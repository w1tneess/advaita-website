-- ==============================================================================
-- Supabase Schema & RLS Setup for advaitachandra.in (Admin Role Based)
-- ==============================================================================
-- Run this script in your Supabase SQL Editor to update RLS policies.

-- 1. Drop existing policies (if needed)
DROP POLICY IF EXISTS "Admin has full access to projects" ON public.projects;
DROP POLICY IF EXISTS "Admin has full access to notes" ON public.notes;
DROP POLICY IF EXISTS "Admin has full access to photography" ON public.photography;
DROP POLICY IF EXISTS "Admin can upload/update/delete photography images" ON storage.objects;

-- 2. Create new policies with admin role checking

-- Projects
CREATE POLICY "Admin has full access to projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (token->>'role' = 'admin')
  WITH CHECK (token->>'role' = 'admin');

-- Notes
CREATE POLICY "Admin has full access to notes"
  ON public.notes FOR ALL
  TO authenticated
  USING (token->>'role' = 'admin')
  WITH CHECK (token->>'role' = 'admin');

-- Photography
CREATE POLICY "Admin has full access to photography"
  ON public.photography FOR ALL
  TO authenticated
  USING (token->>'role' = 'admin')
  WITH CHECK (token->>'role' = 'admin');

-- Storage
CREATE POLICY "Admin can upload/update/delete photography images"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'photography' AND token->>'role' = 'admin')
  WITH CHECK (bucket_id = 'photography' AND token->>'role' = 'admin');

-- 3. Keep existing public access policies (unchanged)
-- These are already correctly set up in the original script

-- Note: To make this work, you need to:
-- 1. Set user metadata for admin users: { "role": "admin" }
// 2. Enable "Include user metadata in JWT" in Supabase Auth Settings
