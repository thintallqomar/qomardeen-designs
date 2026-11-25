import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { fetchAllForAdmin, deleteContent, pathToType, CONTENT_TYPES, logAudit, projectKind, setContentLive, isLiveItem, isSwitchedOff, type ContentStatus, type ContentItem } from '@/lib/cms';
import { BUILT_IN_PROJECTS, isBuiltInProject, setProjectHidden } from '@/lib/siteSettings';
import { useHiddenProjects } from '@/hooks/useSiteSettings';
import { Switch } from '@/components/ui/switch';
import { useStaffAuth } from '@/hooks/useStaffAuth';
import { canEditItem, canPublish } from '@/lib/roles';
import { LEGACY_PROJECTS, importLegacyProject, legacyImageCount } from '@/lib/legacyProjects';
import { Plus, Search, Trash2, ExternalLink, DownloadCloud, Loader2 } from 'lucide-react';
import IconTooltip from '@/components/IconTooltip';

type Filter = ContentStatus | 'all' | 'off';
const STATUSES: Filter[] = ['all', 'draft', 'published', 'scheduled', 'archived', 'off'];

/** One switch, used for every row: On = visitors can see it, Off = hidden but kept. */
const LiveSwitch = ({ on, disabled, busy, title, onChange }: { on: boolean; disabled?: boolean; busy?: boolean; title: string; onChange: (on: boolean) => void }) => (
  <label className={`flex items-center gap-2 shrink-0 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
    <span className={`w-6 text-right text-xs font-medium ${on ? 'text-foreground' : 'text-muted-foreground'}`}>{busy ? '…' : on ? 'On' : 'Off'}</span>
    <Switch
      checked={on}
      disabled={disabled || busy}
      onCheckedChange={onChange}
      aria-label={`${title}: ${on ? 'on, visible on the site' : 'off, hidden from the site'}`}
    />
  </label>
);

const ContentList = () => {
  const { typePath = 'articles' } = useParams();
  const type = pathToType(typePath);
  const qc = useQueryClient();
  const access = useStaffAuth();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Filter>('all');
  const hidden = useHiddenProjects();
  const [busyId, setBusyId] = useState<string | null>(null);
  const author = { userId: access.userId, email: access.email };

  // Turn an item on or off. Imported built-in projects also update the built-in switch,
  // so the original page doesn't reappear in its place.
  const toggle = async (item: ContentItem, on: boolean) => {
    setBusyId(item.id);
    try {
      await setContentLive(item, on);
      if (item.type === 'case_study' && isBuiltInProject(item.slug)) await setProjectHidden(item.slug, !on, author);
      toast.success(on ? `"${item.title}" is on. Visitors can see it.` : `"${item.title}" is off. It's hidden from visitors, and nothing was deleted.`);
      qc.invalidateQueries({ queryKey: ['cms'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['site-settings'] });
    } catch (e: any) {
      toast.error(e?.message ?? 'Could not change it. Nothing on your site changed.');
    } finally {
      setBusyId(null);
    }
  };

  const toggleBuiltIn = async (slug: string, title: string, on: boolean) => {
    setBusyId(slug);
    try {
      await setProjectHidden(slug, !on, author);
      toast.success(on ? `"${title}" is on.` : `"${title}" is off. It's hidden from visitors.`);
      qc.invalidateQueries({ queryKey: ['site-settings'] });
    } catch (e: any) {
      toast.error(e?.message ?? 'Could not change it.');
    } finally {
      setBusyId(null);
    }
  };

  const { data: all = [], isLoading } = useQuery({ queryKey: ['cms', 'all'], queryFn: fetchAllForAdmin });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await deleteContent(id);
      await logAudit({ event_type: 'content.deleted', target_table: 'content_items', target_id: id });
    },
    onSuccess: () => {
      toast.success('Deleted');
      qc.invalidateQueries({ queryKey: ['cms'] });
    },
    onError: (e: any) => toast.error(e.message ?? 'Delete failed'),
  });

  // Projects that were built as fixed pages (through Lovable chat) and can't be edited here yet.
  const [importing, setImporting] = useState(false);
  const [importNote, setImportNote] = useState('');
  const importable = type === 'case_study' && !isLoading && canPublish(access)
    ? LEGACY_PROJECTS.filter(p => !all.some(i => i.type === 'case_study' && i.slug === p.slug))
    : [];

  const runImport = async () => {
    setImporting(true);
    try {
      for (const p of importable) {
        setImportNote(`${p.title}: preparing ${legacyImageCount(p)} images…`);
        await importLegacyProject(p, { userId: access.userId, email: access.email }, (done, total) =>
          setImportNote(`${p.title}: uploaded image ${done} of ${total}`));
      }
      toast.success('Imported. You can now edit these projects here.');
      qc.invalidateQueries({ queryKey: ['cms'] });
      qc.invalidateQueries({ queryKey: ['projects'] });
      qc.invalidateQueries({ queryKey: ['case-study'] });
    } catch (e: any) {
      toast.error(e?.message ?? 'Import failed. Nothing was changed on your live site.');
    } finally {
      setImporting(false);
      setImportNote('');
    }
  };

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all
      .filter(i => i.type === type)
      .filter(i => status === 'all' || (status === 'off' ? isSwitchedOff(i) : i.status === status))
      .filter(i => !q || i.title.toLowerCase().includes(q) || i.slug.includes(q));
  }, [all, type, status, search]);

  if (!type) return <Navigate to="/admin" replace />;
  const meta = CONTENT_TYPES.find(c => c.value === type)!;

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-5xl">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">{meta.label}</h1>
            <p className="text-sm text-muted-foreground">{meta.blurb}</p>
            <p className="text-xs text-muted-foreground mt-1">Switch anything <strong className="font-medium text-foreground">off</strong> to hide it from visitors while you work on it. Nothing is deleted, and switching it back on restores it as it was.</p>
          </div>
          <Link
            to={`/admin/content/${typePath}/new`}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> New
          </Link>
        </div>

        {importable.length > 0 && (
          <div className="card-elegant p-4 mb-5 flex flex-wrap items-center gap-3 border-primary/30">
            <DownloadCloud className="w-5 h-5 text-primary shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {importable.map(p => p.title).join(' and ')} {importable.length > 1 ? 'were' : 'was'} added through chat and can't be edited here yet.
              </p>
              <p className="text-xs text-muted-foreground">
                Import copies the text and images into this dashboard. Your live pages keep working throughout.
                {importing && importNote ? ` ${importNote}` : ''}
              </p>
            </div>
            <button
              onClick={runImport}
              disabled={importing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-60"
            >
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
              {importing ? 'Importing…' : 'Import into admin'}
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search title or slug"
              className="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs capitalize transition-colors ${
                status === s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="card-elegant divide-y divide-border">
          {isLoading && <p className="p-4 text-sm text-muted-foreground">Loading…</p>}
          {type === 'case_study' && !isLoading && (status === 'all' || status === 'off' || status === 'published') && BUILT_IN_PROJECTS
            .filter(p => !all.some(i => i.type === 'case_study' && i.slug === p.slug))
            .filter(p => status !== 'off' || hidden.has(p.slug))
            .filter(p => !search.trim() || p.title.toLowerCase().includes(search.trim().toLowerCase()))
            .map(p => (
              <div key={p.slug} className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground truncate">/projects/{p.slug} · built into the site</p>
                </div>
                <span className="hidden sm:inline text-[10px] tracking-wide px-2 py-1 rounded-full border border-border text-muted-foreground shrink-0">Built-in page</span>
                <LiveSwitch
                  title={p.title}
                  on={!hidden.has(p.slug)}
                  busy={busyId === p.slug}
                  disabled={!canPublish(access)}
                  onChange={on => toggleBuiltIn(p.slug, p.title, on)}
                />
                {!hidden.has(p.slug) && (
                  <IconTooltip label="View live" side="left">
                    <a href={`/en/projects/${p.slug}`} target="_blank" rel="noopener noreferrer" aria-label="View live" className="p-2 rounded-lg text-muted-foreground hover:text-foreground">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </IconTooltip>
                )}
              </div>
            ))}
          {!isLoading && items.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">Nothing here yet.</p>
          )}
          {items.map(item => {
            const editable = canEditItem(access, item, access.userId);
            return (
              <div key={item.id} className="flex items-center gap-3 p-4 hover:bg-secondary/40 transition-colors">
                <Link to={`/admin/content/${typePath}/${item.id}`} className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">/{typePath}/{item.slug}</p>
                </Link>
                {type === 'case_study' && (
                  <span className="hidden sm:inline text-[10px] tracking-wide px-2 py-1 rounded-full border border-border text-muted-foreground shrink-0">
                    {projectKind(item.body_json) === 'other' ? 'Other project' : 'Full case study'}
                  </span>
                )}
                <span className="hidden sm:inline text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-secondary text-muted-foreground shrink-0">
                  {item.status}
                </span>
                <LiveSwitch
                  title={item.title}
                  on={isLiveItem(item) || (item.status === 'scheduled' && !isSwitchedOff(item))}
                  busy={busyId === item.id}
                  disabled={!canPublish(access)}
                  onChange={on => toggle(item, on)}
                />
                {isLiveItem(item) && (
                  <IconTooltip label="View live" side="left">
                    <a href={type === 'case_study' ? `/en/projects/${item.slug}` : `/en/explore/${typePath}/${item.slug}`} target="_blank" rel="noopener noreferrer" aria-label="View live" className="p-2 rounded-lg text-muted-foreground hover:text-foreground">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </IconTooltip>
                )}
                {editable && (
                  <IconTooltip label="Delete" side="left">
                    <button
                      aria-label="Delete"
                      onClick={() => { if (confirm(`Delete "${item.title}"?`)) remove.mutate(item.id); }}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </IconTooltip>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContentList;
