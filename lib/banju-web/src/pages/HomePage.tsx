import { Link } from 'react-router-dom'
import SearchBox from '@/components/SearchBox'
import DailyPoemCard from '@/components/DailyPoemCard'
import PoemCard from '@/components/PoemCard'
import { getDailyPoem, getPopularPoems } from '@/data/poetryStore'
import { useThemeStore } from '@/store/useThemeStore'

const categoryTags = ['思乡', '送别', '边塞', '山水', '田园', '爱情', '咏物', '哲理', '豪放', '婉约']

export default function HomePage() {
  const dailyPoem = getDailyPoem()
  const popularPoems = getPopularPoems()
  const { currentTheme } = useThemeStore()

  // Tech theme layout
  if (currentTheme === 'tech') {
    return (
      <div className="p-4 md:p-6 space-y-10">
        <section className="pt-6 pb-2">
          <div className="font-mono mb-6">
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>#!/bin/bash</div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>
              $ banju --search
            </h1>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}># 半句寻诗 v1.0.0</div>
          </div>
          <SearchBox />
        </section>

        <section>
          <h2 className="section-title text-sm mb-4" style={{ color: 'var(--text-primary)' }}>DAILY_POEM</h2>
          <DailyPoemCard poem={dailyPoem} />
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="section-title text-sm" style={{ color: 'var(--text-primary)' }}>POPULAR</h2>
            <span className="text-[10px] font-mono px-2 py-0.5" style={{ background: 'var(--bg-tag)', color: 'var(--accent)' }}>
              {popularPoems.length} items
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularPoems.map(poem => (
              <PoemCard key={poem.id} poem={poem} size="sm" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title text-sm mb-4" style={{ color: 'var(--text-primary)' }}>TAGS</h2>
          <div className="flex flex-wrap gap-2 font-mono">
            {categoryTags.map(tag => (
              <Link key={tag} to={`/library?theme=${encodeURIComponent(tag)}`}
                className="theme-tag text-xs transition-colors hover:opacity-80">
                .{tag}
              </Link>
            ))}
          </div>
        </section>
      </div>
    )
  }

  // AI theme layout
  if (currentTheme === 'ai') {
    return (
      <div className="p-4 md:p-8 space-y-12">
        <section className="pt-10 pb-4 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            半句
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            AI-powered poetry discovery engine
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBox />
          </div>
        </section>

        <section>
          <DailyPoemCard poem={dailyPoem} />
        </section>

        <section>
          <h2 className="section-title text-xl font-bold mb-5">为你精选</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {popularPoems.map(poem => (
              <PoemCard key={poem.id} poem={poem} size="md" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title text-xl font-bold mb-5">探索更多</h2>
          <div className="flex flex-wrap gap-3">
            {categoryTags.map(tag => (
              <Link key={tag} to={`/library?theme=${encodeURIComponent(tag)}`}
                className="theme-tag text-sm transition-all hover:scale-105">
                {tag}
              </Link>
            ))}
          </div>
        </section>
      </div>
    )
  }

  // Stock theme layout
  if (currentTheme === 'stock') {
    return (
      <div className="p-4 md:p-6 space-y-8">
        <section className="pt-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xl font-bold" style={{ color: 'var(--accent)' }}>BANJU</span>
            <span className="text-xs font-mono px-2 py-0.5 theme-tag-up">LIVE</span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('zh-CN')}
            </span>
          </div>
          <SearchBox />
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="section-title text-sm" style={{ color: 'var(--text-primary)' }}>每日精选</h2>
            <span className="text-xs font-mono stock-up">▲ 推荐</span>
          </div>
          <DailyPoemCard poem={dailyPoem} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title text-sm" style={{ color: 'var(--text-primary)' }}>热门排行</h2>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              共 {popularPoems.length} 首
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularPoems.map(poem => (
              <PoemCard key={poem.id} poem={poem} size="sm" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title text-sm mb-3" style={{ color: 'var(--text-primary)' }}>板块分类</h2>
          <div className="grid grid-cols-5 gap-2">
            {categoryTags.map(tag => (
              <Link key={tag} to={`/library?theme=${encodeURIComponent(tag)}`}
                className="metric-box text-xs font-mono transition-colors hover:opacity-80">
                {tag}
              </Link>
            ))}
          </div>
        </section>
      </div>
    )
  }

  // Ink theme layout
  if (currentTheme === 'ink') {
    return (
      <div className="p-4 md:p-10 space-y-16">
        <section className="pt-16 pb-8 text-center">
          <h1 className="text-3xl font-light tracking-[12px] mb-4" style={{ color: 'var(--text-primary)' }}>
            半句
          </h1>
          <div className="w-12 h-px mx-auto mb-6" style={{ background: 'var(--border)' }} />
          <SearchBox />
        </section>

        <section>
          <div className="text-xs tracking-[6px] mb-8 text-center" style={{ color: 'var(--text-muted)' }}>
            每日 · 一诗
          </div>
          <DailyPoemCard poem={dailyPoem} />
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-base font-light tracking-[4px]" style={{ color: 'var(--text-primary)' }}>经典诗词</h2>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>
          <div className="space-y-0">
            {popularPoems.slice(0, 6).map(poem => (
              <PoemCard key={poem.id} poem={poem} size="md" />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-base font-light tracking-[4px]" style={{ color: 'var(--text-primary)' }}>诗词分类</h2>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>
          <div className="flex flex-wrap gap-4">
            {categoryTags.map(tag => (
              <Link key={tag} to={`/library?theme=${encodeURIComponent(tag)}`}
                className="theme-tag text-sm transition-colors hover:opacity-70">
                {tag}
              </Link>
            ))}
          </div>
        </section>
      </div>
    )
  }

  // Classical (default) layout
  return (
    <div className="p-4 md:p-6 space-y-8">
      <section className="pt-8 pb-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>半句</h1>
          <p className="text-sm" style={{ color: 'var(--accent-glow)' }}>半句寻诗，全卷入怀</p>
        </div>
        <SearchBox />
      </section>

      <section>
        <h2 className="section-title text-lg mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>每日一诗</h2>
        <DailyPoemCard poem={dailyPoem} />
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title text-lg" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>热门诗词</h2>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>精选经典</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularPoems.map(poem => (
            <PoemCard key={poem.id} poem={poem} size="sm" />
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title text-lg mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>诗词分类</h2>
        <div className="flex flex-wrap gap-2">
          {categoryTags.map(tag => (
            <Link key={tag} to={`/library?theme=${encodeURIComponent(tag)}`}
              className="theme-tag text-xs transition-colors hover:opacity-80">
              {tag}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
