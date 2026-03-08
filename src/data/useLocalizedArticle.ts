import type { BlogPost } from './articles';

/**
 * Blog content is English-only.
 * These hooks exist to maintain API compatibility across the codebase.
 */

export function getLocalizedPost(post: BlogPost, _lang: string): BlogPost {
  return post;
}

export function useLocalizedPost(post: BlogPost): BlogPost {
  return post;
}

export function useLocalizedPosts(posts: BlogPost[]): BlogPost[] {
  return posts;
}
