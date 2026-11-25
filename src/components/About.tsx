import { GraduationCap, Briefcase, MapPin, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAboutContent } from '@/hooks/useAboutContent';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';
import Icon3D from './Icon3D';

const ease = [0.25, 0.1, 0.25, 1] as const;

const About = () => {
  const c = useAboutContent();
  return (
    <section id="about" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div>
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
                  {c.bio.map((para, k) => (
                    <p key={k} className={`text-muted-foreground leading-relaxed ${k === c.bio.length - 1 && c.bio.length > 1 ? 'font-medium' : ''}`}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          </ScrollReveal>

          <StaggeredReveal className="space-y-10 md:space-y-12" staggerDelay={0.15}>
            {/* Education */}
            <motion.div
              className="grid md:grid-cols-[220px_minmax(0,1fr)] gap-5 md:gap-10 border-t border-border pt-7 md:pt-8"
            >
              <div className="flex items-center gap-3">
                <Icon3D variant="amber" size="md">
                  <GraduationCap />
                </Icon3D>
                <h3 className="t-h3">{c.educationTitle}</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-8">
                {c.education.map((e, k) => (
                  <div key={k} className="border-t border-border py-4">
                    {e.dates && <p className="text-sm text-muted-foreground mb-2">{e.dates}</p>}
                    <h4 className="font-medium">{e.title}</h4>
                    {e.place && <p className="text-sm text-muted-foreground mt-1">{e.place}</p>}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div
              className="grid md:grid-cols-[220px_minmax(0,1fr)] gap-5 md:gap-10 border-t border-border pt-7 md:pt-8"
            >
              <div className="flex items-center gap-3">
                <Icon3D variant="teal" size="md">
                  <Briefcase />
                </Icon3D>
                <h3 className="t-h3">{c.experienceTitle}</h3>
              </div>
              <div className="relative space-y-7 border-l border-border ml-2 pl-5 sm:ml-0">
                {c.experience.map((job, k) => (
                  <div key={k} className={`relative before:absolute before:-left-[26px] before:top-1.5 before:h-2.5 before:w-2.5 before:rounded-full ${k === 0 ? 'before:bg-primary' : 'before:bg-muted-foreground/40'}`}>
                    <div className="flex flex-wrap justify-between items-start gap-x-3 gap-y-1 mb-1">
                      <h4 className="font-medium">{job.title}</h4>
                      {job.meta && <span className="text-sm text-muted-foreground">{job.meta}</span>}
                    </div>
                    {job.place && <p className="text-sm text-muted-foreground mb-1">{job.place}</p>}
                    {job.note && <p className="text-xs text-muted-foreground mb-1">{job.note}</p>}
                    {job.body && <p className="text-sm text-muted-foreground leading-relaxed">{job.body}</p>}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              className="grid md:grid-cols-[220px_minmax(0,1fr)] gap-5 md:gap-10 border-t border-border pt-7 md:pt-8"
            >
              <div className="flex items-center gap-3">
                <Icon3D variant="violet" size="md">
                  <Award />
                </Icon3D>
                <h3 className="t-h3">{c.certificationsTitle}</h3>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-8">
                {c.certifications.map(({ title, meta }) => (
                  <li key={title} className="border-t border-border py-3">
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
