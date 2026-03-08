import { MessageSquare, Briefcase, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';
import Icon3D from './Icon3D';

const ease = [0.25, 0.1, 0.25, 1] as const;

const AtlasLogo = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const AIAssistantPreview = () => {
  const { t } = useTranslation();

  const prompts = [
    { icon: <Briefcase className="w-3.5 h-3.5" />, text: t('atlas.prompt1') },
    { icon: <MessageSquare className="w-3.5 h-3.5" />, text: t('atlas.prompt2') },
    { icon: <ArrowRight className="w-3.5 h-3.5" />, text: t('atlas.prompt3') },
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl border border-border/50 p-8 md:p-12 text-center" style={{ background: 'hsl(var(--background) / 0.6)', backdropFilter: 'blur(24px)' }}>
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <Icon3D variant="primary" size="xl">
                    <AtlasLogo size={28} />
                  </Icon3D>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">{t('atlas.title')}</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto text-[15px] leading-relaxed">{t('atlas.subtitle')}</p>
                <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                  {prompts.map((prompt, index) => (
                    <motion.div key={index} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-border/50 text-sm text-foreground/70 cursor-default hover:border-border hover:bg-foreground/[0.03] transition-all" whileHover={{ y: -2 }} transition={{ duration: 0.2, ease }}>
                      {prompt.icon}
                      <span>{prompt.text}</span>
                    </motion.div>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground/40 mt-8 tracking-wide uppercase">{t('atlas.hint')}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AIAssistantPreview;
