import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AtlasThread = { id: string; title: string; updated_at: string };
export type AtlasMessage = { role: 'user' | 'assistant'; content: string };

const LAST_THREAD_KEY = 'atlas:last-thread';

/**
 * Cloud-backed conversation history for Atlas. Only used when the signed-in
 * user is an admin — RLS rejects everything else, so callers gate on `enabled`.
 */
export const useAtlasHistory = (enabled: boolean) => {
  const [threads, setThreads] = useState<AtlasThread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(false);

  const refreshThreads = useCallback(async () => {
    if (!enabled) return;
    setLoadingThreads(true);
    const { data, error } = await supabase
      .from('atlas_threads')
      .select('id,title,updated_at')
      .order('updated_at', { ascending: false })
      .limit(100);
    if (error) console.error('atlas threads', error.message);
    setThreads(data ?? []);
    setLoadingThreads(false);
  }, [enabled]);

  useEffect(() => {
    if (enabled) void refreshThreads();
    else setThreads([]);
  }, [enabled, refreshThreads]);

  const createThread = useCallback(async (title?: string): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from('atlas_threads')
      .insert({ user_id: user.id, title: (title ?? 'New conversation').slice(0, 120) })
      .select('id,title,updated_at')
      .single();
    if (error || !data) { console.error('atlas create thread', error?.message); return null; }
    setThreads(prev => [data, ...prev]);
    localStorage.setItem(LAST_THREAD_KEY, data.id);
    return data.id;
  }, []);

  const renameThread = useCallback(async (id: string, title: string) => {
    const clean = title.trim().slice(0, 120) || 'New conversation';
    setThreads(prev => prev.map(t => t.id === id ? { ...t, title: clean } : t));
    const { error } = await supabase.from('atlas_threads').update({ title: clean }).eq('id', id);
    if (error) console.error('atlas rename', error.message);
  }, []);

  const deleteThread = useCallback(async (id: string) => {
    setThreads(prev => prev.filter(t => t.id !== id));
    if (localStorage.getItem(LAST_THREAD_KEY) === id) localStorage.removeItem(LAST_THREAD_KEY);
    const { error } = await supabase.from('atlas_threads').delete().eq('id', id);
    if (error) console.error('atlas delete', error.message);
  }, []);

  const loadMessages = useCallback(async (threadId: string): Promise<AtlasMessage[]> => {
    const { data, error } = await supabase
      .from('atlas_messages')
      .select('role,content')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });
    if (error) { console.error('atlas load messages', error.message); return []; }
    return (data ?? []).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
  }, []);

  const appendMessage = useCallback(async (threadId: string, msg: AtlasMessage) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from('atlas_messages')
      .insert({ thread_id: threadId, user_id: user.id, role: msg.role, content: msg.content });
    if (error) { console.error('atlas append', error.message); return; }
    // Touch the thread so it sorts to the top of the history list.
    await supabase.from('atlas_threads').update({ updated_at: new Date().toISOString() }).eq('id', threadId);
    setThreads(prev => {
      const t = prev.find(x => x.id === threadId);
      if (!t) return prev;
      return [{ ...t, updated_at: new Date().toISOString() }, ...prev.filter(x => x.id !== threadId)];
    });
  }, []);

  return {
    threads,
    loadingThreads,
    refreshThreads,
    createThread,
    renameThread,
    deleteThread,
    loadMessages,
    appendMessage,
    lastThreadId: () => localStorage.getItem(LAST_THREAD_KEY),
    rememberThread: (id: string | null) => id ? localStorage.setItem(LAST_THREAD_KEY, id) : localStorage.removeItem(LAST_THREAD_KEY),
  };
};
