import { GraduationCap, Briefcase, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';
import Icon3D from './Icon3D';

const ease = [0.25, 0.1, 0.25, 1] as const;

const About = () => {
  return (
    <section id="about" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">About Qomardeen Tijani — Product Designer</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Product Designer building scalable, user-centered digital products.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <motion.div
              className="card-elegant mb-12"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3, ease }}
            >
              <div className="flex items-start gap-4 mb-6">
                <Icon3D variant="blue" size="md">
                  <MapPin />
                </Icon3D>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    I'm a Product Designer focused on building clear, structured, and high-impact digital products across SaaS platforms, internal tools, and consumer-facing experiences. I combine product thinking, UX reasoning, and strong visual execution to design interfaces that help users complete tasks efficiently and with confidence.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    I approach design as a problem-solving discipline. Before moving into high-fidelity design, I focus on understanding user goals, workflows, constraints, and edge cases — creating solutions that are intuitive, logically organized, and scalable as products grow.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    My experience spans CMMS platforms, dashboards, fintech products, and website design. I've shipped live digital products end-to-end — from research and discovery through wireframes, visual design, and production handoff — with a strong focus on conversion-focused landing pages and cohesive product flows.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Before transitioning fully into product design, I worked in fashion design, where I developed a deep appreciation for balancing aesthetics with structure, constraints, and user expectations. That foundation sharpened my systems thinking and attention to detail, which now directly informs my digital work.
                  </p>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    I'm actively seeking a product design role where I can contribute immediately, collaborate closely with cross-functional teams, and continue delivering impactful work.
                  </p>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>

          <StaggeredReveal className="grid md:grid-cols-2 gap-8" staggerDelay={0.15} equalHeight>
            {/* Education */}
            <motion.div
              className="card-elegant h-full flex flex-col"
              whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
              transition={{ duration: 0.3, ease }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon3D variant="amber" size="md">
                  <GraduationCap />
                </Icon3D>
                <h3 className="text-xl font-semibold">Education</h3>
              </div>
              <div className="space-y-6">
                <div className="border-l-2 border-primary pl-4">
                  <h4 className="font-medium">Product Design</h4>
                  <p className="text-sm text-muted-foreground mb-1">AltSchool Africa</p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <h4 className="font-medium">B.Sc. Human Anatomy</h4>
                  <p className="text-sm text-muted-foreground mb-1">Ladoke Akintola University of Technology</p>
                </div>
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div
              className="card-elegant h-full flex flex-col"
              whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
              transition={{ duration: 0.3, ease }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon3D variant="teal" size="md">
                  <Briefcase />
                </Icon3D>
                <h3 className="text-xl font-semibold">Experience</h3>
              </div>
              <div className="space-y-6">
                <div className="border-l-2 border-primary pl-4">
                  <h4 className="font-medium">Product Designer</h4>
                  <p className="text-sm text-muted-foreground mb-1">Shipped live digital products across dashboards, SaaS tools, landing pages, and fintech platforms</p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Project Manager</h4>
                    <span className="text-sm text-muted-foreground">2024–Present</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Oladel Global Resources Limited</p>
                  <p className="text-xs text-muted-foreground">Coordinated timelines, planning, and execution</p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <h4 className="font-medium">Independent Fashion Designer</h4>
                  <p className="text-xs text-muted-foreground">Led creative direction, production, and client delivery</p>
                </div>
              </div>
            </motion.div>
          </StaggeredReveal>
        </div>
      </div>
    </section>
  );
};

export default About;
