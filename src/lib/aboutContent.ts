import type { TFunction } from 'i18next';
import { supabase } from '@/integrations/supabase/client';
import { saveContent, logAudit } from '@/lib/cms';

/**
 * Everything written on the About page, editable from Admin › About page.
 *
 * The built-in text (from the translation files and the original page) is the default.
 * Edits are saved per language, so changing the English text never breaks the French page.
 * Stored as one hidden "resource" entry (like the hero images and CV), readable by visitors
 * because it is shown on a public page anyway; only staff can change it.
 */
export const ABOUT_SLUG = 'site-setting-about';

export type Job = { title: string; meta: string; place: string; note: string; body: string };
export type School = { dates: string; title: string; place: string };
export type Cert = { title: string; meta: string };
export type Principle = { title: string; body: string };

export interface AboutContent {
  word: string;
  lead: string;
  cvLabel: string;
  designerLabel: string;
  coderLabel: string;
  designShare: number;
  designer: string[];
  coder: string[];
  factsTitle: string;
  facts: string[];
  bio: string[];
  educationTitle: string;
  education: School[];
  experienceTitle: string;
  experience: Job[];
  certificationsTitle: string;
  certifications: Cert[];
  philosophyTitle: string;
  philosophySubtitle: string;
  principles: Principle[];
}

type Stored = { version: 1; langs: Record<string, Partial<AboutContent>> };

const list = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);

/** The page as it was built, in the given language. */
export const aboutDefaults = (t: TFunction): AboutContent => {
  const principles = t('philosophy.principles', { returnObjects: true });
  return {
    word: t('aboutIntro.big'),
    lead: t('aboutIntro.lead'),
    cvLabel: t('about.resume'),
    designerLabel: t('aboutIntro.partDesigner'),
    coderLabel: t('aboutIntro.partCoder'),
    designShare: 80,
    designer: list(t('aboutIntro.designerList', { returnObjects: true })),
    coder: list(t('aboutIntro.coderList', { returnObjects: true })),
    factsTitle: t('aboutIntro.factsTitle'),
    facts: list(t('aboutIntro.facts', { returnObjects: true })),
    bio: ['p1', 'p2', 'p3', 'p4', 'p5'].map(k => t(`about.${k}`)).filter(Boolean),
    educationTitle: t('about.education'),
    education: [
      { dates: 'Jul 2025 – Jun 2026', title: 'School of Product — Product Design', place: 'AltSchool Africa, Lagos, Nigeria' },
      { dates: 'Aug 2008 – Jun 2014', title: t('about.edu2'), place: 'Ladoke Akintola University of Technology' },
    ],
    experienceTitle: t('about.experience'),
    experience: [
      { title: `${t('about.roleDesigner')} — WalPay`, meta: t('about.job1Tag'), place: t('about.job1Sub'), note: '', body: t('about.job1Desc') },
      { title: `${t('about.roleDesigner')} — UpTime HQ`, meta: 'Aug 2025 – Jan 2026', place: t('about.place2'), note: '', body: t('about.job2Desc') },
      { title: t('about.job3Title'), meta: `2024–${t('about.present')}`, place: 'Oladel Global Resources Limited', note: t('about.job3Promo'), body: t('about.job3Desc') },
      { title: t('about.job4Title'), meta: '', place: '', note: '', body: t('about.job4Desc') },
    ],
    certificationsTitle: t('about.certifications'),
    certifications: [
      { title: 'Foundations of Project Management', meta: 'Google (Coursera) — Jan 2024' },
      { title: 'Foundations of User Experience (UX) Design', meta: 'Google (Coursera) — Jan 2023' },
      { title: 'Jobberman Soft Skills Course', meta: 'Jobberman — Jan 2022' },
      { title: 'Visual Elements of User Interface Design', meta: 'California Institute of the Arts (Coursera) — Jan 2022' },
      { title: 'Web Design: Strategy and Information Architecture', meta: 'California Institute of the Arts (Coursera) — Jan 2022' },
      { title: 'UX Design Fundamentals', meta: 'California Institute of the Arts (Coursera) — Jan 2022' },
    ],
    philosophyTitle: t('philosophy.title'),
    philosophySubtitle: t('philosophy.subtitle', { defaultValue: '' }),
    principles: Array.isArray(principles) ? (principles as Principle[]) : [],
  };
};

