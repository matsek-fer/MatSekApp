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
