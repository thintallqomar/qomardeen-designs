import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Gamepad2, Microscope, Soup, UtensilsCrossed } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import PageIntro from './PageIntro';
import CvDownloadButton from '@/components/CvDownloadButton';
import { aboutPhotos } from '@/data/aboutPhotos';

const DESIGN_SHARE = 80; // honest split: mostly design, early on the code side

const list = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);

/** Top of the About page: who you are in one breath, the designer/coder split, and a few true, human facts. */
const AboutIntro = () => {
  const { t } = useTranslation();
  const designer = list(t('aboutIntro.designerList', { returnObjects: true }));
  const coder = list(t('aboutIntro.coderList', { returnObjects: true }));
  const facts = list(t('aboutIntro.facts', { returnObjects: true }));
  const icons = [Microscope, Gamepad2, UtensilsCrossed, Soup];

  return (
    <section className="pt-16 md:pt-24 pb-12 md:pb-16">
      <div className="container-custom">
        <PageIntro
          word={t('aboutIntro.big')}
          lead={t('aboutIntro.lead')}
          action={<CvDownloadButton className="btn-outline" label={t('about.resume')} />}
        />

        {aboutPhotos.length > 0 && (
          <div className="-mx-4 px-4 flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-0 md:grid md:grid-cols-4 md:overflow-visible">
            {aboutPhotos.slice(0, 4).map((p, i) => (
              <motion.img
                key={p.src}
                src={p.src}
                alt={p.alt}
                loading="lazy"
                initial={{ opacity: 0, y: 16, rotate: i % 2 ? 1.5 : -1.5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="h-56 w-44 shrink-0 md:w-full rounded-2xl object-cover border border-border"
              />
            ))}
          </div>
        )}

        {/* Part designer / part coder */}
        <ScrollReveal delay={0.05}>
          <div className="mt-10 card-elegant p-6 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl md:text-2xl font-bold">
                {t('aboutIntro.partDesigner')} <span className="text-muted-foreground font-normal">/</span>{' '}
                <span className="font-mono text-primary">{t('aboutIntro.partCoder')}</span>
              </h2>
              <span className="text-sm text-muted-foreground">{t('aboutIntro.splitNote', { design: DESIGN_SHARE, code: 100 - DESIGN_SHARE })}</span>
            </div>
            <div
              className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-secondary"
              role="img"
              aria-label={t('aboutIntro.splitNote', { design: DESIGN_SHARE, code: 100 - DESIGN_SHARE })}
            >
              <motion.span
                className="block h-full bg-foreground"
                initial={{ width: 0 }}
                whileInView={{ width: `${DESIGN_SHARE}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className="block h-full flex-1 bg-primary" />
            </div>
            <div className="mt-7 grid sm:grid-cols-2 gap-8">
              <ul className="space-y-2.5">
                {designer.map(item => (
                  <li key={item} className="flex gap-2.5 text-[15px]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />{item}</li>
                ))}
              </ul>
              <ul className="space-y-2.5 font-mono text-sm">
                {coder.map(item => (
                  <li key={item} className="flex gap-2.5"><span className="text-primary">›</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>

        {/* Random facts */}
        <ScrollReveal delay={0.1}>
          <h2 className="mt-14 text-xl md:text-2xl font-bold">{t('aboutIntro.factsTitle')}</h2>
          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            {facts.map((f, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div key={f} className="flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4">
                  <Icon className="w-5 h-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
                  <p className="text-[15px] leading-relaxed">{f}</p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutIntro;
