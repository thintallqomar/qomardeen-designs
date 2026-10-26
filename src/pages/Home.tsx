import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import FeaturedProjects from '@/components/FeaturedProjects';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import PageSEO from '@/components/PageSEO';
import ScrollReveal from '@/components/ScrollReveal';
import { useLocalizedNavigate } from '@/hooks/useLocalizedNavigate';

const btnFocus =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useLocalizedNavigate();

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
            <Hero />

            {/* Short intro */}
            <section className="section-padding" aria-labelledby="home-intro">
              <div className="container-custom">
                <ScrollReveal>
                  <div className="max-w-2xl mx-auto text-center">
                    <h2 id="home-intro" className="text-2xl md:text-3xl font-bold mb-4">
                      {t('homeIntro.title', { defaultValue: 'Design that ships' })}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {t('homeIntro.body', {
                        defaultValue:
                          'I design products across fintech, SaaS and AI-native tools, and I work close to the code so ideas make it to production intact.',
                      })}
                    </p>
                    <button
                      onClick={() => navigate('/about')}
                      className={`inline-flex items-center gap-2 text-primary font-semibold hover:underline group ${btnFocus} rounded`}
                    >
                      {t('homeIntro.cta', { defaultValue: 'Learn more about me' })}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            <FeaturedProjects />
            <div className="container-custom -mt-8 mb-8 text-center">
              <button
                onClick={() => navigate('/projects')}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors ${btnFocus}`}
              >
                {t('homeIntro.viewAll', { defaultValue: 'View all work' })}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Closing CTA */}
            <section className="section-padding" aria-labelledby="home-cta">
              <div className="container-custom">
                <ScrollReveal>
                  <div className="card-elegant max-w-3xl mx-auto p-8 md:p-12 text-center">
                    <h2 id="home-cta" className="text-2xl md:text-3xl font-bold mb-4">
                      {t('homeCta.title', { defaultValue: 'Have a project in mind?' })}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                      {t('homeCta.body', { defaultValue: "Tell me what you're building and I'll get back to you." })}
                    </p>
                    <button
                      onClick={() => navigate('/contact')}
                      className={`inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity group ${btnFocus}`}
                    >
                      {t('homeCta.cta', { defaultValue: 'Get in touch' })}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
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
