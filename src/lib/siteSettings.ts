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
  heroStyle: 'site-setting-hero-style',
  nowLine: 'site-setting-now-line',
  hiddenProjects: 'site-setting-hidden-projects',
  atlasNotes: 'site-setting-atlas-notes',
  atlas: 'site-setting-atlas',
} as const;
export type SiteKey = keyof typeof SITE_SLUGS;

const TITLES: Record<SiteKey, string> = {
  homeHero: 'Site setting: Home hero image',
  hireHero: 'Site setting: Hire hero image',
  cv: 'Site setting: CV',
  heroStyle: 'Site setting: Hero style',
  nowLine: 'Site setting: Now line',
  hiddenProjects: 'Site setting: Projects switched off',
  atlasNotes: 'Site setting: Notes for Atlas',
  atlas: 'Site setting: Atlas on/off',
};

/** Keys that hold a short piece of text (kept in the entry's subtitle) instead of a file. */
export const TEXT_KEYS: SiteKey[] = ['heroStyle', 'nowLine', 'hiddenProjects', 'atlasNotes', 'atlas'];

export interface SiteSetting {
  url: string;
  fileName: string;
  size: number | null;
  updatedAt: string;
  /** Image with a transparent background (a cut-out). */
  cutout?: boolean;
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
    .select('slug, resource_url, subtitle, resource_file_size, updated_at, tags')
    .eq('type', 'resource')
    .in('slug', Object.values(SITE_SLUGS));
  if (error) throw error;

  const out: SiteSettings = {};
  for (const row of data ?? []) {
    const key = (Object.keys(SITE_SLUGS) as SiteKey[]).find(k => SITE_SLUGS[k] === row.slug);
    if (!key) continue;
    if (TEXT_KEYS.includes(key) || row.resource_url) {
      out[key] = {
        url: row.resource_url ?? '',
        fileName: row.subtitle ?? '',
        size: row.resource_file_size ?? null,
        updatedAt: row.updated_at,
        cutout: Array.isArray(row.tags) && row.tags.includes('cutout'),
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
  url: string | null;
  fileName: string;
  size: number | null;
  mime: string | null;
  /** The image has a transparent background. */
  cutout?: boolean;
}

export type HeroStyle = 'new' | 'classic';
/** The "designer who builds" hero is the default; "classic" restores the previous hero, intro and CV button. */
export const heroStyleOf = (settings: SiteSettings): HeroStyle => (settings.heroStyle?.fileName === 'classic' ? 'classic' : 'new');
export const nowLineOf = (settings: SiteSettings): string => settings.nowLine?.fileName?.trim() ?? '';
export const atlasNotesOf = (settings: SiteSettings): string => settings.atlasNotes?.fileName ?? '';

/** Choices for "close Atlas after this long without activity" (seconds; 0 = never). */
export const ATLAS_IDLE_CHOICES = [15, 30, 60, 0] as const;
export const ATLAS_IDLE_DEFAULT = 30;
export type AtlasConfig = { enabled: boolean; idleSeconds: number };
/** Stored as "on|30" / "off|30". Nothing saved = on, closing after 30 seconds. */
export const atlasConfigOf = (settings: SiteSettings): AtlasConfig => {
  const [state, secs] = (settings.atlas?.fileName ?? '').split('|');
  const n = Number(secs);
  return {
    enabled: state !== 'off',
    idleSeconds: secs !== undefined && Number.isFinite(n) && n >= 0 ? n : ATLAS_IDLE_DEFAULT,
  };
};
export const atlasConfigValue = (c: AtlasConfig) => `${c.enabled ? 'on' : 'off'}|${c.idleSeconds}`;

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
    tags: (file.cutout ? ['cutout'] : []) as string[],
    cover_image: key === 'cv' || TEXT_KEYS.includes(key) ? null : file.url,
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
    reading_time_minutes: 1, // the database requires a number here (null made every Site setting save fail)
    word_count: 0,
  };

  const saved = existing
    ? await saveContent(common as never, existing.id)
    : await saveContent({ ...common, author_id: author.userId, author_name: author.email } as never);

  await logAudit({ event_type: existing ? 'content.updated' : 'content.created', target_table: 'content_items', target_id: saved.id });
  inflight = null;
  return saved;
}

/** Saves a short text setting (hero style, now line). */
export const saveSiteValue = (key: SiteKey, value: string, author: { userId: string | null; email: string | null }) =>
  saveSiteSetting(key, { url: null, fileName: value, size: null, mime: null }, author);

/** Go back to the built-in image / CV. */
export async function clearSiteSetting(key: SiteKey) {
  const { error } = await supabase.from('content_items').delete().eq('type', 'resource').eq('slug', SITE_SLUGS[key]);
  if (error) throw error;
  inflight = null;
}

/* ── On / off for projects ────────────────────────────────────────────────────────────────
 * UpTime, WalPay and "This portfolio" are built into the site (not stored in the database),
 * so their on/off switch is kept here: a list of the project addresses (slugs) that are off.
 * Visitors can read this list, so every page that shows projects can leave them out.
 */
export const BUILT_IN_PROJECTS = [
  { slug: 'uptime', title: 'UpTime CMMS' },
  { slug: 'walpay', title: 'WalPay' },
  { slug: 'portfolio', title: 'This portfolio' },
  { slug: 'fragrance', title: 'Fragrance Store app' },
] as const;
export const isBuiltInProject = (slug: string) => BUILT_IN_PROJECTS.some(p => p.slug === slug);

export const hiddenProjectsOf = (settings: SiteSettings): Set<string> =>
  new Set((settings.hiddenProjects?.fileName ?? '').split(',').map(s => s.trim()).filter(Boolean));

/** Turn a built-in project on or off for visitors. */
export async function setProjectHidden(slug: string, hidden: boolean, author: { userId: string | null; email: string | null }) {
  const current = hiddenProjectsOf(await getSiteSettings(true));
  if (hidden === current.has(slug)) return;
  if (hidden) current.add(slug); else current.delete(slug);
  await saveSiteValue('hiddenProjects', [...current].sort().join(','), author);
}
