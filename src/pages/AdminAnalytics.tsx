import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, Eye, Globe, MousePointerClick, LogOut, ArrowLeft, Users, TrendingUp, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

interface VisitorEvent {
  id: string;
  event_type: string;
  page_path: string;
  referrer: string | null;
  created_at: string;
  session_id: string;
}

const COLORS = [
  'hsl(185, 84%, 55%)', 'hsl(185, 84%, 35%)', 'hsl(185, 84%, 75%)',
  'hsl(220, 70%, 50%)', 'hsl(280, 60%, 50%)', 'hsl(340, 70%, 50%)',
];

const StatCard = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) => (
  <div className="card-elegant p-5">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{label}</span>
    </div>
    <p className="text-2xl font-bold">{value}</p>
    {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
  </div>
);

const AdminAnalytics = () => {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<VisitorEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'7d' | '30d' | 'all'>('7d');

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchEvents = async () => {
      setLoading(true);
      let query = supabase.from('visitor_events').select('*').order('created_at', { ascending: false });

      if (range !== 'all') {
        const days = range === '7d' ? 7 : 30;
        const since = new Date(Date.now() - days * 86400000).toISOString();
        query = query.gte('created_at', since);
      }

      const { data, error } = await query.limit(1000);
      if (error) {
        toast.error('Failed to load analytics');
        console.error(error);
      }
      setEvents((data as VisitorEvent[]) || []);
      setLoading(false);
    };
    fetchEvents();
  }, [isAdmin, range]);

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Derived stats
  const pageViews = events.filter(e => e.event_type === 'page_view');
  const uniqueSessions = new Set(events.map(e => e.session_id)).size;
  const ctaClicks = events.filter(e => e.event_type === 'cta_click');

  // Top pages
  const pageCounts: Record<string, number> = {};
  pageViews.forEach(e => { pageCounts[e.page_path] = (pageCounts[e.page_path] || 0) + 1; });
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([page, count]) => ({ page: page === '/' ? 'Home' : page, count }));

  // Referrers
  const refCounts: Record<string, number> = {};
  events.forEach(e => {
    if (e.referrer) {
      try {
        const host = new URL(e.referrer).hostname.replace('www.', '');
        refCounts[host] = (refCounts[host] || 0) + 1;
      } catch { /* skip */ }
    }
  });
  const topReferrers = Object.entries(refCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([source, count]) => ({ source, count }));

  // Views over time (daily)
  const dailyCounts: Record<string, number> = {};
  pageViews.forEach(e => {
    const day = e.created_at.slice(0, 10);
    dailyCounts[day] = (dailyCounts[day] || 0) + 1;
  });
  const dailyData = Object.entries(dailyCounts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, views]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views,
    }));

  // Event types breakdown
  const eventTypeCounts: Record<string, number> = {};
  events.forEach(e => { eventTypeCounts[e.event_type] = (eventTypeCounts[e.event_type] || 0) + 1; });
  const eventTypeData = Object.entries(eventTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-lg font-bold">Analytics</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
              {(['7d', '30d', 'all'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    range === r ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {r === 'all' ? 'All' : r}
                </button>
              ))}
            </div>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats row */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <StatCard icon={Eye} label="Page Views" value={pageViews.length} />
              <StatCard icon={Users} label="Sessions" value={uniqueSessions} />
              <StatCard icon={MousePointerClick} label="CTA Clicks" value={ctaClicks.length} />
              <StatCard icon={Activity} label="Total Events" value={events.length} />
            </motion.div>

            {/* Views over time */}
            <motion.div
              className="card-elegant p-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-sm">Views Over Time</h2>
              </div>
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={dailyData}>
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                    <Line type="monotone" dataKey="views" stroke="hsl(185, 84%, 55%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No data for this period</p>
              )}
            </motion.div>

            {/* Bottom row: Top pages + Referrers + Event types */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Top Pages */}
              <motion.div
                className="card-elegant p-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <Eye className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-sm">Top Pages</h2>
                </div>
                {topPages.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={topPages} layout="vertical" margin={{ left: 0 }}>
                      <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="page" type="category" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: 'hsl(var(--foreground))',
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(185, 84%, 55%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No data</p>
                )}
              </motion.div>

              {/* Referrers */}
              <motion.div
                className="card-elegant p-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <Globe className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-sm">Top Referrers</h2>
                </div>
                {topReferrers.length > 0 ? (
                  <div className="space-y-3">
                    {topReferrers.map((ref, i) => (
                      <div key={ref.source} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-sm truncate max-w-[140px]">{ref.source}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">{ref.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No referrer data</p>
                )}
              </motion.div>

              {/* Event Types */}
              <motion.div
                className="card-elegant p-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <Activity className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-sm">Event Breakdown</h2>
                </div>
                {eventTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={eventTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {eventTypeData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: 'hsl(var(--foreground))',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No data</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {eventTypeData.map((et, i) => (
                    <span key={et.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      {et.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminAnalytics;
