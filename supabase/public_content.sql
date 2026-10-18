-- ==============================================================================
-- Public, draft-free copy of the site document.
-- Run after fix_rls.sql. Visitors (anon) no longer read public.site_content
-- directly; they call get_public_site_content(), which returns the same document
-- shape with only what is meant to be public:
--
--   * ALLOWLIST: a top-level key reaches visitors only if it is named below. A key
--     the admin adds later (or a new internal one) stays private until it is added
--     to the list on purpose. 'activity' (titles of deleted items) is returned as [].
--   * DEFAULT-CLOSED lists: blog posts and notes need status = 'published'; projects
--     need published = true; social links need visible = true. An item without the
--     flag is NOT public.
--   * Lists with no draft concept (skills, timeline, interests, categories, photos,
--     thinkers) are public as a whole; they have no flag to check.
--
-- The admin editor keeps reading the full row through the "Admin manage site_content"
-- policy.
--
-- This file is idempotent: it is both the fresh-setup step and the migration.
--
-- APPLY (existing project): paste this file into the Supabase SQL editor and run it.
--   1. First run the pre-flight query below. Projects / social links it lists will
--      disappear from the public site on apply. Anything you meant to keep public
--      needs its flag set to true in /admin first; deliberately hidden ones are
--      expected in the list.
--   2. Run this file. Then `npm run security:rls` and load the live site.
--   Pre-flight:
--     SELECT 'projects' AS list, p ->> 'title' AS item
--       FROM public.site_content, jsonb_array_elements(data -> 'projects') p
--      WHERE id = 'main' AND COALESCE(p ->> 'published', '') <> 'true'
--     UNION ALL
--     SELECT 'social', s ->> 'label'
--       FROM public.site_content, jsonb_array_elements(data -> 'social') s
--      WHERE id = 'main' AND COALESCE(s ->> 'visible', '') <> 'true';
--
-- ROLLBACK: re-run the previous version of this file, which restores the old
--   denylist function:  git show 0925f83:supabase/public_content.sql
--   Do not roll back by dropping the function and re-creating the "Public read
--   site_content" policy: the client then reads the raw table, drafts included.
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
    SELECT sc.data, sc.updated_at
    FROM public.site_content sc
    WHERE sc.id = 'main' AND jsonb_typeof(sc.data) = 'object'
  )
  SELECT
    jsonb_build_object('publicCopy', true, 'activity', '[]'::jsonb)
    || COALESCE((
      SELECT jsonb_object_agg(e.key, e.value)
      FROM jsonb_each(doc.data) AS e
      WHERE e.key = ANY (ARRAY[
        'schemaVersion', 'seedVersion', 'profile', 'home', 'categories', 'skills',
        'timeline', 'interests', 'settings', 'photography'
      ])
    ), '{}'::jsonb)
    || jsonb_build_object(
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
        WHERE item ->> 'published' = 'true'
      ),
      'social', (
        SELECT COALESCE(jsonb_agg(item ORDER BY pos), '[]'::jsonb)
        FROM jsonb_array_elements(
          CASE jsonb_typeof(doc.data -> 'social') WHEN 'array' THEN doc.data -> 'social' ELSE '[]'::jsonb END
        ) WITH ORDINALITY AS t(item, pos)
        WHERE item ->> 'visible' = 'true'
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
