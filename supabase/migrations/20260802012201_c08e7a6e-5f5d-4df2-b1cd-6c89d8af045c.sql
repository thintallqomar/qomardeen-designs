CREATE TABLE IF NOT EXISTS public.comment_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.comment_contacts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comment_contacts TO authenticated;
GRANT ALL ON public.comment_contacts TO service_role;

ALTER TABLE public.comment_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can attach a contact email to a comment"
  ON public.comment_contacts FOR INSERT TO anon, authenticated
  WITH CHECK (length(email) BETWEEN 3 AND 254 AND email LIKE '%_@_%.__%');

CREATE POLICY "Only admins can read contact emails"
  ON public.comment_contacts FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can modify contact emails"
  ON public.comment_contacts FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.comment_contacts (comment_id, email, created_at)
SELECT id, guest_email, created_at FROM public.blog_comments
WHERE guest_email IS NOT NULL AND length(guest_email) > 0;

DROP VIEW IF EXISTS public.blog_comments_public;
ALTER TABLE public.blog_comments DROP COLUMN guest_email;

CREATE VIEW public.blog_comments_public
WITH (security_invoker = true) AS
SELECT id, article_slug, parent_id, user_id, guest_name, content, is_edited, created_at, updated_at
FROM public.blog_comments;

GRANT SELECT ON public.blog_comments_public TO anon, authenticated;