CREATE OR REPLACE FUNCTION public.validate_blog_comment()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF length(NEW.content) > 5000 THEN
    RAISE EXCEPTION 'Comment too long (max 5000 characters)';
  END IF;
  IF NEW.guest_name IS NOT NULL AND length(NEW.guest_name) > 100 THEN
    RAISE EXCEPTION 'Name too long';
  END IF;
  IF length(NEW.article_slug) > 200 THEN
    RAISE EXCEPTION 'Invalid article slug';
  END IF;
  RETURN NEW;
END;
$function$;