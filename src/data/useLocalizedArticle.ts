import { useTranslation } from 'react-i18next';
import type { BlogPost } from './articles';

/**
 * Blog content is English-only.
 * These hooks maintain the same hook-call signature to avoid
 * "Rendered fewer hooks than expected" errors.
 */

export function getLocalizedPost(post: BlogPost, _lang: string): BlogPost {
  return post;
}

export function useLocalizedPost<T extends BlogPost | undefined>(post: T): T {
  // Keep the hook call to preserve hook count consistency
  useTranslation();
  return post;
}

export function useLocalizedPosts(posts: BlogPost[]): BlogPost[] {
  useTranslation();
  return posts;
}
