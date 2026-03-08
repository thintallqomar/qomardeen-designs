import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import ScrollReveal from './ScrollReveal';
import NewsletterCapture from './NewsletterCapture';
import Icon3D from './Icon3D';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();

  const socialLinks = [
    { icon: 'linkedin', href: "https://linkedin.com/in/qomardeen-tijani", label: "LinkedIn" },
    { icon: 'mail', href: "mailto:qomardeentylertijani@gmail.com", label: "Email" },
    { icon: 'phone', href: "tel:+2348139469192", label: "Phone" },
    { icon: 'message-square', href: "https://x.com/the_Qomardeen", label: "X (Twitter)" },
  ];

  const quickLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.projects'), href: '/projects' },
    { name: t('nav.architecture'), href: '/architecture' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.thinking'), href: '/thinking' },
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
                  <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent" aria-hidden="true">QTT</span>
                  <span className="text-lg font-medium">Qomardeen Tyler Tijani</span>
                </div>
                <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">{t('footer.description')}</p>
                <div className="flex items-center gap-4">
                  {socialLinks.map((link, index) => (
                    <motion.a key={index} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="p-2 rounded-lg bg-secondary hover:bg-primary/10 transition-colors" aria-label={link.label} whileHover={{ y: -2, scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                      <Icon3D name={link.icon} size={22} />
                    </motion.a>
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
                  <div>qomardeentylertijani@gmail.com</div>
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
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>{t('footer.tagline')}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </ScrollReveal>
  );
};

export default Footer;
