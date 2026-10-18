-- ==============================================================================
-- Public, draft-free copy of the site document.
-- Run after fix_rls.sql. Visitors (anon) no longer read public.site_content
-- directly; they call get_public_site_content(), which returns the same document
-- without the admin activity log (which holds titles of deleted items), draft
-- posts and notes, unpublished projects or hidden social links. The admin editor
-- keeps reading the full row through the "Admin manage site_content" policy.
-- ==============================================================================

-- SECURITY DEFINER is the point: it reads the row anon cannot see, and only returns
-- the filtered copy. Supabase's advisor will list it as "callable by anon"; that is intended.
CREATE OR REPLACE FUNCTION public.get_public_site_content()
RETURNS TABLE (data jsonb, updated_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  WITH doc AS (
    SELECT sc.data, sc.updated_at FROM public.site_content sc WHERE sc.id = 'main'
  )
  SELECT
    doc.data
      || jsonb_build_object(
        'publicCopy', true,
        'activity', '[]'::jsonb,
        'blog', (
          SELECT COALESCE(jsonb_agg(item ORDER BY pos), '[]'::jsonb)
          FROM jsonb_array_elements(
            CASE jsonb_typeof(doc.data -> 'blog') WHEN 'array' THEN doc.data -> 'blog' ELSE '[]'::jsonb END
          ) WITH ORDINALITY AS t(item, pos)
          WHERE item ->> 'status' = 'published'
        ),
        'projects', (
          SELECT COALESCE(jsonb_agg(item ORDER BY pos), '[]'::jsonb)
          FROM jsonb_array_elements(
            CASE jsonb_typeof(doc.data -> 'projects') WHEN 'array' THEN doc.data -> 'projects' ELSE '[]'::jsonb END
          ) WITH ORDINALITY AS t(item, pos)
          WHERE COALESCE(item ->> 'published', 'true') <> 'false'
        ),
        'social', (
          SELECT COALESCE(jsonb_agg(item ORDER BY pos), '[]'::jsonb)
          FROM jsonb_array_elements(
            CASE jsonb_typeof(doc.data -> 'social') WHEN 'array' THEN doc.data -> 'social' ELSE '[]'::jsonb END
          ) WITH ORDINALITY AS t(item, pos)
          WHERE COALESCE(item ->> 'visible', 'true') <> 'false'
        )
      )
      || CASE jsonb_typeof(doc.data -> 'philosophy')
        WHEN 'object' THEN jsonb_build_object(
          'philosophy',
          (doc.data -> 'philosophy') || jsonb_build_object(
            'notes', (
              SELECT COALESCE(jsonb_agg(item ORDER BY pos), '[]'::jsonb)
              FROM jsonb_array_elements(
                CASE jsonb_typeof(doc.data -> 'philosophy' -> 'notes')
                  WHEN 'array' THEN doc.data -> 'philosophy' -> 'notes' ELSE '[]'::jsonb END
              ) WITH ORDINALITY AS t(item, pos)
              WHERE item ->> 'status' = 'published'
            )
          )
        )
        ELSE '{}'::jsonb
      END,
    doc.updated_at
  FROM doc;
$$;

REVOKE EXECUTE ON FUNCTION public.get_public_site_content() FROM public;
GRANT EXECUTE ON FUNCTION public.get_public_site_content() TO anon, authenticated;

-- Visitors now read through the function only.
DROP POLICY IF EXISTS "Public read access" ON public.site_content;
DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;

-- ------------------------------------------------------------------------------
-- ROLLBACK (only to undo this file). The site keeps working either way: the client
-- falls back to reading site_content directly when this function does not exist.
-- ------------------------------------------------------------------------------
-- CREATE POLICY "Public read site_content" ON public.site_content
--   FOR SELECT TO public USING (true);
-- DROP FUNCTION IF EXISTS public.get_public_site_content();
