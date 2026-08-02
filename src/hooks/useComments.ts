import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Comment {
  id: string;
  article_slug: string;
  parent_id: string | null;
  user_id: string | null;
  guest_name: string | null;
  content: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  profile?: {
    display_name: string;
    avatar_url: string | null;
  };
  replies?: Comment[];
}

function buildTree(comments: Comment[]): Comment[] {
  const map = new Map<string, Comment>();
  const roots: Comment[] = [];

  for (const c of comments) {
    map.set(c.id, { ...c, replies: [] });
  }

  for (const c of map.values()) {
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.replies!.push(c);
    } else {
      roots.push(c);
    }
  }

  return roots;
}

export function useComments(articleSlug: string) {
  const queryClient = useQueryClient();
  const queryKey = ['comments', articleSlug];

  const { data: flatComments = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_comments_public' as any)
        .select('*')
        .eq('article_slug', articleSlug)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch profiles for user comments
      const rows = ((data || []) as any[]) as Comment[];
      const userIds = [...new Set(rows.filter(c => c.user_id).map(c => c.user_id!))];
      let profileMap = new Map<string, { display_name: string; avatar_url: string | null }>();

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, display_name, avatar_url')
          .in('user_id', userIds);

        if (profiles) {
          for (const p of profiles) {
            profileMap.set(p.user_id, { display_name: p.display_name, avatar_url: p.avatar_url });
          }
        }
      }

      return rows.map(c => ({
        ...c,
        profile: c.user_id ? profileMap.get(c.user_id) : undefined,
      })) as Comment[];
    },
  });

  const comments = buildTree(flatComments);
  const commentCount = flatComments.length;

  const addComment = useMutation({
    mutationFn: async (payload: {
      content: string;
      parent_id?: string;
      guest_name?: string;
      guest_email?: string;
    }) => {
      const { data: { session } } = await supabase.auth.getSession();

      const insert: Record<string, unknown> = {
        article_slug: articleSlug,
        content: payload.content,
        parent_id: payload.parent_id || null,
      };

      if (session?.user) {
        insert.user_id = session.user.id;
      } else {
        insert.guest_name = payload.guest_name;
      }

      const { data, error } = await supabase
        .from('blog_comments')
        .insert(insert as any)
        .select('id')
        .single();
      if (error) throw error;

      // Guest contact emails live in a private table that visitors cannot read.
      if (!session?.user && payload.guest_email && data?.id) {
        await supabase
          .from('comment_contacts' as any)
          .insert({ comment_id: data.id, email: payload.guest_email } as any);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const editComment = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .from('blog_comments')
        .update({ content, is_edited: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteComment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_comments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { comments, commentCount, isLoading, addComment, editComment, deleteComment };
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      return {
        id: session.user.id,
        email: session.user.email,
        profile,
      };
    },
    staleTime: 30_000,
  });
}
