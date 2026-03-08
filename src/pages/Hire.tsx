import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollReveal from '@/components/ScrollReveal';
import StaggeredReveal from '@/components/StaggeredReveal';
import { Linkedin, Mail, Calendar, CheckCircle, Sparkles, Zap, Users, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ease = [0.25, 0.1, 0.25, 1] as const;

const strengths = [
  { icon: <Zap className="w-5 h-5 text-primary" />, title: "Ship Real Products", desc: "End-to-end delivery from research to production" },
  { icon: <Layers className="w-5 h-5 text-primary" />, title: "Systems Thinker", desc: "Design with scalability and consistency in mind" },
  { icon: <Users className="w-5 h-5 text-primary" />, title: "Cross-functional", desc: "Clear communication with devs, PMs, and stakeholders" },
];

const topProjects = [
  { title: "UpTime CMMS", desc: "Enterprise SaaS for asset management", route: "/projects/uptime" },
  { title: "WalPay", desc: "Fintech digital wallet & currency exchange", route: "/projects/walpay" },
];

const Hire = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navigation />
      <PageTransition>
        <div className="min-h-screen">
          <main className="pt-14">
            <section className="section-padding">
              <div className="container-custom">
                <div className="max-w-4xl mx-auto">
                  {/* Value Proposition */}
                  <ScrollReveal>
                    <div className="text-center mb-16">
                      <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
                        <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                        <Sparkles className="w-4 h-4 mr-1" />
                        Available for hire
                      </div>
                      <h1 className="text-3xl md:text-4xl font-bold mb-4">Hire Qomardeen Tijani</h1>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Product Designer specializing in scalable digital products at the intersection of UX, AI, and systems thinking.
                      </p>
                    </div>
                  </ScrollReveal>

                  {/* Strengths */}
                  <StaggeredReveal className="grid md:grid-cols-3 gap-6 mb-16" staggerDelay={0.12} equalHeight>
                    {strengths.map((item, index) => (
                      <motion.div
                        key={index}
                        className="card-elegant text-center h-full flex flex-col items-center"
                        whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
                        transition={{ duration: 0.3, ease }}
                      >
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                          {item.icon}
                        </div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </motion.div>
                    ))}
                  </StaggeredReveal>

                  {/* Top Projects */}
                  <ScrollReveal>
                    <div className="mb-16">
                      <h2 className="text-2xl font-semibold mb-6 text-center">Top Projects</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        {topProjects.map((project, index) => (
                          <motion.div
                            key={index}
                            className="card-elegant group cursor-pointer"
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.3, ease }}
                            onClick={() => navigate(project.route)}
                          >
                            <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
                            <p className="text-sm text-muted-foreground">{project.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Skills */}
                  <ScrollReveal>
                    <div className="mb-16">
                      <h2 className="text-2xl font-semibold mb-6 text-center">Core Skills</h2>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['UI Design', 'UX Research', 'Product Design', 'Design Systems', 'Dashboards', 'Prototyping', 'Wireframing', 'Information Architecture', 'Figma', 'AI Tools'].map((skill, i) => (
                          <span key={i} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Contact */}
                  <ScrollReveal>
                    <div className="card-elegant p-8 md:p-12 text-center">
                      <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                      <p className="text-muted-foreground mb-8">Open to freelance and full-time product design roles.</p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <motion.a
                          href="mailto:qomardeentylertijani@gmail.com"
                          className="modern-btn inline-flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2, ease }}
                        >
                          <Mail className="w-4 h-4" /> Send Email
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

                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Schedule a call — reach out via email or LinkedIn</span>
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
