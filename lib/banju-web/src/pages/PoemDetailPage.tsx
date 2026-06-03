import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getPoemById, getAllPoems } from '@/data/poetryStore'
import { usePoetryStore } from '@/store/usePoetryStore'
import { useThemeStore } from '@/store/useThemeStore'
import AudioPlayer from '@/components/AudioPlayer'
import AiChatBot from '@/components/AiChatBot'
import LectureViewer from '@/components/LectureViewer'

export default function PoemDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const poem = getPoemById(Number(id))
  const [showTranslation, setShowTranslation] = useState(false)
  const [showAppreciation, setShowAppreciation] = useState(false)
  const [vertical, setVertical] = useState(false)
  const { currentTheme } = useThemeStore()
  const { toggleFavorite, isFavorite, toggleMemorized, isMemorized } = usePoetryStore()

  if (!poem) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: 'var(--text-muted)' }}>未找到该诗词</p>
        <Link to="/" className="inline-block mt-4 hover:underline text-sm" style={{ color: 'var(--accent)' }}>返回首页</Link>
      </div>
    )
  }

  const fav = isFavorite(poem.id)
  const mem = isMemorized(poem.id)
  const lines = poem.content.split('\n')
  const related = getAllPoems()
    .filter(p => p.id !== poem.id && (p.author === poem.author || p.tags.some(t => poem.tags.includes(t))))
    .slice(0, 4)

  // Tech theme: code viewer
  if (currentTheme === 'tech') {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="font-mono text-sm mb-4 flex items-center gap-1" style={{ color: 'var(--accent)' }}>
          <span>←</span> cd ..
        </button>

        {/* Terminal window */}
        <div className="rounded overflow-hidden" style={{ border: '1px solid rgba(0,212,255,0.2)' }}>
          <div className="flex items-center gap-2 px-4 py-2" style={{ background: 'var(--accent)' }}>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
            </div>
            <span className="text-white/80 text-xs font-mono ml-2">{poem.title}.txt</span>
          </div>

          <div className="p-5" style={{ background: 'var(--bg-card)' }}>
            <div className="flex items-center gap-2 mb-3 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--accent)' }}>/**</span>
              <span>{poem.dynasty} · {poem.author}</span>
              <span style={{ color: 'var(--accent)' }}>*/</span>
            </div>

            <div className="space-y-2 mb-6">
              {lines.map((line, i) => (
                <div key={i} className="flex items-start gap-3 font-mono">
                  <span className="text-xs w-6 text-right shrink-0" style={{ color: 'rgba(0,212,255,0.3)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-base" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-poem)' }}>{line}</span>
                </div>
              ))}
            </div>

            {/* Tags as code */}
            <div className="flex flex-wrap gap-2 font-mono text-xs" style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              {poem.tags.map(tag => (
                <span key={tag} className="theme-tag">.{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4 font-mono text-xs">
          <button onClick={() => toggleFavorite(poem.id)} className="px-3 py-1.5 rounded"
            style={{ background: fav ? 'rgba(239,68,68,0.1)' : 'var(--bg-tag)', color: fav ? '#EF4444' : 'var(--text-muted)' }}>
            {fav ? '★ favorited' : '☆ favorite'}
          </button>
          <button onClick={() => toggleMemorized(poem.id)} className="px-3 py-1.5 rounded"
            style={{ background: mem ? 'rgba(22,163,74,0.1)' : 'var(--bg-tag)', color: mem ? '#16A34A' : 'var(--text-muted)' }}>
            {mem ? '✓ memorized' : '○ memorize'}
          </button>
        </div>

        {/* Translation & Appreciation */}
        {poem.translation && (
          <div className="mt-4">
            <button onClick={() => setShowTranslation(!showTranslation)}
              className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
              {showTranslation ? '▼' : '▶'} translation.md
            </button>
            {showTranslation && (
              <div className="mt-2 p-4 font-mono text-sm" style={{ background: 'var(--bg-tag)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                {poem.translation}
              </div>
            )}
          </div>
        )}
        {poem.appreciation && (
          <div className="mt-3">
            <button onClick={() => setShowAppreciation(!showAppreciation)}
              className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
              {showAppreciation ? '▼' : '▶'} analysis.md
            </button>
            {showAppreciation && (
              <div className="mt-2 p-4 font-mono text-sm" style={{ background: 'var(--bg-tag)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                {poem.appreciation}
              </div>
            )}
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-6">
            <h3 className="section-title text-xs mb-3" style={{ color: 'var(--text-primary)' }}>RELATED_FILES</h3>
            <div className="grid grid-cols-2 gap-2">
              {related.map(p => (
                <Link key={p.id} to={`/poem/${p.id}`} className="card p-3 font-mono text-xs group">
                  <div style={{ color: 'var(--text-primary)' }}>{p.title}.txt</div>
                  <div style={{ color: 'var(--text-muted)' }}>{p.author}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // AI theme: clean with glow accents
  if (currentTheme === 'ai') {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-sm mb-6 flex items-center gap-1 rounded-full px-3 py-1.5 transition-all"
          style={{ background: 'var(--bg-tag)', color: 'var(--text-muted)' }}>
          ← 返回
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{poem.title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{poem.author} · {poem.dynasty}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {poem.tags.map(tag => (
              <span key={tag} className="theme-tag text-xs">{tag}</span>
            ))}
          </div>
        </div>

        {/* Poem body with glow */}
        <div className="card p-8 mb-8 ai-glow text-center">
          <div className="space-y-4">
            {lines.map((line, i) => (
              <p key={i} className="text-lg md:text-xl leading-loose" style={{ fontFamily: 'var(--font-poem)', color: 'var(--text-primary)' }}>{line}</p>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button onClick={() => toggleFavorite(poem.id)}
            className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-all"
            style={{ background: fav ? 'rgba(239,68,68,0.1)' : 'var(--bg-tag)', color: fav ? '#EF4444' : 'var(--text-muted)' }}>
            {fav ? '♥ 已收藏' : '♡ 收藏'}
          </button>
          <button onClick={() => toggleMemorized(poem.id)}
            className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-full transition-all"
            style={{ background: mem ? 'rgba(22,163,74,0.1)' : 'var(--bg-tag)', color: mem ? '#16A34A' : 'var(--text-muted)' }}>
            {mem ? '✓ 已背' : '标记已背'}
          </button>
        </div>

        {poem.translation && (
          <div className="mb-5">
            <button onClick={() => setShowTranslation(!showTranslation)}
              className="section-title text-sm font-medium flex items-center gap-2">
              {showTranslation ? '▾' : '▸'} 译文
            </button>
            {showTranslation && (
              <div className="mt-3 p-5 card">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{poem.translation}</p>
              </div>
            )}
          </div>
        )}
        {poem.appreciation && (
          <div className="mb-8">
            <button onClick={() => setShowAppreciation(!showAppreciation)}
              className="section-title text-sm font-medium flex items-center gap-2">
              {showAppreciation ? '▾' : '▸'} 赏析
            </button>
            {showAppreciation && (
              <div className="mt-3 p-5 card">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{poem.appreciation}</p>
              </div>
            )}
          </div>
        )}

        {related.length > 0 && (
          <div>
            <h3 className="section-title text-lg font-bold mb-4">相关推荐</h3>
            <div className="grid grid-cols-2 gap-4">
              {related.map(p => (
                <Link key={p.id} to={`/poem/${p.id}`} className="card p-4 group">
                  <h4 className="text-sm font-medium" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{p.title}</h4>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{p.author}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Stock theme: data dashboard style
  if (currentTheme === 'stock') {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="font-mono text-sm mb-4" style={{ color: 'var(--accent)' }}>
          ← 返回
        </button>

        {/* Header like stock ticker */}
        <div className="card p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-mono text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{poem.title}</h1>
              <div className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
                {poem.author} | {poem.dynasty} | {poem.form}
              </div>
            </div>
            <div className="flex gap-2">
              {poem.tags.map(tag => (
                <span key={tag} className="theme-tag-up text-[10px] font-mono">{tag}</span>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="metric-box">
              <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>行数</div>
              <div className="text-base font-mono font-bold" style={{ color: 'var(--accent)' }}>{lines.length}</div>
            </div>
            <div className="metric-box">
              <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>字数</div>
              <div className="text-base font-mono font-bold" style={{ color: 'var(--accent)' }}>{poem.content.replace(/\s/g, '').length}</div>
            </div>
            <div className="metric-box">
              <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>标签</div>
              <div className="text-base font-mono font-bold" style={{ color: 'var(--accent)' }}>{poem.tags.length}</div>
            </div>
            <div className="metric-box">
              <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>热度</div>
              <div className="text-base font-mono font-bold stock-up">{(Math.random() * 10 + 90).toFixed(1)}</div>
            </div>
          </div>

          {/* Poem lines */}
          <div className="space-y-2">
            {lines.map((line, i) => (
              <div key={i} className="poem-line font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{line}</div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-4 font-mono text-xs">
          <button onClick={() => toggleFavorite(poem.id)} className="px-4 py-2 metric-box"
            style={{ color: fav ? '#DC2626' : 'var(--text-muted)' }}>
            {fav ? '★ 已持仓' : '☆ 加入'}
          </button>
          <button onClick={() => toggleMemorized(poem.id)} className="px-4 py-2 metric-box"
            style={{ color: mem ? '#16A34A' : 'var(--text-muted)' }}>
            {mem ? '✓ 已掌握' : '○ 背诵'}
          </button>
        </div>

        {poem.translation && (
          <div className="mb-4">
            <button onClick={() => setShowTranslation(!showTranslation)} className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
              {showTranslation ? '▼' : '▶'} 译文分析
            </button>
            {showTranslation && (
              <div className="mt-2 p-4 font-mono text-sm metric-box">{poem.translation}</div>
            )}
          </div>
        )}
        {poem.appreciation && (
          <div className="mb-6">
            <button onClick={() => setShowAppreciation(!showAppreciation)} className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
              {showAppreciation ? '▼' : '▶'} 深度研报
            </button>
            {showAppreciation && (
              <div className="mt-2 p-4 font-mono text-sm metric-box">{poem.appreciation}</div>
            )}
          </div>
        )}

        {related.length > 0 && (
          <div>
            <h3 className="section-title text-xs mb-3" style={{ color: 'var(--text-primary)' }}>关联标的</h3>
            <div className="grid grid-cols-2 gap-2">
              {related.map(p => (
                <Link key={p.id} to={`/poem/${p.id}`} className="card p-3 font-mono text-xs group">
                  <div style={{ color: 'var(--text-primary)' }}>{p.title}</div>
                  <div style={{ color: 'var(--text-muted)' }}>{p.author} · {p.dynasty}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Ink theme: vertical, extreme whitespace
  if (currentTheme === 'ink') {
    return (
      <div className="p-4 md:p-12 max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-sm mb-12 flex items-center gap-2 tracking-widest" style={{ color: 'var(--text-muted)' }}>
          ← 返回
        </button>

        <div className="text-center mb-16">
          <h1 className="text-3xl font-light tracking-[8px] mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
            {poem.title}
          </h1>
          <div className="text-xs tracking-[4px]" style={{ color: 'var(--text-muted)' }}>
            {poem.author} · {poem.dynasty}
          </div>
          <div className="w-16 h-px mx-auto mt-6" style={{ background: 'var(--border)' }} />
        </div>

        {/* Vertical poem display */}
        <div className="flex justify-center mb-16 overflow-x-auto">
          <div className="poem-vertical text-xl leading-[3]">
            {lines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>

        {/* Actions - minimal */}
        <div className="flex items-center justify-center gap-6 mb-12">
          <button onClick={() => toggleFavorite(poem.id)} className="text-sm tracking-wider transition-opacity hover:opacity-60"
            style={{ color: fav ? '#C41E3A' : 'var(--text-muted)' }}>
            {fav ? '已藏' : '收藏'}
          </button>
          <div className="w-px h-4" style={{ background: 'var(--border)' }} />
          <button onClick={() => toggleMemorized(poem.id)} className="text-sm tracking-wider transition-opacity hover:opacity-60"
            style={{ color: mem ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            {mem ? '已背' : '背诵'}
          </button>
        </div>

        {/* Seal decoration */}
        <div className="flex justify-end mb-12">
          <div className="ink-seal">{poem.title.charAt(0)}</div>
        </div>

        {poem.translation && (
          <div className="mb-8">
            <button onClick={() => setShowTranslation(!showTranslation)}
              className="text-sm tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              {showTranslation ? '▾' : '▸'} 译文
            </button>
            {showTranslation && (
              <div className="mt-4 py-4" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-sm leading-loose tracking-wide" style={{ color: 'var(--text-secondary)' }}>{poem.translation}</p>
              </div>
            )}
          </div>
        )}
        {poem.appreciation && (
          <div className="mb-12">
            <button onClick={() => setShowAppreciation(!showAppreciation)}
              className="text-sm tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              {showAppreciation ? '▾' : '▸'} 赏析
            </button>
            {showAppreciation && (
              <div className="mt-4 py-4" style={{ borderTop: '1px solid var(--border)' }}>
                <p className="text-sm leading-loose tracking-wide" style={{ color: 'var(--text-secondary)' }}>{poem.appreciation}</p>
              </div>
            )}
          </div>
        )}

        {related.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-sm font-light tracking-[4px]" style={{ color: 'var(--text-primary)' }}>相关</h3>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>
            <div className="space-y-0">
              {related.map(p => (
                <Link key={p.id} to={`/poem/${p.id}`} className="block card py-4 group">
                  <h4 className="text-sm font-light tracking-wider" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{p.title}</h4>
                  <p className="text-xs mt-1 tracking-wider" style={{ color: 'var(--text-muted)' }}>{p.author}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Classical (default): traditional scroll
  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm mb-4 transition-colors" style={{ color: 'var(--text-muted)' }}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        返回
      </button>

      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>{poem.title}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{poem.author} · {poem.dynasty} · {poem.form}</p>
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {poem.tags.map(tag => (
            <span key={tag} className="theme-tag text-xs">{tag}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        <button onClick={() => toggleFavorite(poem.id)}
          className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: fav ? '#EF4444' : 'var(--text-muted)', backgroundColor: fav ? 'rgba(239,68,68,0.08)' : 'var(--bg-tag)' }}>
          <svg className="w-4 h-4" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {fav ? '已收藏' : '收藏'}
        </button>
        <button onClick={() => toggleMemorized(poem.id)}
          className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: mem ? '#16A34A' : 'var(--text-muted)', backgroundColor: mem ? 'rgba(22,163,74,0.08)' : 'var(--bg-tag)' }}>
          <svg className="w-4 h-4" fill={mem ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {mem ? '已背' : '标记已背'}
        </button>
        <button onClick={() => setVertical(!vertical)}
          className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: vertical ? 'var(--accent)' : 'var(--text-muted)', backgroundColor: vertical ? 'var(--bg-tag)' : 'transparent' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {vertical ? '横排' : '竖排'}
        </button>
      </div>

      <div className="card mb-6">
        <div className={vertical ? 'flex justify-center overflow-x-auto py-4' : 'text-center py-4'}>
          <div className={vertical ? 'vertical-text space-y-4' : 'space-y-3'}>
            {lines.map((line, i) => (
              <p key={i} className="text-lg md:text-xl leading-loose" style={{ fontFamily: 'var(--font-poem)', color: 'var(--text-primary)' }}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      {poem.translation && (
        <div className="mb-4">
          <button onClick={() => setShowTranslation(!showTranslation)}
            className="section-title flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--accent)' }}>
            <svg className={`w-4 h-4 transition-transform ${showTranslation ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            译文
          </button>
          {showTranslation && (
            <div className="mt-3 p-4 rounded-xl" style={{ border: '1px solid var(--border)' }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{poem.translation}</p>
            </div>
          )}
        </div>
      )}

      {poem.appreciation && (
        <div className="mb-8">
          <button onClick={() => setShowAppreciation(!showAppreciation)}
            className="section-title flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--accent)' }}>
            <svg className={`w-4 h-4 transition-transform ${showAppreciation ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            赏析
          </button>
          {showAppreciation && (
            <div className="mt-3 p-4 rounded-xl" style={{ border: '1px solid var(--border)' }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{poem.appreciation}</p>
            </div>
          )}
        </div>
      )}

      {/* AI Tools */}
      <div className="mb-8 p-4 rounded-xl" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}>
        <div className="flex flex-wrap items-center gap-3">
          <AudioPlayer poemId={poem.id} poemTitle={poem.title} tags={poem.tags} />
          <AiChatBot poemId={poem.id} poemTitle={poem.title} />
        </div>
        <div className="mt-3">
          <LectureViewer poemId={poem.id} />
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h3 className="section-title text-base mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>相关诗词</h3>
          <div className="grid grid-cols-2 gap-3">
            {related.map(p => (
              <Link key={p.id} to={`/poem/${p.id}`} className="card p-3 group">
                <h4 className="text-sm" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{p.title}</h4>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.author}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
