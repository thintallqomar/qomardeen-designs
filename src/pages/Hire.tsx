import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Briefcase, CalendarDays, CheckCircle2, Code2, Download, Layers,
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import uptimeCover from '@/assets/uptime-cover.png';
import walpayCover from '@/assets/walpay/frame-01.png';
import HeroGlow from '@/components/HeroGlow';
import HeroPortrait from '@/components/HeroPortrait';
import CvDownloadButton from '@/components/CvDownloadButton';

const EMAIL = 'qomardeentijani@gmail.com';
const BOOK_URL = 'https://cal.com/the_Qomardeen';
const LINKEDIN_URL = 'https://linkedin.com/in/qomardeentijani';

/* Ways to work together */
const engagements = [
  {
    icon: <Briefcase />,
    title: 'Full-time role',
    body: 'Product Designer or UI/UX Designer inside a product team: remote, with a local or international company. I can start immediately.',
    cta: 'Discuss a role',
  },
  {
    icon: <Rocket />,
    title: 'Freelance project',
    body: 'Dashboards, web apps and mobile flows, scoped end to end or in focused sprints, from discovery through to production-ready UI.',
    cta: 'Start a project',
  },
  {
    icon: <Layers />,
    title: 'Design system & handoff',
    body: 'Component libraries, design tokens and developer-ready specs that keep what ships faithful to what was designed.',
    cta: 'Talk it through',
  },
];

const valueProps = [
  { icon: <Target />, title: 'Product-led thinking', description: 'I look past the screen to business goals, user pain points and the outcome the design is meant to drive.' },
  { icon: <Code2 />, title: 'Design ↔ dev bridge', description: 'I know how engineers think, so handoffs are specs they can actually build from.' },
  { icon: <Zap />, title: 'Ship fast, ship right', description: 'Discovery to deployment in weeks, not months, without trading away quality or usability.' },
];

const processSteps = [
  { icon: <Lightbulb />, title: 'Discover', description: 'Understand the problem, the users, the business context and the constraints.' },
  { icon: <PenTool />, title: 'Design', description: 'Wireframes, high-fidelity UI and interactive prototypes grounded in real data.' },
  { icon: <Code2 />, title: 'Hand off', description: 'Specs, tokens and documentation your engineers can build from.' },
  { icon: <Rocket />, title: 'Deliver', description: 'QA, iteration and launch support, with documentation that keeps the work maintainable.' },
];

const deliverables = [
  'Figma files with auto-layout and variants',
  'Interactive prototypes for stakeholder buy-in',
  'Developer-ready specs and component documentation',
  'Design tokens: colors, typography, spacing',
  'Responsive layouts across breakpoints',
  'Motion specs for micro-interactions',
];

const work = [
  { title: 'UpTime CMMS', tag: 'Enterprise SaaS', desc: 'Asset management with complex maintenance workflows and dashboards.', route: '/projects/uptime', image: uptimeCover },
  { title: 'WalPay', tag: 'Fintech', desc: 'Digital wallet and currency exchange, with trust-building mobile flows.', route: '/projects/walpay', image: walpayCover },
];

const faqs = [
  { q: 'What kind of products have you designed?', a: 'Fintech and enterprise SaaS: a CMMS platform, dashboards, a digital wallet and currency exchange, and websites. Each is shown as a case study on this site.' },
  { q: 'How do you work with engineers?', a: 'I hand off developer-ready specs, design tokens and component documentation, and I prototype with AI assistance where it speeds things up, so what ships stays true to the design.' },
  { q: 'What do you need to get started?', a: 'A short brief: the goal, who it is for, the timeline, and any existing designs or research. I will reply with questions, next steps and a realistic scope.' },
];

const Hire = () => {
  const localizedPath = useLocalizedPath();

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
                        <span><span className="sm:hidden">Available now</span><span className="hidden sm:inline">Available immediately</span> · Nigeria (WAT, UTC+1)</span>
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
                        Product design that ships,<br />
                        <span className="text-primary">from discovery to production.</span>
                      </h1>
                      <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
                        I design clear, scalable interfaces for fintech and SaaS products, and I work close to engineering so the design survives handoff. Open to Product Design and UI/UX roles, remote, local or international.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="btn-primary group">
                          <CalendarDays className="w-4 h-4" />
                          Book a call
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <CvDownloadButton className="btn-outline" />
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
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">Ways we can work together</h2>
                    <p className="text-muted-foreground">Whether you are hiring for a team or scoping a project, here is how it usually starts.</p>
                  </div>
                </ScrollReveal>
                <StaggeredReveal className="grid md:grid-cols-3 gap-5" staggerDelay={0.1}>
                  {engagements.map(e => (
                    <div key={e.title} className="card-elegant flex flex-col h-full">
                      <Icon3D variant="primary" size="md" className="mb-4">{e.icon}</Icon3D>
                      <h3 className="text-lg font-semibold mb-2">{e.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{e.body}</p>
                      <a href="#contact" className="inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-primary hover:underline">
                        {e.cta} <ArrowRight className="w-4 h-4" />
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
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">Proof, not promises</h2>
                    <p className="text-muted-foreground">Two end-to-end case studies, from research to final UI.</p>
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
                        <img src={w.image} alt={`${w.title} case study`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-5">
                        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{w.tag}</span>
                        <h3 className="text-lg font-semibold mt-1 mb-1.5">{w.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{w.desc}</p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                          View case study <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link to={localizedPath('/projects')} className="btn-outline">
                    See all projects <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>

            {/* ── Why teams hire me ── */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Why teams hire me</h2>
                </ScrollReveal>
                <StaggeredReveal className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto" staggerDelay={0.1}>
                  {valueProps.map(v => (
                    <div key={v.title} className="card-elegant h-full">
                      <Icon3D variant="primary" size="md" className="mb-4">{v.icon}</Icon3D>
                      <h3 className="font-semibold mb-1.5">{v.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                    </div>
                  ))}
                </StaggeredReveal>
              </div>
            </section>

            {/* ── How I work ── */}
            <section className="section-padding">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How I work</h2>
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
                <div className="max-w-3xl mx-auto">
                  <ScrollReveal>
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What you get</h2>
                    <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
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
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Questions recruiters ask</h2>
                  </ScrollReveal>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((f, i) => (
                      <AccordionItem key={f.q} value={`faq-${i}`}>
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
                      <h2 className="text-2xl md:text-3xl font-bold mb-3">Let's talk</h2>
                      <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                        Book a call, or share a few details below and I'll come back with next steps, timing and a realistic scope.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                          <CalendarDays className="w-4 h-4" /> Book a call
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
