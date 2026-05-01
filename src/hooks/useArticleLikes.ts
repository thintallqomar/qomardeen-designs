import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const VISITOR_KEY = 'designqit:visitor_id';

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function useArticleLikes(articleSlug: string) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  const refresh = useCallback(async () => {
    const visitorId = getVisitorId();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id ?? null;

    const { count: total } = await supabase
      .from('blog_likes')
      .select('*', { count: 'exact', head: true })
      .eq('article_slug', articleSlug);
    setCount(total ?? 0);

    let q = supabase.from('blog_likes').select('id').eq('article_slug', articleSlug).limit(1);
    q = userId ? q.eq('user_id', userId) : q.eq('visitor_id', visitorId);
    const { data: mine } = await q;
    setLiked(!!mine && mine.length > 0);
    setLoading(false);
  }, [articleSlug]);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

  const toggle = useCallback(async () => {
    if (pending) return;
    setPending(true);
    const visitorId = getVisitorId();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id ?? null;

    // Optimistic
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount((c) => c + (wasLiked ? -1 : 1));

    try {
      if (wasLiked) {
        let del = supabase.from('blog_likes').delete().eq('article_slug', articleSlug);
        del = userId ? del.eq('user_id', userId) : del.eq('visitor_id', visitorId);
        const { error } = await del;
        if (error) throw error;
      } else {
        const payload = userId
          ? { article_slug: articleSlug, user_id: userId }
          : { article_slug: articleSlug, visitor_id: visitorId };
        const { error } = await supabase.from('blog_likes').insert(payload);
        if (error) throw error;
      }
    } catch (e) {
      // revert
      setLiked(wasLiked);
      setCount((c) => c + (wasLiked ? 1 : -1));
      console.error('Like toggle failed', e);
    } finally {
      setPending(false);
    }
  }, [articleSlug, liked, pending]);

  return { count, liked, loading, pending, toggle };
}