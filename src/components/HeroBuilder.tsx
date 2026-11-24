import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Briefcase, Sparkles } from 'lucide-react';
import HeroGlow from '@/components/HeroGlow';
import HeroPortrait from '@/components/HeroPortrait';
import { useHeroConfig } from '@/hooks/useSiteSettings';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import uptimeThumb from '@/assets/uptime-thumb.webp';
import heroCutout from '@/assets/hero-cutout.webp';

const ease = [0.22, 1, 0.36, 1] as const;
const DOTS = 'radial-gradient(hsl(var(--foreground) / 0.35) 1px, transparent 1.2px)';
const SPOT = 'radial-gradient(hsl(var(--primary)) 1.4px, transparent 1.8px)';
const SPOT_MASK = 'radial-gradient(220px circle at var(--mx, 70%) var(--my, 30%), black, transparent)';

const PeekCard = ({ to, className, label }: { to: string; className: string; label: string }) => (
  <Link
    to={to}
    className={`items-center gap-3 rounded-2xl border border-border bg-card/90 backdrop-blur px-3 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
  >
    <img src={uptimeThumb} alt="" className="h-11 w-16 rounded-lg object-cover" loading="lazy" />
    <span className="flex-1 text-left">
      <span className="block text-[10px] font-semibold uppercase tracking-widest text-primary">{label}</span>
      <span className="block text-sm font-semibold">UpTime CMMS</span>
    </span>
    <ArrowUpRight className="w-4 h-4 text-muted-foreground rtl:-scale-x-100" />
  </Link>
);

/**
 * Home hero, "designer who builds".
 * Home's job is curiosity: your angle, a face, one glimpse of work, the next click. Availability details, process and
 * terms live on the Hire page. One quiet motion: a spotlight that follows the cursor over a faint dot grid
 * (mouse devices only, never for people who prefer reduced motion).
 */
const HeroBuilder = () => {
  const { t } = useTranslation();
  const { nowLine } = useHeroConfig();
  const localizedPath = useLocalizedPath();
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const [spotlight, setSpotlight] = useState(false);
  const [atlasReady, setAtlasReady] = useState(true);

  useEffect(() => {
    setSpotlight(window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce);
  }, [reduce]);

  // Fallback: if the assistant isn't on the page, show plain skill tags instead of chips that would do nothing.
  useEffect(() => {
    const id = setTimeout(() => setAtlasReady(!!(window as unknown as { __atlasReady?: boolean }).__atlasReady), 1500);
    return () => clearTimeout(id);
  }, []);

  const onMove = (e: React.PointerEvent) => {
    if (!spotlight || !section.current) return;
    const rect = section.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      section.current?.style.setProperty('--mx', `${x}px`);
      section.current?.style.setProperty('--my', `${y}px`);
    });
  };

  const ask = (prompt: string) => window.dispatchEvent(new CustomEvent('atlas:ask', { detail: { prompt } }));
  const skills = t('hero.skills', { returnObjects: true }) as unknown;
  const skillList = Array.isArray(skills) ? (skills as string[]) : [];
  const rise = (delay: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease } });

  return (
    <section ref={section} onPointerMove={onMove} className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      <HeroGlow />
      {/* faint dot grid (systems thinking), with a brighter spotlight that follows the cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_85%)] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        style={{ backgroundImage: DOTS, backgroundSize: '24px 24px' }}
      />
      {spotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{ backgroundImage: SPOT, backgroundSize: '24px 24px', maskImage: SPOT_MASK, WebkitMaskImage: SPOT_MASK }}
        />
      )}

      <div className="container-custom relative z-10 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] gap-12 items-center">
        <div className="min-w-0">
          <motion.div {...rise(0)} className="flex items-center gap-3">
            {/* phones: a face on the first screen */}
            <span
              aria-hidden="true"
              className="lg:hidden relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-primary/30"
              style={{ background: 'hsl(var(--primary) / 0.22)' }}
            >
              <img src={heroCutout} alt="" className="absolute inset-x-0 bottom-0 w-full object-contain object-bottom scale-[1.35] origin-bottom" />
            </span>
            <Link
              to={localizedPath('/hire')}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs sm:text-sm font-medium hover:bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {t('hero.status')}
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Link>
          </motion.div>

          <motion.h1 {...rise(0.08)} className="mt-6 text-[clamp(2.1rem,5.4vw,3.9rem)] font-bold tracking-tight leading-[1.05] text-balance">
            <span className="sr-only">Qomardeen Tijani — {t('hero.nameTag')}. </span>
            {t('hero.headline1')}
            <br />
            <span className="text-primary">{t('hero.headline2')}</span>
          </motion.h1>

          <motion.p {...rise(0.16)} className="mt-5 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            {t('hero.sub')}
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to={localizedPath('/projects')} className="btn-primary group">
              {t('hero.cta_explore')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to={localizedPath('/hire')} className="btn-outline">
              <Briefcase className="w-4 h-4" />
              {t('hero.cta_hire')}
            </Link>
          </motion.div>

          {/* phones: the work, right after the buttons */}
          <PeekCard to={localizedPath('/projects/uptime')} className="flex lg:hidden mt-5" label={t('hero.peekLabel')} />

          <motion.div {...rise(0.32)} className="mt-8">
            {atlasReady ? (
              <>
                <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> {t('hero.atlasLabel')}
                </p>
                <div className="-mx-4 px-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
                  {[1, 2, 3].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => ask(t(`hero.atlas${n}`))}
                      className="shrink-0 whitespace-nowrap sm:whitespace-normal rounded-full border border-border bg-background/60 px-3.5 py-2 text-left text-sm text-foreground/90 hover:border-primary/50 hover:bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {t(`hero.atlas${n}`)}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skillList.map(s => (
                  <span key={s} className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground">{s}</span>
                ))}
              </div>
            )}
            {nowLine && (
              <p className="mt-5 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{t('hero.now')}</span> · {nowLine}
              </p>
            )}
          </motion.div>
        </div>

        <div className="relative">
          <HeroPortrait>
            <PeekCard to={localizedPath('/projects/uptime')} className="hidden lg:flex absolute -bottom-3 -left-5 z-10 shadow-lg hover:-translate-y-0.5 transition-transform" label={t('hero.peekLabel')} />
          </HeroPortrait>
          <p className="mt-8 text-center lg:text-right text-sm">
            <span className="font-semibold">Qomardeen Tijani</span>
            <span className="text-muted-foreground"> · {t('hero.nameTag')}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroBuilder;
