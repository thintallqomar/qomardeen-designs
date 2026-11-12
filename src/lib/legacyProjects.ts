import uptimeCover from '@/assets/uptime-cover.png';
import up01 from '@/assets/uptime/frame-01.png';
import up02 from '@/assets/uptime/frame-02.png';
import up03 from '@/assets/uptime/frame-03.png';
import up04 from '@/assets/uptime/frame-04.png';
import up05 from '@/assets/uptime/frame-05.png';
import up06 from '@/assets/uptime/frame-06.png';
import up07 from '@/assets/uptime/frame-07.png';
import up08 from '@/assets/uptime/frame-08.png';
import up09 from '@/assets/uptime/frame-09.png';
import up10 from '@/assets/uptime/frame-10.png';
import wp01 from '@/assets/walpay/frame-01.png';
import wp02 from '@/assets/walpay/frame-02.png';
import wp03 from '@/assets/walpay/frame-03.png';
import wp04 from '@/assets/walpay/frame-04.png';
import wp05 from '@/assets/walpay/frame-05.png';
import wp06 from '@/assets/walpay/frame-06.png';
import wp07 from '@/assets/walpay/frame-07.png';
import wp08 from '@/assets/walpay/frame-08.png';
import wp09 from '@/assets/walpay/frame-09.png';
import wp10 from '@/assets/walpay/frame-10.png';
import wp11 from '@/assets/walpay/frame-11.png';
import wp12 from '@/assets/walpay/frame-12.png';
import wp13 from '@/assets/walpay/frame-13.png';
import { supabase } from '@/integrations/supabase/client';
import { saveContent, estimateReading, type CaseStudyBody } from '@/lib/cms';
import { uploadMedia } from '@/lib/media';

/**
 * The two flagship projects that were originally built as fixed pages through Lovable chat.
 * "Import" copies them into the admin (text + images) so they can be edited like any other
 * case study. Nothing is removed: the original pages stay as a fallback until an imported
 * copy is published.
 */

const ASSETS: Record<string, string> = {
  'uptime/cover': uptimeCover,
  'uptime/01': up01,
  'uptime/02': up02,
  'uptime/03': up03,
  'uptime/04': up04,
  'uptime/05': up05,
  'uptime/06': up06,
  'uptime/07': up07,
  'uptime/08': up08,
  'uptime/09': up09,
  'uptime/10': up10,
  'walpay/01': wp01,
  'walpay/02': wp02,
  'walpay/03': wp03,
  'walpay/04': wp04,
  'walpay/05': wp05,
  'walpay/06': wp06,
  'walpay/07': wp07,
  'walpay/08': wp08,
  'walpay/09': wp09,
  'walpay/10': wp10,
  'walpay/11': wp11,
  'walpay/12': wp12,
  'walpay/13': wp13,
};

interface LegacySection {
  title: string; subtitle: string; description: string; imageKey: string; imageAlt: string;
  metrics?: { label: string; value: string }[];
}
export interface LegacyProject {
  slug: string; title: string; subtitle: string; excerpt: string; tags: string[];
  badge: string; role: string; scope: string; platform: string; timeline?: string; liveUrl: string;
  coverKey: string; coverAlt: string;
  sections: LegacySection[];
  gallery: { key: string; alt: string; label: string }[];
}

