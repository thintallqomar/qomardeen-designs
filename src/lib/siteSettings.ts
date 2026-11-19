import { supabase } from '@/integrations/supabase/client';
import { saveContent, logAudit } from '@/lib/cms';

/**
 * Site-wide files you manage from Admin > Site: the Home hero image, the Hire hero image and the CV.
 *
 * Each one is stored as a small hidden "resource" entry with a reserved address (slug). The public
 * pages read it, and fall back to the built-in image / CV when nothing has been uploaded.
 * Entries with these slugs never appear in the public lists or in the admin content lists.
 */
export const SITE_SLUGS = {
  homeHero: 'site-setting-home-hero',
  hireHero: 'site-setting-hire-hero',
  cv: 'site-setting-cv',
} as const;
export type SiteKey = keyof typeof SITE_SLUGS;

const TITLES: Record<SiteKey, string> = {
  homeHero: 'Site setting: Home hero image',
  hireHero: 'Site setting: Hire hero image',
  cv: 'Site setting: CV',
};

export interface SiteSetting {
  url: string;
  fileName: string;
  size: number | null;
  updatedAt: string;
}
export type SiteSettings = Partial<Record<SiteKey, SiteSetting>>;

const CACHE_KEY = 'site-settings-cache-v1';
const FRESH_MS = 5 * 60 * 1000;

/** Last known settings (from this browser), so pages can show the right image instantly. */
export const cachedSiteSettings = (): SiteSettings | undefined => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as SiteSettings) : undefined;
  } catch {
    return undefined;
  }
};

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('content_items')
    .select('slug, resource_url, subtitle, resource_file_size, updated_at')
    .eq('type', 'resource')
    .in('slug', Object.values(SITE_SLUGS));
  if (error) throw error;

  const out: SiteSettings = {};
  for (const row of data ?? []) {
    const key = (Object.keys(SITE_SLUGS) as SiteKey[]).find(k => SITE_SLUGS[k] === row.slug);
    if (key && row.resource_url) {
      out[key] = {
        url: row.resource_url,
        fileName: row.subtitle ?? '',
        size: row.resource_file_size ?? null,
        updatedAt: row.updated_at,
      };
    }
  }
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(out)); } catch { /* private mode */ }
  return out;
}

let inflight: Promise<SiteSettings> | null = null;
let fetchedAt = 0;

/** Shared and cached for 5 minutes, so every part of the site asks the database once. */
export function getSiteSettings(force = false): Promise<SiteSettings> {
  if (!force && inflight && Date.now() - fetchedAt < FRESH_MS) return inflight;
  fetchedAt = Date.now();
  inflight = fetchSiteSettings().catch(err => {
    inflight = null;
    throw err;
  });
  return inflight;
}

export interface SavedFile {
  url: string;
  fileName: string;
  size: number | null;
  mime: string | null;
}

export async function saveSiteSetting(key: SiteKey, file: SavedFile, author: { userId: string | null; email: string | null }) {
  const slug = SITE_SLUGS[key];
  const { data: existing } = await supabase
    .from('content_items')
    .select('id')
    .eq('type', 'resource')
    .eq('slug', slug)
    .maybeSingle();

  const now = new Date().toISOString();
  const common = {
    type: 'resource' as const,
    title: TITLES[key],
    slug,
    subtitle: file.fileName,
    excerpt: null,
    tags: [] as string[],
    cover_image: key === 'cv' ? null : file.url,
    cover_image_alt: null,
    seo_title: null,
    seo_description: null,
    resource_url: file.url,
    resource_file_type: file.mime,
    resource_file_size: file.size,
    status: 'published' as const,
    visibility: 'public' as const,
    is_featured: false,
    publish_date: now,
    updated_date: now,
    body_json: {},
    reading_time_minutes: null,
    word_count: 0,
  };

  const saved = existing
    ? await saveContent(common as never, existing.id)
    : await saveContent({ ...common, author_id: author.userId, author_name: author.email } as never);

  await logAudit({ event_type: existing ? 'content.updated' : 'content.created', target_table: 'content_items', target_id: saved.id });
  inflight = null;
  return saved;
}

/** Go back to the built-in image / CV. */
export async function clearSiteSetting(key: SiteKey) {
  const { error } = await supabase.from('content_items').delete().eq('type', 'resource').eq('slug', SITE_SLUGS[key]);
  if (error) throw error;
  inflight = null;
}
