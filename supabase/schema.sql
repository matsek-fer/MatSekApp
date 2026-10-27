-- ============================================================================
-- Math Club App — Complete Database Schema (Supabase / PostgreSQL)
-- ============================================================================
-- Run this in the Supabase SQL Editor (or as a migration).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
--    Mirrors Supabase auth.users; one-to-one.
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
  description     TEXT NOT NULL DEFAULT '',
  prerequisites   TEXT NOT NULL DEFAULT '',
  target_audience TEXT NOT NULL DEFAULT '',
  status          activity_status NOT NULL DEFAULT 'pending',
  admin_comment   TEXT,                             -- filled on denial
  reviewed_by     UUID REFERENCES public.profiles(id),  -- admin who acted
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_time_order CHECK (end_time > start_time)
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
  type        TEXT NOT NULL,            -- 'approved', 'rejected', 'info'
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);

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
-- through this client; the two routes that mail a proposer fetch it with the
-- service-role client after their own admin check. Queries therefore embed
-- `profiles(id, full_name)` and nothing more.
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

REVOKE SELECT ON public.profiles FROM anon, authenticated;
GRANT SELECT (id, full_name) ON public.profiles TO anon;
GRANT SELECT (id, full_name, role) ON public.profiles TO authenticated;

-- Users can update only their own profile, and only their name. Without the
-- column grant a member could set their own `role` to admin with one
-- PostgREST call, since the policy only checks whose row it is. Promotion to
-- admin stays what section 8 documents: an UPDATE in the SQL editor.
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
-- review columns stay empty, as on insert: the API strips them, but a
-- member's token works against PostgREST directly, and a forged
-- admin_comment would be shown as the admin's words.
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

-- Insert is allowed for the recipient (system/service_role inserts, but RLS
-- is bypassed by service_role key.  This policy is for completeness.)
CREATE POLICY "Notifications insert for recipient"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can mark their own notifications as read
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Applying the hardening above to a database that ran an earlier version of
-- this file (the statements are safe to repeat):
--
--   REVOKE SELECT ON public.profiles FROM anon, authenticated;
--   GRANT SELECT (id, full_name) ON public.profiles TO anon;
--   GRANT SELECT (id, full_name, role) ON public.profiles TO authenticated;
--   REVOKE UPDATE ON public.profiles FROM anon, authenticated;
--   GRANT UPDATE (full_name) ON public.profiles TO authenticated;
--   DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
--   DROP POLICY IF EXISTS "Users can create activities" ON public.activities;
--   CREATE POLICY "Users can create activities" ON public.activities FOR INSERT
--     WITH CHECK (auth.uid() = created_by AND status = 'pending'
--       AND reviewed_by IS NULL AND reviewed_at IS NULL AND admin_comment IS NULL);
--   DROP POLICY IF EXISTS "Users can update own pending activities" ON public.activities;
--   CREATE POLICY "Users can update own pending activities" ON public.activities FOR UPDATE
--     USING (auth.uid() = created_by AND status = 'pending')
--     WITH CHECK (auth.uid() = created_by AND status = 'pending'
--       AND reviewed_by IS NULL AND reviewed_at IS NULL AND admin_comment IS NULL);
--   CREATE OR REPLACE FUNCTION public.is_admin()
--   RETURNS boolean
--   LANGUAGE sql STABLE SECURITY DEFINER
--   SET search_path = public
--   AS $$
--     SELECT EXISTS (
--       SELECT 1 FROM public.profiles
--       WHERE id = auth.uid() AND role = 'admin'
--     )
--   $$;
--   REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
--   GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;
--   ALTER POLICY "Admins can view all activities" ON public.activities USING (public.is_admin());
--   ALTER POLICY "Admins can update any activity" ON public.activities USING (public.is_admin());
--   ALTER POLICY "Admins can delete any activity" ON public.activities USING (public.is_admin());
--   ALTER POLICY "Admins can view all notifications" ON public.notifications USING (public.is_admin());
-- ---------------------------------------------------------------------------

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

-- Writes mirror the activity rules: the author while the proposal is still
-- pending, admins always.  No UPDATE policy — a material is replaced, not
-- edited.
CREATE POLICY "Authors add materials to own pending activities"
  ON public.activity_materials FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.activities a
      WHERE a.id = activity_id
        AND a.created_by = auth.uid()
        AND a.status = 'pending'
    )
    OR public.is_admin()
  );

CREATE POLICY "Authors remove materials from own pending activities"
  ON public.activity_materials FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.activities a
      WHERE a.id = activity_id
        AND a.created_by = auth.uid()
        AND a.status = 'pending'
    )
    OR public.is_admin()
  );

-- The bucket is private: the browser PUTs the bytes straight to Storage on
-- a signed upload URL, so the bucket is the only thing positioned to refuse
-- a size or a type, and readers get short-lived signed URLs minted by the
-- activity page under their own permissions.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'activity-materials',
  'activity-materials',
  false,
  26214400,                                 -- 25 MiB
  ARRAY['application/pdf', 'text/markdown', 'text/plain']
)
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Objects are keyed {activity_id}/{material_id}/{file name}, so the first
-- path segment is the activity and the tests below are the table's tests
-- again.  The id is compared as text so a malformed segment is a miss, not
-- a cast error.
CREATE POLICY "Activity files follow their activity"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'activity-materials'
    AND EXISTS (
      SELECT 1 FROM public.activities a
      WHERE a.id::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Authors upload files to own pending activities"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'activity-materials'
    AND (
      EXISTS (
        SELECT 1 FROM public.activities a
        WHERE a.id::text = (storage.foldername(name))[1]
          AND a.created_by = auth.uid()
          AND a.status = 'pending'
      )
      OR public.is_admin()
    )
  );

CREATE POLICY "Authors remove files from own pending activities"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'activity-materials'
    AND (
      EXISTS (
        SELECT 1 FROM public.activities a
        WHERE a.id::text = (storage.foldername(name))[1]
          AND a.created_by = auth.uid()
          AND a.status = 'pending'
      )
      OR public.is_admin()
    )
  );

-- ---------------------------------------------------------------------------
-- Applying section 9 to a database that ran an earlier version of this file:
-- add the two enum values first, on their own — a value added by ALTER TYPE
-- cannot be used in the same transaction — then run section 9 as it stands.
--
--   ALTER TYPE activity_type ADD VALUE IF NOT EXISTS 'social';
--   ALTER TYPE activity_type ADD VALUE IF NOT EXISTS 'seminar';
-- ---------------------------------------------------------------------------

-- ============================================================================

-- ═══════════════════════════════════════════════════════════════════════════
-- Retired: the AI document assistant (sections 9 to 12 of earlier versions)
-- ═══════════════════════════════════════════════════════════════════════════
-- The reader moved off the website into a local tool (matsek-fer/document-
-- reader) in line with spec D-005: Supabase runs the website only. A fresh
-- project needs nothing here. A development project that ran the old file
-- can drop what it created with:
--
--   DROP FUNCTION IF EXISTS public.match_document_chunks;
--   DROP TABLE IF EXISTS public.document_chunks, public.chat_messages,
--     public.chat_threads, public.ai_usage_events, public.ai_rate_buckets,
--     public.document_blocks, public.documents CASCADE;
--   DROP TYPE IF EXISTS public.document_kind, public.document_status,
--     public.ai_provider, public.chat_role;
--   DELETE FROM storage.objects WHERE bucket_id = 'documents';
--   DELETE FROM storage.buckets WHERE id = 'documents';
--   DROP EXTENSION IF EXISTS vector;
