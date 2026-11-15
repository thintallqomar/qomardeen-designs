import { Sun, Moon, Clock, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme, type ThemePreference } from '@/hooks/useTheme';

/**
 * Theme control. "Automatic" follows the time of day (light 06:00–18:00, dark 18:00–06:00);
 * choosing Light or Dark overrides it at any time and is remembered until changed.
 */
const ThemeMenu = ({ size = 'md' }: { size?: 'sm' | 'md' }) => {
  const { t } = useTranslation();
  const { theme, preference, setPreference } = useTheme();

  const options: { value: ThemePreference; label: string; hint?: string; icon: JSX.Element }[] = [
    { value: 'auto', label: t('theme.auto'), hint: t('theme.autoHint'), icon: <Clock className="w-4 h-4" /> },
    { value: 'light', label: t('theme.light'), icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: t('theme.dark'), icon: <Moon className="w-4 h-4" /> },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t('theme.label')}
          title={t('theme.label')}
          className={`${size === 'sm' ? 'h-9 w-9' : 'h-10 w-10'} inline-flex items-center justify-center rounded-lg bg-secondary/50 hover:bg-secondary text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
        >
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[15rem] z-[70]">
        {options.map(o => (
          <DropdownMenuItem key={o.value} onSelect={() => setPreference(o.value)} className="flex items-center gap-3 py-2.5 cursor-pointer">
            {o.icon}
            <span className="flex-1">
              <span className="block text-sm font-medium">{o.label}</span>
              {o.hint && <span className="block text-xs text-muted-foreground">{o.hint}</span>}
            </span>
            {preference === o.value && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeMenu;
