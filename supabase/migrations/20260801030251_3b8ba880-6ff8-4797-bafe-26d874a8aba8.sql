-- ── new roles ─────────────────────────────────────────────
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'contributor';

-- ── enums ─────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.content_type AS ENUM ('article','thinking','architecture','resource');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.content_status AS ENUM ('draft','published','scheduled','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.content_visibility AS ENUM ('public','unlisted','private');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── helper: staff check (security definer, private schema) ─
CREATE OR REPLACE FUNCTION private.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text IN ('admin','editor','contributor')
  )
$$;

CREATE OR REPLACE FUNCTION private.is_publisher(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text IN ('admin','editor')
  )
$$;

REVOKE EXECUTE ON FUNCTION private.is_staff(uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION private.is_publisher(uuid) FROM anon, authenticated;

-- ── content_items ─────────────────────────────────────────
CREATE TABLE public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.content_type NOT NULL,
  title text NOT NULL,
  subtitle text,
  slug text NOT NULL,
  cover_image text,
  featured_image text,
  excerpt text,
  tldr text,
  body_json jsonb,
  body_html text,
  body_markdown text,
  category text,
  tags text[] NOT NULL DEFAULT '{}',
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text,
  author_avatar text,
  publish_date timestamptz,
  updated_date timestamptz,
  seo_title text,
  seo_description text,
  seo_image text,
  cover_image_alt text,
  canonical_url text,
  status public.content_status NOT NULL DEFAULT 'draft',
  visibility public.content_visibility NOT NULL DEFAULT 'public',
  is_featured boolean NOT NULL DEFAULT false,
  is_pinned boolean NOT NULL DEFAULT false,
  reading_time_minutes integer NOT NULL DEFAULT 1,
  word_count integer NOT NULL DEFAULT 0,
  resource_url text,
  resource_file_type text,
  resource_file_size integer,
  legacy_slug text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT content_items_slug_per_type UNIQUE (type, slug)
);

CREATE INDEX content_items_type_status_idx ON public.content_items (type, status, publish_date DESC);
CREATE INDEX content_items_tags_idx ON public.content_items USING gin (tags);
CREATE INDEX content_items_search_idx ON public.content_items
  USING gin (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(subtitle,'') || ' ' || coalesce(excerpt,'') || ' ' || coalesce(body_markdown,'')));

GRANT SELECT ON public.content_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published content"
  ON public.content_items FOR SELECT TO anon, authenticated
  USING (status = 'published' AND visibility = 'public' AND (publish_date IS NULL OR publish_date <= now()));

CREATE POLICY "Staff can read all content"
  ON public.content_items FOR SELECT TO authenticated
  USING (private.is_staff(auth.uid()));

CREATE POLICY "Staff can create drafts they own"
  ON public.content_items FOR INSERT TO authenticated
  WITH CHECK (
    private.is_staff(auth.uid())
    AND author_id = auth.uid()
    AND (private.is_publisher(auth.uid()) OR status = 'draft')
  );

CREATE POLICY "Publishers can update any content"
  ON public.content_items FOR UPDATE TO authenticated
  USING (private.is_publisher(auth.uid()))
  WITH CHECK (private.is_publisher(auth.uid()));

CREATE POLICY "Contributors can update their own drafts"
  ON public.content_items FOR UPDATE TO authenticated
  USING (private.is_staff(auth.uid()) AND author_id = auth.uid() AND status = 'draft')
  WITH CHECK (private.is_staff(auth.uid()) AND author_id = auth.uid() AND status = 'draft');

CREATE POLICY "Publishers can delete content"
  ON public.content_items FOR DELETE TO authenticated
  USING (private.is_publisher(auth.uid()));

-- ── content_relations ─────────────────────────────────────
CREATE TABLE public.content_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_content_id uuid REFERENCES public.content_items(id) ON DELETE CASCADE,
  source_project_slug text,
  target_content_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT content_relations_source_present CHECK (source_content_id IS NOT NULL OR source_project_slug IS NOT NULL)
);

CREATE UNIQUE INDEX content_relations_unique_content ON public.content_relations (source_content_id, target_content_id) WHERE source_content_id IS NOT NULL;
CREATE UNIQUE INDEX content_relations_unique_project ON public.content_relations (source_project_slug, target_content_id) WHERE source_project_slug IS NOT NULL;

GRANT SELECT ON public.content_relations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_relations TO authenticated;
GRANT ALL ON public.content_relations TO service_role;
ALTER TABLE public.content_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read relations"
  ON public.content_relations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff can manage relations"
  ON public.content_relations FOR ALL TO authenticated
  USING (private.is_staff(auth.uid()))
  WITH CHECK (private.is_staff(auth.uid()));

-- ── categories & tags ─────────────────────────────────────
CREATE TABLE public.content_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.content_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_categories TO authenticated;
GRANT ALL ON public.content_categories TO service_role;
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read categories" ON public.content_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Publishers manage categories" ON public.content_categories FOR ALL TO authenticated
  USING (private.is_publisher(auth.uid())) WITH CHECK (private.is_publisher(auth.uid()));

CREATE TABLE public.content_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.content_tags TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_tags TO authenticated;
GRANT ALL ON public.content_tags TO service_role;
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read tags" ON public.content_tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff manage tags" ON public.content_tags FOR ALL TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

-- ── media library ─────────────────────────────────────────
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL UNIQUE,
  public_url text NOT NULL,
  file_name text NOT NULL,
  mime_type text,
  file_size integer,
  width integer,
  height integer,
  alt_text text,
  folder text NOT NULL DEFAULT 'uploads',
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX media_assets_folder_idx ON public.media_assets (folder, created_at DESC);
GRANT SELECT ON public.media_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read media" ON public.media_assets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff manage media" ON public.media_assets FOR ALL TO authenticated
  USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));

-- ── audit log ─────────────────────────────────────────────
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  actor_id uuid,
  actor_email text,
  target_table text,
  target_id text,
  outcome text NOT NULL DEFAULT 'success',
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_log_created_idx ON public.audit_log (created_at DESC);
CREATE INDEX audit_log_event_idx ON public.audit_log (event_type, created_at DESC);
GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit log" ON public.audit_log FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));

-- ── updated_at triggers ───────────────────────────────────
CREATE TRIGGER content_items_updated_at BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER content_categories_updated_at BEFORE UPDATE ON public.content_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER media_assets_updated_at BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
