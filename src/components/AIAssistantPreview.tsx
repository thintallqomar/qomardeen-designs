import { Sparkles, MessageSquare, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const ease = [0.25, 0.1, 0.25, 1] as const;

const prompts = [
  { icon: <Briefcase className="w-4 h-4" />, text: "Explain this designer's fintech work" },
  { icon: <MessageSquare className="w-4 h-4" />, text: "Show product design case studies" },
  { icon: <Sparkles className="w-4 h-4" />, text: "How can we hire this designer?" },
];

const AIAssistantPreview = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="card-elegant p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Persius</h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  Your AI-powered portfolio guide — ask questions, explore projects, and navigate the site hands-free
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {prompts.map((prompt, index) => (
                    <motion.div
                      key={index}
                      className="inline-flex items-center gap-2 px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-secondary-foreground cursor-default"
                      whileHover={{ scale: 1.03, y: -2 }}
                      transition={{ duration: 0.2, ease }}
                    >
                      {prompt.icon}
                      <span>{prompt.text}</span>
                    </motion.div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground mt-6">
                  Try it now — click the ✨ icon in the bottom-right corner
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AIAssistantPreview;
