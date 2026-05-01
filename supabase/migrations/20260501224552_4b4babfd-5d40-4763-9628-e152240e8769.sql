
CREATE TABLE public.blog_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT NOT NULL,
  user_id UUID,
  visitor_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT blog_likes_owner_check CHECK (
    (user_id IS NOT NULL AND visitor_id IS NULL)
    OR (user_id IS NULL AND visitor_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX blog_likes_user_unique
  ON public.blog_likes (article_slug, user_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX blog_likes_visitor_unique
  ON public.blog_likes (article_slug, visitor_id)
  WHERE visitor_id IS NOT NULL;

CREATE INDEX blog_likes_article_idx ON public.blog_likes (article_slug);

ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read likes"
  ON public.blog_likes
  FOR SELECT
  USING (true);

CREATE POLICY "Signed-in users can add their like"
  ON public.blog_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND visitor_id IS NULL);

CREATE POLICY "Signed-in users can remove their like"
  ON public.blog_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Visitors can add a like"
  ON public.blog_likes
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL AND visitor_id IS NOT NULL AND length(visitor_id) BETWEEN 8 AND 100);

CREATE POLICY "Visitors can remove a like"
  ON public.blog_likes
  FOR DELETE
  TO anon
  USING (user_id IS NULL AND visitor_id IS NOT NULL);
