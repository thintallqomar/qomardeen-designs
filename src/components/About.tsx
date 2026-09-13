import { GraduationCap, Briefcase, MapPin, Download, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
            <div className="text-center mb-10 md:mb-16">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 leading-tight">About Qomardeen Tijani — Product Designer</h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Product Designer building scalable, user-centered digital products.
              </p>
              <Button asChild className="mt-6">
                <a href="/Qomardeen-Tijani-Resume.pdf" download="Qomardeen-Tijani-Resume.pdf">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </a>
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <motion.div
              className="card-elegant mb-12"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3, ease }}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 mb-6">
                <Icon3D variant="blue" size="md">
                  <MapPin />
                </Icon3D>
                <div className="space-y-4 text-[15px] md:text-base">
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

          <StaggeredReveal className="grid md:grid-cols-2 gap-5 md:gap-8" staggerDelay={0.15} equalHeight>
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
                  <div className="flex flex-wrap justify-between items-start gap-x-3 gap-y-1">
                    <h4 className="font-medium">School of Product — Product Design</h4>
                    <span className="text-sm text-muted-foreground">Jul 2025 – Jun 2026</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">AltSchool Africa, Lagos, Nigeria</p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <div className="flex flex-wrap justify-between items-start gap-x-3 gap-y-1">
                    <h4 className="font-medium">B.Sc. Human Anatomy</h4>
                    <span className="text-sm text-muted-foreground">Aug 2008 – Jun 2014</span>
                  </div>
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
                  <h4 className="font-medium">Product Designer — WalPay</h4>
                  <p className="text-sm text-muted-foreground mb-1">FinTech mobile application</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Design onboarding, wallet management, and payment screens for a fintech app — using research, wireframing, and prototyping to simplify complex financial workflows and reduce friction during transactions.
                  </p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <div className="flex flex-wrap justify-between items-start gap-x-3 gap-y-1 mb-2">
                    <h4 className="font-medium">Product Designer — UpTime HQ</h4>
                    <span className="text-sm text-muted-foreground">Aug 2025 – Jan 2026</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Lagos, Nigeria</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Led end-to-end UX/UI design of a CMMS platform — research, wireframes, and high-fidelity prototypes in Figma — plus landing pages and core product architecture across authentication, payments, and support. Worked with project managers and engineers in an Agile team to speed up delivery.
                  </p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <div className="flex flex-wrap justify-between items-start gap-x-3 gap-y-1 mb-2">
                    <h4 className="font-medium">Project Manager</h4>
                    <span className="text-sm text-muted-foreground">2024–Present</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Oladel Global Resources Limited</p>
                  <p className="text-xs text-muted-foreground mb-1">Promoted from Project Manager Intern (2023–2024)</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Own end-to-end project planning, timelines, and delivery across cross-functional teams — keeping scope, budget, and quality on track. Introduced structured workflows and reporting that improved execution predictability and stakeholder visibility, while coordinating client communication, resourcing, and risk management from kickoff through handover.
                  </p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <h4 className="font-medium">Independent Fashion Designer</h4>
                  <p className="text-xs text-muted-foreground">Led creative direction, production, and client delivery</p>
                </div>
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              className="card-elegant h-full flex flex-col md:col-span-2"
              whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
              transition={{ duration: 0.3, ease }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon3D variant="violet" size="md">
                  <Award />
                </Icon3D>
                <h3 className="text-xl font-semibold">Certifications</h3>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  ['Product Design (Diploma)', 'AltSchool Africa — Jul 2026'],
                  ['Foundations of Project Management', 'Google (Coursera) — Jan 2024'],
                  ['Foundations of User Experience (UX) Design', 'Google (Coursera) — Jan 2023'],
                  ['Jobberman Soft Skills Course', 'Jobberman — Jan 2022'],
                  ['Visual Elements of User Interface Design', 'California Institute of the Arts (Coursera) — Jan 2022'],
                  ['Web Design: Strategy and Information Architecture', 'California Institute of the Arts (Coursera) — Jan 2022'],
                  ['UX Design Fundamentals', 'California Institute of the Arts (Coursera) — Jan 2022'],
                ].map(([title, meta]) => (
                  <li key={title} className="border-l-2 border-muted pl-4">
                    <h4 className="font-medium text-[15px]">{title}</h4>
                    <p className="text-sm text-muted-foreground">{meta}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </StaggeredReveal>

        </div>
      </div>
    </section>
  );
};

export default About;
