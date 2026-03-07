import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import { Database, Workflow, Server, GitBranch, Layers, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;

const entries = [
  {
    icon: <Database className="w-6 h-6 text-primary" />,
    title: "Database Design Patterns",
    problem: "Designing scalable schemas for multi-tenant SaaS platforms",
    stack: ["PostgreSQL", "Supabase", "Row-Level Security"],
    strategy: "Normalized schemas with strategic denormalization for read-heavy dashboards",
  },
  {
    icon: <Workflow className="w-6 h-6 text-primary" />,
    title: "API Architecture",
    problem: "Building consistent, versioned APIs for product interfaces",
    stack: ["REST", "Edge Functions", "Real-time Subscriptions"],
    strategy: "Resource-oriented design with real-time channels for live data",
  },
  {
    icon: <Server className="w-6 h-6 text-primary" />,
    title: "Scaling Frontend Systems",
    problem: "Maintaining performance as product complexity grows",
    stack: ["React", "TypeScript", "Code Splitting"],
    strategy: "Component-driven architecture with lazy loading and design tokens",
  },
  {
    icon: <GitBranch className="w-6 h-6 text-primary" />,
    title: "Design System Architecture",
    problem: "Ensuring consistency across multiple product surfaces",
    stack: ["Figma", "Tailwind", "Component Libraries"],
    strategy: "Token-based theming with semantic naming conventions",
  },
  {
    icon: <Layers className="w-6 h-6 text-primary" />,
    title: "Information Architecture",
    problem: "Structuring complex data for intuitive navigation",
    stack: ["Card Sorting", "Tree Testing", "Heuristic Evaluation"],
    strategy: "Task-based hierarchy with progressive disclosure",
  },
  {
    icon: <Scale className="w-6 h-6 text-primary" />,
    title: "Trade-off Analysis",
    problem: "Balancing speed, quality, and scope in product decisions",
    stack: ["Decision Matrices", "Impact Mapping", "RICE Scoring"],
    strategy: "Transparent trade-off documentation with stakeholder alignment",
  },
];

const Architecture = () => {
  return (
    <>
      <Navigation />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            <section className="section-padding">
              <div className="container-custom">
                <div className="max-w-6xl mx-auto">
                  <ScrollReveal>
                    <div className="text-center mb-16">
                      <h1 className="text-3xl md:text-4xl font-bold mb-4">Architecture & System Design</h1>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        How I think about product systems, data structures, and scalable design decisions
                      </p>
                    </div>
                  </ScrollReveal>

                  <div className="grid md:grid-cols-2 gap-6">
                    {entries.map((entry, index) => (
                      <motion.div
                        key={index}
                        className="card-elegant"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08, duration: 0.5, ease }}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 bg-primary/20 rounded-lg flex-shrink-0">
                            {entry.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-1">{entry.title}</h3>
                            <p className="text-sm text-muted-foreground">{entry.problem}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Tech Stack</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {entry.stack.map((tech, i) => (
                                <span key={i} className="skill-tag text-xs">{tech}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Strategy</span>
                            <p className="text-sm text-muted-foreground mt-1">{entry.strategy}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
