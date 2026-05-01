import { useEffect } from 'react';
import type { BlogPost } from '@/data/articles';

interface ArticleSEOProps {
  post: BlogPost;
}

const ArticleSEO = ({ post }: ArticleSEOProps) => {
  useEffect(() => {
    // Title
    document.title = post.seo.metaTitle;

    // Meta tags
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const url = window.location.href;
    const socialImage = post.socialImage || post.heroImage;
    const absoluteImage = socialImage
      ? (socialImage.startsWith('http') ? socialImage : `${window.location.origin}${socialImage}`)
      : null;
    const imageAlt = post.heroImageAlt || post.title;

    setMeta('description', post.seo.metaDescription);
    setMeta('og:title', post.seo.metaTitle, true);
    setMeta('og:description', post.seo.metaDescription, true);
    setMeta('og:type', 'article', true);
    setMeta('og:url', url, true);
    if (absoluteImage) {
      setMeta('og:image', absoluteImage, true);
      setMeta('og:image:alt', imageAlt, true);
      setMeta('og:image:width', '1536', true);
      setMeta('og:image:height', '896', true);
    }
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', post.seo.metaTitle);
    setMeta('twitter:description', post.seo.metaDescription);
    if (absoluteImage) {
      setMeta('twitter:image', absoluteImage);
      setMeta('twitter:image:alt', imageAlt);
    }

    // JSON-LD structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'article-schema';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.seo.metaDescription,
      author: {
        '@type': 'Person',
        name: post.author.name,
      },
      datePublished: post.publishDate,
      dateModified: post.lastUpdated || post.publishDate,
      publisher: {
        '@type': 'Person',
        name: post.author.name,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      articleSection: post.category,
      keywords: post.tags.join(', '),
    });
    document.head.appendChild(script);

    return () => {
      document.title = 'DesignQit — Qomardeen Tijani';
      const schemaScript = document.getElementById('article-schema');
      if (schemaScript) schemaScript.remove();
    };
  }, [post]);

  return null;
};

export default ArticleSEO;
