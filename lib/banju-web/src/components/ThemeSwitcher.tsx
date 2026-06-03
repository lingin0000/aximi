import { useState, useEffect, useRef, useCallback } from 'react'
import { themes, useThemeStore, applyTheme, type ThemeId } from '@/store/useThemeStore'

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  const [panelPos, setPanelPos] = useState<{ left: number; top: number } | null>(null)
  const { currentTheme, setTheme } = useThemeStore()
  const panelRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    applyTheme(currentTheme)
  }, [currentTheme])

  // 点击外部关闭
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // 计算面板位置：自动贴在按钮旁边，不超出视口
  const calcPosition = useCallback(() => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const panelW = 288 // w-72 = 18rem
    const panelH = 400 // 预估高度
    const gap = 8

    // 水平方向：优先向右，放不下就向左
    let left: number
    if (rect.right + gap + panelW <= window.innerWidth) {
      left = rect.right + gap // 按钮右侧
    } else {
      left = rect.left - gap - panelW // 按钮左侧
    }

    // 垂直方向：优先向下，放不下就向上
    let top: number
    if (rect.bottom + gap + panelH <= window.innerHeight) {
      top = rect.bottom + gap // 按钮下方
    } else {
      top = rect.top - gap - panelH // 按钮上方
      // 确保不超出顶部
      if (top < 8) top = 8
    }

    // 确保不超出左右
    if (left < 8) left = 8
    if (left + panelW > window.innerWidth - 8) left = window.innerWidth - 8 - panelW

    setPanelPos({ left, top })
  }, [])

  function toggle() {
    if (!open) calcPosition()
    setOpen(!open)
  }

  function handleSelect(id: ThemeId) {
    setTheme(id)
    applyTheme(id)
    setOpen(false)
  }

  const themeList = Object.values(themes)
  const current = themes[currentTheme]

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
        style={{ color: 'var(--text-secondary)', background: 'var(--bg-tag)' }}
        title="切换主题"
      >
        <span className="text-base">{current.icon}</span>
        <span className="hidden sm:inline text-xs">{current.name}</span>
      </button>

      {open && panelPos && (
        <div
          ref={panelRef}
          className="fixed z-[200] w-72 overflow-hidden"
          style={{
            left: panelPos.left,
            top: panelPos.top,
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            borderRadius: 'var(--radius)',
          }}
        >
          <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>选择主题风格</h3>
          </div>
          <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
            {themeList.map(t => {
              const isActive = t.id === currentTheme
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left"
                  style={{
                    backgroundColor: isActive ? 'var(--bg-tag)' : 'transparent',
                    border: isActive ? `1px solid var(--accent)` : '1px solid transparent',
                  }}
                >
                  <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-lg"
                    style={{ backgroundColor: t.vars['--bg-header'] }}>
                    {t.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {t.name}
                      </span>
                      {isActive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: 'var(--accent)', color: 'var(--text-on-header)' }}>
                          当前
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {t.description}
                    </p>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.vars['--bg'] }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.vars['--accent'] }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.vars['--accent-glow'] }} />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
