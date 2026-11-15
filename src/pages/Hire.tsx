import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight, ArrowUpRight, Briefcase, CalendarDays, CheckCircle2, Code2, Layers,
  Lightbulb, Linkedin, Mail, PenTool, Rocket, Target, Zap,
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import StaggeredReveal from '@/components/StaggeredReveal';
import Icon3D from '@/components/Icon3D';
import PageSEO from '@/components/PageSEO';
import InquiryForm from '@/components/InquiryForm';
import StickyHireBar from '@/components/StickyHireBar';
import HeroGlow from '@/components/HeroGlow';
import HeroPortrait from '@/components/HeroPortrait';
import CvDownloadButton from '@/components/CvDownloadButton';
import Testimonials from '@/components/Testimonials';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import uptimeCover from '@/assets/uptime-cover.png';
import walpayCover from '@/assets/walpay/frame-01.png';

const EMAIL = 'qomardeentijani@gmail.com';
const BOOK_URL = 'https://cal.com/the_Qomardeen';
const LINKEDIN_URL = 'https://linkedin.com/in/qomardeentijani';

const Hire = () => {
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();

  const engagements = [
    { icon: <Briefcase />, title: t('hire.eng1Title'), body: t('hire.eng1Body'), cta: t('hire.eng1Cta') },
    { icon: <Rocket />, title: t('hire.eng2Title'), body: t('hire.eng2Body'), cta: t('hire.eng2Cta') },
    { icon: <Layers />, title: t('hire.eng3Title'), body: t('hire.eng3Body'), cta: t('hire.eng3Cta') },
  ];
  const valueProps = [
    { icon: <Target />, title: t('hire.why1T'), description: t('hire.why1D') },
    { icon: <Layers />, title: t('hire.why2T'), description: t('hire.why2D') },
    { icon: <Code2 />, title: t('hire.why3T'), description: t('hire.why3D') },
    { icon: <Zap />, title: t('hire.why4T'), description: t('hire.why4D') },
  ];
  const processSteps = [
    { icon: <Lightbulb />, title: t('hire.how1T'), description: t('hire.how1D') },
    { icon: <PenTool />, title: t('hire.how2T'), description: t('hire.how2D') },
    { icon: <Code2 />, title: t('hire.how3T'), description: t('hire.how3D') },
    { icon: <Rocket />, title: t('hire.how4T'), description: t('hire.how4D') },
  ];
  const deliverables = [1, 2, 3, 4, 5, 6].map(n => t(`hire.get${n}`));
  const work = [
    { title: 'UpTime CMMS', tag: t('hire.tagSaas'), desc: t('hire.uptimeDesc'), route: '/projects/uptime', image: uptimeCover },
    { title: 'WalPay', tag: t('hire.tagFintech'), desc: t('hire.walpayDesc'), route: '/projects/walpay', image: walpayCover },
  ];
  const faqs = [1, 2, 3, 4, 5, 6].map(n => ({ q: t(`hire.faq${n}Q`), a: t(`hire.faq${n}A`) }));

  return (
    <>
      <Navigation />
      <PageSEO
        title="Hire Qomardeen Tijani — Product Designer (UI/UX), Available Now"
        description="Product Designer for fintech and SaaS teams. Open to remote full-time and freelance roles, available immediately. Book a call or download my CV."
        path="/hire"
      />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            {/* ── Hero ── */}
            <section className="relative overflow-hidden section-padding">
              <HeroGlow />
              <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-center">
                  <ScrollReveal>
                    <div>
                      <div className="inline-flex max-w-full items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/60 text-xs sm:text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 animate-ping" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                        </span>
                        <span>
                          <span className="sm:hidden">{t('hire.badgeNow')}</span>
                          <span className="hidden sm:inline">{t('hire.badgeImmediately')}</span> · {t('hire.badgeTz')}
                        </span>
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
                        {t('hire.h1a')}<br />
                        <span className="text-primary">{t('hire.h1b')}</span>
                      </h1>
                      <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">{t('hire.intro')}</p>
                      <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="btn-primary group">
                          <CalendarDays className="w-4 h-4" />
                          {t('hire.bookCall')}
                          <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <CvDownloadButton className="btn-outline" label={t('hire.downloadCv')} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-5 text-sm text-muted-foreground">
                        <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-1.5 py-2 hover:text-primary transition-colors">
                          <Mail className="w-4 h-4" /> {EMAIL}
                        </a>
                        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 py-2 hover:text-primary transition-colors">
                          <Linkedin className="w-4 h-4" /> LinkedIn
                        </a>
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Identical to the Home hero portrait */}
                  <HeroPortrait />
                </div>
              </div>
            </section>

            {/* ── Ways to work together ── */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <ScrollReveal>
                  <div className="text-center mb-10 max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('hire.waysTitle')}</h2>
                    <p className="text-muted-foreground">{t('hire.waysSub')}</p>
                  </div>
                </ScrollReveal>
                <StaggeredReveal className="grid md:grid-cols-3 gap-5" staggerDelay={0.1}>
                  {engagements.map(e => (
                    <div key={e.title} className="card-elegant flex flex-col h-full">
                      <Icon3D variant="primary" size="md" className="mb-4">{e.icon}</Icon3D>
                      <h3 className="text-lg font-semibold mb-2">{e.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{e.body}</p>
                      <a href="#contact" className="inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-primary hover:underline">
                        {e.cta} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                      </a>
                    </div>
                  ))}
                </StaggeredReveal>
              </div>
            </section>

            {/* ── Selected work ── */}
            <section className="section-padding">
              <div className="container-custom">
                <ScrollReveal>
                  <div className="text-center mb-10 max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('hire.proofTitle')}</h2>
                    <p className="text-muted-foreground">{t('hire.proofSub')}</p>
                  </div>
                </ScrollReveal>
                <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {work.map(w => (
                    <Link
                      key={w.title}
                      to={localizedPath(w.route)}
                      className="group block rounded-2xl border border-border bg-card overflow-hidden hover:shadow-elegant transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      <div className="aspect-video bg-muted overflow-hidden">
                        <img src={w.image} alt={`${w.title}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-5">
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{w.tag}</span>
                        <h3 className="text-lg font-semibold mt-1 mb-1.5">{w.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{w.desc}</p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                          {t('hire.viewCase')} <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link to={localizedPath('/projects')} className="btn-outline">
                    {t('hire.seeAll')} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                </div>
              </div>
            </section>

            {/* ── Testimonials (appears once real ones are added in src/data/testimonials.ts) ── */}
            <Testimonials />

            {/* ── Why teams hire me ── */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{t('hire.whyTitle')}</h2>
                </ScrollReveal>
                <StaggeredReveal className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto" staggerDelay={0.1}>
                  {valueProps.map(v => (
                    <div key={v.title} className="card-elegant flex gap-4">
                      <Icon3D variant="primary" size="md">{v.icon}</Icon3D>
                      <div>
                        <h3 className="font-semibold mb-1.5">{v.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                      </div>
                    </div>
                  ))}
                </StaggeredReveal>
              </div>
            </section>

            {/* ── How I work ── */}
            <section className="section-padding">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{t('hire.howTitle')}</h2>
                </ScrollReveal>
                <StaggeredReveal className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={0.1}>
                  {processSteps.map((s, i) => (
                    <div key={s.title} className="card-elegant h-full">
                      <div className="flex items-center justify-between mb-4">
                        <Icon3D variant="primary" size="md">{s.icon}</Icon3D>
                        <span className="text-sm font-semibold text-muted-foreground tabular-nums">0{i + 1}</span>
                      </div>
                      <h3 className="font-semibold mb-1.5">{s.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                    </div>
                  ))}
                </StaggeredReveal>
              </div>
            </section>

            {/* ── What you get ── */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <div className="max-w-2xl mx-auto">
                  <ScrollReveal>
                    <h2 className="text-xl md:text-2xl font-bold mb-5">{t('hire.getTitle')}</h2>
                    <ul className="space-y-3">
                      {deliverables.map(d => (
                        <li key={d} className="flex items-start gap-3 text-sm md:text-base">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /> {d}
                        </li>
                      ))}
                    </ul>
                  </ScrollReveal>
                </div>
              </div>
            </section>

            {/* ── FAQ ── */}
            <section className="section-padding">
              <div className="container-custom">
                <div className="max-w-3xl mx-auto">
                  <ScrollReveal>
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{t('hire.faqTitle')}</h2>
                  </ScrollReveal>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((f, i) => (
                      <AccordionItem key={i} value={`faq-${i}`}>
                        <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </section>

            {/* ── Contact ── */}
            <section id="contact" className="section-padding bg-muted/30 scroll-mt-16">
              <div className="container-custom">
                <div className="max-w-3xl mx-auto">
                  <ScrollReveal>
                    <div className="text-center mb-10">
                      <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('hire.talkTitle')}</h2>
                      <p className="text-muted-foreground max-w-xl mx-auto mb-6">{t('hire.talkBody')}</p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                          <CalendarDays className="w-4 h-4" /> {t('hire.bookCall')}
                        </a>
                      </div>
                    </div>
                  </ScrollReveal>
                  <ScrollReveal delay={0.1}>
                    <InquiryForm />
                  </ScrollReveal>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </PageTransition>
      <StickyHireBar bookUrl={BOOK_URL} />
    </>
  );
};

export default Hire;
