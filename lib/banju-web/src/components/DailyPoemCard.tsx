import { Link } from 'react-router-dom'
import type { Poem } from '@/data/poetryStore'
import { useThemeStore } from '@/store/useThemeStore'

interface DailyPoemCardProps {
  poem: Poem
}

export default function DailyPoemCard({ poem }: DailyPoemCardProps) {
  const { currentTheme } = useThemeStore()
  const lines = poem.content.split('\n')

  // Tech theme: terminal window style
  if (currentTheme === 'tech') {
    return (
      <Link to={`/poem/${poem.id}`} className="block group">
        <div className="rounded overflow-hidden transition-all" style={{ border: '1px solid rgba(0,212,255,0.2)', background: 'var(--bg-card)' }}>
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-2" style={{ background: 'var(--accent)', borderBottom: '1px solid rgba(0,212,255,0.2)' }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
            </div>
            <span className="text-white/80 text-xs font-mono ml-2">poem_viewer.sh</span>
          </div>
          <div className="p-5 font-mono">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5" style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--accent)' }}>
                {poem.dynasty}::{poem.author}
              </span>
            </div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {poem.title}
            </h2>
            <div className="space-y-1.5">
              {lines.slice(0, 4).map((line, i) => (
                <div key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'rgba(0,212,255,0.4)' }} className="w-5 text-right text-xs leading-6">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-mono">{line}</span>
                </div>
              ))}
              {lines.length > 4 && <div className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>// 更多内容...</div>}
            </div>
            <div className="mt-4 pt-3 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--accent)' }}>→</span> 点击运行查看完整诗篇
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // AI theme: glassmorphism card with floating glow
  if (currentTheme === 'ai') {
    return (
      <Link to={`/poem/${poem.id}`} className="block group">
        <div className="relative rounded-3xl p-6 overflow-hidden transition-all ai-glow"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(236,72,153,0.08))', border: '1px solid rgba(139,92,246,0.15)' }}>
          {/* Decorative orbs */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent)' }} />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.1), transparent)' }} />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-4 py-1.5 rounded-full font-medium"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', color: '#fff' }}>
                ✦ 每日一诗
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-1 group-hover:opacity-80 transition-opacity"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              {poem.title}
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{poem.author} · {poem.dynasty}</p>
            <div className="space-y-2.5 mb-4">
              {lines.slice(0, 4).map((line, i) => (
                <p key={i} className="text-base leading-relaxed" style={{ fontFamily: 'var(--font-poem)', color: 'var(--text-secondary)' }}>
                  {line}
                </p>
              ))}
              {lines.length > 4 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>......</p>}
            </div>
            <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>阅读全文 →</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Stock theme: dashboard widget style
  if (currentTheme === 'stock') {
    return (
      <Link to={`/poem/${poem.id}`} className="block group">
        <div className="rounded-md overflow-hidden transition-all"
          style={{ border: '1px solid rgba(0,212,170,0.15)', borderTop: '3px solid var(--accent)', background: 'var(--bg-card)' }}>
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold" style={{ color: 'var(--accent)' }}>▶ 每日精选</span>
            </div>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('zh-CN')}</span>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{poem.title}</span>
              <span className="text-xs font-mono px-2 py-0.5 theme-tag-up">{poem.dynasty}</span>
            </div>
            <div className="text-xs font-mono mb-3" style={{ color: 'var(--text-muted)' }}>
              {poem.author} | {poem.form || '古体'}
            </div>
            <div className="space-y-1.5">
              {lines.slice(0, 4).map((line, i) => (
                <div key={i} className="poem-line font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {line}
                </div>
              ))}
              {lines.length > 4 && <div className="text-xs font-mono mt-2" style={{ color: 'var(--text-muted)' }}>...</div>}
            </div>
            {/* Metric boxes */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="metric-box">
                <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>行数</div>
                <div className="text-lg font-mono font-bold" style={{ color: 'var(--accent)' }}>{lines.length}</div>
              </div>
              <div className="metric-box">
                <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>标签</div>
                <div className="text-lg font-mono font-bold" style={{ color: 'var(--accent)' }}>{poem.tags.length}</div>
              </div>
              <div className="metric-box">
                <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>热度</div>
                <div className="text-lg font-mono font-bold stock-up">98.6</div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Ink theme: scroll / extreme whitespace
  if (currentTheme === 'ink') {
    return (
      <Link to={`/poem/${poem.id}`} className="block group">
        <div className="py-8 px-4 transition-all">
          <div className="text-xs tracking-[6px] mb-6" style={{ color: 'var(--text-muted)' }}>
            每日 · 一诗
          </div>
          <h2 className="text-2xl font-light tracking-[4px] mb-2 group-hover:opacity-70 transition-opacity"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            {poem.title}
          </h2>
          <div className="text-xs tracking-widest mb-8" style={{ color: 'var(--text-muted)' }}>
            {poem.author} · {poem.dynasty}
          </div>
          
          <div className="space-y-6 mb-6">
            {lines.slice(0, 4).map((line, i) => (
              <p key={i} className="text-lg leading-loose tracking-wider" style={{ fontFamily: 'var(--font-poem)', color: 'var(--text-secondary)' }}>
                {line}
              </p>
            ))}
            {lines.length > 4 && (
              <div className="flex items-center gap-2 mt-4">
                <div className="w-8 h-px" style={{ background: 'var(--border)' }} />
                <span className="text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>余下省略</span>
              </div>
            )}
          </div>

          {/* Ink seal decoration */}
          <div className="flex items-center justify-end pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="ink-seal">诗</div>
          </div>
        </div>
      </Link>
    )
  }

  // Classical (default): warm gradient banner
  return (
    <Link to={`/poem/${poem.id}`} className="block group">
      <div className="relative rounded-xl p-6 md:p-8 text-white overflow-hidden transition-all"
        style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light), var(--bg-header))' }}>
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: 'var(--accent-glow)', opacity: 0.1 }} />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-1/2 -translate-x-1/2 bg-white/5" />

        <div className="flex items-center gap-2 mb-4 relative z-10">
          <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            每日一诗
          </span>
          <span className="text-white/60 text-xs">{new Date().toLocaleDateString('zh-CN')}</span>
        </div>

        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl mb-1 group-hover:opacity-80 transition-opacity" style={{ fontFamily: 'var(--font-heading)' }}>
            {poem.title}
          </h2>
          <p className="text-white/60 text-sm mb-4">{poem.author} · {poem.dynasty}</p>

          <div className="space-y-2 mb-4">
            {lines.slice(0, 4).map((line, i) => (
              <p key={i} className="text-base md:text-lg text-white/90 leading-relaxed" style={{ fontFamily: 'var(--font-poem)' }}>
                {line}
              </p>
            ))}
            {lines.length > 4 && <p className="text-white/40 text-sm">......</p>}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-white/50 text-xs">点击阅读全文</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
