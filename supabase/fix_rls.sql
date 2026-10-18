-- ==============================================================================
-- Row-Level Security & privileges for the Advaita website.
-- Run order on an existing project: fix_rls.sql -> public_content.sql -> contact_rate_limit.sql
-- (a fresh project runs schema.sql first). Every write is limited to accounts in
-- public.admin_users; anon may only insert contact messages.
-- The public read of site_content is handled in public_content.sql.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 0. Admin allowlist
-- ------------------------------------------------------------------------------
-- Being signed in is NOT enough to be admin: Supabase Auth allows public sign-ups
-- unless disabled, so every write policy below checks this allowlist instead.
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE
);
-- RLS on with no policies: the table is invisible to anon and authenticated clients.
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
$$;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- REQUIRED, once: allowlist your own admin account (edit the email before running).
-- Until this row exists, admin saves and uploads are rejected.
-- INSERT INTO public.admin_users (user_id)
--   SELECT id FROM auth.users WHERE email = '<your-admin-login-email>'
--   ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 1. public.site_content
-- ------------------------------------------------------------------------------
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can update" ON public.site_content;
DROP POLICY IF EXISTS "Admin manage site_content" ON public.site_content;
CREATE POLICY "Admin manage site_content" ON public.site_content
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

-- ------------------------------------------------------------------------------
-- 2. public.contact_submissions
-- ------------------------------------------------------------------------------
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions FORCE ROW LEVEL SECURITY;

-- Email is optional on the home page form ('' = not given); anything else must look valid.
ALTER TABLE public.contact_submissions DROP CONSTRAINT IF EXISTS chk_contact_email_valid;
ALTER TABLE public.contact_submissions
  ADD CONSTRAINT chk_contact_email_valid CHECK (
    email = ''
    OR (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND char_length(email) <= 320)
  );

DROP POLICY IF EXISTS "Public can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Public insert contact_submissions" ON public.contact_submissions;
CREATE POLICY "Public insert contact_submissions" ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) > 0 AND char_length(name) <= 200
    AND char_length(trim(message)) > 0 AND char_length(message) <= 5000
    AND (email = '' OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
  );

DROP POLICY IF EXISTS "Authenticated users can manage contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admin manage contact_submissions" ON public.contact_submissions;
CREATE POLICY "Admin manage contact_submissions" ON public.contact_submissions
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

-- ------------------------------------------------------------------------------
-- 3. Table privileges (defence in depth under RLS)
-- ------------------------------------------------------------------------------
-- Supabase grants ALL on public tables to anon by default. anon keeps SELECT on
-- site_content only so the keepalive pings still get 200 (RLS returns no rows).
REVOKE ALL ON public.site_content FROM anon;
GRANT SELECT ON public.site_content TO anon;
REVOKE ALL ON public.contact_submissions FROM anon;
GRANT INSERT ON public.contact_submissions TO anon;
REVOKE ALL ON public.admin_users FROM anon, authenticated;

-- ------------------------------------------------------------------------------
-- 4. storage.objects (images bucket)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- The bucket is public, so object URLs work without any SELECT policy; a public
-- SELECT policy would only let anyone list every file (including orphaned uploads).
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Public read images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin list images" ON storage.objects;
CREATE POLICY "Admin list images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'images' AND (SELECT public.is_admin()));

DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload images" ON storage.objects;
CREATE POLICY "Admin upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images' AND (SELECT public.is_admin()));

DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update images" ON storage.objects;
CREATE POLICY "Admin update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images' AND (SELECT public.is_admin()))
  WITH CHECK (bucket_id = 'images' AND (SELECT public.is_admin()));

DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete images" ON storage.objects;
CREATE POLICY "Admin delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'images' AND (SELECT public.is_admin()));

-- ------------------------------------------------------------------------------
-- 5. Verify: every policy that is now live. Policies are OR-ed, so any row here
--    that is not listed above (e.g. one created in the dashboard) still grants access.
-- ------------------------------------------------------------------------------
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname IN ('public', 'storage')
ORDER BY schemaname, tablename, policyname;
