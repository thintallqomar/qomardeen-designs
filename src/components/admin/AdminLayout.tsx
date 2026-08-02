import { NavLink, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useStaffAuth } from '@/hooks/useStaffAuth';
import {
  LayoutDashboard, FileText, Lightbulb, Boxes, Download, BarChart3, LogOut, ArrowLeft,
} from 'lucide-react';
import IconTooltip from '@/components/IconTooltip';

const links = [
  { to: '/admin', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/content/articles', label: 'Articles', icon: FileText },
  { to: '/admin/content/thinking', label: 'Thinking', icon: Lightbulb },
  { to: '/admin/content/architecture', label: 'Architecture', icon: Boxes },
  { to: '/admin/content/resources', label: 'Resources', icon: Download },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { loading, isStaff, email, roles } = useStaffAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isStaff) return <Navigate to="/admin/login" replace />;

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border p-4 sticky top-0 h-screen">
        <div className="px-2 py-3">
          <p className="text-sm font-bold">Studio</p>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
          <p className="text-[10px] uppercase tracking-wider text-primary mt-1">{roles.join(' · ') || 'staff'}</p>
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur flex justify-around py-2">
        {links.map(({ to, label, icon: Icon, end }) => (
          <IconTooltip key={to} label={label} side="top">
            <NavLink to={to} end={end} aria-label={label} className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              <Icon className="w-5 h-5" />
            </NavLink>
          </IconTooltip>
        ))}
        <IconTooltip label="Sign out" side="top">
          <button onClick={signOut} aria-label="Sign out" className="p-2 rounded-lg text-muted-foreground"><LogOut className="w-5 h-5" /></button>
        </IconTooltip>
      </div>

      <main className="flex-1 min-w-0 pb-20 md:pb-0">{children}</main>
    </div>
  );
};

export default AdminLayout;
