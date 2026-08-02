import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { fetchAllForAdmin, CONTENT_TYPES, typeToPath, type ContentItem } from '@/lib/cms';
import { FileText, Clock, CalendarClock, PenLine, Plus } from 'lucide-react';
import Icon3D from '@/components/Icon3D';

const Stat = ({ icon: Icon, label, value, variant }: any) => (
  <div className="card-elegant p-5">
    <div className="flex items-center gap-3 mb-3">
      <Icon3D variant={variant} size="sm"><Icon className="w-4 h-4" /></Icon3D>
      <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{label}</span>
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const Dashboard = () => {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cms', 'all'],
    queryFn: fetchAllForAdmin,
  });

  const published = items.filter(i => i.status === 'published').length;
  const drafts = items.filter(i => i.status === 'draft').length;
  const scheduled = items.filter(i => i.status === 'scheduled').length;
  const recent = items.slice(0, 8) as ContentItem[];

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 max-w-5xl">
        <h1 className="text-2xl font-bold mb-1">Overview</h1>
        <p className="text-sm text-muted-foreground mb-8">Everything you publish, in one place.</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Stat icon={FileText} label="Published" value={published} variant="primary" />
          <Stat icon={PenLine} label="Drafts" value={drafts} variant="violet" />
          <Stat icon={CalendarClock} label="Scheduled" value={scheduled} variant="teal" />
          <Stat icon={Clock} label="Total" value={items.length} variant="blue" />
        </div>

        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Create</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          {CONTENT_TYPES.map(t => (
            <Link
              key={t.value}
              to={`/admin/content/${t.path}/new`}
              className="card-elegant p-4 flex items-start gap-3 hover:border-primary/40 transition-colors"
            >
              <Icon3D variant="primary" size="sm"><Plus className="w-4 h-4" /></Icon3D>
              <div>
                <p className="text-sm font-medium">New {t.label.replace(/s$/, '')}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.blurb}</p>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Recent activity</h2>
        <div className="card-elegant divide-y divide-border">
          {isLoading && <p className="p-4 text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && recent.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground">No content yet — create your first piece above.</p>
          )}
          {recent.map(item => (
            <Link
              key={item.id}
              to={`/admin/content/${typeToPath(item.type)}/${item.id}`}
              className="flex items-center justify-between gap-4 p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {item.type} · updated {new Date(item.updated_at).toLocaleDateString()}
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-secondary text-muted-foreground shrink-0">
                {item.status}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
