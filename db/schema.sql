-- ============================================================================
-- Math Club App — Complete Database Schema (PostgreSQL 15+)
-- ============================================================================
-- Applied once, to an empty database, by db/init.sh when the Postgres
-- container first starts. By hand, as the role that will own the schema:
--
--   -- as a superuser, once:
--   CREATE ROLE matsek LOGIN PASSWORD '…';
--   CREATE ROLE anon NOLOGIN;
--   CREATE ROLE authenticated NOLOGIN;
--   GRANT anon, authenticated TO matsek;
--   ALTER DATABASE matsek OWNER TO matsek;
--   CREATE EXTENSION "uuid-ossp";
--   -- then:
--   psql "postgres://matsek:…@host/matsek" -f db/schema.sql
--
-- The access model is the one the app was built on under Supabase, kept on
-- purpose: every policy below tests auth.uid(), and the column grants below
-- name Supabase's two request roles, `anon` and `authenticated`, which exist
-- here under the same names. src/lib/db switches to one of them at the start
-- of every withUser() transaction and sets app.user_id for that transaction
-- only. The owner role bypasses RLS (the tables are not FORCEd), which is
-- what asService() uses for the few reads and writes that must cross users.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ---------------------------------------------------------------------------
-- Created by a superuser in db/init.sh; here so a by-hand install fails
-- loudly at the top if that step was skipped.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------------
-- 1a. REQUEST ROLES — the grants Supabase gives anon and authenticated
-- ---------------------------------------------------------------------------
-- Supabase grants both roles everything on public tables by default and
-- lets RLS and the column grants in section 6 narrow it. The same defaults
-- are set here, before any table exists, so every REVOKE/GRANT below means
-- exactly what it meant on Supabase.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 1b. AUTH — what Supabase's auth schema used to provide
-- ---------------------------------------------------------------------------
-- Named and shaped after Supabase's own auth.users so the profile trigger and
-- the domain lock below apply unchanged. The request roles get USAGE on the
-- schema (policies call auth.uid()) and no grant on any table in it: users,
-- sessions and codes are touched only by src/lib/auth through the owner role.
CREATE SCHEMA IF NOT EXISTS auth;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;

CREATE TABLE auth.users (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email              TEXT NOT NULL,
  encrypted_password TEXT NOT NULL,
  email_confirmed_at TIMESTAMPTZ,            -- NULL until the signup code is entered
  raw_user_meta_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Addresses are compared case-insensitively everywhere; the index is what
-- makes "already registered" a constraint rather than a race.
CREATE UNIQUE INDEX users_email_key ON auth.users (lower(email));

-- The cookie holds a random token; only its SHA-256 is stored, so a read of
-- this table does not hand out live sessions.
CREATE TABLE auth.sessions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash   TEXT NOT NULL UNIQUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at   TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_sessions_user ON auth.sessions(user_id);

-- Six-digit codes for signup confirmation and password recovery. One live
-- code per user and purpose: asking again replaces it, so an old email stops
-- working the moment a new one is sent. `attempts` caps guessing at a handful
-- per code, which is what makes a 10^6 space safe to send by email.
CREATE TABLE auth.one_time_codes (
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  purpose    TEXT NOT NULL CHECK (purpose IN ('signup', 'recovery')),
  code_hash  TEXT NOT NULL,
  attempts   INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, purpose)
);

-- Login and code-sending throttles, keyed by text ("login:<email>") because
-- they have to work before anyone is signed in. Supabase Auth applied its
-- own; these replace them.
CREATE TABLE auth.rate_limits (
  key          TEXT NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  hits         INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (key, window_start)
);

-- The member the current transaction acts for, or NULL for a visitor.
-- src/lib/db sets app.user_id with set_config(…, true), which scopes it to
-- the transaction, so a pooled connection cannot carry one request's identity
-- into the next.
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS UUID AS $$
  SELECT nullif(current_setting('app.user_id', true), '')::uuid
$$ LANGUAGE sql STABLE;

-- ---------------------------------------------------------------------------
-- 2. ENUMS
-- ---------------------------------------------------------------------------
CREATE TYPE activity_type AS ENUM (
  'lecture',
  'discussion',
  'problem_solving_session',
  'social',
  'seminar'
);

CREATE TYPE activity_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE user_role AS ENUM (
  'user',
  'admin'
);

