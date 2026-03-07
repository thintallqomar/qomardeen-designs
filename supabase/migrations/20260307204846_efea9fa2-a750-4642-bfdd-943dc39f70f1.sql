-- 1. Add admin-only SELECT policy on visitor_events
CREATE POLICY "Admins can view visitor events"
ON public.visitor_events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Create rate limiting function for contact submissions
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF (
    SELECT count(*)
    FROM public.contact_submissions
    WHERE email = NEW.email
      AND created_at > now() - interval '1 hour'
  ) >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;
  RETURN NEW;
END;
$$;

-- 3. Attach rate limit trigger to contact_submissions
CREATE TRIGGER check_contact_rate_limit_trigger
BEFORE INSERT ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.check_contact_rate_limit();