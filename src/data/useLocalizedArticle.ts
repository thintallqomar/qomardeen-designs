import { useTranslation } from 'react-i18next';
import type { BlogPost } from './articles';

export interface ArticleTranslation {
  title: string;
  excerpt: string;
  content: string;
}

export type ArticleTranslations = Record<string, ArticleTranslation>;

import frTranslations from './translations/fr';
import esTranslations from './translations/es';
import deTranslations from './translations/de';
import ptTranslations from './translations/pt';
import ruTranslations from './translations/ru';
import arTranslations from './translations/ar';
import yoTranslations from './translations/yo';
import haTranslations from './translations/ha';
import igTranslations from './translations/ig';
import pcmTranslations from './translations/pcm';

const allTranslations: Record<string, ArticleTranslations> = {
  fr: frTranslations, es: esTranslations, de: deTranslations,
  pt: ptTranslations, ru: ruTranslations, ar: arTranslations,
  yo: yoTranslations, ha: haTranslations, ig: igTranslations,
  pcm: pcmTranslations,
};

export function getLocalizedPost(post: BlogPost, lang: string): BlogPost {
  if (lang === 'en' || !allTranslations[lang]) return post;
  const translation = allTranslations[lang]?.[post.slug];
  if (!translation) return post;
  return { ...post, title: translation.title, excerpt: translation.excerpt, content: translation.content };
}

export function useLocalizedPost(post: BlogPost): BlogPost {
  const { i18n } = useTranslation();
  return getLocalizedPost(post, i18n.language?.slice(0, 2) || 'en');
}

export function useLocalizedPosts(posts: BlogPost[]): BlogPost[] {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'en';
  return posts.map(post => getLocalizedPost(post, lang));
}
