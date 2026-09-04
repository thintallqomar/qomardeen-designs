CREATE TABLE public.atlas_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'New conversation',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.atlas_threads TO authenticated;
GRANT ALL ON public.atlas_threads TO service_role;
ALTER TABLE public.atlas_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own atlas threads" ON public.atlas_threads
  FOR ALL TO authenticated
  USING (auth.uid() = user_id AND private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (auth.uid() = user_id AND private.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER atlas_threads_updated_at BEFORE UPDATE ON public.atlas_threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.atlas_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.atlas_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX atlas_messages_thread_idx ON public.atlas_messages(thread_id, created_at);
CREATE INDEX atlas_threads_user_idx ON public.atlas_threads(user_id, updated_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.atlas_messages TO authenticated;
GRANT ALL ON public.atlas_messages TO service_role;
ALTER TABLE public.atlas_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage own atlas messages" ON public.atlas_messages
  FOR ALL TO authenticated
  USING (auth.uid() = user_id AND private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (auth.uid() = user_id AND private.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.validate_atlas_message()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF length(NEW.content) > 50000 THEN RAISE EXCEPTION 'Message too long'; END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER validate_atlas_message_trigger BEFORE INSERT ON public.atlas_messages
  FOR EACH ROW EXECUTE FUNCTION public.validate_atlas_message();