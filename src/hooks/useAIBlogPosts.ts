import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BlogPost } from '@/data/articles';
import profileImg from '@/assets/new-profile.jpg';

export interface AIBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  read_time: string;
  status: string;
  hero_image_url: string | null;
  created_at: string;
  published_at: string | null;
}

function aiBlogToBlogPost(post: AIBlogPost): BlogPost {
  return {
    slug: `ai-${post.slug}`,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    readTime: post.read_time,
    category: post.category as BlogPost['category'],
    tags: post.tags,
    publishDate: post.published_at || post.created_at,
    heroImage: post.hero_image_url || undefined,
    author: {
      name: 'Qomardeen Tijani',
      avatar: profileImg,
    },
    seo: {
      metaTitle: `${post.title} | Qomardeen Tijani`,
      metaDescription: post.excerpt,
    },
    section: 'blog',
  };
}

export function useAIBlogPosts() {
  return useQuery({
    queryKey: ['ai-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return (data as AIBlogPost[]).map(aiBlogToBlogPost);
    },
  });
}
