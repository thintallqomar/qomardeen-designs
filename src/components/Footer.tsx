import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Linkedin, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPath } from '@/hooks/useLocalizedNavigate';
import { useFooterScenes } from '@/hooks/useSiteSettings';
import NewsletterCapture from './NewsletterCapture';
import FooterScenes from './FooterScenes';

const XIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/** Qomardeen's local time (Lagos), refreshed every 30 seconds. */
const useLagosTime = () => {
  const fmt = () => {
    try {
      return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Lagos' }).format(new Date());
    } catch {
      return '';
    }
  };
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setTime(fmt()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
};

/**
 * Minimal footer: who, where to go, how to reach you, newsletter, copyright. Two rows on desktop.
 * Every item is a link or a working form. Behind it sits quiet scenery from the games Qomardeen plays
 * (switch it off in Admin › Site).
 */
const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = useTranslation();
  const localizedPath = useLocalizedPath();
  const scenesOn = useFooterScenes();
  const lagosTime = useLagosTime();

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
  const ring = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring';
  const linkCls = `footer-link py-1 text-sm text-muted-foreground hover:text-foreground transition-colors rounded ${ring}`;
  const toTop = () => {
    const smooth = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
  };

  return (
    <footer className="site-footer relative isolate overflow-hidden">
      {scenesOn && <FooterScenes />}
      <div className="container-custom relative">
        <div className="flex flex-col gap-5 pt-10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <Link to={localizedPath('/')} className={`group shrink-0 rounded ${ring}`}>
            <span className="block text-xl font-semibold tracking-tight md:text-2xl">Qomardeen Tijani</span>
            <span className="mt-0.5 block text-sm text-muted-foreground">{t('footer.description')}</span>
          </Link>
          <nav aria-label={t('footer.quickLinks')} className="flex flex-wrap gap-x-5 gap-y-1">
            {links.map(l => (
              <Link key={l.href} to={localizedPath(l.href)} className={linkCls}>{l.name}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                title={s.label}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`footer-icon grid h-10 w-10 place-items-center rounded-full text-muted-foreground hover:text-foreground transition-colors ${ring}`}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-rule" aria-hidden="true" />
        <div className="flex flex-col-reverse gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {t('footer.copyright', { year })}
            <span className="mx-1.5" aria-hidden="true">·</span>
            <Link to={localizedPath('/hire')} className="inline-flex items-center gap-1.5 hover:text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
              {t('footer.availableTitle')}
            </Link>
            {lagosTime && (
              <>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span className="tabular-nums">{t('footer.location')} {lagosTime} WAT</span>
              </>
            )}
          </p>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <NewsletterCapture compact />
            <button
              type="button"
              onClick={toTop}
              aria-label={t('footer.backToTop', { defaultValue: 'Back to top' })}
              title={t('footer.backToTop', { defaultValue: 'Back to top' })}
              className={`footer-icon grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:text-foreground transition-colors ${ring}`}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
