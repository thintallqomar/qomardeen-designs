-- Two-step sign-in for the admin, enforced by the database itself.
--
-- Once an account has a confirmed authenticator app, its staff powers (reading private data,
-- editing content, uploading media) only work after the 6-digit code has been entered,
-- i.e. when the session is "aal2". A session that only used the password ("aal1") is
-- treated like a visitor. Accounts without an authenticator are unaffected.
--
-- Checks about someone other than the signed-in user (or from backend functions, where there
-- is no signed-in user) are unaffected too: those functions do their own check.

CREATE OR REPLACE FUNCTION private.mfa_ok(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE
    WHEN auth.uid() IS NULL OR _user_id IS DISTINCT FROM auth.uid() THEN true
    WHEN coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2' THEN true
    ELSE NOT EXISTS (
      SELECT 1 FROM auth.mfa_factors f
      WHERE f.user_id = _user_id AND f.status = 'verified'
    )
  END
$$;
REVOKE ALL ON FUNCTION private.mfa_ok(uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION private.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text IN ('admin','editor','contributor')
  ) AND private.mfa_ok(_user_id)
$$;

CREATE OR REPLACE FUNCTION private.is_publisher(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text IN ('admin','editor')
  ) AND private.mfa_ok(_user_id)
$$;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  ) AND private.mfa_ok(_user_id)
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  ) AND private.mfa_ok(_user_id)
$$;
