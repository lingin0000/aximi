import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { filterPoems, getDynasties, getAuthors, getThemes, getForms, getAllPoems } from '@/data/poetryStore'
import PoemCard from '@/components/PoemCard'
import { useThemeStore } from '@/store/useThemeStore'

export default function LibraryPage() {
  const [searchParams] = useSearchParams()
  const urlTheme = searchParams.get('theme') || ''
  const [dynasty, setDynasty] = useState('')
  const [author, setAuthor] = useState('')
  const [theme, setTheme] = useState(urlTheme)
  const [form, setForm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const pageSize = 12
  const { currentTheme } = useThemeStore()

  const dynasties = useMemo(() => getDynasties(), [])
  const authors = useMemo(() => getAuthors(), [])
  const themes = useMemo(() => getThemes(), [])
  const forms = useMemo(() => getForms(), [])

  useEffect(() => {
    if (urlTheme) setTheme(urlTheme)
  }, [urlTheme])

  const filteredPoems = useMemo(() => {
    const hasFilter = dynasty || author || theme || form
    if (!hasFilter) return getAllPoems()
    return filterPoems({ dynasty: dynasty || undefined, author: author || undefined, theme: theme || undefined, form: form || undefined })
  }, [dynasty, author, theme, form])

  const totalPages = Math.ceil(filteredPoems.length / pageSize)
  const pagePoems = filteredPoems.slice((page - 1) * pageSize, page * pageSize)

  function clearFilters() {
    setDynasty(''); setAuthor(''); setTheme(''); setForm(''); setPage(1)
  }

  const hasFilter = dynasty || author || theme || form
  const selectClass = "px-3 py-1.5 text-sm focus:outline-none focus:ring-1 transition-colors"
  const selectStyle = { backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }

  // Determine grid class based on theme
  const gridClass = currentTheme === 'ai' ? 'grid grid-cols-1 sm:grid-cols-2 gap-5'
    : currentTheme === 'ink' ? 'space-y-0'
    : currentTheme === 'stock' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {currentTheme === 'tech' ? (
          <div className="flex items-center gap-3">
            <h1 className="section-title text-sm" style={{ color: 'var(--text-primary)' }}>POETRY_DB</h1>
            <span className="text-[10px] font-mono px-2 py-0.5" style={{ background: 'var(--bg-tag)', color: 'var(--accent)' }}>
              {filteredPoems.length} records
            </span>
          </div>
        ) : currentTheme === 'ai' ? (
          <div className="flex items-center gap-3">
            <h1 className="section-title text-2xl font-bold">诗库</h1>
            <span className="text-xs px-3 py-1 rounded-full theme-tag">{filteredPoems.length} 首</span>
          </div>
        ) : currentTheme === 'stock' ? (
          <div className="flex items-center gap-3">
            <h1 className="section-title text-sm" style={{ color: 'var(--text-primary)' }}>诗库总览</h1>
            <span className="text-xs font-mono theme-tag-up">{filteredPoems.length} 首</span>
          </div>
        ) : currentTheme === 'ink' ? (
          <div>
            <h1 className="text-lg font-light tracking-[4px]" style={{ color: 'var(--text-primary)' }}>诗库</h1>
            <span className="text-xs tracking-wider" style={{ color: 'var(--text-muted)' }}>{filteredPoems.length} 首</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <h1 className="section-title text-xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>诗库</h1>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>共 {filteredPoems.length} 首</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="hidden md:flex overflow-hidden" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <button onClick={() => setViewMode('grid')} className="p-1.5 transition-colors"
              style={{ backgroundColor: viewMode === 'grid' ? 'var(--accent)' : 'transparent', color: viewMode === 'grid' ? 'var(--text-on-header)' : 'var(--text-muted)' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z"/></svg>
            </button>
            <button onClick={() => setViewMode('list')} className="p-1.5 transition-colors"
              style={{ backgroundColor: viewMode === 'list' ? 'var(--accent)' : 'transparent', color: viewMode === 'list' ? 'var(--text-on-header)' : 'var(--text-muted)' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className={`flex flex-wrap gap-3 mb-6 p-4 ${currentTheme === 'ink' ? '' : 'rounded-xl'}`}
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <select value={dynasty} onChange={e => { setDynasty(e.target.value); setPage(1) }} className={selectClass} style={selectStyle}>
          <option value="">全部朝代</option>
          {dynasties.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={author} onChange={e => { setAuthor(e.target.value); setPage(1) }} className={selectClass} style={selectStyle}>
          <option value="">全部作者</option>
          {authors.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={form} onChange={e => { setForm(e.target.value); setPage(1) }} className={selectClass} style={selectStyle}>
          <option value="">全部体裁</option>
          {forms.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        {hasFilter && (
          <button onClick={clearFilters} className="text-xs px-2 hover:underline" style={{ color: 'var(--accent)' }}>
            清除筛选
          </button>
        )}
      </div>

      {/* Theme tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => { setTheme(''); setPage(1) }}
          className={`px-3 py-1 text-xs transition-colors ${currentTheme === 'ai' ? 'rounded-full' : currentTheme === 'ink' ? '' : 'rounded-full'}`}
          style={{ backgroundColor: !theme ? 'var(--accent)' : 'var(--bg-tag)', color: !theme ? 'var(--text-on-header)' : 'var(--text-secondary)' }}>
          全部
        </button>
        {themes.map(t => (
          <button key={t} onClick={() => { setTheme(theme === t ? '' : t); setPage(1) }}
            className={`px-3 py-1 text-xs transition-colors ${currentTheme === 'ai' ? 'rounded-full' : currentTheme === 'ink' ? '' : 'rounded-full'}`}
            style={{ backgroundColor: theme === t ? 'var(--accent)' : 'var(--bg-tag)', color: theme === t ? 'var(--text-on-header)' : 'var(--text-secondary)' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Poem list */}
      {pagePoems.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
          <p>没有找到符合条件的诗词</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className={gridClass}>
          {pagePoems.map(poem => <PoemCard key={poem.id} poem={poem} />)}
        </div>
      ) : (
        <div className={currentTheme === 'ink' ? 'space-y-0' : 'space-y-2'}>
          {pagePoems.map(poem => <PoemCard key={poem.id} poem={poem} size="sm" />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 text-sm disabled:opacity-40 transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius)' }}>
            {currentTheme === 'tech' ? '← prev' : '上一页'}
          </button>
          <span className={`text-sm ${currentTheme === 'tech' || currentTheme === 'stock' ? 'font-mono' : ''}`} style={{ color: 'var(--text-muted)' }}>
            {currentTheme === 'tech' ? `${page}/${totalPages}` : `${page} / ${totalPages}`}
          </span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-sm disabled:opacity-40 transition-colors"
            style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius)' }}>
            {currentTheme === 'tech' ? 'next →' : '下一页'}
          </button>
        </div>
      )}
    </div>
  )
}
