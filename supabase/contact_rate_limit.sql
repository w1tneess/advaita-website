-- ==============================================================================
-- Database-side rate limit for contact_submissions.
-- Run after fix_rls.sql. The client honeypot and cooldown stop casual bots, but
-- anyone can POST to the REST API with the public anon key and skip both; this
-- trigger applies to every insert regardless of where it comes from.
--
-- Limits: 3 messages per sender email per 10 minutes, 30 messages per hour in total.
-- Concurrent inserts can slip slightly past the limit; it is a flood guard, not a quota.
-- ==============================================================================

-- The old default timezone('utc', now()) yields a timestamp WITHOUT time zone, so rows
-- were misdated (and escaped the windows below) whenever the database TimeZone was not UTC.
ALTER TABLE public.contact_submissions ALTER COLUMN created_at SET DEFAULT now();

-- SECURITY DEFINER so the count sees rows that RLS hides from the inserting anon role.
CREATE OR REPLACE FUNCTION public.enforce_contact_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.email <> '' AND (
    SELECT count(*) FROM public.contact_submissions
    WHERE lower(email) = lower(NEW.email) AND created_at > now() - interval '10 minutes'
  ) >= 3 THEN
    RAISE EXCEPTION 'Too many messages from this address. Please try again in a few minutes.'
      USING ERRCODE = 'P0001', HINT = 'rate_limited';
  END IF;

  IF (
    SELECT count(*) FROM public.contact_submissions
    WHERE created_at > now() - interval '1 hour'
  ) >= 30 THEN
    RAISE EXCEPTION 'The message form is busy right now. Please try again later or email hi@advaitachandra.in.'
      USING ERRCODE = 'P0001', HINT = 'rate_limited';
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger functions run without an EXECUTE check, so nobody needs to call it directly.
REVOKE EXECUTE ON FUNCTION public.enforce_contact_rate_limit() FROM public, anon, authenticated;

DROP TRIGGER IF EXISTS contact_submissions_rate_limit ON public.contact_submissions;
CREATE TRIGGER contact_submissions_rate_limit
  BEFORE INSERT ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.enforce_contact_rate_limit();

-- ------------------------------------------------------------------------------
-- ROLLBACK (only to undo this file):
-- ------------------------------------------------------------------------------
-- DROP TRIGGER IF EXISTS contact_submissions_rate_limit ON public.contact_submissions;
-- DROP FUNCTION IF EXISTS public.enforce_contact_rate_limit();
-- ALTER TABLE public.contact_submissions ALTER COLUMN created_at SET DEFAULT timezone('utc'::text, now());
