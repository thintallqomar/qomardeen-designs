
-- Profiles table for signed-in commenters
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Blog comments table with threading
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT NOT NULL,
  parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_name TEXT,
  guest_email TEXT,
  content TEXT NOT NULL,
  is_edited BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_blog_comments_article ON public.blog_comments(article_slug);
CREATE INDEX idx_blog_comments_parent ON public.blog_comments(parent_id);

ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "Anyone can read comments" ON public.blog_comments FOR SELECT USING (true);

-- Signed-in users can insert comments
CREATE POLICY "Signed-in users can comment" ON public.blog_comments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Anonymous users can comment (guest_name required, no user_id)
CREATE POLICY "Anonymous users can comment" ON public.blog_comments FOR INSERT
  TO anon WITH CHECK (user_id IS NULL AND guest_name IS NOT NULL AND length(guest_name) > 0);

-- Users can edit their own comments
CREATE POLICY "Users can edit own comments" ON public.blog_comments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" ON public.blog_comments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Admins can manage all comments
CREATE POLICY "Admins can manage comments" ON public.blog_comments FOR ALL
  TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Validation trigger
CREATE OR REPLACE FUNCTION public.validate_blog_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF length(NEW.content) > 5000 THEN
    RAISE EXCEPTION 'Comment too long (max 5000 characters)';
  END IF;
  IF NEW.guest_name IS NOT NULL AND length(NEW.guest_name) > 100 THEN
    RAISE EXCEPTION 'Name too long';
  END IF;
  IF NEW.guest_email IS NOT NULL AND length(NEW.guest_email) > 255 THEN
    RAISE EXCEPTION 'Email too long';
  END IF;
  IF length(NEW.article_slug) > 200 THEN
    RAISE EXCEPTION 'Invalid article slug';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_comment_before_insert
  BEFORE INSERT OR UPDATE ON public.blog_comments
  FOR EACH ROW EXECUTE FUNCTION public.validate_blog_comment();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON public.blog_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
