import { supabase } from '@/integrations/supabase/client';

export type ContentType = 'article' | 'thinking' | 'architecture' | 'resource' | 'case_study';
export type ContentStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type ContentVisibility = 'public' | 'unlisted' | 'private';

/**
 * Structured payload for a `case_study` content item, stored in `body_json`.
 * The title/subtitle/cover_image/excerpt/tags live on the content_items row;
 * everything below is case-study specific storytelling data.
 */
export interface CaseStudyMetric {
  label: string;
  value: string;
}
export interface CaseStudySection {
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  imageAlt?: string;
  metrics?: CaseStudyMetric[];
}
export interface CaseStudyFrame {
  src: string;
  alt?: string;
  label?: string;
}
export interface CaseStudyBody {
  badge?: string;        // e.g. "UI/UX Case Study"
  role?: string;         // e.g. "Product Designer (UI/UX)"
  scope?: string;        // e.g. "End-to-End Design"
  platform?: string;     // e.g. "Web App (SaaS)"
  behanceUrl?: string;   // external Behance / live link
  sections: CaseStudySection[];   // sticky-scroll storytelling
  gallery: CaseStudyFrame[];      // full-frame gallery
}

export const emptyCaseStudyBody = (): CaseStudyBody => ({
  badge: 'UI/UX Case Study',
  role: '',
  scope: '',
  platform: '',
  behanceUrl: '',
  sections: [],
  gallery: [],
});

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  subtitle: string | null;
  slug: string;
  cover_image: string | null;
  featured_image: string | null;
  excerpt: string | null;
  tldr: string | null;
  body_json: unknown;
  body_html: string | null;
  body_markdown: string | null;
  category: string | null;
  tags: string[];
  author_id: string | null;
  author_name: string | null;
  author_avatar: string | null;
  publish_date: string | null;
  updated_date: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_image: string | null;
  cover_image_alt: string | null;
  canonical_url: string | null;
  status: ContentStatus;
  visibility: ContentVisibility;
  is_featured: boolean;
  is_pinned: boolean;
  reading_time_minutes: number;
  word_count: number;
  resource_url: string | null;
  resource_file_type: string | null;
  resource_file_size: number | null;
  legacy_slug: string | null;
  created_at: string;
  updated_at: string;
}

export const CONTENT_TYPES: { value: ContentType; label: string; path: string; blurb: string }[] = [
  { value: 'case_study', label: 'Case Studies', path: 'case-studies', blurb: 'In-depth product design case studies with scroll storytelling and galleries.' },
  { value: 'article', label: 'Articles', path: 'articles', blurb: 'Long-form essays on product design, UX and systems.' },
  { value: 'thinking', label: 'Thinking', path: 'thinking', blurb: 'Short opinion pieces, teardowns and design lessons.' },
  { value: 'architecture', label: 'Architecture', path: 'architecture', blurb: 'PRDs, system design, user flows and decision logs.' },
  { value: 'resource', label: 'Resources', path: 'resources', blurb: 'Templates, checklists, kits and downloads.' },
];

export const typeToPath = (t: ContentType) =>
  CONTENT_TYPES.find(c => c.value === t)?.path ?? 'articles';

export const pathToType = (p: string): ContentType | undefined =>
  CONTENT_TYPES.find(c => c.path === p)?.value;

/** Words-per-minute reading estimate. */
export const estimateReading = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return { words, minutes: Math.max(1, Math.round(words / 225)) };
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const PUBLISHED = (q: any) =>
  q.eq('status', 'published').eq('visibility', 'public').order('publish_date', { ascending: false });

export async function fetchPublished(type?: ContentType) {
  let q = supabase.from('content_items').select('*');
  if (type) q = q.eq('type', type);
  const { data, error } = await PUBLISHED(q);
  if (error) throw error;
  return (data ?? []) as unknown as ContentItem[];
}

export async function fetchBySlug(type: ContentType, slug: string) {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('type', type)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as ContentItem) ?? null;
}

export async function fetchAllForAdmin() {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as ContentItem[];
}

export async function fetchRelated(sourceContentId?: string, sourceProjectSlug?: string) {
  let q = supabase.from('content_relations').select('target_content_id, sort_order');
  q = sourceContentId ? q.eq('source_content_id', sourceContentId) : q.eq('source_project_slug', sourceProjectSlug ?? '');
  const { data, error } = await q.order('sort_order');
  if (error) throw error;
  const ids = (data ?? []).map(r => r.target_content_id);
  if (!ids.length) return [] as ContentItem[];
  const { data: items, error: e2 } = await supabase
    .from('content_items')
    .select('*')
    .in('id', ids)
    .eq('status', 'published')
    .eq('visibility', 'public');
  if (e2) throw e2;
  return (items ?? []) as unknown as ContentItem[];
}

export async function setRelations(
  targetIds: string[],
  source: { contentId?: string; projectSlug?: string }
) {
  const del = supabase.from('content_relations').delete();
  const { error: delErr } = source.contentId
    ? await del.eq('source_content_id', source.contentId)
    : await del.eq('source_project_slug', source.projectSlug ?? '');
  if (delErr) throw delErr;
  if (!targetIds.length) return;
  const rows = targetIds.map((id, i) => ({
    source_content_id: source.contentId ?? null,
    source_project_slug: source.projectSlug ?? null,
    target_content_id: id,
    sort_order: i,
  }));
  const { error } = await supabase.from('content_relations').insert(rows);
  if (error) throw error;
}

/** Records a security/admin event. Never throws — logging must not break the UI. */
export async function logAudit(event: {
  event_type: string;
  target_table?: string;
  target_id?: string;
  outcome?: 'success' | 'denied' | 'error';
  details?: Record<string, unknown>;
}) {
  try {
    await supabase.functions.invoke('audit-log', { body: event });
  } catch {
    /* swallow */
  }
}
/** Create or update a content item. Returns the saved row. */
export async function saveContent(
  payload: Partial<ContentItem> & { type: ContentType; title: string; slug: string },
  id?: string
) {
  if (id) {
    const { data, error } = await supabase
      .from('content_items')
      .update(payload as never)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as unknown as ContentItem;
  }
  const { data, error } = await supabase
    .from('content_items')
    .insert(payload as never)
    .select('*')
    .single();
  if (error) throw error;
  return data as unknown as ContentItem;
}

export async function deleteContent(id: string) {
  const { error } = await supabase.from('content_items').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchById(id: string) {
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as ContentItem) ?? null;
}
