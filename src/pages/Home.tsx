import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import HeroBuilder from '@/components/HeroBuilder';
import { useHeroConfig } from '@/hooks/useSiteSettings';
import FeaturedProjects from '@/components/FeaturedProjects';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PageSEO from '@/components/PageSEO';
import ScrollReveal from '@/components/ScrollReveal';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';

const btnFocus =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const Home = () => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const { heroStyle } = useHeroConfig();
  const classic = heroStyle === 'classic';

  return (
    <>
      <Navigation />
      <PageSEO
        title="Qomardeen Tijani — Product Designer (UX, AI & Systems)"
        description="Product Designer bridging design and development. See selected fintech and SaaS case studies, then get in touch."
        path="/"
      />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            {classic ? <Hero /> : <HeroBuilder />}

            {/* Short intro: classic style only (the new hero already carries this message) */}
            {classic && (
              <>
            <section className="section-padding" aria-labelledby="home-intro">
              <div className="container-custom">
                <ScrollReveal>
                  <div className="max-w-2xl mx-auto text-center">
                    <h2 id="home-intro" className="t-h2 mb-4">
                      {t('homeIntro.title')}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {t('homeIntro.body')}
                    </p>
                    <Link
                      to={localizedPath('/about')}
                      className={`inline-flex items-center gap-2 text-primary font-semibold hover:underline group ${btnFocus} rounded`}
                    >
                      {t('homeIntro.cta')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </section>

              </>
            )}

            <FeaturedProjects />

            {/* Closing CTA */}
            <section className="section-padding" aria-labelledby="home-cta">
              <div className="container-custom">
                <ScrollReveal>
                  <div className="card-elegant max-w-3xl mx-auto p-8 md:p-12 text-center">
                    <h2 id="home-cta" className="t-h2 mb-4">
                      {t('homeCta.title')}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      {t('homeCta.body')}
                    </p>
                    <Link
                      to={localizedPath('/hire#contact')}
                      className={`inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity group ${btnFocus}`}
                    >
                      {t('homeCta.cta')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </PageTransition>
    </>
  );
};

export default Home;
