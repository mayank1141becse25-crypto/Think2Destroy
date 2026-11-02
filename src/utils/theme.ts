export type ThemeMode = 'emerald' | 'midnight' | 'ocean' | 'solar';

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  tagline: string;
  icon: string; // Emoji
  previewColor: string; // Hex for preview pill
  badgeColor: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'emerald',
    name: 'Lush Emerald',
    tagline: 'Classic Circular Economy (Green, Beige & Frost)',
    icon: '🌿',
    previewColor: '#10b981',
    badgeColor: 'bg-emerald-500 text-white',
  },
  {
    id: 'midnight',
    name: 'Midnight Cyber',
    tagline: 'Dark Glassmorphic Mode with Neon Accents',
    icon: '🌙',
    previewColor: '#0f172a',
    badgeColor: 'bg-indigo-600 text-white',
  },
  {
    id: 'ocean',
    name: 'Ocean Waters',
    tagline: 'Aquamarine, Cyan & Deep Marine Cleanliness',
    icon: '🌊',
    previewColor: '#06b6d4',
    badgeColor: 'bg-cyan-600 text-white',
  },
  {
    id: 'solar',
    name: 'Earth & Solar',
    tagline: 'Warm Terracotta, Harvest Gold & Amber Glow',
    icon: '☀️',
    previewColor: '#f59e0b',
    badgeColor: 'bg-amber-600 text-white',
  },
];

const THEME_STORAGE_KEY = 'w2w_active_theme_v1';

export const ThemeService = {
  getTheme(): ThemeMode {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
      if (saved && ['emerald', 'midnight', 'ocean', 'solar'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'emerald';
  },

  setTheme(theme: ThemeMode): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
    // Update root class
    const root = document.documentElement;
    root.classList.remove('theme-emerald', 'theme-midnight', 'theme-ocean', 'theme-solar', 'dark');
    root.classList.add(`theme-${theme}`);
    if (theme === 'midnight') {
      root.classList.add('dark');
    }
  },

  applyInitialTheme(): ThemeMode {
    const current = this.getTheme();
    this.setTheme(current);
    return current;
  },
};
