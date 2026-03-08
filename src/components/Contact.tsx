import { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Send, CheckCircle, Globe, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';
import Icon3D from './Icon3D';
import { z } from 'zod';

const ease = [0.25, 0.1, 0.25, 1] as const;

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  subject: z.string().trim().min(1, 'Subject is required').max(200),
  message: z.string().trim().min(1, 'Message is required').max(2000),
});

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors(prev => { const n = { ...prev }; delete n[e.target.name]; return n; });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: result.data.name,
        email: result.data.email,
        subject: result.data.subject,
        message: result.data.message,
      });

      if (error) throw error;

      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: result.data.name,
          email: result.data.email,
          subject: result.data.subject,
          message: result.data.message,
        },
      });

      if (emailError) {
        console.error('Email notification error:', emailError);
      }

      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      toast({ title: "Message sent!", description: "Thank you for reaching out. I'll get back to you soon." });
    } catch (error) {
      console.error('Submission error:', error);
      toast({ title: "Failed to send message", description: "Something went wrong. Please try again or contact me directly.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <Mail />, variant: 'blue' as const, label: "Email", value: "qomardeentylertijani@gmail.com", href: "mailto:qomardeentylertijani@gmail.com" },
    { icon: <Phone />, variant: 'emerald' as const, label: "Phone", value: "+2348139469192", href: "tel:+2348139469192" },
    { icon: <MapPin />, variant: 'rose' as const, label: "Location", value: "Nigeria", href: null },
    { icon: <Linkedin />, variant: 'accent' as const, label: "LinkedIn", value: "Connect with me", href: "https://linkedin.com/in/qomardeen-tijani" },
    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, variant: 'primary' as const, label: "X (Twitter)", value: "@the_Qomardeen", href: "https://x.com/the_Qomardeen" },
    { icon: <Globe />, variant: 'teal' as const, label: "Book a Call", value: "Schedule a meeting", href: "https://cal.com/the_Qomardeen" },
  ];

  return (
    <section id="contact" className="section-padding bg-muted/30">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Connect</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Open to full-time roles, contract opportunities, and collaborative projects.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            <div className="flex flex-col">
              <StaggeredReveal className="space-y-4 flex-1" staggerDelay={0.08}>
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    className="card-elegant"
                    whileHover={{ y: -2, boxShadow: 'var(--shadow-md)' }}
                    transition={{ duration: 0.25, ease }}
                  >
                    <div className="flex items-center gap-4">
                      <Icon3D variant={item.variant} size="md">
                        {item.icon}
                      </Icon3D>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground">{item.label}</div>
                        {item.href ? (
                          <a href={item.href} className="font-medium hover:text-primary transition-colors"
                            target={item.href.startsWith('http') ? '_blank' : undefined}
                            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >{item.value}</a>
                        ) : (
                          <div className="font-medium">{item.value}</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </StaggeredReveal>

              <ScrollReveal delay={0.3}>
                <div className="bg-gradient-subtle p-6 rounded-xl border border-border mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon3D variant="success" size="sm">
                      <CheckCircle />
                    </Icon3D>
                    <span className="font-medium">Currently Available</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Open to full-time roles, contract opportunities, and collaborative projects.
                  </p>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal direction="right" delay={0.15}>
              <div className="card-elegant flex flex-col h-full">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center flex-1 py-12 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                      >
                        <Icon3D variant="success" size="xl" className="mb-6">
                          <CheckCircle />
                        </Icon3D>
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6">Thank you for reaching out. I'll get back to you soon.</p>
                      <Button variant="outline" onClick={() => setIsSuccess(false)}>Send Another Message</Button>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1">
                      <h3 className="text-xl font-semibold mb-6">Send a Message</h3>
                      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                        <div className="space-y-6 flex-1 flex flex-col">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label htmlFor="name" className="text-sm font-medium">Name *</label>
                              <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className={`border-border focus:border-primary ${errors.name ? 'border-destructive' : ''}`} />
                              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="email" className="text-sm font-medium">Email *</label>
                              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" className={`border-border focus:border-primary ${errors.email ? 'border-destructive' : ''}`} />
                              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium">Subject *</label>
                            <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="What's this about?" className={`border-border focus:border-primary ${errors.subject ? 'border-destructive' : ''}`} />
                            {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
                          </div>
                          <div className="space-y-2 flex-1 flex flex-col">
                            <label htmlFor="message" className="text-sm font-medium">Message *</label>
                            <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about your project or just say hello..." className={`border-border focus:border-primary resize-none flex-1 min-h-[120px] ${errors.message ? 'border-destructive' : ''}`} />
                            {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                          </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2, ease }}>
                          <Button type="submit" disabled={isSubmitting} className="w-full btn-primary disabled:opacity-50 mt-6">
                            {isSubmitting ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</>
                            ) : (
                              <><Send className="w-4 h-4 mr-2" />Send Message</>
                            )}
                          </Button>
                        </motion.div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