-- ---------------------------------------------------------------------------
-- 3. PROFILES TABLE
--    One per auth.users row, created by the trigger in 3a.
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT NOT NULL DEFAULT '',
  role        user_role NOT NULL DEFAULT 'user',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Automatically set updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3a. NEW USER HOOK — auto-create profile on signup
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 4. ACTIVITIES TABLE
-- ---------------------------------------------------------------------------
CREATE TABLE public.activities (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  activity_type   activity_type NOT NULL,
  start_time      TIMESTAMPTZ NOT NULL,
  end_time        TIMESTAMPTZ NOT NULL,
  location        TEXT NOT NULL DEFAULT '',
  -- Whether the room named in `location` is actually booked; shown beside
  -- it as a red, yellow or green dot.  TEXT with a CHECK rather than an
  -- enum, like the materials' phase and kind, so a state can be added
  -- without an ALTER TYPE.
  reservation_status TEXT NOT NULL DEFAULT 'not_sent',
  description     TEXT NOT NULL DEFAULT '',
  prerequisites   TEXT NOT NULL DEFAULT '',
  target_audience TEXT NOT NULL DEFAULT '',
  status          activity_status NOT NULL DEFAULT 'pending',
  admin_comment   TEXT,                             -- filled on denial
  reviewed_by     UUID REFERENCES public.profiles(id),  -- admin who acted
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_time_order CHECK (end_time > start_time),
  CONSTRAINT chk_reservation_status
    CHECK (reservation_status IN ('not_sent', 'pending', 'confirmed'))
);

CREATE TRIGGER activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Index for calendar queries
CREATE INDEX idx_activities_start_time ON public.activities(start_time);
CREATE INDEX idx_activities_status ON public.activities(status);

-- ---------------------------------------------------------------------------
-- 5. NOTIFICATIONS TABLE
-- ---------------------------------------------------------------------------
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
  type        TEXT NOT NULL,            -- 'approved', 'rejected', 'edited', 'info'
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);

-- ---------------------------------------------------------------------------
-- 5a. ACTIVITIES WITH THEIR PROPOSER'S NAME
-- ---------------------------------------------------------------------------
-- The shape every activity read returns: the row plus `creator` as
-- {id, full_name}, which is what Supabase's
-- `select("*, creator:profiles!created_by(id, full_name)")` embed produced.
-- Only those two columns: they are all `anon` may read of a profile (section
-- 6), and security_invoker makes the view run with the caller's rights, so
-- naming any other column would fail the whole query for a visitor — and
-- the activities policies still decide which rows come back.
CREATE VIEW public.activities_with_creator
WITH (security_invoker = true) AS
SELECT
  a.*,
  CASE WHEN c.id IS NULL THEN NULL ELSE
    json_build_object('id', c.id, 'full_name', c.full_name)
  END AS creator
FROM public.activities a
LEFT JOIN public.profiles c ON c.id = a.created_by;

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- PROFILES POLICIES
-- ---------------------------------------------------------------------------

-- Everyone can read profiles (the public calendar shows who proposed an
-- activity) — but only the name. The column grants below are checked before
-- any policy, so a query that names a column its role cannot read is refused
-- outright: anonymous visitors get `id` and `full_name`, signed-in members
-- `role` as well, because every page reads its own row's role and a column
-- grant cannot depend on the row. Nobody reads another member's e-mail
-- through withUser(); the two routes that mail a proposer fetch it through
-- asService() after their own admin check. Queries therefore join
-- `profiles(id, full_name)` and nothing more.
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

REVOKE SELECT ON public.profiles FROM anon, authenticated;
GRANT SELECT (id, full_name) ON public.profiles TO anon;
GRANT SELECT (id, full_name, role) ON public.profiles TO authenticated;

-- Users can update only their own profile, and only their name. Without the
-- column grant a member could set their own `role` to admin with one
-- UPDATE, since the policy only checks whose row it is. Promotion to admin
-- stays what section 8 documents: an UPDATE run in psql.
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

REVOKE UPDATE ON public.profiles FROM anon, authenticated;
GRANT UPDATE (full_name) ON public.profiles TO authenticated;

-- ---------------------------------------------------------------------------
-- ACTIVITIES POLICIES
-- ---------------------------------------------------------------------------

-- Anyone (including anonymous) can read APPROVED activities → public calendar
CREATE POLICY "Anyone can view approved activities"
  ON public.activities FOR SELECT
  USING (status = 'approved');

