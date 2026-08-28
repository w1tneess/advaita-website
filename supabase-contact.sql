-- ==============================================================================
-- Contact Submissions Table for advaitachandra.in
-- ==============================================================================
-- Run this in your Supabase SQL Editor after the initial schema setup.
-- This adds a table for storing contact form submissions.

-- 1. Create Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  topic text NOT NULL CHECK (topic IN ('general', 'project-feedback', 'collaboration', 'correction', 'other')),
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Anyone can submit (INSERT) — this is a public contact form
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions FOR INSERT
  WITH CHECK (true);

-- Only authenticated admin users can read submissions
CREATE POLICY "Admin can read contact submissions"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated admin users can update (mark as read)
CREATE POLICY "Admin can update contact submissions"
  ON public.contact_submissions FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated admin users can delete
CREATE POLICY "Admin can delete contact submissions"
  ON public.contact_submissions FOR DELETE
  TO authenticated
  USING (true);
