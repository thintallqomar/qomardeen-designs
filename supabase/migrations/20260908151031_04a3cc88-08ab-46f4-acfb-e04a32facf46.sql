CREATE TABLE public.project_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  company text,
  project_type text NOT NULL,
  budget_range text,
  timeline text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE, DELETE ON public.project_inquiries TO authenticated;
GRANT ALL ON public.project_inquiries TO service_role;

ALTER TABLE public.project_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read inquiries"
  ON public.project_inquiries FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update inquiries"
  ON public.project_inquiries FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete inquiries"
  ON public.project_inquiries FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.validate_project_inquiry()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF length(NEW.name) > 100 THEN RAISE EXCEPTION 'Name too long'; END IF;
  IF length(NEW.email) > 255 THEN RAISE EXCEPTION 'Email too long'; END IF;
  IF NEW.company IS NOT NULL AND length(NEW.company) > 150 THEN RAISE EXCEPTION 'Company too long'; END IF;
  IF length(NEW.project_type) > 100 THEN RAISE EXCEPTION 'Project type too long'; END IF;
  IF NEW.budget_range IS NOT NULL AND length(NEW.budget_range) > 100 THEN RAISE EXCEPTION 'Budget too long'; END IF;
  IF NEW.timeline IS NOT NULL AND length(NEW.timeline) > 100 THEN RAISE EXCEPTION 'Timeline too long'; END IF;
  IF length(NEW.message) > 4000 THEN RAISE EXCEPTION 'Message too long'; END IF;
  IF (
    SELECT count(*) FROM public.project_inquiries
    WHERE email = NEW.email AND created_at > now() - interval '1 hour'
  ) >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_project_inquiry_trigger
  BEFORE INSERT ON public.project_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.validate_project_inquiry();

CREATE TRIGGER project_inquiries_updated_at
  BEFORE UPDATE ON public.project_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();