import { GraduationCap, Briefcase, MapPin, Download, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';
import Icon3D from './Icon3D';
import CvDownloadButton from '@/components/CvDownloadButton';

const ease = [0.25, 0.1, 0.25, 1] as const;

const About = () => {
  const { t } = useTranslation();
  return (
    <section id="about" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-16">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 leading-tight">{t('about.title')}</h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t('about.subtitle')}
              </p>
              <CvDownloadButton className="btn-primary mt-6" label={t('about.resume')} />
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
                    {t('about.p1')}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('about.p2')}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('about.p3')}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('about.p4')}
                  </p>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    {t('about.p5')}
                  </p>
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
                <h3 className="text-xl font-semibold">{t('about.education')}</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-8">
                <div className="border-t border-border py-4">
                  <p className="text-sm text-muted-foreground mb-2">Jul 2025 – Jun 2026</p>
                  <h4 className="font-medium">School of Product — Product Design</h4>
                  <p className="text-sm text-muted-foreground mt-1">AltSchool Africa, Lagos, Nigeria</p>
                </div>
                <div className="border-t border-border py-4">
                  <p className="text-sm text-muted-foreground mb-2">Aug 2008 – Jun 2014</p>
                  <h4 className="font-medium">{t('about.edu2')}</h4>
                  <p className="text-sm text-muted-foreground mt-1">Ladoke Akintola University of Technology</p>
                </div>
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
                <h3 className="text-xl font-semibold">{t('about.experience')}</h3>
              </div>
              <div className="relative space-y-7 border-l border-border ml-2 pl-5 sm:ml-0">
                <div className="relative before:absolute before:-left-[26px] before:top-1.5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-primary">
                  <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                    <h4 className="font-medium">{t('about.roleDesigner')} — WalPay</h4>
                    <span className="text-sm text-muted-foreground">{t('about.job1Tag')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{t('about.job1Sub')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('about.job1Desc')}
                  </p>
                </div>
                <div className="relative before:absolute before:-left-[26px] before:top-1.5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-muted-foreground/40">
                  <div className="flex flex-wrap justify-between items-start gap-x-3 gap-y-1 mb-2">
                    <h4 className="font-medium">{t('about.roleDesigner')} — UpTime HQ</h4>
                    <span className="text-sm text-muted-foreground">Aug 2025 – Jan 2026</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{t('about.place2')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('about.job2Desc')}
                  </p>
                </div>
                <div className="relative before:absolute before:-left-[26px] before:top-1.5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-muted-foreground/40">
                  <div className="flex flex-wrap justify-between items-start gap-x-3 gap-y-1 mb-2">
                    <h4 className="font-medium">{t('about.job3Title')}</h4>
                    <span className="text-sm text-muted-foreground">2024–{t('about.present')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Oladel Global Resources Limited</p>
                  <p className="text-xs text-muted-foreground mb-1">{t('about.job3Promo')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('about.job3Desc')}
                  </p>
                </div>
                <div className="relative before:absolute before:-left-[26px] before:top-1.5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-muted-foreground/40">
                  <h4 className="font-medium">{t('about.job4Title')}</h4>
                  <p className="text-xs text-muted-foreground">{t('about.job4Desc')}</p>
                </div>
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
                <h3 className="text-xl font-semibold">{t('about.certifications')}</h3>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-8">
                {[
                  ['Foundations of Project Management', 'Google (Coursera) — Jan 2024'],
                  ['Foundations of User Experience (UX) Design', 'Google (Coursera) — Jan 2023'],
                  ['Jobberman Soft Skills Course', 'Jobberman — Jan 2022'],
                  ['Visual Elements of User Interface Design', 'California Institute of the Arts (Coursera) — Jan 2022'],
                  ['Web Design: Strategy and Information Architecture', 'California Institute of the Arts (Coursera) — Jan 2022'],
                  ['UX Design Fundamentals', 'California Institute of the Arts (Coursera) — Jan 2022'],
                ].map(([title, meta]) => (
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
