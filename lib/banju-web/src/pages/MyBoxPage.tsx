import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getPoemById } from '@/data/poetryStore'
import { usePoetryStore } from '@/store/usePoetryStore'
import { useThemeStore } from '@/store/useThemeStore'

export default function MyBoxPage() {
  const [activeTab, setActiveTab] = useState<'favorites' | 'collections'>('favorites')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newColName, setNewColName] = useState('')

  const {
    favorites, memorized, toggleFavorite, toggleMemorized,
    collections, createCollection, deleteCollection
  } = usePoetryStore()

  const { currentTheme } = useThemeStore()

  function handleCreateCollection() {
    if (newColName.trim()) {
      createCollection(newColName.trim())
      setNewColName('')
      setShowCreateModal(false)
    }
  }

  const favPoems = favorites.map(id => getPoemById(id)).filter(Boolean)

  const tabBtn = (tab: 'favorites' | 'collections', label: string, count: number) => (
    <button
      onClick={() => setActiveTab(tab)}
      className="px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px"
      style={{
        borderColor: activeTab === tab ? 'var(--accent)' : 'transparent',
        color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
      }}
    >
      {label} ({count})
    </button>
  )

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        {currentTheme === 'tech' ? (
          <div className="flex items-center gap-3">
            <h1 className="section-title text-sm" style={{ color: 'var(--text-primary)' }}>MY_BOX</h1>
            <span className="text-[10px] font-mono px-2 py-0.5" style={{ background: 'var(--bg-tag)', color: 'var(--accent)' }}>{favorites.length} saved</span>
          </div>
        ) : currentTheme === 'ai' ? (
          <div className="flex items-center gap-3">
            <h1 className="section-title text-2xl font-bold">我的诗匣</h1>
            <span className="text-xs px-3 py-1 rounded-full theme-tag">{favorites.length} 收藏</span>
          </div>
        ) : currentTheme === 'stock' ? (
          <div className="flex items-center gap-3">
            <h1 className="section-title text-sm" style={{ color: 'var(--text-primary)' }}>持仓总览</h1>
            <span className="text-xs font-mono theme-tag-up">{favorites.length} 首</span>
          </div>
        ) : currentTheme === 'ink' ? (
          <div>
            <h1 className="text-lg font-light tracking-[4px]" style={{ color: 'var(--text-primary)' }}>我的诗匣</h1>
            <span className="text-xs tracking-wider" style={{ color: 'var(--text-muted)' }}>{favorites.length} 收藏</span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <h1 className="section-title text-xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>我的诗匣</h1>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{favorites.length} 收藏</span>
          </div>
        )}
      </div>

      {/* Tab 切换 */}
      <div className="flex mb-6" style={{ borderBottom: '1px solid var(--border)' }}>
        {tabBtn('favorites', '收藏', favorites.length)}
        {tabBtn('collections', '诗单', collections.length)}
      </div>

      {/* 收藏列表 */}
      {activeTab === 'favorites' && (
        <div>
          {favPoems.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p>还没有收藏诗词</p>
              <p className="text-sm mt-1">浏览诗库，收藏喜欢的诗词吧</p>
              <Link to="/library" className="inline-block mt-4 text-sm hover:underline" style={{ color: 'var(--accent)' }}>
                去诗库看看
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {favPoems.map(poem => poem && (
                <div key={poem.id} className="card flex items-center justify-between gap-3">
                  <Link to={`/poem/${poem.id}`} className="flex-1 min-w-0">
                    <h3 className="text-sm truncate" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{poem.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{poem.author} · {poem.dynasty}</p>
                  </Link>
                  <div className="flex items-center gap-2 shrink-0">
                    {memorized.includes(poem.id) && (
                      <span className="text-xs px-2 py-0.5 rounded" style={{ color: '#16A34A', backgroundColor: 'rgba(22,163,74,0.08)' }}>已背</span>
                    )}
                    <button onClick={() => toggleMemorized(poem.id)} className="p-1 transition-colors" style={{ color: 'var(--text-muted)' }} title="标记已背">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button onClick={() => toggleFavorite(poem.id)} className="p-1 transition-colors" style={{ color: '#EF4444' }} title="取消收藏">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 诗单 */}
      {activeTab === 'collections' && (
        <div>
          <button onClick={() => setShowCreateModal(true)}
            className="w-full card flex items-center justify-center gap-2 text-sm mb-4 transition-colors hover:shadow-theme"
            style={{ color: 'var(--accent)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            创建诗单
          </button>

          {collections.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
              <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p>还没有创建诗单</p>
              <p className="text-sm mt-1">创建诗单，整理你喜欢的诗词</p>
            </div>
          ) : (
            <div className="space-y-3">
              {collections.map(col => (
                <div key={col.id} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{col.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{col.poemIds.length} 首</span>
                      <button onClick={() => deleteCollection(col.id)} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {col.poemIds.length > 0 ? (
                    <div className="space-y-1">
                      {col.poemIds.slice(0, 5).map(pid => {
                        const p = getPoemById(pid)
                        return p ? (
                          <Link key={pid} to={`/poem/${pid}`}
                            className="flex items-center justify-between text-sm py-1 px-2 rounded transition-colors"
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                            <span style={{ color: 'var(--text-primary)' }}>{p.title}</span>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.author}</span>
                          </Link>
                        ) : null
                      })}
                      {col.poemIds.length > 5 && (
                        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>还有 {col.poemIds.length - 5} 首...</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>诗单为空，去诗库添加诗词吧</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 创建诗单弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="p-6 w-full max-w-sm" style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius)' }}>
            <h3 className="text-lg mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>创建诗单</h3>
            <input
              type="text"
              value={newColName}
              onChange={e => setNewColName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreateCollection()}
              placeholder="输入诗单名称..."
              className="w-full px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-1"
              style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setShowCreateModal(false); setNewColName('') }}
                className="px-4 py-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                取消
              </button>
              <button onClick={handleCreateCollection} disabled={!newColName.trim()}
                className="btn-primary text-sm disabled:opacity-50">
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