-- Authenticated users can read their OWN activities (any status)
CREATE POLICY "Users can view own activities"
  ON public.activities FOR SELECT
  USING (auth.uid() = created_by);

-- The admin test the policies below share. It is SECURITY DEFINER on purpose:
-- a policy's sub-select runs with the privileges of whoever is querying, and
-- an anonymous visitor may read only `id` and `full_name` from profiles (the
-- column grant in section 6), so a policy that looked at `profiles.role`
-- inline would fail the entire statement for them with "permission denied" —
-- an empty public calendar. Running the test as the function's owner keeps
-- `role` private and the policies working for every role.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- Admins can read ALL activities (for dashboard moderation)
CREATE POLICY "Admins can view all activities"
  ON public.activities FOR SELECT
  USING (public.is_admin());

-- Authenticated users can create activities, and what they create is a
-- proposal: the row must arrive as 'pending' with the review columns empty,
-- or a member could insert an approved activity straight onto the public
-- calendar. Approval only ever happens through the admin UPDATE policy.
CREATE POLICY "Users can create activities"
  ON public.activities FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND status = 'pending'
    AND reviewed_by IS NULL
    AND reviewed_at IS NULL
    AND admin_comment IS NULL
  );

-- Users can update their OWN activities only if still 'pending' — and the
-- review columns stay empty, as on insert: the API strips them, and the
-- policy holds even for a route that forgets to — a forged admin_comment
-- would be shown as the admin's words.
CREATE POLICY "Users can update own pending activities"
  ON public.activities FOR UPDATE
  USING (auth.uid() = created_by AND status = 'pending')
  WITH CHECK (
    auth.uid() = created_by
    AND status = 'pending'
    AND reviewed_by IS NULL
    AND reviewed_at IS NULL
    AND admin_comment IS NULL
  );

-- An approved activity stays its author's to edit.  What the author may not
-- do is choose where the edit leaves it: the check admits a row that is
-- still approved, or back in the queue with the review columns cleared, and
-- the trigger below decides which of the two it is.
CREATE POLICY "Users can update own approved activities"
  ON public.activities FOR UPDATE
  USING (auth.uid() = created_by AND status = 'approved')
  WITH CHECK (
    auth.uid() = created_by
    AND (
      status = 'approved'
      OR (
        status = 'pending'
        AND reviewed_by IS NULL
        AND reviewed_at IS NULL
        AND admin_comment IS NULL
      )
    )
  );

-- A member's edit never carries a status; this sets it.  Moving, relocating
-- or retyping an approved activity changes what the admin agreed to, so the
-- row goes back to 'pending' — off the public calendar, by the SELECT
-- policies above — until it is approved again.  Every other edit (the
-- description, the prerequisites, the reservation status) leaves the status
-- and the review columns exactly as they were.  It has to be a trigger: a
-- policy sees only the new row and cannot tell what changed, and with the
-- two UPDATE policies ORed together a member could otherwise send their own
-- pending row up as approved.  Admins, and anything not acting for a
-- member (asService(), psql), write what they mean.
CREATE OR REPLACE FUNCTION public.settle_member_edit()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF OLD.status = 'approved' AND (
       NEW.start_time    IS DISTINCT FROM OLD.start_time
    OR NEW.end_time      IS DISTINCT FROM OLD.end_time
    OR NEW.location      IS DISTINCT FROM OLD.location
    OR NEW.activity_type IS DISTINCT FROM OLD.activity_type
  ) THEN
    NEW.status        := 'pending';
    NEW.reviewed_by   := NULL;
    NEW.reviewed_at   := NULL;
    NEW.admin_comment := NULL;
  ELSE
    NEW.status        := OLD.status;
    NEW.reviewed_by   := OLD.reviewed_by;
    NEW.reviewed_at   := OLD.reviewed_at;
    NEW.admin_comment := OLD.admin_comment;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER activities_settle_member_edit
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.settle_member_edit();

-- Admins can update any activity (approve / deny / edit)
CREATE POLICY "Admins can update any activity"
  ON public.activities FOR UPDATE
  USING (public.is_admin());

-- Users can delete their OWN activities only if still 'pending'
CREATE POLICY "Users can delete own pending activities"
  ON public.activities FOR DELETE
  USING (auth.uid() = created_by AND status = 'pending');

