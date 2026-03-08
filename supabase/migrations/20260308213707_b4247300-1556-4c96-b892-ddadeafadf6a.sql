
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anon can insert drafts" ON public.ai_blog_posts;
DROP POLICY IF EXISTS "Anon can update drafts" ON public.ai_blog_posts;

-- Tighter insert policy: anon can only insert drafts
CREATE POLICY "Anon can insert drafts"
ON public.ai_blog_posts
FOR INSERT
TO anon
WITH CHECK (status = 'draft');

-- Tighter update policy: anon can only publish existing drafts (status change only)
CREATE POLICY "Anon can publish drafts"
ON public.ai_blog_posts
FOR UPDATE
TO anon
USING (status = 'draft')
WITH CHECK (status = 'published');