export const LEGACY_PROJECTS: LegacyProject[] = [
  {
    slug: 'uptime',
    title: 'UpTime CMMS',
    subtitle: 'A powerful maintenance and equipment tracking tool that reduces downtime through scheduled tasks, offline functionality, and smart reporting.',
    excerpt: 'CMMS platform for asset tracking & maintenance workflows',
    tags: ['UI/UX', 'SaaS', 'Dashboard', 'CMMS'],
    badge: 'UI/UX Case Study', role: 'Product Designer (UI/UX)', scope: 'End-to-End Design', platform: 'Web App (SaaS)',
    liveUrl: 'https://www.behance.net/gallery/239892845/UpTime',
    coverKey: 'uptime/cover', coverAlt: 'UpTime CMMS case study cover',
    sections: [
      { title: 'The Problem', subtitle: 'Discovery', imageKey: 'uptime/02', imageAlt: 'Product Overview - Frustrations and Solutions',
        description: 'Maintenance teams relied on spreadsheets and paper logs to track equipment, leading to missed schedules, unplanned downtime, and costly reactive repairs.',
        metrics: [{ label: 'Avg. Downtime', value: '23%' }, { label: 'Missed Tasks', value: '40%' }] },
      { title: 'Research & Empathy', subtitle: 'Understanding Users', imageKey: 'uptime/05', imageAlt: 'User Persona',
        description: 'Through interviews with facility managers and technicians, we mapped pain points into an empathy map and defined a primary persona — a maintenance lead juggling 200+ assets across multiple sites.' },
      { title: 'Design System & Identity', subtitle: 'Visual Foundation', imageKey: 'uptime/07', imageAlt: 'Brand Identity',
        description: 'We crafted a professional yet approachable brand identity with a clean color palette, structured typography, and iconography that communicates reliability and precision.' },
      { title: 'The Dashboard', subtitle: 'Core Experience', imageKey: 'uptime/08', imageAlt: 'Dashboard Design',
        description: 'The central hub provides real-time asset health, upcoming maintenance schedules, and actionable alerts — transforming data overload into clear, prioritized insights.',
        metrics: [{ label: 'Task Completion', value: '94%' }, { label: 'Response Time', value: '-60%' }] },
    ],
    gallery: [
      { key: 'uptime/01', alt: 'UpTime Cover - UI/UX Case Study', label: 'Cover' },
      { key: 'uptime/02', alt: 'Product Overview - Frustrations and Solutions', label: 'Product Overview' },
      { key: 'uptime/03', alt: 'Design Approach - Core Features', label: 'Design Approach' },
      { key: 'uptime/04', alt: 'Project Timeline', label: 'Project Timeline' },
      { key: 'uptime/05', alt: 'User Persona', label: 'User Persona' },
      { key: 'uptime/06', alt: 'Empathy Map', label: 'Empathy Map' },
      { key: 'uptime/07', alt: 'Brand Identity', label: 'Brand Identity' },
      { key: 'uptime/08', alt: 'Dashboard Design', label: 'Dashboard' },
      { key: 'uptime/09', alt: 'Equipment Registry & Task Management', label: 'Key Features' },
      { key: 'uptime/10', alt: 'Settings & Integration', label: 'Settings & Integration' }
    ],
  },
  {
    slug: 'walpay',
    title: 'WalPay',
    subtitle: 'A digital wallet and currency exchange platform designed to remove the friction from international finance, enabling instant transfers with institutional-grade rates.',
    excerpt: 'Fintech platform for seamless international transfers',
    tags: ['UX Design', 'UI Design', 'Fintech', 'iOS App'],
    badge: 'UI/UX Case Study', role: 'Product Designer (UI/UX)', scope: 'End-to-End Design', platform: 'iOS App & Website', timeline: '8 Weeks',
    liveUrl: 'https://www.behance.net/gallery/242927925/WalPay-UI-UX-Case-Study',
    coverKey: 'walpay/01', coverAlt: 'WalPay case study cover',
    sections: [
      { title: 'The Challenge', subtitle: 'Discovery', imageKey: 'walpay/03', imageAlt: 'Frustrations and Solutions',
        description: 'International money transfers were riddled with hidden fees, slow processing, and fragmented experiences — leaving users anxious about where their money was at any given moment.',
        metrics: [{ label: 'Avg. Transfer Fee', value: '7.5%' }, { label: 'Processing Time', value: '3-5 days' }] },
      { title: 'Understanding Users', subtitle: 'Research', imageKey: 'walpay/05', imageAlt: 'User Persona - Sarah Jenkins',
        description: 'We interviewed expatriates and freelancers who regularly send money across borders. Their core need: trust, speed, and transparency in every transaction.' },
      { title: 'Design Language', subtitle: 'Visual System', imageKey: 'walpay/09', imageAlt: 'Style Guide',
        description: 'A fintech product demands trust. We built a design system around clean geometry, a confidence-inspiring blue palette, and typography that balances authority with approachability.' },
      { title: 'Mobile-First Experience', subtitle: 'Final Designs', imageKey: 'walpay/10', imageAlt: 'Onboarding Screens',
        description: 'Every screen was designed for thumb-friendly interaction on mobile. The send-money flow was reduced from 8 steps to 3, with real-time rate visibility and instant confirmation.',
        metrics: [{ label: 'Steps Reduced', value: '62%' }, { label: 'Task Success', value: '97%' }] },
    ],
    gallery: [
      { key: 'walpay/01', alt: 'WalPay Cover - UI/UX Case Study', label: 'Cover' },
      { key: 'walpay/02', alt: 'Product Overview - Digital Wallet Platform', label: 'Product Overview' },
      { key: 'walpay/03', alt: 'Frustrations and Solutions', label: 'Frustrations & Solutions' },
      { key: 'walpay/04', alt: 'Design Process - Double Diamond', label: 'Design Process' },
      { key: 'walpay/05', alt: 'User Persona - Sarah Jenkins', label: 'User Persona' },
      { key: 'walpay/06', alt: 'Empathy Mapping', label: 'Empathy Mapping' },
      { key: 'walpay/07', alt: 'User Flow', label: 'User Flow' },
      { key: 'walpay/08', alt: 'Website Design', label: 'Website Design' },
      { key: 'walpay/09', alt: 'Style Guide - Typography & Colors', label: 'Style Guide' },
      { key: 'walpay/10', alt: 'High Fidelity Mobile Designs - Onboarding', label: 'Onboarding Screens' },
      { key: 'walpay/11', alt: 'Send Money & Wallet Transactions', label: 'Send Money & Transactions' },
      { key: 'walpay/12', alt: 'Profile Settings & Preferences', label: 'Profile & Settings' },
      { key: 'walpay/13', alt: 'KYC Verification Flow', label: 'KYC Flow' }
    ],
  },
];

