import { useEffect, useCallback } from 'react';
import { NavLink, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useStaffAuth } from '@/hooks/useStaffAuth';
import { useTheme } from '@/hooks/useTheme';
import {
  LayoutDashboard, FileText, Lightbulb, Boxes, Download, BarChart3, LogOut, ArrowLeft, Images, Sun, Moon, Briefcase, MessageSquare, Inbox,
} from 'lucide-react';
import IconTooltip from '@/components/IconTooltip';

const links = [
  { to: '/admin', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { to: '/admin/content/case-studies', label: 'Case Studies', icon: Briefcase },
  { to: '/admin/content/articles', label: 'Articles', icon: FileText },
  { to: '/admin/content/thinking', label: 'Thinking', icon: Lightbulb },
  { to: '/admin/content/architecture', label: 'Architecture', icon: Boxes },
  { to: '/admin/content/resources', label: 'Resources', icon: Download },
  { to: '/admin/media', label: 'Media', icon: Images },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/atlas', label: 'Atlas Memory', icon: MessageSquare },
];

/** Sign out automatically after this much inactivity. */
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { loading, isStaff, email, roles } = useStaffAuth();
  const { theme, toggleTheme } = useTheme();

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }, [navigate]);

  // Idle session expiry — protects an unattended admin session.
  useEffect(() => {
    if (!isStaff) return;
    let timer: number;
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => { void signOut(); }, IDLE_TIMEOUT_MS);
    };
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      window.clearTimeout(timer);
      events.forEach(e => window.removeEventListener(e, reset));
    };
  }, [isStaff, signOut]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isStaff) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border p-4 sticky top-0 h-screen">
        <div className="px-2 py-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-bold">Studio</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
            <p className="text-[10px] uppercase tracking-wider text-primary mt-1">{roles.join(' · ') || 'staff'}</p>
          </div>
          <IconTooltip label={theme === 'dark' ? 'Light mode' : 'Dark mode'} side="right">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </IconTooltip>
        </div>
        <nav className="mt-4 space-y-1 flex-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                  isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-1">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to site
          </button>
          <button onClick={signOut} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile rail */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur flex justify-around py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] overflow-x-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <IconTooltip key={to} label={label} side="top">
            <NavLink to={to} end={end} aria-label={label} className={({ isActive }) => `min-w-11 min-h-11 flex items-center justify-center rounded-lg ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              <Icon className="w-5 h-5" />
            </NavLink>
          </IconTooltip>
        ))}
        <IconTooltip label={theme === 'dark' ? 'Light mode' : 'Dark mode'} side="top">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="min-w-11 min-h-11 flex items-center justify-center rounded-lg text-muted-foreground">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </IconTooltip>
        <IconTooltip label="Sign out" side="top">
          <button onClick={signOut} aria-label="Sign out" className="min-w-11 min-h-11 flex items-center justify-center rounded-lg text-muted-foreground"><LogOut className="w-5 h-5" /></button>
        </IconTooltip>
      </div>

      <main className="flex-1 min-w-0 overflow-x-hidden pb-24 md:pb-0">{children}</main>
    </div>
  );
};

export default AdminLayout;
