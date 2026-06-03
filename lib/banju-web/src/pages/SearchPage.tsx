import { useSearchParams, Link } from 'react-router-dom'
import { searchPoems } from '@/data/poetryStore'
import { useThemeStore } from '@/store/useThemeStore'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const results = query ? searchPoems(query) : []
  const { currentTheme } = useThemeStore()

  const scoreLabel = (score: number) => {
    if (currentTheme === 'tech') return score >= 90 ? 'EXACT' : score >= 70 ? 'PINYIN' : 'FUZZY'
    if (currentTheme === 'stock') return score >= 90 ? '精确匹配' : score >= 70 ? '拼音匹配' : '模糊匹配'
    return score >= 90 ? '精确' : score >= 70 ? '拼音' : '模糊'
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        {currentTheme === 'tech' ? (
          <div className="font-mono">
            <h1 className="section-title text-sm" style={{ color: 'var(--text-primary)' }}>SEARCH_RESULTS</h1>
            {query && (
              <div className="text-xs mt-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                $ grep "{query}" poetry_db — {results.length} matches found
              </div>
            )}
          </div>
        ) : currentTheme === 'ai' ? (
          <div>
            <h1 className="section-title text-2xl font-bold">搜索结果</h1>
            {query && (
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                搜索 "{query}" — 找到 {results.length} 个结果
              </p>
            )}
          </div>
        ) : currentTheme === 'stock' ? (
          <div className="flex items-center gap-3">
            <h1 className="section-title text-sm" style={{ color: 'var(--text-primary)' }}>搜索查询</h1>
            {query && (
              <span className="text-xs font-mono theme-tag-up">"{query}" · {results.length}条</span>
            )}
          </div>
        ) : currentTheme === 'ink' ? (
          <div>
            <h1 className="text-lg font-light tracking-[4px]" style={{ color: 'var(--text-primary)' }}>搜索结果</h1>
            {query && (
              <p className="text-xs tracking-wider mt-2" style={{ color: 'var(--text-muted)' }}>
                "{query}" · 共 {results.length} 首
              </p>
            )}
          </div>
        ) : (
          <div>
            <h1 className="section-title text-xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>搜索结果</h1>
            {query && (
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                搜索 "{query}" — 找到 {results.length} 个结果
              </p>
            )}
          </div>
        )}
      </div>

      {!query && (
        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
          <p>{currentTheme === 'tech' ? '// 请输入关键词搜索诗词' : '请输入关键词搜索诗词'}</p>
          <p className="text-sm mt-2">{currentTheme === 'tech' ? '# 支持全文搜索、拼音首字母、模糊匹配' : '支持全文搜索、拼音首字母、模糊匹配'}</p>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
          <p className="text-lg mb-2">未找到相关诗词</p>
          <p className="text-sm">试试换个关键词，或者输入拼音首字母</p>
          <Link to="/" className="inline-block mt-4 text-sm hover:underline" style={{ color: 'var(--accent)' }}>返回首页</Link>
        </div>
      )}

      {results.length > 0 && (
        <div className={currentTheme === 'ink' ? 'space-y-0' : 'space-y-3'}>
          {results.map(({ poem, score, matchedLine }) => (
            <div key={poem.id} className="card transition-all">
              <Link to={`/poem/${poem.id}`} className="block">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className={`text-base ${currentTheme === 'tech' || currentTheme === 'stock' ? 'font-mono' : ''}`}
                    style={{ fontFamily: currentTheme === 'tech' || currentTheme === 'stock' ? 'monospace' : 'var(--font-heading)', color: 'var(--text-primary)' }}>
                    {poem.title}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{poem.author} · {poem.dynasty}</span>
                    <span className={`text-xs ${currentTheme === 'stock' ? 'theme-tag-up' : 'theme-tag'}`}>
                      {scoreLabel(score)}
                    </span>
                  </div>
                </div>
                {matchedLine && (
                  <p className={`text-sm px-2 py-1 rounded mb-2 ${currentTheme === 'tech' ? 'font-mono' : ''}`}
                    style={{ color: 'var(--accent)', backgroundColor: 'var(--bg-tag)' }}>
                    ...{matchedLine}...
                  </p>
                )}
                <p className={`text-sm line-clamp-2 ${currentTheme === 'tech' || currentTheme === 'stock' ? 'font-mono' : ''}`}
                  style={{ color: 'var(--text-secondary)' }}>
                  {poem.content.replace(/\n/g, '')}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
