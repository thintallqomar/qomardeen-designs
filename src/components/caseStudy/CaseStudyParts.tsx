import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { useHiddenProjects } from '@/hooks/useSiteSettings';
import { safeHref } from '@/lib/safeUrl';
import CaseVideo from './CaseVideo';

/*
 * Shared building blocks for every case study (UpTime, WalPay, the portfolio, and any
 * case study written in the admin), so they all follow the same system as the rest of
 * the site: left-aligned, one type scale, hairline rows instead of boxes, one ending.
 */

export type Fact = { label: string; value: string };

/** Opening: small breadcrumb, title, one-line lead, facts row, optional live link. */
export const CaseStudyHeader = ({
  badge, title, lead, facts, liveUrl, liveLabel, extra,
}: {
  badge?: string; title: string; lead?: string; facts: Fact[]; liveUrl?: string; liveLabel?: string; extra?: ReactNode;
}) => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const shown = facts.filter(f => f.value);
  const live = safeHref(liveUrl);
  return (
    <section className="pt-16 md:pt-24 pb-10 md:pb-14">
      <div className="container-custom">
        <ScrollReveal>
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <Link to={localizedPath('/projects')} className="hover:text-primary transition-colors">{t('nav.projects')}</Link>
            {badge && <><span className="mx-2" aria-hidden="true">/</span><span>{badge}</span></>}
          </nav>
          <h1 className="t-title max-w-4xl">{title}</h1>
          {lead && <p className="t-lead mt-5 md:mt-6 max-w-2xl">{lead}</p>}

          {shown.length > 0 && (
            <dl className={`mt-10 grid grid-cols-2 ${shown.length >= 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-x-8`}>
              {shown.map(f => (
                <div key={f.label} className="border-t border-border py-4">
                  <dt className="text-sm text-muted-foreground mb-1">{f.label}</dt>
                  <dd className="font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {(live || extra) && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {live && (
                <a href={live} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <ExternalLink className="w-4 h-4" /> {liveLabel || t('caseStudy.viewLive')}
                </a>
              )}
              {extra}
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};

/** "Full case study" frames: numbered, left-aligned, each opens full screen. */
export const CaseStudyFrames = ({
  title, blurb, frames, onOpen,
}: {
  title: string; blurb?: string; frames: { src: string; alt: string; label?: string; video?: string }[]; onOpen: (i: number) => void;
}) => {
  const [loaded, setLoaded] = useState<Set<number>>(new Set());
  return (
    <section id="case-study-content" className="section-padding">
      <div className="container-custom">
        <ScrollReveal>
          <div className="mb-10 max-w-2xl">
            <h2 className="t-h2 mb-3">{title}</h2>
            {blurb && <p className="text-muted-foreground">{blurb}</p>}
          </div>
        </ScrollReveal>
        <div className="space-y-10 md:space-y-14">
          {frames.map((f, i) => (
            <figure key={i}>
              <figcaption className="mb-4 flex items-baseline gap-3 text-sm">
                <span className="font-mono text-primary tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-medium text-muted-foreground">{f.label || f.alt}</span>
              </figcaption>
{f.video ? (
                <CaseVideo src={f.video} poster={f.src} label={f.alt} />
              ) : (
              <button
                type="button"
                onClick={() => onOpen(i)}
                className="relative block w-full overflow-hidden rounded-2xl border border-border bg-card text-left cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`${f.alt}: open full screen`}
              >
                {!loaded.has(i) && <Skeleton className="w-full aspect-[16/9]" />}
                <img
                  src={f.src}
                  alt={f.alt}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setLoaded(prev => new Set(prev).add(i))}
                  className={`w-full h-auto transition-opacity duration-300 ${loaded.has(i) ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
                />
              </button>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

/** One ending for every case study: the next case study, and a way to talk. */
export const CaseStudyEnd = ({ next: wanted }: { next?: { title: string; route: string; blurb?: string } }) => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const hidden = useHiddenProjects();
  // If the next case study is switched off, point to all projects instead of a page that isn't there.
  const next = wanted && !hidden.has(wanted.route.split('/').pop() ?? '') ? wanted : undefined;
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        <ScrollReveal>
          <div className="grid md:grid-cols-[minmax(0,1fr)_auto] gap-8 md:items-end">
            {next ? (
              <Link
                to={localizedPath(next.route)}
                className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <span className="text-sm text-muted-foreground">{t('caseStudy.next')}</span>
                <span className="mt-2 flex items-center gap-3 t-title !text-[clamp(1.75rem,5vw,3rem)] group-hover:text-primary transition-colors">
                  {next.title}
                  <ArrowUpRight className="w-7 h-7 md:w-9 md:h-9 shrink-0 rtl:-scale-x-100 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
                {next.blurb && <span className="mt-2 block text-muted-foreground max-w-xl">{next.blurb}</span>}
              </Link>
            ) : (
              <Link to={localizedPath('/projects')} className="t-h2 inline-flex items-center gap-2 hover:text-primary transition-colors">
                {t('caseStudy.allProjects')} <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </Link>
            )}
            <div className="flex flex-col gap-2 md:items-end">
              <span className="text-sm text-muted-foreground">{t('caseStudy.likeThis')}</span>
              <Link to={localizedPath('/hire#contact')} className="btn-primary">
                {t('caseStudy.letsTalk')} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
