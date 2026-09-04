import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { MessageSquare, Plus, Trash2, Loader2, Sparkles } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useStaffAuth } from '@/hooks/useStaffAuth';
import { useAtlasHistory, type AtlasMessage } from '@/hooks/useAtlasHistory';
import { openAtlasThread } from '@/components/AIAssistantWidget';
import IconTooltip from '@/components/IconTooltip';

const stripCommands = (s: string) =>
  s.replace(/\[\[NAVIGATE:\/[^\]]*\]\]/g, '').replace(/\[\[BLOG_POST\]\][\s\S]*?\[\[\/BLOG_POST\]\]/g, '').replace(/\[\[PUBLISH_BLOG\]\]/g, '').trim();

const AtlasHistory = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const { isAdmin, loading } = useStaffAuth();
  const history = useAtlasHistory(isAdmin);
  const [messages, setMessages] = useState<AtlasMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Route-driven active thread: reloading /admin/atlas/<id> restores that conversation.
  useEffect(() => {
    if (!isAdmin || !threadId) { setMessages([]); return; }
    let active = true;
    setLoadingMessages(true);
    history.loadMessages(threadId).then(m => { if (active) { setMessages(m); setLoadingMessages(false); } });
    return () => { active = false; };
  }, [isAdmin, threadId, history]);

  const handleNew = async () => {
    const id = await history.createThread();
    if (id) navigate(`/admin/atlas/${id}`);
  };

  const handleDelete = async (id: string) => {
    await history.deleteThread(id);
    if (id === threadId) navigate('/admin/atlas');
  };

  const active = history.threads.find(t => t.id === threadId);

  return (
    <AdminLayout>
      {!loading && !isAdmin ? (
        <div className="p-8 text-sm text-muted-foreground">Atlas memory is available to administrators only.</div>
      ) : (
      <div className="flex h-screen">
        <aside className="w-72 shrink-0 border-r border-border flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <h1 className="text-sm font-bold">Atlas conversations</h1>
            <IconTooltip label="New conversation" side="bottom">
              <button onClick={handleNew} aria-label="New conversation" className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </IconTooltip>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
            {history.threads.length === 0 && !history.loadingThreads && (
              <p className="px-3 py-6 text-xs text-muted-foreground text-center">No conversations yet.</p>
            )}
            {history.threads.map(t => (
              <div key={t.id} className={`group flex items-center gap-1 rounded-xl px-2 py-2 ${t.id === threadId ? 'bg-primary/10' : 'hover:bg-secondary'}`}>
                <button onClick={() => navigate(`/admin/atlas/${t.id}`)} className="flex-1 min-w-0 text-left px-1">
                  <p className={`text-sm truncate ${t.id === threadId ? 'text-primary font-medium' : ''}`}>{t.title}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(t.updated_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</p>
                </button>
                <IconTooltip label="Delete" side="left">
                  <button onClick={() => void handleDelete(t.id)} aria-label={`Delete ${t.title}`} className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </IconTooltip>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex-1 min-w-0 flex flex-col">
          {!threadId ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
              <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground max-w-sm">Pick a conversation on the left, or start a new one. Everything you discuss with Atlas while signed in is remembered here.</p>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold truncate">{active?.title ?? 'Conversation'}</h2>
                <button onClick={() => openAtlasThread(threadId)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  <Sparkles className="w-4 h-4" /> Continue in Atlas
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 max-w-3xl">
                {loadingMessages && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
                {!loadingMessages && messages.length === 0 && (
                  <p className="text-sm text-muted-foreground">This conversation is empty. Use “Continue in Atlas” to start it.</p>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] text-sm leading-relaxed ${m.role === 'user' ? 'bg-foreground text-background px-4 py-2.5 rounded-2xl rounded-br-lg' : 'prose prose-sm max-w-none text-foreground/90'}`}>
                      {m.role === 'user' ? m.content : <ReactMarkdown>{stripCommands(m.content)}</ReactMarkdown>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
      )}
    </AdminLayout>
  );
};

export default AtlasHistory;
