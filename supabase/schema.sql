-- ==============================================================================
-- Tables for the Advaita website (fresh project only; every statement is idempotent).
-- Then run, in order: fix_rls.sql, public_content.sql, contact_rate_limit.sql.
-- RLS is enabled here so no table ever exists without it; the policies live in fix_rls.sql.
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

-- ------------------------------------------------------------------------------
-- 2. Table: public.contact_submissions
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  topic text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
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
        email = ''
        OR (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND char_length(email) <= 320)
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

-- ------------------------------------------------------------------------------
-- 3. Maintenance: Automated Cleanup (pg_cron)
-- Enable the extension first (Dashboard > Database > Extensions > pg_cron), then run
-- this block again if it printed the NOTICE below. Any other failure now aborts loudly.
-- Confirm the job exists:
--   SELECT jobname, schedule, active FROM cron.job WHERE jobname = 'delete_old_contact_submissions';
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
  ELSE
    RAISE NOTICE 'pg_cron is not enabled: contact_submissions older than 6 months will NOT be deleted until it is.';
  END IF;
END $$;