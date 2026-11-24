import { Link } from 'react-router-dom';
import { Linkedin, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import NewsletterCapture from './NewsletterCapture';

const XIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/**
 * Minimal footer: who, where to go, how to reach you, newsletter, copyright. Two rows on desktop.
 * Every item is a link or a working form.
 */
const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();

  const links = [
    { name: t('nav.projects'), href: '/projects' },
    { name: t('nav.hire'), href: '/hire' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.blog', { defaultValue: 'Articles' }), href: '/explore/articles' },
    { name: t('nav.thinking'), href: '/explore/thinking' },
    { name: t('nav.architecture'), href: '/explore/architecture' },
    { name: t('nav.contact', { defaultValue: 'Contact' }), href: '/hire#contact' },
  ];
  const socials = [
    { icon: <Linkedin className="w-4 h-4" />, href: 'https://linkedin.com/in/qomardeentijani', label: 'LinkedIn' },
    { icon: <Mail className="w-4 h-4" />, href: 'mailto:qomardeentijani@gmail.com', label: 'Email' },
    { icon: <Phone className="w-4 h-4" />, href: 'tel:+2348139469192', label: 'Phone' },
    { icon: <XIcon />, href: 'https://x.com/the_Qomardeen', label: 'X (Twitter)' },
  ];
  const linkCls = 'py-1 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded';

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container-custom">
        <div className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <Link to={localizedPath('/')} className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
            <span className="font-semibold">Qomardeen Tijani</span>
            <span className="text-sm text-muted-foreground"> · {t('footer.description')}</span>
          </Link>
          <nav aria-label={t('footer.quickLinks')} className="flex flex-wrap gap-x-5 gap-y-1">
            {links.map(l => (
              <Link key={l.href} to={localizedPath(l.href)} className={linkCls}>{l.name}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-1 -ml-2 lg:ml-0">
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                title={s.label}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-border py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {t('footer.copyright', { year })} ·{' '}
            <Link to={localizedPath('/hire')} className="inline-flex items-center gap-1.5 hover:text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              {t('footer.location')} · {t('footer.availableTitle')}
            </Link>
          </p>
          <NewsletterCapture compact />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
