import { Link } from 'react-router-dom';
import { Linkedin, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import ScrollReveal from './ScrollReveal';
import NewsletterCapture from './NewsletterCapture';
import Icon3D from './Icon3D';
import IconTooltip from './IconTooltip';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();

  const socialLinks = [
    { icon: <Linkedin />, variant: 'accent' as const, href: "https://linkedin.com/in/qomardeentijani", label: "LinkedIn" },
    { icon: <Mail />, variant: 'blue' as const, href: "mailto:qomardeentijani@gmail.com", label: "Email" },
    { icon: <Phone />, variant: 'emerald' as const, href: "tel:+2348139469192", label: "Phone" },
    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>, variant: 'primary' as const, href: "https://x.com/the_Qomardeen", label: "X (Twitter)" },
  ];

  const quickLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.projects'), href: '/projects' },
    { name: t('nav.architecture'), href: '/explore/architecture' },
    { name: t('nav.blog', { defaultValue: 'Articles' }), href: '/explore/articles' },
    { name: t('nav.thinking'), href: '/explore/thinking' },
    { name: t('nav.hire'), href: '/hire' },
    { name: t('nav.about'), href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <ScrollReveal>
      <footer className="bg-card border-t border-border">
        <div className="container-custom">
          <div className="py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent" aria-hidden="true">QT</span>
                  <span className="text-lg font-medium">Qomardeen Tijani</span>
                </div>
                <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">{t('footer.description')}</p>
                <div className="flex items-center gap-3">
                  {socialLinks.map((link, index) => (
                    <IconTooltip key={index} label={link.label}>
                      <motion.a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined} aria-label={link.label} whileHover={{ y: -2, scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                        <Icon3D variant={link.variant} size="sm">
                          {link.icon}
                        </Icon3D>
                      </motion.a>
                    </IconTooltip>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">{t('footer.quickLinks')}</h3>
                <div className="space-y-2">
                  {quickLinks.map((link, index) => (
                    <Link key={index} to={localizedPath(link.href)} className="block text-muted-foreground hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">{t('footer.getInTouch')}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>{t('footer.location')}</div>
                  <div>qomardeentijani@gmail.com</div>
                  <div>+2348139469192</div>
                </div>
                <div className="mt-4 p-3 bg-secondary rounded-lg">
                  <div className="text-sm font-medium text-foreground mb-1">{t('footer.availableTitle')}</div>
                  <div className="text-xs text-muted-foreground">{t('footer.availableDesc')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border">
            <NewsletterCapture />
          </div>

          <div className="py-6 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">{t('footer.copyright', { year: currentYear })}</div>
            </div>
          </div>
        </div>
      </footer>
    </ScrollReveal>
  );
};

export default Footer;
