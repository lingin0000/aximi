import { create } from 'zustand';

export type ThemeId = 'classical' | 'tech' | 'ai' | 'stock' | 'ink';

interface ThemeColors {
  bg: string;
  bgCard: string;
  bgHeader: string;
  bgInput: string;
  bgHover: string;
  bgTag: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnHeader: string;
  accent: string;
  accentLight: string;
  accentGlow: string;
  border: string;
  shadow: string;
}

const themeColors: Record<ThemeId, ThemeColors> = {
  classical: {
    bg: '#FDF8F0', bgCard: '#FFFFFF', bgHeader: '#2C5F2D', bgInput: '#FFFFFF',
    bgHover: '#F5EDE0', bgTag: 'rgba(44,95,45,0.08)',
    textPrimary: '#2D3748', textSecondary: '#4A5568', textMuted: '#A0AEC0',
    textOnHeader: '#FFFFFF',
    accent: '#2C5F2D', accentLight: '#3D7A3E', accentGlow: '#D4AF37',
    border: '#F5EDE0', shadow: 'rgba(0,0,0,0.06)',
  },
  tech: {
    bg: '#0D1117', bgCard: '#161B22', bgHeader: '#010409', bgInput: '#0D1117',
    bgHover: '#1C2128', bgTag: 'rgba(0,212,255,0.1)',
    textPrimary: '#E6EDF3', textSecondary: '#8B949E', textMuted: '#484F58',
    textOnHeader: '#E6EDF3',
    accent: '#00D4FF', accentLight: '#58A6FF', accentGlow: '#F78166',
    border: '#30363D', shadow: 'rgba(0,212,255,0.08)',
  },
  ai: {
    bg: '#0F0B1A', bgCard: '#1A1530', bgHeader: '#0A0714', bgInput: '#1A1530',
    bgHover: '#241E3E', bgTag: 'rgba(139,92,246,0.12)',
    textPrimary: '#E8E0F5', textSecondary: '#9B8DC2', textMuted: '#5B4F80',
    textOnHeader: '#E8E0F5',
    accent: '#8B5CF6', accentLight: '#A78BFA', accentGlow: '#EC4899',
    border: '#2D2550', shadow: 'rgba(139,92,246,0.1)',
  },
  stock: {
    bg: '#F8F9FA', bgCard: '#FFFFFF', bgHeader: '#1B2838', bgInput: '#FFFFFF',
    bgHover: '#F0F2F5', bgTag: 'rgba(220,38,38,0.06)',
    textPrimary: '#1F2937', textSecondary: '#6B7280', textMuted: '#9CA3AF',
    textOnHeader: '#F9FAFB',
    accent: '#DC2626', accentLight: '#EF4444', accentGlow: '#16A34A',
    border: '#E5E7EB', shadow: 'rgba(0,0,0,0.08)',
  },
  ink: {
    bg: '#FAFAF8', bgCard: '#FFFFFF', bgHeader: '#1A1A1A', bgInput: '#FFFFFF',
    bgHover: '#F3F3F0', bgTag: 'rgba(0,0,0,0.04)',
    textPrimary: '#1A1A1A', textSecondary: '#666666', textMuted: '#AAAAAA',
    textOnHeader: '#FAFAF8',
    accent: '#333333', accentLight: '#555555', accentGlow: '#888888',
    border: '#E8E8E5', shadow: 'rgba(0,0,0,0.04)',
  },
};

interface ThemeStore {
  current: ThemeId;
  colors: ThemeColors;
  setTheme: (id: ThemeId) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  current: 'classical',
  colors: themeColors.classical,
  setTheme: (id) => set({ current: id, colors: themeColors[id] }),
}));
