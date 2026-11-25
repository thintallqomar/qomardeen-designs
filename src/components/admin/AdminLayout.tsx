import { useEffect, useCallback, useState } from 'react';
import { NavLink, useNavigate, Navigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useStaffAuth } from '@/hooks/useStaffAuth';
import { useTheme } from '@/hooks/useTheme';
import {
  LayoutDashboard, FileText, Lightbulb, Boxes, Download, BarChart3, LogOut, ArrowLeft, Images, Sun, Moon, Briefcase, MessageSquare, Inbox, SlidersHorizontal, UserRound, ShieldCheck, ShieldAlert, Menu,
} from 'lucide-react';
import IconTooltip from '@/components/IconTooltip';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';

const links = [
  { to: '/admin', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { to: '/admin/content/case-studies', label: 'Case Studies', icon: Briefcase },
  { to: '/admin/content/articles', label: 'Articles', icon: FileText },
  { to: '/admin/content/thinking', label: 'Thinking', icon: Lightbulb },
  { to: '/admin/content/architecture', label: 'Architecture', icon: Boxes },
  { to: '/admin/content/resources', label: 'Resources', icon: Download },
  { to: '/admin/media', label: 'Media', icon: Images },
  { to: '/admin/about', label: 'About page', icon: UserRound },
  { to: '/admin/site', label: 'Site', icon: SlidersHorizontal },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/atlas', label: 'Atlas Memory', icon: MessageSquare },
  { to: '/admin/security', label: 'Security', icon: ShieldCheck },
];

/** Sign out automatically after this much inactivity. */
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { loading, isStaff, needsMfa, mfaEnabled, email, roles } = useStaffAuth();
  const { pathname } = useLocation();
  // Phones: the menu lives behind a button at the top right, and closes after you pick a page.
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  const isCurrent = (to: string, end?: boolean) => (end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`));
  const current = links.find(l => isCurrent(l.to, l.end));
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

  if (needsMfa) return <Navigate to={`/admin/login?next=${encodeURIComponent(pathname)}`} replace />;
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

      <main className="flex-1 min-w-0 overflow-x-hidden">
        {/* Phone top bar: where you are, and the menu button */}
        <div className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-2 pt-[calc(0.5rem+env(safe-area-inset-top))] backdrop-blur">
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight">Studio</p>
            <p className="truncate text-xs text-muted-foreground">{current?.label ?? 'Admin'}</p>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="grid h-11 w-11 place-items-center rounded-xl text-foreground hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent side="right" className="md:hidden flex w-[min(20rem,85vw)] flex-col gap-0 p-0">
            <div className="px-5 pt-[calc(1.25rem+env(safe-area-inset-top))] pb-4 pr-12 border-b border-border">
              <SheetTitle className="text-base">Studio</SheetTitle>
              <SheetDescription className="truncate text-xs">{email}</SheetDescription>
              <p className="text-[10px] uppercase tracking-wider text-primary mt-1">{roles.join(' · ') || 'staff'}</p>
            </div>
            <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
              {links.map(({ to, label, icon: Icon, end }) => {
                const on = isCurrent(to, end);
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={`flex min-h-10 items-center gap-3 rounded-xl px-3 text-[15px] transition-colors ${on ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/80 hover:bg-secondary'}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </NavLink>
                );
              })}
            </nav>
            <div className="border-t border-border px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] space-y-0.5">
              <button onClick={toggleTheme} className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-[15px] text-foreground/80 hover:bg-secondary">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
              <button onClick={() => navigate('/')} className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-[15px] text-foreground/80 hover:bg-secondary">
                <ArrowLeft className="h-4 w-4" /> Back to site
              </button>
              <button onClick={signOut} className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-[15px] text-foreground/80 hover:bg-secondary">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </SheetContent>
        </Sheet>
        {!mfaEnabled && pathname !== '/admin/security' && (
          <Link
            to="/admin/security"
            className="flex items-center gap-2 px-4 md:px-10 py-2.5 border-b border-border bg-amber-500/10 text-sm text-amber-700 dark:text-amber-300 hover:bg-amber-500/15 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Two-step sign-in is off. Turn it on so a stolen password can't open your studio.</span>
          </Link>
        )}
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
