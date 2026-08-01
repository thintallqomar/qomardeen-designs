import { useEffect } from 'react';
import ogDefault from '@/assets/og-default.jpg';

const SITE_ORIGIN = 'https://qomardeentijani.lovable.app';
const SITE_NAME = 'DesignQit — Qomardeen Tijani';

interface PageSEOProps {
  title: string;
  description: string;
  /** Path WITHOUT the language prefix, e.g. "/about". Use "/" for home. */
  path: string;
  /** Optional explicit canonical override (absolute URL). */
  canonical?: string;
  /** Optional og:image override (absolute URL or imported asset). */
  image?: string;
  /** og:type — defaults to "website". */
  type?: 'website' | 'article' | 'profile';
}

const SUPPORTED_LANGS = ['en', 'fr', 'es', 'de', 'pt', 'ru', 'yo', 'ha', 'ig', 'pcm', 'ar'];

const PageSEO = ({ title, description, path, canonical, image, type = 'website' }: PageSEOProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (key: string, value: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    };

    // Detect current language from URL: /:lang/...
    const langMatch = window.location.pathname.match(/^\/([a-z]{2,3})(?:\/|$)/i);
    const currentLang = langMatch && SUPPORTED_LANGS.includes(langMatch[1]) ? langMatch[1] : 'en';
    const cleanPath = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
    const url = canonical || `${SITE_ORIGIN}/${currentLang}${cleanPath}`;

    // Canonical (self-referential, per route + language)
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;

    // hreflang alternates for every supported language
    document
      .querySelectorAll('link[rel="alternate"][data-page-hreflang]')
      .forEach(el => el.remove());
    SUPPORTED_LANGS.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = `${SITE_ORIGIN}/${lang}${cleanPath}`;
      link.setAttribute('data-page-hreflang', 'true');
      document.head.appendChild(link);
    });
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = `${SITE_ORIGIN}/en${cleanPath}`;
    xDefault.setAttribute('data-page-hreflang', 'true');
    document.head.appendChild(xDefault);

    const rawImage = image || ogDefault;
    const absoluteImage = typeof rawImage === 'string' && rawImage.startsWith('http')
      ? rawImage
      : `${SITE_ORIGIN}${rawImage}`;

    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type, true);
    setMeta('og:url', url, true);
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('og:locale', currentLang.replace('-', '_'), true);
    setMeta('og:image', absoluteImage, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', absoluteImage);

    return () => {
      document
        .querySelectorAll('link[rel="alternate"][data-page-hreflang]')
        .forEach(el => el.remove());
    };
  }, [title, description, path, canonical, image, type]);

  return null;
};

export default PageSEO;