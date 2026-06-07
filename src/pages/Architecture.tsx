import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import StaggeredReveal from '@/components/StaggeredReveal';
import Icon3D from '@/components/Icon3D';
import PageSEO from '@/components/PageSEO';
import {
  Database, Workflow, Server, GitBranch, Layers, Scale,
  ArrowRight, Box, Cpu, Globe, Shield, Zap, Code2,
  MonitorSmartphone, CircuitBoard, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;

/* ── System Diagram Node ── */
const DiagramNode = ({ label, icon, variant = 'primary' as const }: { label: string; icon: React.ReactNode; variant?: any }) => (
  <motion.div
    className="card-elegant p-4 text-center flex flex-col items-center gap-2"
    whileHover={{ y: -3, boxShadow: 'var(--shadow-lg)' }}
    transition={{ duration: 0.25, ease }}
  >
    <Icon3D variant={variant} size="sm">{icon}</Icon3D>
    <span className="text-xs font-semibold">{label}</span>
  </motion.div>
);

const DiagramConnector = ({ vertical = false }: { vertical?: boolean }) => (
  <div className={`flex items-center justify-center ${vertical ? 'h-8' : 'w-8'}`}>
    <div className={`${vertical ? 'w-px h-full' : 'h-px w-full'} bg-primary/30`} />
    <ArrowRight className={`w-3 h-3 text-primary/50 absolute ${vertical ? 'rotate-90' : ''}`} />
  </div>
);

/* ── Tech Stack Data ── */
const techCategories = [
  {
    category: 'Design',
    tools: [
      { name: 'Figma', role: 'UI Design & Prototyping' },
      { name: 'FigJam', role: 'Whiteboarding & Ideation' },
      { name: 'Framer', role: 'Interactive Prototypes' },
    ],
  },
  {
    category: 'Frontend',
    tools: [
      { name: 'React', role: 'Component Architecture' },
      { name: 'TypeScript', role: 'Type Safety' },
      { name: 'Tailwind CSS', role: 'Utility-First Styling' },
      { name: 'Framer Motion', role: 'Animations' },
    ],
  },
  {
    category: 'Backend & Data',
    tools: [
      { name: 'Supabase', role: 'Database & Auth' },
      { name: 'PostgreSQL', role: 'Relational Data' },
      { name: 'Edge Functions', role: 'Serverless Logic' },
      { name: 'REST APIs', role: 'Service Integration' },
    ],
  },
  {
    category: 'Workflow',
    tools: [
      { name: 'Git & GitHub', role: 'Version Control' },
      { name: 'Linear', role: 'Project Tracking' },
      { name: 'Notion', role: 'Documentation' },
      { name: 'Vercel', role: 'Deployment' },
    ],
  },
];

/* ── API Design Patterns ── */
const apiPatterns = [
  {
    method: 'GET',
    endpoint: '/api/v1/assets',
    description: 'Fetch paginated assets with filters, sorting, and search',
    details: 'Cursor-based pagination for large datasets. Supports field-level filtering and full-text search.',
  },
  {
    method: 'POST',
    endpoint: '/api/v1/work-orders',
    description: 'Create a new work order with validation and assignment',
    details: 'Schema validation with Zod. Auto-assigns based on asset location and technician availability.',
  },
  {
    method: 'WS',
    endpoint: '/realtime/dashboard',
    description: 'Live subscription for dashboard metrics and alerts',
    details: 'WebSocket channel with row-level security. Updates push to all connected clients instantly.',
  },
];

/* ── Scaling Strategies ── */
const scalingStrategies = [
  {
    icon: <Cpu />,
    variant: 'amber' as const,
    title: 'Lazy Loading & Code Splitting',
    description: 'Route-based splitting reduces initial bundle by 60%. Components load on demand to keep TTI under 2s.',
  },
  {
    icon: <Database />,
    variant: 'blue' as const,
    title: 'Strategic Denormalization',
    description: 'Read-heavy dashboards use materialized views. Write paths stay normalized for data integrity.',
  },
  {
    icon: <Globe />,
    variant: 'teal' as const,
    title: 'Edge-First Architecture',
    description: 'Serverless functions deploy globally. Static assets served from CDN. API latency stays under 100ms.',
  },
  {
    icon: <Shield />,
    variant: 'rose' as const,
    title: 'Row-Level Security',
    description: 'Multi-tenant isolation at the database layer. Policies enforce access without application-level guards.',
  },
];

/* ── Trade-off Decisions ── */
const tradeoffs = [
  {
    decision: 'Server Components vs. Client SPA',
    chose: 'Client SPA (React + Vite)',
    reasoning: 'Portfolio and product interfaces need rich interactivity. SSR adds complexity without meaningful SEO benefit for authenticated dashboards.',
    tradeoff: 'Slightly slower initial load, but faster subsequent navigation and simpler deployment.',
  },
  {
    decision: 'Custom Design System vs. Component Library',
    chose: 'Hybrid (shadcn/ui + custom tokens)',
    reasoning: 'Shadcn provides accessible primitives. Custom tokens ensure brand consistency without reinventing accessible components.',
    tradeoff: 'Less "unique" base components, but dramatically faster iteration and guaranteed a11y.',
  },
  {
    decision: 'REST vs. GraphQL',
    chose: 'REST with Real-time Channels',
    reasoning: 'Product interfaces have predictable data shapes. REST is simpler to cache and debug. Real-time channels handle live updates.',
    tradeoff: 'Occasional over-fetching, offset by simpler tooling and better caching.',
  },
];

const Architecture = () => {
  return (
    <>
      <Navigation />
      <PageSEO
        title="Architecture & System Design — Qomardeen Tijani"
        description="How Qomardeen Tijani thinks about product architecture beyond the interface: database patterns, system flows, and scaling decisions."
        path="/architecture"
      />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">

            {/* ── Hero ── */}
            <section className="section-padding">
              <div className="container-custom">
                <div className="max-w-4xl mx-auto">
                  <ScrollReveal>
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
                        <CircuitBoard className="w-4 h-4 mr-2" />
                        Systems Thinking in Practice
                      </div>
                      <h1 className="text-3xl md:text-5xl font-bold mb-4">Architecture & System Design</h1>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        How I think about product systems, data structures, and the engineering decisions behind scalable design.
                      </p>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>

            {/* ── System Diagram ── */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">System Overview</h2>
                  <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
                    A simplified view of how the layers connect in a typical product I design and build.
                  </p>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="max-w-4xl mx-auto">
                    {/* Layer 1 — Client */}
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 block text-center">Client Layer</span>
                      <div className="grid grid-cols-3 gap-4">
                        <DiagramNode label="Web App (React)" icon={<MonitorSmartphone />} variant="blue" />
                        <DiagramNode label="Design System" icon={<Layers />} variant="violet" />
                        <DiagramNode label="State & Cache" icon={<Box />} variant="amber" />
                      </div>
                    </div>

                    <div className="flex justify-center"><div className="w-px h-10 bg-primary/20" /></div>

                    {/* Layer 2 — API */}
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 block text-center">API Layer</span>
                      <div className="grid grid-cols-3 gap-4">
                        <DiagramNode label="REST Endpoints" icon={<Workflow />} variant="teal" />
                        <DiagramNode label="Edge Functions" icon={<Zap />} variant="amber" />
                        <DiagramNode label="Realtime WS" icon={<BarChart3 />} variant="emerald" />
                      </div>
                    </div>

                    <div className="flex justify-center"><div className="w-px h-10 bg-primary/20" /></div>

                    {/* Layer 3 — Data */}
                    <div>
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 block text-center">Data Layer</span>
                      <div className="grid grid-cols-3 gap-4">
                        <DiagramNode label="PostgreSQL" icon={<Database />} variant="blue" />
                        <DiagramNode label="Auth & RLS" icon={<Shield />} variant="rose" />
                        <DiagramNode label="File Storage" icon={<Server />} variant="violet" />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            {/* ── Tech Stack ── */}
            <section className="section-padding">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Tech Stack</h2>
                  <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
                    Tools I use across the design-to-development pipeline.
                  </p>
                </ScrollReveal>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                  {techCategories.map((cat, ci) => (
                    <ScrollReveal key={ci}>
                      <div className="card-elegant h-full">
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">{cat.category}</h3>
                        <div className="space-y-3">
                          {cat.tools.map((tool, ti) => (
                            <div key={ti} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                              <span className="font-medium text-sm">{tool.name}</span>
                              <span className="text-xs text-muted-foreground">{tool.role}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* ── API Design ── */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">API Design Patterns</h2>
                  <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
                    How I structure interfaces between client and server.
                  </p>
                </ScrollReveal>

                <div className="max-w-4xl mx-auto space-y-4">
                  {apiPatterns.map((api, i) => (
                    <motion.div
                      key={i}
                      className="card-elegant"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5, ease }}
                    >
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                          api.method === 'GET' ? 'bg-success/20 text-success' :
                          api.method === 'POST' ? 'bg-primary/20 text-primary' :
                          'bg-warning/20 text-warning'
                        }`}>
                          {api.method}
                        </span>
                        <code className="text-sm font-mono text-muted-foreground">{api.endpoint}</code>
                      </div>
                      <p className="font-medium text-sm mb-1">{api.description}</p>
                      <p className="text-xs text-muted-foreground">{api.details}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Scaling Strategies ── */}
            <section className="section-padding">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Scaling Strategies</h2>
                  <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
                    Performance decisions I make to keep products fast as they grow.
                  </p>
                </ScrollReveal>

                <StaggeredReveal className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6" staggerDelay={0.1} equalHeight>
                  {scalingStrategies.map((item, i) => (
                    <motion.div
                      key={i}
                      className="card-elegant h-full"
                      whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
                      transition={{ duration: 0.3, ease }}
                    >
                      <div className="flex items-start gap-4">
                        <Icon3D variant={item.variant} size="md">
                          {item.icon}
                        </Icon3D>
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

            {/* ── Trade-offs ── */}
            <section className="section-padding bg-muted/30">
              <div className="container-custom">
                <ScrollReveal>
                  <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Trade-off Decisions</h2>
                  <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
                    Real architectural decisions and why I made them.
                  </p>
                </ScrollReveal>

                <div className="max-w-4xl mx-auto space-y-6">
                  {tradeoffs.map((t, i) => (
                    <motion.div
                      key={i}
                      className="card-elegant"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5, ease }}
                    >
                      <h3 className="font-semibold mb-3">{t.decision}</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">Chose</span>
                          <p className="text-sm mt-1">{t.chose}</p>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">Reasoning</span>
                          <p className="text-sm text-muted-foreground mt-1">{t.reasoning}</p>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">Trade-off</span>
                          <p className="text-sm text-muted-foreground mt-1">{t.tradeoff}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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

export default Architecture;
