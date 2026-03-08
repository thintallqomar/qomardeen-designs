import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().trim().email('Please enter a valid email').max(255);

const NewsletterCapture = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setStatus('loading');
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: result.data });

      if (error) {
        if (error.code === '23505') {
          toast.info(t('newsletter.alreadySubscribed'));
          setStatus('success');
          return;
        }
        throw error;
      }

      setStatus('success');
      toast.success(t('newsletter.successToast'));
    } catch {
      toast.error(t('newsletter.errorToast'));
      setStatus('idle');
    }
  };

  return (
    <section className="py-16 md:py-20">
      <motion.div
        className="max-w-xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-5">
          <Mail className="w-3.5 h-3.5" />
          {t('newsletter.badge')}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          {t('newsletter.title')}
        </h2>
        <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-md mx-auto">
          {t('newsletter.subtitle')}
        </p>

        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-2 text-primary font-medium"
          >
            <CheckCircle className="w-5 h-5" />
            {t('newsletter.success')}
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder')}
              required
              disabled={status === 'loading'}
              className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {t('newsletter.subscribe')} <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
};

export default NewsletterCapture;