-- Admins can delete any activity
CREATE POLICY "Admins can delete any activity"
  ON public.activities FOR DELETE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- NOTIFICATIONS POLICIES
-- ---------------------------------------------------------------------------

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can see all notifications
CREATE POLICY "Admins can view all notifications"
  ON public.notifications FOR SELECT
  USING (public.is_admin());

-- Insert is allowed for the recipient (system inserts go through
-- asService(), which bypasses RLS.  This policy is for completeness.)
CREATE POLICY "Notifications insert for recipient"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can mark their own notifications as read
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 7. DOMAIN LOCK — restrict registration to @fer.hr / @student.fer.hr
-- ============================================================================
-- This is a custom hook that runs BEFORE a user is created in auth.users.
-- It rejects signups whose email domain is not allowed.

CREATE OR REPLACE FUNCTION public.restrict_email_domain()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email !~ '@(student\.)?fer\.hr$' THEN
    RAISE EXCEPTION 'Only @fer.hr and @student.fer.hr emails are allowed.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER restrict_email_domain_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.restrict_email_domain();

-- ============================================================================
-- 8. SEED: promote first user (or specific emails) to admin manually
-- ============================================================================
-- Run after the first admin registers:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@fer.hr';

-- ============================================================================
-- 9. ACTIVITY MATERIALS — reading lists and uploads attached to a proposal
-- ============================================================================
-- One row per material on a proposal.  `phase` splits them into what to go
-- through BEFORE the session and what belongs to the session itself or to
-- afterwards; the activity page renders the two as separate lists.  `kind`
-- says where the thing lives: a page under /materials, any URL, or a file
-- in the activity-materials bucket.  Phase and kind are TEXT with CHECKs
-- rather than enums so a value can be added without an ALTER TYPE.
CREATE TABLE public.activity_materials (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id   UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  phase         TEXT NOT NULL,
  kind          TEXT NOT NULL,
  title         TEXT NOT NULL,
  url           TEXT NOT NULL DEFAULT '',   -- library and link kinds
  note          TEXT NOT NULL DEFAULT '',   -- e.g. the library topic a book belongs to
  storage_path  TEXT NOT NULL DEFAULT '',   -- file kind
  file_name     TEXT NOT NULL DEFAULT '',
  content_type  TEXT NOT NULL DEFAULT '',
  byte_size     INTEGER NOT NULL DEFAULT 0,
  position      INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_material_phase CHECK (phase IN ('before', 'during')),
  CONSTRAINT chk_material_kind  CHECK (kind IN ('library', 'link', 'file'))
);

-- Materials are always read as one activity's two lists, in order
CREATE INDEX idx_activity_materials_activity
  ON public.activity_materials(activity_id, phase, position);

ALTER TABLE public.activity_materials ENABLE ROW LEVEL SECURITY;

-- Visibility is TESTED THROUGH THE ACTIVITY: the sub-select runs under the
-- caller's role, so the activities policies (approved for everyone, own for
-- the author, all for admins) decide here too, and nothing is repeated.
CREATE POLICY "Materials follow their activity"
  ON public.activity_materials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.activities a
      WHERE a.id = activity_id
    )
  );

-- Writes are the author's while the activity is pending or approved — a
-- reading list is not what the admin approved, so changing it does not send
-- the activity back for review the way a new time or room does — and
-- always an admin's.  A rejected activity is closed.  No UPDATE policy: a
-- material is replaced, not edited.
CREATE POLICY "Authors add materials to own activities"
  ON public.activity_materials FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.activities a
      WHERE a.id = activity_id
        AND a.created_by = auth.uid()
        AND a.status IN ('pending', 'approved')
    )
    OR public.is_admin()
  );

CREATE POLICY "Authors remove materials from own activities"
  ON public.activity_materials FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.activities a
      WHERE a.id = activity_id
        AND a.created_by = auth.uid()
        AND a.status IN ('pending', 'approved')
    )
    OR public.is_admin()
  );

-- The files themselves live in an S3 bucket, keyed
-- {activity_id}/{material_id}/{file name} (storage_path). The bucket is
-- private and the browser never talks to it: uploads and downloads pass
-- through /api/activities/[id]/materials/[materialId]/file, which looks the
-- material up through RLS first, so the policies above decide who may read
-- or write a file exactly as they decide for its row. That route also
-- enforces the 25 MiB and file-type limits Supabase's bucket settings used
-- to.