/* ── cleaning (also protects the page from oversized or malformed saves) ── */
const s = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/\s+$/g, '').slice(0, max) : '');
const strings = (v: unknown, maxItems: number, maxLen: number) =>
  (Array.isArray(v) ? v : []).map(x => s(x, maxLen).trim()).filter(Boolean).slice(0, maxItems);
const objects = <T extends Record<string, string>>(v: unknown, keys: (keyof T)[], maxItems: number, maxLen: number): T[] =>
  (Array.isArray(v) ? v : [])
    .map(o => Object.fromEntries(keys.map(k => [k, s((o as Record<string, unknown>)?.[k as string], maxLen).trim()])) as T)
    .filter(o => !!o[keys.includes('title' as keyof T) ? ('title' as keyof T) : keys[0]]) // a row needs its main field (title) to be shown
    .slice(0, maxItems);

export const cleanAbout = (c: AboutContent): AboutContent => ({
  word: s(c.word, 40).trim(),
  lead: s(c.lead, 600).trim(),
  cvLabel: s(c.cvLabel, 40).trim(),
  designerLabel: s(c.designerLabel, 40).trim(),
  coderLabel: s(c.coderLabel, 40).trim(),
  designShare: Math.max(0, Math.min(100, Math.round(Number(c.designShare) || 0))),
  designer: strings(c.designer, 12, 160),
  coder: strings(c.coder, 12, 160),
  factsTitle: s(c.factsTitle, 80).trim(),
  facts: strings(c.facts, 12, 240),
  bio: strings(c.bio, 10, 1500),
  educationTitle: s(c.educationTitle, 60).trim(),
  education: objects<School>(c.education, ['dates', 'title', 'place'], 12, 200),
  experienceTitle: s(c.experienceTitle, 60).trim(),
  experience: objects<Job>(c.experience, ['title', 'meta', 'place', 'note', 'body'], 15, 1200),
  certificationsTitle: s(c.certificationsTitle, 60).trim(),
  certifications: objects<Cert>(c.certifications, ['title', 'meta'], 30, 200),
  philosophyTitle: s(c.philosophyTitle, 80).trim(),
  philosophySubtitle: s(c.philosophySubtitle, 300).trim(),
  principles: objects<Principle>(c.principles, ['title', 'body'], 10, 600),
});

/** Built-in text with any saved edits for this language laid on top. Empty saved headings fall back. */
export const mergeAbout = (defaults: AboutContent, saved?: Partial<AboutContent>): AboutContent => {
  if (!saved) return defaults;
  const out = { ...defaults } as Record<string, unknown>;
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined || v === null) continue;
    if (typeof v === 'string' && !v.trim()) continue;
    out[k] = v;
  }
  return out as unknown as AboutContent;
};

export async function fetchAbout(): Promise<Stored> {
  const { data, error } = await supabase
    .from('content_items')
    .select('body_json')
    .eq('type', 'resource')
    .eq('slug', ABOUT_SLUG)
    .maybeSingle();
  if (error) throw error;
  const body = data?.body_json as Stored | null;
  return body && body.version === 1 && body.langs ? body : { version: 1, langs: {} };
}

/** Save (or with `null`, reset to built-in) the About text for one language. */
export async function saveAbout(lang: string, content: AboutContent | null, author: { userId: string | null; email: string | null }) {
  const current = await fetchAbout();
  const langs = { ...current.langs };
  if (content) langs[lang] = cleanAbout(content);
  else delete langs[lang];

  const { data: existing } = await supabase
    .from('content_items')
    .select('id')
    .eq('type', 'resource')
    .eq('slug', ABOUT_SLUG)
    .maybeSingle();
  const now = new Date().toISOString();
  const row = {
    type: 'resource' as const,
    title: 'Site setting: About page text',
    slug: ABOUT_SLUG,
    subtitle: Object.keys(langs).join(','),
    status: 'published' as const,
    visibility: 'public' as const,
    is_featured: false,
    publish_date: now,
    updated_date: now,
    tags: [] as string[],
    body_json: { version: 1, langs },
    word_count: 0,
  };
  const saved = existing
    ? await saveContent(row as never, existing.id)
    : await saveContent({ ...row, author_id: author.userId, author_name: author.email } as never);
  await logAudit({ event_type: 'content.updated', target_table: 'content_items', target_id: saved.id, details: { about: lang, reset: !content } });
  return saved;
}
