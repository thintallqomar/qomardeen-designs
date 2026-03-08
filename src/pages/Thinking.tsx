import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import { Brain, Lightbulb, Search, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;

const articles = [
  { icon: <Search className="w-6 h-6 text-primary" />, title: "UX Breakdown: Mobile Banking Onboarding", desc: "Analyzing how top fintech apps reduce friction in first-time user flows.", tag: "UX Breakdown" },
  { icon: <Lightbulb className="w-6 h-6 text-primary" />, title: "Product Teardown: Notion's Design System", desc: "How Notion balances flexibility and consistency across a complex product.", tag: "Product Teardown" },
  { icon: <Cpu className="w-6 h-6 text-primary" />, title: "AI in Product Design: Beyond Chatbots", desc: "How AI is reshaping design workflows, research, and user experience.", tag: "AI Insight" },
  { icon: <Brain className="w-6 h-6 text-primary" />, title: "Systems Thinking for Designers", desc: "Why understanding the whole system leads to better component-level decisions.", tag: "Systems" },
];

const Thinking = () => {
  return (
    <>
      <Navigation />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            <section className="section-padding">
              <div className="container-custom">
                <div className="max-w-4xl mx-auto">
                  <ScrollReveal>
                    <div className="text-center mb-16">
                      <h1 className="text-3xl md:text-4xl font-bold mb-4">Thinking</h1>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        UX breakdowns, product teardowns, and strategic design thinking
                      </p>
                    </div>
                  </ScrollReveal>

                  <div className="space-y-6">
                    {articles.map((article, index) => (
                      <motion.div
                        key={index}
                        className="card-elegant group cursor-pointer"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08, duration: 0.4, ease }}
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/20 rounded-lg flex-shrink-0">
                            {article.icon}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 block">{article.tag}</span>
                            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{article.title}</h2>
                            <p className="text-sm text-muted-foreground">{article.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <ScrollReveal>
                    <p className="text-center text-muted-foreground mt-12 text-sm">
                      More thinking pieces coming soon.
                    </p>
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

export default Thinking;
