
-- 1. Add rate-limiting style protection: restrict public INSERT on contact_submissions to reasonable data
-- The existing "Anyone can submit contact form" policy uses WITH CHECK (true) which is fine for a public form
-- But let's add length constraints via a validation trigger

CREATE OR REPLACE FUNCTION public.validate_contact_submission()
RETURNS TRIGGER AS $$
BEGIN
  IF length(NEW.name) > 100 THEN
    RAISE EXCEPTION 'Name too long';
  END IF;
  IF length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'Email too long';
  END IF;
  IF length(NEW.subject) > 200 THEN
    RAISE EXCEPTION 'Subject too long';
  END IF;
  IF length(NEW.message) > 2000 THEN
    RAISE EXCEPTION 'Message too long';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_contact_submission_trigger
BEFORE INSERT ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.validate_contact_submission();

-- 2. Add validation trigger for visitor_events
CREATE OR REPLACE FUNCTION public.validate_visitor_event()
RETURNS TRIGGER AS $$
BEGIN
  IF length(NEW.session_id) > 100 THEN
    RAISE EXCEPTION 'Session ID too long';
  END IF;
  IF length(NEW.event_type) > 50 THEN
    RAISE EXCEPTION 'Event type too long';
  END IF;
  IF length(NEW.page_path) > 500 THEN
    RAISE EXCEPTION 'Page path too long';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_visitor_event_trigger
BEFORE INSERT ON public.visitor_events
FOR EACH ROW
EXECUTE FUNCTION public.validate_visitor_event();

-- 3. Add validation trigger for analytics_events
CREATE OR REPLACE FUNCTION public.validate_analytics_event()
RETURNS TRIGGER AS $$
BEGIN
  IF length(NEW.event_type) > 50 THEN
    RAISE EXCEPTION 'Event type too long';
  END IF;
  IF length(NEW.page_path) > 500 THEN
    RAISE EXCEPTION 'Page path too long';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_analytics_event_trigger
BEFORE INSERT ON public.analytics_events
FOR EACH ROW
EXECUTE FUNCTION public.validate_analytics_event();

-- 4. Protect user_roles from unauthorized modifications
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
