import { Link } from 'react-router-dom'
import type { Poem } from '@/data/poetryStore'
import { useThemeStore } from '@/store/useThemeStore'

interface PoemCardProps {
  poem: Poem
  size?: 'sm' | 'md' | 'lg'
}

export default function PoemCard({ poem, size = 'md' }: PoemCardProps) {
  const { currentTheme } = useThemeStore()
  const firstLine = poem.content.split(/[。\n]/)[0] || ''
  const secondLine = poem.content.split(/[。\n]/)[1] || ''
  const sizeClasses = { sm: 'p-3', md: 'p-4', lg: 'p-6' }

  // Tech theme: code block style with line numbers
  if (currentTheme === 'tech') {
    return (
      <Link to={`/poem/${poem.id}`} className={`block card ${sizeClasses[size]} group transition-all relative overflow-hidden`}>
        <div className="flex items-center gap-2 mb-2 font-mono">
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--accent)', color: 'var(--text-on-header)' }}>
            {poem.dynasty}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            // {poem.author}
          </span>
        </div>
        <h3 className="text-base font-bold font-mono mb-2 group-hover:opacity-80 transition-opacity"
          style={{ color: 'var(--text-primary)' }}>
          {poem.title}
        </h3>
        <div className="space-y-1">
          <div className="poem-line text-sm font-mono" data-line="01" style={{ color: 'var(--text-secondary)' }}>
            {firstLine}
          </div>
          {secondLine && (
            <div className="poem-line text-sm font-mono" data-line="02" style={{ color: 'var(--text-secondary)' }}>
              {secondLine}
            </div>
          )}
        </div>
        {poem.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 font-mono">
            {poem.tags.slice(0, 3).map(tag => (
              <span key={tag} className="theme-tag text-[10px]">.{tag}</span>
            ))}
          </div>
        )}
      </Link>
    )
  }

  // AI theme: glassmorphism bubble
  if (currentTheme === 'ai') {
    return (
      <Link to={`/poem/${poem.id}`} className="block card p-5 group transition-all relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-glow))' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-3 py-1 rounded-full theme-tag">{poem.dynasty}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{poem.author}</span>
          </div>
          <h3 className="text-lg font-bold mb-2 group-hover:opacity-80 transition-opacity"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            {poem.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-poem)' }}>
            {firstLine}{secondLine && `，${secondLine}`}
          </p>
          {poem.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {poem.tags.slice(0, 3).map(tag => (
                <span key={tag} className="theme-tag text-xs">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </Link>
    )
  }

  // Stock theme: data panel style
  if (currentTheme === 'stock') {
    return (
      <Link to={`/poem/${poem.id}`} className="block card p-4 group transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
              {poem.title}
            </span>
          </div>
          <span className="theme-tag-up text-[10px] font-mono">{poem.dynasty}</span>
        </div>
        <div className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>
          {poem.author} · {poem.form || '古体'}
        </div>
        <div className="border-t pt-2 mt-1" style={{ borderColor: 'var(--border)' }}>
          <div className="poem-line text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
            {firstLine}
          </div>
          {secondLine && (
            <div className="poem-line text-sm font-mono mt-1" style={{ color: 'var(--text-secondary)' }}>
              {secondLine}
            </div>
          )}
        </div>
        {poem.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 font-mono">
            {poem.tags.slice(0, 3).map(tag => (
              <span key={tag} className="theme-tag-down text-[10px]">#{tag}</span>
            ))}
          </div>
        )}
      </Link>
    )
  }

  // Ink theme: extreme minimalism
  if (currentTheme === 'ink') {
    return (
      <Link to={`/poem/${poem.id}`} className="block card py-5 px-2 group transition-all">
        <div className="text-xs tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          {poem.dynasty} · {poem.author}
        </div>
        <h3 className="text-lg font-light tracking-wider mb-3 group-hover:opacity-70 transition-opacity"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
          {poem.title}
        </h3>
        <p className="text-sm leading-loose" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-poem)' }}>
          {firstLine}{secondLine && `，${secondLine}`}
        </p>
        {poem.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {poem.tags.slice(0, 3).map(tag => (
              <span key={tag} className="theme-tag text-xs">{tag}</span>
            ))}
          </div>
        )}
      </Link>
    )
  }

  // Classical (default): traditional scroll style
  return (
    <Link to={`/poem/${poem.id}`} className={`block card ${sizeClasses[size]} group transition-all`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-base font-semibold group-hover:opacity-80 transition-opacity"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
          {poem.title}
        </h3>
        <span className="shrink-0 text-xs px-2 py-0.5 rounded theme-tag">{poem.dynasty}</span>
      </div>
      <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{poem.author}</p>
      <p className={`text-sm leading-relaxed ${size === 'sm' ? 'line-clamp-2' : 'line-clamp-3'}`}
        style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-poem)' }}>
        {firstLine}{secondLine && `，${secondLine}`}
      </p>
      {poem.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {poem.tags.slice(0, 3).map(tag => (
            <span key={tag} className="theme-tag text-xs">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  )
}
