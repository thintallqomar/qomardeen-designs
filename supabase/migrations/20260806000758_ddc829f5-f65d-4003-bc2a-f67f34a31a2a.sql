DROP POLICY IF EXISTS "Anyone can attach a contact email to a comment" ON public.comment_contacts;
REVOKE INSERT ON public.comment_contacts FROM anon;

DROP POLICY IF EXISTS "Commenter profiles are viewable" ON public.profiles;