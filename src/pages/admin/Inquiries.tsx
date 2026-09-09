import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, Trash2, CheckCircle2, Inbox } from 'lucide-react';
import IconTooltip from '@/components/IconTooltip';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  company: string | null;
  project_type: string;
  budget_range: string | null;
  timeline: string | null;
  message: string;
  status: string;
  created_at: string;
}

const AdminInquiries = () => {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('project_inquiries' as never)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast({ title: 'Could not load inquiries', description: error.message, variant: 'destructive' });
    setItems((data ?? []) as unknown as Inquiry[]);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('project_inquiries' as never).update({ status } as never).eq('id', id);
    if (error) return toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    setItems(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('project_inquiries' as never).delete().eq('id', id);
    if (error) return toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const newCount = items.filter(i => i.status === 'new').length;

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Project Inquiries</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? 'Loading…' : `${items.length} total · ${newCount} new`}
          </p>
        </header>

        {!loading && items.length === 0 && (
          <div className="card-elegant p-10 text-center">
            <Inbox className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No inquiries yet. They'll appear here as soon as someone uses the Hire page form.</p>
          </div>
        )}

        <div className="space-y-4">
          {items.map(item => (
            <article key={item.id} className="card-elegant p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold">{item.name}</h2>
                    {item.status === 'new' && (
                      <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary">New</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground break-words">
                    {item.email}{item.company ? ` · ${item.company}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <IconTooltip label="Reply by email">
                    <a
                      href={`mailto:${item.email}?subject=Re: your project inquiry`}
                      aria-label="Reply by email"
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </IconTooltip>
                  <IconTooltip label={item.status === 'handled' ? 'Mark as new' : 'Mark as handled'}>
                    <button
                      onClick={() => setStatus(item.id, item.status === 'handled' ? 'new' : 'handled')}
                      aria-label="Toggle handled"
                      className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors hover:bg-secondary ${
                        item.status === 'handled' ? 'text-success' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </IconTooltip>
                  <IconTooltip label="Delete">
                    <button
                      onClick={() => remove(item.id)}
                      aria-label="Delete inquiry"
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </IconTooltip>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                <span className="px-2 py-0.5 rounded-full bg-secondary">{item.project_type}</span>
                {item.budget_range && <span className="px-2 py-0.5 rounded-full bg-secondary">{item.budget_range}</span>}
                {item.timeline && <span className="px-2 py-0.5 rounded-full bg-secondary">{item.timeline}</span>}
                <span className="px-2 py-0.5">{new Date(item.created_at).toLocaleString()}</span>
              </div>

              <p className="text-sm whitespace-pre-wrap text-muted-foreground">{item.message}</p>
            </article>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInquiries;
