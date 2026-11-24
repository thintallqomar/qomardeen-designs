import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useTransform } from 'framer-motion';
import { ArrowRight, Briefcase, Sparkles } from 'lucide-react';
import HeroGlow from '@/components/HeroGlow';
import SplitPortrait, { useSplit } from '@/components/SplitPortrait';
import { useHeroConfig } from '@/hooks/useSiteSettings';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';

const ease = [0.22, 1, 0.36, 1] as const;
const rise = (delay: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease } });

/**
 * Home hero: your name, big. Under it, your face split in two, designer on the left and builder (code) on the right.
 * Moving the mouse across the hero slides the seam; on phones a Designer / Builder switch does the same.
 */
const HeroBuilder = () => {
  const { t } = useTranslation();
  const { nowLine } = useHeroConfig();
  const localizedPath = useLocalizedPath();
  const section = useRef<HTMLElement>(null);
  const split = useSplit(section);
  // the side that is showing more of itself gets the spotlight
  const designerOpacity = useTransform(split.pos, [15, 50, 85], [0.35, 0.8, 1]);
  const builderOpacity = useTransform(split.pos, [15, 50, 85], [1, 0.8, 0.35]);
  const ask = (prompt: string) => window.dispatchEvent(new CustomEvent('atlas:ask', { detail: { prompt } }));

  return (
    <section ref={section} className="relative overflow-hidden pt-14 pb-12 md:pt-16 md:pb-16">
      <HeroGlow />
      <div className="container-custom relative z-10 flex flex-col items-center text-center">
        <motion.div {...rise(0)}>
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

        <motion.h1 {...rise(0.06)} className="mt-6 text-[clamp(2.6rem,8vw,6rem)] font-bold tracking-tight leading-[0.98]">
          Qomardeen Tijani
        </motion.h1>
        <motion.p {...rise(0.12)} className="mt-4 text-xl md:text-2xl font-semibold tracking-tight">
          {t('hero.headline1')} <span className="text-primary">{t('hero.headline2')}</span>
        </motion.p>

        <motion.div {...rise(0.18)} className="mt-7 flex w-full flex-col sm:w-auto sm:flex-row gap-3">
          <Link to={localizedPath('/projects')} className="btn-primary group">
            {t('hero.cta_explore')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to={localizedPath('/hire')} className="btn-outline">
            <Briefcase className="w-4 h-4" />
            {t('hero.cta_hire')}
          </Link>
        </motion.div>

        {/* the split: designer | face | builder */}
        <motion.div {...rise(0.26)} className="mt-6 w-full grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)_minmax(0,1fr)] items-center gap-6 lg:gap-10">
          <motion.div style={{ opacity: designerOpacity }} className="hidden lg:block text-right">
            <h2 className="text-3xl font-bold tracking-tight">{t('hero.designerTitle')}</h2>
            <p className="mt-2 ml-auto max-w-xs text-muted-foreground leading-relaxed">{t('hero.designerDesc')}</p>
          </motion.div>
          <SplitPortrait split={split} />
          <motion.div style={{ opacity: builderOpacity }} className="hidden lg:block text-left">
            <h2 className="font-mono text-3xl font-bold tracking-tight text-primary">{t('hero.builderTitle')}</h2>
            <p className="mt-2 max-w-xs text-muted-foreground leading-relaxed">{t('hero.builderDesc')}</p>
          </motion.div>
          {/* phones and tablets: both descriptions under the photo */}
          <div className="lg:hidden grid sm:grid-cols-2 gap-4 text-left">
            <div className="rounded-2xl border border-border bg-card/60 p-4">
              <p className="font-semibold">{t('hero.designerTitle')}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t('hero.designerDesc')}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/60 p-4">
              <p className="font-mono font-semibold text-primary">{t('hero.builderTitle')}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t('hero.builderDesc')}</p>
            </div>
          </div>
        </motion.div>

        <motion.div {...rise(0.34)} className="mt-10 w-full">
          <p className="mb-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> {t('hero.atlasLabel')}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[1, 2, 3].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => ask(t(`hero.atlas${n}`))}
                className="rounded-full border border-border bg-background/60 px-3.5 py-2 text-sm text-foreground/90 hover:border-primary/50 hover:bg-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {t(`hero.atlas${n}`)}
              </button>
            ))}
          </div>
          {nowLine && (
            <p className="mt-5 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{t('hero.now')}</span> · {nowLine}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBuilder;
