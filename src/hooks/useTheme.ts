import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';
export type ThemePreference = 'auto' | 'light' | 'dark';

const KEY = 'theme-preference';
/** In automatic mode the site is light from 06:00 until 18:00 and dark from 18:00 until 06:00 (the visitor's own clock). */
export const LIGHT_FROM_HOUR = 6;
export const LIGHT_UNTIL_HOUR = 18;

export const themeForTime = (date: Date = new Date()): Theme => {
  const hour = date.getHours();
  return hour >= LIGHT_FROM_HOUR && hour < LIGHT_UNTIL_HOUR ? 'light' : 'dark';
};

const readPreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === 'light' || stored === 'dark' || stored === 'auto' ? stored : 'auto';
  } catch {
    return 'auto';
  }
};

const resolve = (pref: ThemePreference): Theme => (pref === 'auto' ? themeForTime() : pref);

/** Puts the theme on the page (the site marks light mode with a `light` class on <html>). */
const applyToPage = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.toggle('light', theme === 'light');
  // keep the phone's browser bar in step with the page
  const bg = getComputedStyle(root).getPropertyValue('--background').trim();
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && bg) meta.setAttribute('content', `hsl(${bg})`);
};

/* One shared store, so every theme control on the page (menu, admin) stays in step. */
let preference: ThemePreference = 'auto';
let effective: Theme = 'dark';
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

const refresh = () => {
  const next = resolve(preference);
  if (next !== effective) {
    effective = next;
    applyToPage(effective);
    emit();
  }
};

if (typeof window !== 'undefined') {
  preference = readPreference();
  effective = resolve(preference);
  try { localStorage.removeItem('theme'); } catch { /* old key from the previous version */ }
  applyToPage(effective);
  // In automatic mode, flip at 06:00 / 18:00 even if the page stays open.
  window.setInterval(() => { if (preference === 'auto') refresh(); }, 30_000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && preference === 'auto') refresh(); });
  window.addEventListener('storage', e => {
    if (e.key === KEY) { preference = readPreference(); refresh(); emit(); }
  });
}

export const setThemePreference = (next: ThemePreference) => {
  preference = next;
  try { localStorage.setItem(KEY, next); } catch { /* private mode: still works for this visit */ }
  effective = resolve(next);
  applyToPage(effective);
  emit();
};

const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

export const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, () => effective, () => 'dark' as Theme);
  const pref = useSyncExternalStore(subscribe, () => preference, () => 'auto' as ThemePreference);
  return {
    theme,
    preference: pref,
    setPreference: setThemePreference,
    /** Switch to the other theme and keep that choice until it is changed again. */
    toggleTheme: () => setThemePreference(effective === 'dark' ? 'light' : 'dark'),
  };
};
