-- ==============================================================================
-- Supabase Hardened Security & Performance Schema for Advaita Website
-- Compliant with:
-- 1. Principle of Least Privilege
-- 2. Anti-BOLA / IDOR Protection (Role + Identity Verification)
-- 3. High-Performance Subquery Caching for RLS Policies
-- 4. Storage Upsert Completeness (INSERT + SELECT + UPDATE with CHECK)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Table: public.site_content
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_content (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index on updated_at for query performance
CREATE INDEX IF NOT EXISTS idx_site_content_updated_at ON public.site_content (updated_at DESC);

-- Enable & enforce Row Level Security
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content FORCE ROW LEVEL SECURITY;

-- Policy: Public read access
DROP POLICY IF EXISTS "Public read access" ON public.site_content;
DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
CREATE POLICY "Public read site_content" ON public.site_content
  FOR SELECT
  TO public
  USING (true);

-- Policy: Admin-only modification (Prevents unauthorized overwrites/deletions)
-- Uses cached subqueries to evaluate JWT claims once per query instead of per-row
DROP POLICY IF EXISTS "Authenticated users can update" ON public.site_content;
DROP POLICY IF EXISTS "Admin manage site_content" ON public.site_content;
CREATE POLICY "Admin manage site_content" ON public.site_content
  FOR ALL
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'email') = 'hi@advaitachandra.in'
    OR (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin'
  )
  WITH CHECK (
    (SELECT auth.jwt() ->> 'email') = 'hi@advaitachandra.in'
    OR (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin'
  );

-- ------------------------------------------------------------------------------
-- 2. Table: public.contact_submissions
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  topic text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance Index for chronological sorting and administrative pagination
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions (created_at DESC);

-- Database-level input integrity constraints (Prevent DB bloat, payload injection & malformed records)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_contact_name_length'
  ) THEN
    ALTER TABLE public.contact_submissions
      ADD CONSTRAINT chk_contact_name_length CHECK (char_length(trim(name)) > 0 AND char_length(name) <= 200);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_contact_email_valid'
  ) THEN
    ALTER TABLE public.contact_submissions
      ADD CONSTRAINT chk_contact_email_valid CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        AND char_length(email) <= 320
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_contact_message_length'
  ) THEN
    ALTER TABLE public.contact_submissions
      ADD CONSTRAINT chk_contact_message_length CHECK (char_length(trim(message)) > 0 AND char_length(message) <= 5000);
  END IF;
END $$;

-- Enable & enforce Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions FORCE ROW LEVEL SECURITY;

-- Policy: Public & Authenticated users can submit inquiries (with format check)
DROP POLICY IF EXISTS "Public can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public insert contact_submissions" ON public.contact_submissions;
CREATE POLICY "Public insert contact_submissions" ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) > 0 AND char_length(name) <= 200
    AND char_length(trim(message)) > 0 AND char_length(message) <= 5000
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

-- Policy: Admin-only management (Strict privacy: prevents arbitrary authenticated users from reading private messages)
DROP POLICY IF EXISTS "Authenticated users can manage contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admin manage contact_submissions" ON public.contact_submissions;
CREATE POLICY "Admin manage contact_submissions" ON public.contact_submissions
  FOR ALL
  TO authenticated
  USING (
    (SELECT auth.jwt() ->> 'email') = 'hi@advaitachandra.in'
    OR (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin'
  )
  WITH CHECK (
    (SELECT auth.jwt() ->> 'email') = 'hi@advaitachandra.in'
    OR (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin'
  );

-- ------------------------------------------------------------------------------
-- 3. Storage: 'images' Bucket Access Control
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view images
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Public read images bucket" ON storage.objects;
CREATE POLICY "Public read images bucket" 
  ON storage.objects FOR SELECT 
  TO public 
  USING (bucket_id = 'images');

-- Admin can upload new images
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload images" ON storage.objects;
CREATE POLICY "Admin upload images" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (
    bucket_id = 'images'
    AND (
      (SELECT auth.jwt() ->> 'email') = 'hi@advaitachandra.in'
      OR (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin'
    )
  );

-- Admin can update/replace images (requires both USING and WITH CHECK for secure upserts)
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update images" ON storage.objects;
CREATE POLICY "Admin update images" 
  ON storage.objects FOR UPDATE 
  TO authenticated 
  USING (
    bucket_id = 'images'
    AND (
      (SELECT auth.jwt() ->> 'email') = 'hi@advaitachandra.in'
      OR (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin'
    )
  )
  WITH CHECK (
    bucket_id = 'images'
    AND (
      (SELECT auth.jwt() ->> 'email') = 'hi@advaitachandra.in'
      OR (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin'
    )
  );

-- Admin can delete images
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete images" ON storage.objects;
CREATE POLICY "Admin delete images" 
  ON storage.objects FOR DELETE 
  TO authenticated 
  USING (
    bucket_id = 'images'
    AND (
      (SELECT auth.jwt() ->> 'email') = 'hi@advaitachandra.in'
      OR (SELECT (auth.jwt() -> 'app_metadata' ->> 'role')) = 'admin'
    )
  );

-- ------------------------------------------------------------------------------
-- 4. Maintenance: Automated Cleanup (pg_cron)
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule('delete_old_contact_submissions')
    WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'delete_old_contact_submissions');

    PERFORM cron.schedule(
      'delete_old_contact_submissions',
      '0 0 * * *',
      'DELETE FROM public.contact_submissions WHERE created_at < now() - interval ''6 months'';'
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;