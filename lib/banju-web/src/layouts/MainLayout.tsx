import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { usePoetryStore } from '../store/usePoetryStore'
import ThemeSwitcher from '../components/ThemeSwitcher'
import AuthModal from '../components/AuthModal'
import { useAuthStore } from '../store/useAuthStore'
import { useThemeStore } from '../store/useThemeStore'

const navItems = [
  { to: '/', label: '首页', icon: HomeIcon },
  { to: '/search', label: '半句搜', icon: SearchIcon },
  { to: '/library', label: '诗库', icon: BookIcon },
  { to: '/my-box', label: '我的诗匣', icon: BoxIcon },
]

export default function MainLayout() {
  const location = useLocation()
  const { currentTheme } = useThemeStore()
  const { isLoggedIn, user, logout } = useAuthStore()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: 'var(--bg)' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 h-screen sticky top-0 border-r"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        
        {/* Sidebar Logo */}
        <div className="px-5 py-6 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
          {currentTheme === 'tech' ? (
            <div className="font-mono">
              <span style={{ color: 'var(--accent)' }}>$</span>
              <span className="ml-1 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                banju
              </span>
              <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>v1.0</span>
            </div>
          ) : currentTheme === 'ai' ? (
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                半句
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>AI Poetry Engine</div>
            </div>
          ) : currentTheme === 'ink' ? (
            <div className="text-center">
              <div className="text-2xl font-light tracking-[8px]" style={{ color: 'var(--text-primary)' }}>
                半句
              </div>
            </div>
          ) : currentTheme === 'stock' ? (
            <div>
              <span className="text-lg font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                BANJU
              </span>
              <span className="text-xs ml-2 font-mono" style={{ color: 'var(--accent)' }}>
                ▲ 诗词指数
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <div>
                <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>半句</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  从半句，懂全诗
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Nav - scrollable */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to ||
              (item.to !== '/' && location.pathname.startsWith(item.to))
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                  currentTheme === 'tech' ? 'rounded-none' : currentTheme === 'ai' ? 'rounded-2xl' : 'rounded-lg'
                }`}
                style={{
                  background: isActive ? 'var(--bg-tag)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: isActive && currentTheme === 'classical' ? '3px solid var(--accent)' : 'none',
                }}
              >
                <item.icon active={isActive} />
                <span>{item.label}</span>
                {item.to === '/my-box' && <FavBadge />}
              </NavLink>
            )
          })}
        </nav>

        {/* Theme Switcher - fixed at bottom of sidebar */}
        <div className="shrink-0 px-3 py-4 border-t relative z-50" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          <div className="flex items-center justify-between gap-2">
            <ThemeSwitcher />
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="text-xs px-2 py-1 rounded hover:opacity-80"
                style={{ color: 'var(--text-muted)' }}
                title={user?.username}
              >
                {user?.username?.slice(0, 4)} | 退出
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="text-xs px-2 py-1 rounded hover:opacity-80"
                style={{ color: 'var(--accent)' }}
              >
                登录
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-50 px-4 py-3 border-b backdrop-blur-sm flex items-center justify-between"
          style={{ 
            background: currentTheme === 'ai' ? 'rgba(255,255,255,0.7)' : 'var(--bg-card)',
            borderColor: 'var(--border)',
          }}>
          
          {currentTheme === 'tech' ? (
            <div className="font-mono text-sm">
              <span style={{ color: 'var(--accent)' }}>~/</span>
              <span style={{ color: 'var(--text-primary)' }}>banju</span>
              <span className="ml-1 animate-pulse" style={{ color: 'var(--accent)' }}>_</span>
            </div>
          ) : currentTheme === 'ai' ? (
            <div className="text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              半句
            </div>
          ) : currentTheme === 'ink' ? (
            <div className="text-xl tracking-[6px] font-light" style={{ color: 'var(--text-primary)' }}>半句</div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xl">📖</span>
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>半句</span>
            </div>
          )}

          <ThemeSwitcher />
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full">
          <Outlet />
        </main>

        {/* Mobile Tab Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.to ||
              (item.to !== '/' && location.pathname.startsWith(item.to))
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex-1 flex flex-col items-center py-2.5 text-xs transition-colors relative"
                style={{
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{ background: 'var(--accent)' }} />
                )}
                <item.icon active={isActive} />
                <span className="mt-1">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom spacer for mobile */}
        <div className="lg:hidden h-16" />
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  )
}

/* ============ Icons ============ */

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function BookIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}

function BoxIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}

/* ============ Badge ============ */

function FavBadge() {
  const favCount = usePoetryStore((s) => s.favorites.length)
  if (favCount === 0) return null
  return (
    <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium flex items-center justify-center"
      style={{ background: 'var(--accent)', color: 'var(--text-on-header)' }}>
      {favCount}
    </span>
  )
}
