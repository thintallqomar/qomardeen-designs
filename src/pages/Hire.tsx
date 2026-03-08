import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import StaggeredReveal from '@/components/StaggeredReveal';
import {
  Linkedin, Mail, Calendar, Sparkles, Zap, Users, Layers,
  ArrowRight, CheckCircle, Target, Lightbulb, Rocket,
  Clock, Globe, MessageSquare, Palette, Code2, BarChart3,
  Heart, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import profileImage from '@/assets/new-profile.jpg';

const ease = [0.25, 0.1, 0.25, 1] as const;

/* ── Value Props ── */
const valueProps = [
  {
    icon: <Target className="w-6 h-6 text-primary" />,
    title: 'Product-Led Thinking',
    description: 'I don\'t just design screens — I understand business goals, user pain points, and how design drives measurable outcomes.',
  },
  {
    icon: <Layers className="w-6 h-6 text-primary" />,
    title: 'Systems Over Screens',
    description: 'Every component I create fits into a scalable system. Design tokens, reusable patterns, and consistent logic across surfaces.',
  },
  {
    icon: <Code2 className="w-6 h-6 text-primary" />,
    title: 'Design ↔ Dev Fluency',
    description: 'I speak both languages. I prototype in code, write production-ready CSS, and collaborate seamlessly with engineering.',
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: 'Ship Fast, Ship Right',
    description: 'From discovery to deployment in weeks, not months. I move quickly without sacrificing quality or user experience.',
  },
];

/* ── Process Steps ── */
const processSteps = [
  { icon: <Lightbulb className="w-5 h-5" />, step: '01', title: 'Discovery', description: 'Understand the problem, users, business context, and constraints.' },
  { icon: <Palette className="w-5 h-5" />, step: '02', title: 'Design', description: 'Wireframes → high-fidelity UI → interactive prototypes with real data thinking.' },
  { icon: <Code2 className="w-5 h-5" />, step: '03', title: 'Build', description: 'Design system implementation, responsive layouts, motion, and handoff-ready specs.' },
  { icon: <Rocket className="w-5 h-5" />, step: '04', title: 'Deliver', description: 'QA, iteration, launch support, and documentation for long-term maintainability.' },
];

/* ── Services ── */
const services = [
  'Product Design (end-to-end)',
  'UI/UX Design',
  'Design Systems',
  'Dashboard & Data Visualization',
  'Mobile-First Design',
  'Prototyping & User Testing',
  'AI-Powered Product Interfaces',
  'Design-to-Code Implementation',
];

/* ── What You Get ── */
const deliverables = [
  { icon: <CheckCircle className="w-4 h-4 text-primary" />, text: 'Pixel-perfect Figma files with auto-layout and variants' },
  { icon: <CheckCircle className="w-4 h-4 text-primary" />, text: 'Interactive prototypes for stakeholder buy-in' },
  { icon: <CheckCircle className="w-4 h-4 text-primary" />, text: 'Developer-ready design specs and component documentation' },
  { icon: <CheckCircle className="w-4 h-4 text-primary" />, text: 'Design system tokens (colors, typography, spacing)' },
  { icon: <CheckCircle className="w-4 h-4 text-primary" />, text: 'Responsive layouts across all breakpoints' },
  { icon: <CheckCircle className="w-4 h-4 text-primary" />, text: 'Motion design specs for micro-interactions' },
];

/* ── Top Projects ── */
const topProjects = [
  { title: 'UpTime CMMS', desc: 'Enterprise SaaS — asset management with complex workflows and dashboards.', route: '/projects/uptime' },
  { title: 'WalPay', desc: 'Fintech — digital wallet, currency exchange, and trust-building mobile flows.', route: '/projects/walpay' },
];

const Hire = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navigation />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">

            {/* ── Hero ── */}
            <section className="section-padding">
              <div className="container-custom">
                <div className="max-w-5xl mx-auto">
                  <ScrollReveal>
                    <div className="grid md:grid-cols-[1fr_auto] gap-10 items-center">
                      <div>
                        <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
                          <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                          <Sparkles className="w-4 h-4 mr-1" />
                          Available for hire — Q1 2026
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                          Let's Build Something<br />
                          <span className="text-primary">Users Love</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl mb-8">
                          Product Designer who turns complex problems into elegant, scalable interfaces. 
                          I work at the intersection of UX, engineering, and business strategy to ship products that matter.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <motion.a
                            href="mailto:qomardeentylertijani@gmail.com"
                            className="modern-btn inline-flex items-center justify-center gap-2 group"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2, ease }}
                          >
                            <Mail className="w-4 h-4" />
                            Get in Touch
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </motion.a>
                          <motion.a
                            href="https://linkedin.com/in/qomardeen-tijani"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="outline-btn inline-flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2, ease }}
                          >
                            <Linkedin className="w-4 h-4" /> LinkedIn
                          </motion.a>
                        </div>
                      </div>
                      <motion.div
                        className="hidden md:block"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease }}
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-2xl opacity-20 scale-110" />
                          <img
                            src={profileImage}
                            alt="Qomardeen Tijani — Product Designer"
                            className="w-56 h-56 object-cover object-center rounded-2xl relative z-10"
                          />
                        </div>
                      </motion.div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>

            {/* ── Value Proposition ── */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Why Work With Me</h2>
                  <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
                    What sets me apart from other designers.
                  </p>
                </ScrollReveal>

                <StaggeredReveal className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6" staggerDelay={0.1} equalHeight>
                  {valueProps.map((item, i) => (
                    <motion.div
                      key={i}
                      className="card-elegant h-full"
                      whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
                      transition={{ duration: 0.3, ease }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/20 rounded-lg flex-shrink-0">{item.icon}</div>
                        <div>
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </StaggeredReveal>
              </div>
            </section>

            {/* ── Process ── */}
            <section className="section-padding">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">How I Work</h2>
                  <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
                    A structured, transparent process from kickoff to launch.
                  </p>
                </ScrollReveal>

                <div className="max-w-3xl mx-auto">
                  {processSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-6 mb-8 last:mb-0"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12, duration: 0.5, ease }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                          {step.icon}
                        </div>
                        {i < processSteps.length - 1 && (
                          <div className="w-px flex-1 bg-border mt-2" />
                        )}
                      </div>
                      <div className="pb-8">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{step.step}</span>
                        <h3 className="font-semibold text-lg mt-1">{step.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Services & Deliverables ── */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
                  <ScrollReveal>
                    <div>
                      <h2 className="text-2xl font-bold mb-6">Services</h2>
                      <div className="flex flex-wrap gap-2">
                        {services.map((s, i) => (
                          <span key={i} className="skill-tag">{s}</span>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>

                  <ScrollReveal>
                    <div>
                      <h2 className="text-2xl font-bold mb-6">What You Get</h2>
                      <div className="space-y-3">
                        {deliverables.map((d, i) => (
                          <div key={i} className="flex items-start gap-3">
                            {d.icon}
                            <span className="text-sm text-muted-foreground">{d.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>

            {/* ── Featured Work ── */}
            <section className="section-padding">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Featured Work</h2>
                  <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
                    Recent projects that showcase my approach.
                  </p>
                </ScrollReveal>

                <StaggeredReveal className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6" staggerDelay={0.12} equalHeight>
                  {topProjects.map((project, i) => (
                    <motion.div
                      key={i}
                      className="card-elegant group cursor-pointer h-full"
                      whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
                      transition={{ duration: 0.3, ease }}
                      onClick={() => navigate(project.route)}
                    >
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{project.desc}</p>
                      <div className="flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                        View Case Study <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  ))}
                </StaggeredReveal>
              </div>
            </section>

            {/* ── Availability & CTA ── */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <div className="max-w-3xl mx-auto">
                  <ScrollReveal>
                    <div className="card-elegant p-8 md:p-12 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />

                      <div className="relative z-10">
                        <div className="inline-flex items-center px-4 py-2 bg-success/20 rounded-full text-sm font-medium text-success mb-6">
                          <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                          Open to freelance & full-time roles
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Start?</h2>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                          Whether it's a quick redesign or a full product build, I'd love to hear about your project.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                          <motion.a
                            href="mailto:qomardeentylertijani@gmail.com"
                            className="modern-btn inline-flex items-center justify-center gap-2 group"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2, ease }}
                          >
                            <Mail className="w-4 h-4" />
                            Send an Email
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </motion.a>
                          <motion.a
                            href="https://linkedin.com/in/qomardeen-tijani"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="outline-btn inline-flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2, ease }}
                          >
                            <Linkedin className="w-4 h-4" /> Connect on LinkedIn
                          </motion.a>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Typical response within 24 hours</span>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>

          </main>
          <Footer />
        </div>
      </PageTransition>
    </>
  );
};

export default Hire;
