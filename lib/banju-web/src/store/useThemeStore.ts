import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeId = 'classical' | 'tech' | 'ai' | 'stock' | 'ink'

export interface ThemeConfig {
  id: ThemeId
  name: string
  description: string
  icon: string
  // CSS变量值
  vars: {
    '--bg': string
    '--bg-card': string
    '--bg-header': string
    '--bg-input': string
    '--bg-hover': string
    '--bg-tag': string
    '--text-primary': string
    '--text-secondary': string
    '--text-muted': string
    '--text-on-header': string
    '--accent': string
    '--accent-light': string
    '--accent-glow': string
    '--border': string
    '--shadow': string
    '--font-heading': string
    '--font-body': string
    '--font-poem': string
    '--radius': string
    '--card-style': string
  }
}

export const themes: Record<ThemeId, ThemeConfig> = {
  classical: {
    id: 'classical',
    name: '古韵',
    description: '墨绿古卷，诗意盎然',
    icon: '🏯',
    vars: {
      '--bg': '#FDF8F0',
      '--bg-card': '#FFFFFF',
      '--bg-header': '#2C5F2D',
      '--bg-input': '#FFFFFF',
      '--bg-hover': '#F5EDE0',
      '--bg-tag': 'rgba(44,95,45,0.08)',
      '--text-primary': '#2D3748',
      '--text-secondary': '#4A5568',
      '--text-muted': '#A0AEC0',
      '--text-on-header': '#FFFFFF',
      '--accent': '#2C5F2D',
      '--accent-light': '#3D7A3E',
      '--accent-glow': '#D4AF37',
      '--border': '#F5EDE0',
      '--shadow': '0 1px 3px rgba(0,0,0,0.06)',
      '--font-heading': '"SimSun", "Songti SC", serif',
      '--font-body': '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif',
      '--font-poem': '"KaiTi", "Kaiti SC", serif',
      '--radius': '12px',
      '--card-style': '0 1px 3px rgba(0,0,0,0.06)',
    },
  },
  tech: {
    id: 'tech',
    name: '科技',
    description: '赛博霓虹，代码律动',
    icon: '🌐',
    vars: {
      '--bg': '#0D1117',
      '--bg-card': '#161B22',
      '--bg-header': '#010409',
      '--bg-input': '#0D1117',
      '--bg-hover': '#1C2128',
      '--bg-tag': 'rgba(0,212,255,0.1)',
      '--text-primary': '#E6EDF3',
      '--text-secondary': '#8B949E',
      '--text-muted': '#484F58',
      '--text-on-header': '#E6EDF3',
      '--accent': '#00D4FF',
      '--accent-light': '#58A6FF',
      '--accent-glow': '#F78166',
      '--border': '#30363D',
      '--shadow': '0 1px 6px rgba(0,212,255,0.08)',
      '--font-heading': '"JetBrains Mono", "Fira Code", monospace',
      '--font-body': '"Inter", "Segoe UI", sans-serif',
      '--font-poem': '"JetBrains Mono", "Fira Code", monospace',
      '--radius': '6px',
      '--card-style': '0 0 12px rgba(0,212,255,0.06)',
    },
  },
  ai: {
    id: 'ai',
    name: 'AI',
    description: '神经网络，智能涌现',
    icon: '🤖',
    vars: {
      '--bg': '#0F0B1A',
      '--bg-card': '#1A1530',
      '--bg-header': '#0A0714',
      '--bg-input': '#1A1530',
      '--bg-hover': '#241E3E',
      '--bg-tag': 'rgba(139,92,246,0.12)',
      '--text-primary': '#E8E0F5',
      '--text-secondary': '#9B8DC2',
      '--text-muted': '#5B4F80',
      '--text-on-header': '#E8E0F5',
      '--accent': '#8B5CF6',
      '--accent-light': '#A78BFA',
      '--accent-glow': '#EC4899',
      '--border': '#2D2550',
      '--shadow': '0 2px 12px rgba(139,92,246,0.1)',
      '--font-heading': '"SF Pro Display", "Inter", sans-serif',
      '--font-body': '"SF Pro Text", "Inter", sans-serif',
      '--font-poem': '"SF Pro Text", "Noto Sans SC", sans-serif',
      '--radius': '16px',
      '--card-style': '0 2px 16px rgba(139,92,246,0.08)',
    },
  },
  stock: {
    id: 'stock',
    name: 'K线',
    description: '红涨绿跌，数据为王',
    icon: '📈',
    vars: {
      '--bg': '#F8F9FA',
      '--bg-card': '#FFFFFF',
      '--bg-header': '#1B2838',
      '--bg-input': '#FFFFFF',
      '--bg-hover': '#F0F2F5',
      '--bg-tag': 'rgba(220,38,38,0.06)',
      '--text-primary': '#1F2937',
      '--text-secondary': '#6B7280',
      '--text-muted': '#9CA3AF',
      '--text-on-header': '#F9FAFB',
      '--accent': '#DC2626',
      '--accent-light': '#EF4444',
      '--accent-glow': '#16A34A',
      '--border': '#E5E7EB',
      '--shadow': '0 1px 3px rgba(0,0,0,0.08)',
      '--font-heading': '"DIN", "Roboto", sans-serif',
      '--font-body': '"Roboto", "Noto Sans SC", sans-serif',
      '--font-poem': '"Noto Sans SC", sans-serif',
      '--radius': '4px',
      '--card-style': '0 1px 2px rgba(0,0,0,0.06)',
    },
  },
  ink: {
    id: 'ink',
    name: '水墨',
    description: '黑白极简，留白意境',
    icon: '🎨',
    vars: {
      '--bg': '#FAFAF8',
      '--bg-card': '#FFFFFF',
      '--bg-header': '#1A1A1A',
      '--bg-input': '#FFFFFF',
      '--bg-hover': '#F3F3F0',
      '--bg-tag': 'rgba(0,0,0,0.04)',
      '--text-primary': '#1A1A1A',
      '--text-secondary': '#666666',
      '--text-muted': '#AAAAAA',
      '--text-on-header': '#FAFAF8',
      '--accent': '#333333',
      '--accent-light': '#555555',
      '--accent-glow': '#888888',
      '--border': '#E8E8E5',
      '--shadow': '0 1px 4px rgba(0,0,0,0.04)',
      '--font-heading': '"STKaiti", "Kaiti SC", "KaiTi", serif',
      '--font-body': '"Noto Serif SC", "Songti SC", serif',
      '--font-poem': '"STKaiti", "Kaiti SC", "KaiTi", serif',
      '--radius': '2px',
      '--card-style': '0 1px 4px rgba(0,0,0,0.04)',
    },
  },
}

interface ThemeStore {
  currentTheme: ThemeId
  setTheme: (id: ThemeId) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      currentTheme: 'classical',
      setTheme: (id: ThemeId) => set({ currentTheme: id }),
    }),
    { name: 'banju-theme' }
  )
)

/** 将主题CSS变量应用到document.documentElement */
export function applyTheme(id: ThemeId) {
  const theme = themes[id]
  if (!theme) return
  const root = document.documentElement
  root.setAttribute('data-theme', id)
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}
