
-- 1. Media stays private: remove blanket read access, staff-only direct reads.
DROP POLICY IF EXISTS "Anyone can read media bucket" ON storage.objects;

CREATE POLICY "Staff can read media"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'media' AND private.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff can upload media" ON storage.objects;
CREATE POLICY "Staff can upload media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media' AND private.is_staff(auth.uid()));

-- 2. Brute-force throttling for admin sign-in (backend only).
CREATE TABLE IF NOT EXISTS public.auth_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  ip_hash text,
  success boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS auth_attempts_identifier_idx
  ON public.auth_attempts (identifier, created_at DESC);
CREATE INDEX IF NOT EXISTS auth_attempts_ip_idx
  ON public.auth_attempts (ip_hash, created_at DESC);

REVOKE ALL ON public.auth_attempts FROM anon, authenticated;
GRANT ALL ON public.auth_attempts TO service_role;

ALTER TABLE public.auth_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can review login attempts"
ON public.auth_attempts FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role));
