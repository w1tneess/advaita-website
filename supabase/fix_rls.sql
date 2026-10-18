-- ==============================================================================
-- Quick Fix: Supabase Row-Level Security (RLS) Policy Update
-- Fixes: "new row violates row-level security policy for table site_content"
-- Restricts every write to accounts listed in public.admin_users.
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

-- 1. public.site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access" ON public.site_content;
DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
CREATE POLICY "Public read site_content" ON public.site_content
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update" ON public.site_content;
DROP POLICY IF EXISTS "Admin manage site_content" ON public.site_content;
CREATE POLICY "Admin manage site_content" ON public.site_content
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

-- 2. public.contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions FORCE ROW LEVEL SECURITY;

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

DROP POLICY IF EXISTS "Authenticated users can manage contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admin manage contact_submissions" ON public.contact_submissions;
CREATE POLICY "Admin manage contact_submissions" ON public.contact_submissions
  FOR ALL
  TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

-- 3. storage.objects (images bucket)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Public read images bucket" ON storage.objects;
CREATE POLICY "Public read images bucket" 
  ON storage.objects FOR SELECT 
  TO public 
  USING (bucket_id = 'images');

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
