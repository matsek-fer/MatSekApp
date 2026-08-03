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
  'problem_solving_session'
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

-- Everyone can read profiles (needed for showing creator names)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile (e.g. change roles)
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

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

-- Admins can read ALL activities (for dashboard moderation)
CREATE POLICY "Admins can view all activities"
  ON public.activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Authenticated users can create activities (status automatically 'pending')
CREATE POLICY "Users can create activities"
  ON public.activities FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their OWN activities only if still 'pending'
CREATE POLICY "Users can update own pending activities"
  ON public.activities FOR UPDATE
  USING (auth.uid() = created_by AND status = 'pending')
  WITH CHECK (auth.uid() = created_by AND status = 'pending');

-- Admins can update any activity (approve / deny / edit)
CREATE POLICY "Admins can update any activity"
  ON public.activities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can delete their OWN activities only if still 'pending'
CREATE POLICY "Users can delete own pending activities"
  ON public.activities FOR DELETE
  USING (auth.uid() = created_by AND status = 'pending');

-- Admins can delete any activity
CREATE POLICY "Admins can delete any activity"
  ON public.activities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

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
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

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
-- 9. AI DOCUMENT ASSISTANT — documents and extracted blocks
-- ============================================================================
-- Added after the initial deploy.  On a database that already has sections
-- 1-8, run ONLY this section; on a fresh database the whole file applies top
-- to bottom.  Unlike the sections above, this one is going to be pasted into
-- the SQL Editor of a live database rather than applied once to an empty one,
-- so everything below is re-runnable — except the two CREATE TYPEs in 9.1.

-- ---------------------------------------------------------------------------
-- 9.1 ENUMS
-- ---------------------------------------------------------------------------
-- CREATE TYPE has no IF NOT EXISTS, and the DO-block guard that would stand
-- in for one is what the dashboard's SQL runner refuses to parse.  So these
-- two are the section's one non-re-runnable spot: on a re-run they fail with
-- "already exists" — delete them and run the rest.

CREATE TYPE document_kind AS ENUM ('pdf', 'markdown', 'text');

-- The upload is a three-step handshake — create the row, PUT the bytes to
-- Storage, then ask the server to extract — so a document is observable in
-- between.  'uploading' means the row exists but the bytes may not; a row
-- stuck there is an abandoned upload and is safe to sweep.
CREATE TYPE document_status AS ENUM (
  'uploading',
  'extracting',
  'ready',
  'failed'
);

-- ---------------------------------------------------------------------------
-- 9.2 DOCUMENTS TABLE
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  kind          document_kind NOT NULL,
  status        document_status NOT NULL DEFAULT 'uploading',
  storage_path  TEXT NOT NULL,
  byte_size     INTEGER NOT NULL DEFAULT 0,
  page_count    INTEGER NOT NULL DEFAULT 0,
  block_count   INTEGER NOT NULL DEFAULT 0,
  error_message TEXT NOT NULL DEFAULT '',   -- filled when status = 'failed'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS documents_updated_at ON public.documents;
CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- The library page lists one member's documents, newest first
CREATE INDEX IF NOT EXISTS idx_documents_owner
  ON public.documents(owner_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 9.3 DOCUMENT BLOCKS TABLE
-- ---------------------------------------------------------------------------
-- Extracted text, one row per paragraph (Markdown/text) or per grouped line
-- run (PDF).  These are both the render unit and the anchor target: the
-- reader draws the SERVER's blocks rather than parsing the file itself, which
-- is what lets the chat route resolve a quoted excerpt from ids and offsets
-- instead of trusting text the browser sends it.
CREATE TABLE IF NOT EXISTS public.document_blocks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  page        INTEGER NOT NULL DEFAULT 1,
  block_index INTEGER NOT NULL,
  text        TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT chk_block_index_order CHECK (block_index >= 0)
);

-- Blocks are always read in document order, and re-ingestion must not be able
-- to leave two blocks claiming the same position.
CREATE UNIQUE INDEX IF NOT EXISTS idx_document_blocks_position
  ON public.document_blocks(document_id, block_index);

-- ---------------------------------------------------------------------------
-- 9.4 ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_blocks ENABLE ROW LEVEL SECURITY;

-- Members upload their own study material, so unlike activities there is no
-- public or admin read here at all.  ADMINS DELIBERATELY GET NO VISIBILITY:
-- private means private, including from the section's admins.

DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can create own documents" ON public.documents;
CREATE POLICY "Users can create own documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
CREATE POLICY "Users can update own documents"
  ON public.documents FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own documents" ON public.documents;
CREATE POLICY "Users can delete own documents"
  ON public.documents FOR DELETE
  USING (auth.uid() = owner_id);

-- Blocks carry no owner of their own; ownership is TESTED THROUGH THE PARENT
-- so there is exactly one place that decides who may read a document.

DROP POLICY IF EXISTS "Users can view own document blocks" ON public.document_blocks;
CREATE POLICY "Users can view own document blocks"
  ON public.document_blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id AND d.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create own document blocks" ON public.document_blocks;
CREATE POLICY "Users can create own document blocks"
  ON public.document_blocks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id AND d.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own document blocks" ON public.document_blocks;
CREATE POLICY "Users can delete own document blocks"
  ON public.document_blocks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id AND d.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- 9.5 STORAGE BUCKET
-- ---------------------------------------------------------------------------
-- Private bucket.  Files are never served directly — the reader gets a
-- short-lived signed URL minted server-side, and the ingest route downloads
-- through the service client.
--
-- The size and MIME limits live HERE rather than in a route handler because
-- the browser PUTs its bytes straight to Storage on a signed URL; no Next
-- process sees the upload, so the bucket is the only thing in a position to
-- refuse it.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  26214400,                                 -- 25 MiB
  ARRAY['application/pdf', 'text/markdown', 'text/plain']
)
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Objects are keyed {owner_id}/{document_id}/original.{ext}, so the owner
-- test is a prefix test on the first path segment.

DROP POLICY IF EXISTS "Users can read own document files" ON storage.objects;
CREATE POLICY "Users can read own document files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can upload own document files" ON storage.objects;
CREATE POLICY "Users can upload own document files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can delete own document files" ON storage.objects;
CREATE POLICY "Users can delete own document files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
