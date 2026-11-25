import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon3D from './Icon3D';
import { invokeFunction } from '@/lib/invokeFunction';

const ease = [0.25, 0.1, 0.25, 1] as const;

const PROJECT_TYPES = [
  'Product design (end-to-end)',
  'UI/UX design',
  'Design system',
  'Dashboard / data visualization',
  'Mobile app design',
  'Design audit / consultation',
  'Full-time role',
  'Something else',
];

const BUDGETS = ['Under $1,000', '$1,000 – $3,000', '$3,000 – $7,000', '$7,000+', 'Not sure yet'];
const TIMELINES = ['ASAP', 'Within 1 month', '1–3 months', 'Flexible'];

const buildSchema = (t: (key: string) => string) => z.object({
  name: z.string().trim().min(1, t('inquiry.errName')).max(100),
  email: z.string().trim().email(t('inquiry.errEmail')).max(255),
  company: z.string().trim().max(150).optional().or(z.literal('')),
  projectType: z.string().trim().min(1, t('inquiry.errType')).max(100),
  budget: z.string().trim().max(100).optional().or(z.literal('')),
  timeline: z.string().trim().max(100).optional().or(z.literal('')),
  message: z.string().trim().min(10, t('inquiry.errMsg')).max(4000),
});

const emptyForm = {
  name: '', email: '', company: '', projectType: '', budget: '', timeline: '', message: '',
};

const fieldClass = (invalid?: boolean) =>
  `border-border focus:border-primary ${invalid ? 'border-destructive' : ''}`;

const selectClass =
  'w-full h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary';

const InquiryForm = () => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const schema = buildSchema(t);

  const set = (key: keyof typeof emptyForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach(i => {
        if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      await invokeFunction('submit-inquiry', parsed.data);
      setSuccess(true);
      setForm(emptyForm);
      toast({ title: t('inquiry.toastOkTitle'), description: t('inquiry.toastOkBody') });
    } catch (err) {
      // Show the server's own reason when there is one (e.g. too many messages), else the usual text.
      const reason = err instanceof Error && !/check your connection/i.test(err.message) ? err.message : '';
      toast({
        title: t('inquiry.toastFailTitle'),
        description: reason || t('inquiry.toastFailBody'),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card-elegant p-6 md:p-8">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-10"
          >
            <Icon3D variant="success" size="xl" className="mb-6"><CheckCircle /></Icon3D>
            <h3 className="text-xl font-semibold mb-2">{t('inquiry.okTitle')}</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {t('inquiry.okBody')}
            </p>
            <Button variant="outline" onClick={() => setSuccess(false)}>{t('inquiry.another')}</Button>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-xl font-semibold mb-1">{t('inquiry.title')}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t('inquiry.sub')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="iq-name" className="text-sm font-medium">{t('inquiry.nameL')}</label>
                  <Input id="iq-name" value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder={t('inquiry.namePh')} className={fieldClass(!!errors.name)} />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="iq-email" className="text-sm font-medium">{t('inquiry.emailL')}</label>
                  <Input id="iq-email" type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder={t('inquiry.emailPh')} className={fieldClass(!!errors.email)} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="iq-company" className="text-sm font-medium">{t('inquiry.companyL')} <span className="text-muted-foreground font-normal">{t('inquiry.optional')}</span></label>
                  <Input id="iq-company" value={form.company} onChange={e => set('company', e.target.value)}
                    placeholder={t('inquiry.companyPh')} className={fieldClass()} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="iq-type" className="text-sm font-medium">{t('inquiry.typeL')}</label>
                  <select id="iq-type" value={form.projectType} onChange={e => set('projectType', e.target.value)}
                    className={`${selectClass} ${errors.projectType ? 'border-destructive' : ''}`}>
                    <option value="">{t('inquiry.typeSelect')}</option>
                    {PROJECT_TYPES.map((v, i) => <option key={v} value={v}>{t(`inquiry.t${i + 1}`)}</option>)}
                  </select>
                  {errors.projectType && <p className="text-xs text-destructive">{errors.projectType}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="iq-budget" className="text-sm font-medium">{t('inquiry.budgetL')} <span className="text-muted-foreground font-normal">{t('inquiry.optional')}</span></label>
                  <select id="iq-budget" value={form.budget} onChange={e => set('budget', e.target.value)} className={selectClass}>
                    <option value="">{t('inquiry.budgetSelect')}</option>
                    {BUDGETS.map((v, i) => <option key={v} value={v}>{i === BUDGETS.length - 1 ? t('inquiry.b5') : v}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="iq-timeline" className="text-sm font-medium">{t('inquiry.timelineL')} <span className="text-muted-foreground font-normal">{t('inquiry.optional')}</span></label>
                  <select id="iq-timeline" value={form.timeline} onChange={e => set('timeline', e.target.value)} className={selectClass}>
                    <option value="">{t('inquiry.timelineSelect')}</option>
                    {TIMELINES.map((v, i) => <option key={v} value={v}>{t(`inquiry.tl${i + 1}`)}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="iq-message" className="text-sm font-medium">{t('inquiry.messageL')}</label>
                <Textarea id="iq-message" value={form.message} onChange={e => set('message', e.target.value)}
                  placeholder={t('inquiry.messagePh')}
                  className={`resize-none min-h-[140px] ${fieldClass(!!errors.message)}`} />
                {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2, ease }}>
                <Button type="submit" disabled={submitting} className="w-full btn-primary disabled:opacity-50">
                  {submitting
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('inquiry.sending')}</>
                    : <><Send className="w-4 h-4 mr-2" />{t('inquiry.send')}</>}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InquiryForm;