const toFile = async (key: string, name: string) => {
  const res = await fetch(ASSETS[key]);
  if (!res.ok) throw new Error(`Could not read image ${key}`);
  const blob = await res.blob();
  return new File([blob], name, { type: blob.type || 'image/png' });
};

/** Uploads one image into the media library (compressed to WebP) and returns its URL. */
const uploadKey = async (cache: Map<string, string>, key: string, slug: string, alt: string) => {
  const cached = cache.get(key);
  if (cached) return cached;
  const file = await toFile(key, `${slug}-${key.split('/')[1]}.png`);
  const asset = await uploadMedia(file, 'projects', alt);
  cache.set(key, asset.public_url);
  return asset.public_url;
};

export const legacyImageCount = (p: LegacyProject) => new Set([p.coverKey, ...p.sections.map(s => s.imageKey), ...p.gallery.map(g => g.key)]).size;

export async function importLegacyProject(
  p: LegacyProject,
  author: { userId: string | null; email: string | null },
  onStep?: (done: number, total: number) => void,
) {
  // Never overwrite something that already exists with this slug.
  const { data: clash } = await supabase.from('content_items').select('id').eq('type', 'case_study' as never).eq('slug', p.slug).maybeSingle();
  if (clash) return null;

  const total = legacyImageCount(p);
  let done = 0;
  const cache = new Map<string, string>();
  const up = async (key: string, alt: string) => {
    const before = cache.size;
    const url = await uploadKey(cache, key, p.slug, alt);
    if (cache.size > before) onStep?.(++done, total);
    return url;
  };

  const cover = await up(p.coverKey, p.coverAlt);
  const sections: CaseStudyBody['sections'] = [];
  for (const s of p.sections) {
    sections.push({ title: s.title, subtitle: s.subtitle, description: s.description, image: await up(s.imageKey, s.imageAlt), imageAlt: s.imageAlt, metrics: s.metrics });
  }
  const gallery: CaseStudyBody['gallery'] = [];
  for (const g of p.gallery) gallery.push({ src: await up(g.key, g.alt), alt: g.alt, label: g.label });

  const body: CaseStudyBody = {
    kind: 'full', badge: p.badge, role: p.role, scope: p.scope, platform: p.platform, timeline: p.timeline ?? '',
    behanceUrl: p.liveUrl, sections, gallery,
  };
  const reading = estimateReading([p.excerpt, ...p.sections.map(s => `${s.title} ${s.description}`)].join(' '));
  const now = new Date().toISOString();
  return saveContent({
    type: 'case_study', title: p.title, subtitle: p.subtitle, slug: p.slug, excerpt: p.excerpt, tags: p.tags,
    cover_image: cover, cover_image_alt: p.coverAlt, seo_title: null, seo_description: null, resource_url: p.liveUrl,
    status: 'published', visibility: 'public', is_featured: true, publish_date: now, updated_date: now,
    body_json: body, reading_time_minutes: reading.minutes, word_count: reading.words,
    author_id: author.userId, author_name: author.email,
  } as never);
}
