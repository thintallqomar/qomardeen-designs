
CREATE TABLE public.ai_blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Product Design',
  tags TEXT[] NOT NULL DEFAULT '{}',
  read_time TEXT NOT NULL DEFAULT '5 min',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  hero_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

ALTER TABLE public.ai_blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access for published posts
CREATE POLICY "Anyone can read published posts"
ON public.ai_blog_posts
FOR SELECT
USING (status = 'published');

-- Allow authenticated admins to manage posts
CREATE POLICY "Admins can manage all posts"
ON public.ai_blog_posts
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow anon insert for AI-generated drafts (published via admin confirmation)
CREATE POLICY "Anon can insert drafts"
ON public.ai_blog_posts
FOR INSERT
TO anon
WITH CHECK (status = 'draft');

-- Allow anon to update draft to published (for the confirmation flow)
CREATE POLICY "Anon can update drafts"
ON public.ai_blog_posts
FOR UPDATE
TO anon
USING (status = 'draft')
WITH CHECK (true);
