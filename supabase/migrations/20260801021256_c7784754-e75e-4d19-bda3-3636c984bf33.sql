-- 1. Private schema for security-definer helpers (removes them from exposed API)
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC;

-- 2. ai_blog_posts: remove anonymous insert/publish
DROP POLICY IF EXISTS "Anon can insert drafts" ON public.ai_blog_posts;
DROP POLICY IF EXISTS "Anon can publish drafts" ON public.ai_blog_posts;
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.ai_blog_posts;
CREATE POLICY "Admins can manage all posts" ON public.ai_blog_posts
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
REVOKE INSERT, UPDATE, DELETE ON public.ai_blog_posts FROM anon;

-- 3. blog_comments: hide guest_email from public reads
DROP POLICY IF EXISTS "Anyone can read comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Admins can manage comments" ON public.blog_comments;
CREATE POLICY "Admins can manage comments" ON public.blog_comments
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Public can read comments" ON public.blog_comments
  FOR SELECT TO anon, authenticated
  USING (true);

REVOKE SELECT ON public.blog_comments FROM anon, authenticated;
GRANT SELECT (id, article_slug, parent_id, user_id, guest_name, content, is_edited, created_at, updated_at)
  ON public.blog_comments TO anon, authenticated;
GRANT SELECT ON public.blog_comments TO service_role;

CREATE OR REPLACE VIEW public.blog_comments_public
WITH (security_invoker = true) AS
  SELECT id, article_slug, parent_id, user_id, guest_name, content, is_edited, created_at, updated_at
  FROM public.blog_comments;
GRANT SELECT ON public.blog_comments_public TO anon, authenticated, service_role;

-- 4. profiles: no longer world-readable
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Commenter profiles are viewable" ON public.profiles
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.blog_comments c WHERE c.user_id = profiles.user_id));
REVOKE SELECT ON public.profiles FROM anon, authenticated;
GRANT SELECT (id, user_id, display_name, avatar_url, created_at, updated_at) ON public.profiles TO anon, authenticated;

-- 5. blog_likes: hide visitor identifiers, prevent duplicates
REVOKE SELECT ON public.blog_likes FROM anon, authenticated;
GRANT SELECT (id, article_slug, created_at) ON public.blog_likes TO anon, authenticated;
CREATE UNIQUE INDEX IF NOT EXISTS blog_likes_visitor_unique
  ON public.blog_likes (article_slug, visitor_id) WHERE visitor_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS blog_likes_user_unique
  ON public.blog_likes (article_slug, user_id) WHERE user_id IS NOT NULL;

-- 6. Replace always-true write policies with real validation
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(btrim(name)) BETWEEN 1 AND 100
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255
    AND length(btrim(subject)) BETWEEN 1 AND 200
    AND length(btrim(message)) BETWEEN 1 AND 2000
  );

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255);

DROP POLICY IF EXISTS "Anyone can log visitor events" ON public.visitor_events;
CREATE POLICY "Anyone can log visitor events" ON public.visitor_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(session_id) BETWEEN 1 AND 100
    AND length(event_type) BETWEEN 1 AND 50
    AND length(page_path) BETWEEN 1 AND 500
  );

-- 7. Rewire remaining policies onto private.has_role, then drop the public one
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view visitor events" ON public.visitor_events;
CREATE POLICY "Admins can view visitor events" ON public.visitor_events
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;
CREATE POLICY "Only admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
CREATE POLICY "Only admins can insert roles" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
CREATE POLICY "Only admins can update roles" ON public.user_roles
  FOR UPDATE TO authenticated USING (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION private.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user();