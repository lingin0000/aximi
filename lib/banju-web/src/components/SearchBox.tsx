import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchPoems, type SearchResult } from '@/data/poetryStore'

const placeholders = [
  '只记得一半？',
  '试试输入半句诗...',
  '拼音首字母也行',
  '例如 "c q m y g"',
]

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % placeholders.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (query.trim().length >= 1) {
      const results = searchPoems(query).slice(0, 5)
      setSuggestions(results)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      setShowSuggestions(false)
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  function handleSuggestionClick(poemId: number) {
    setShowSuggestions(false)
    setQuery('')
    navigate(`/poem/${poemId}`)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={placeholders[placeholderIdx]}
            className="w-full pl-12 pr-24 py-4 text-base transition-colors focus:outline-none search-box"
            style={{
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--text-on-header)',
              borderRadius: 'calc(var(--radius) - 2px)',
            }}
          >
            搜诗
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 overflow-hidden z-50"
          style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
          {suggestions.map(({ poem, matchedLine }) => (
            <button
              key={poem.id}
              onClick={() => handleSuggestionClick(poem.id)}
              className="w-full text-left px-4 py-3 transition-colors"
              style={{ borderBottom: '1px solid var(--border)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div className="flex items-center justify-between">
                <span className="text-base" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{poem.title}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{poem.author} · {poem.dynasty}</span>
              </div>
              {matchedLine && (
                <div className="text-sm mt-0.5 truncate" style={{ color: 'var(--accent)' }}>
                  ...{matchedLine}...
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
