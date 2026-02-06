import { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Send, CheckCircle, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ScrollReveal from './ScrollReveal';
import StaggeredReveal from './StaggeredReveal';
import emailjs from '@emailjs/browser';

const ease = [0.25, 0.1, 0.25, 1] as const;

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await emailjs.send('service_rzan6ys', 'template_qr2qk7j', {
        from_name: formData.name, from_email: formData.email,
        subject: formData.subject, message: formData.message, to_name: 'Qomardeen Tijani',
      }, '4uu54qdOq-iAYRu50');
      toast({ title: "Message sent successfully!", description: "Thank you for reaching out. I'll get back to you soon." });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('EmailJS error:', error);
      toast({ title: "Failed to send message", description: "Something went wrong. Please try again or contact me directly.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, label: "Email", value: "qomardeentylertijani@gmail.com", href: "mailto:qomardeentylertijani@gmail.com" },
    { icon: <Phone className="w-5 h-5" />, label: "Phone", value: "+2348139469192", href: "tel:+2348139469192" },
    { icon: <MapPin className="w-5 h-5" />, label: "Location", value: "Nigeria", href: null },
    { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn", value: "Connect with me", href: "https://linkedin.com/in/qomardeen-tijani" },
    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, label: "X (Twitter)", value: "@the_Qomardeen", href: "https://x.com/the_Qomardeen" },
    { icon: <Globe className="w-5 h-5" />, label: "Book a Call", value: "Schedule a meeting", href: "https://cal.com/the_Qomardeen" },
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
                      <div className="p-3 bg-secondary rounded-lg text-foreground">{item.icon}</div>
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
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
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
                <h3 className="text-xl font-semibold mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                  <div className="space-y-6 flex-1 flex flex-col">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Name *</label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required className="border-border focus:border-primary" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email *</label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" required className="border-border focus:border-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">Subject *</label>
                      <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="What's this about?" required className="border-border focus:border-primary" />
                    </div>
                    <div className="space-y-2 flex-1 flex flex-col">
                      <label htmlFor="message" className="text-sm font-medium">Message *</label>
                      <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about your project or just say hello..." required className="border-border focus:border-primary resize-none flex-1 min-h-[120px]" />
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2, ease }}>
                    <Button type="submit" disabled={isSubmitting} className="w-full btn-primary disabled:opacity-50 mt-6">
                      {isSubmitting ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Sending...</>
                      ) : (
                        <><Send className="w-4 h-4 mr-2" />Send Message</>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
