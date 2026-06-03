import poemsData from './poems.json'
import { getPinyinInitials, isPinyinInput, editDistance } from '@/utils/pinyin'

export interface Poem {
  id: number
  title: string
  author: string
  dynasty: string
  content: string
  translation: string
  appreciation: string
  tags: string[]
  form: string
}

// 预计算拼音首字母索引
const poemPinyinMap = new Map<number, string>()
poemsData.forEach((poem) => {
  const lines = poem.content.replace(/\n/g, '')
  poemPinyinMap.set(poem.id, getPinyinInitials(lines))
})

const allPoems = poemsData as Poem[]

export function getAllPoems(): Poem[] {
  return allPoems
}

export function getPoemById(id: number): Poem | undefined {
  return allPoems.find(p => p.id === id)
}

export interface SearchResult {
  poem: Poem
  score: number
  matchedLine?: string
}

/**
 * 搜索诗词 - 支持精确匹配、关键词匹配、拼音首字母匹配、模糊匹配
 */
export function searchPoems(query: string): SearchResult[] {
  if (!query.trim()) return []
  
  const q = query.trim().toLowerCase()
  const results: SearchResult[] = []
  const isPinyin = isPinyinInput(q)
  const pinyinQuery = isPinyin ? q.replace(/\s/g, '') : ''

  for (const poem of allPoems) {
    const content = poem.content.replace(/\n/g, '')
    const title = poem.title
    const author = poem.author
    const fullText = content + title + author

    // 1. 精确子串匹配（最高优先级）- 内容中匹配
    if (content.includes(q)) {
      results.push({ poem, score: 100, matchedLine: q })
      continue
    }

    // 2. 标题匹配
    if (title.includes(q)) {
      results.push({ poem, score: 95 })
      continue
    }

    // 3. 作者匹配
    if (author.includes(q)) {
      results.push({ poem, score: 85 })
      continue
    }

    // 4. 关键词拆分匹配（对中文输入）
    if (!isPinyin && q.length >= 2) {
      const chars = q.split('')
      let matchCount = 0
      for (const char of chars) {
        if (fullText.includes(char)) matchCount++
      }
      if (matchCount >= Math.ceil(chars.length * 0.5)) {
        results.push({ poem, score: 60 + matchCount * 5 })
        continue
      }
    }

    // 5. 拼音首字母匹配
    if (isPinyin) {
      const poemInitials = poemPinyinMap.get(poem.id) || ''
      if (poemInitials.includes(pinyinQuery)) {
        results.push({ poem, score: 80, matchedLine: pinyinQuery })
        continue
      }
      // 部分拼音匹配
      if (pinyinQuery.length >= 3 && poemInitials.includes(pinyinQuery.slice(0, 3))) {
        results.push({ poem, score: 50 })
        continue
      }
    }

    // 6. 编辑距离模糊匹配（仅对短查询）
    if (q.length >= 2 && q.length <= 7) {
      const lines = poem.content.split(/[，。？！\n]/).filter(l => l.trim().length >= 2)
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.length >= q.length) {
          const dist = editDistance(q, trimmed.slice(0, q.length))
          if (dist <= 1) {
            results.push({ poem, score: 40, matchedLine: trimmed })
            break
          }
        }
      }
    }
  }

  // 按分数排序并去重
  const seen = new Set<number>()
  return results
    .sort((a, b) => b.score - a.score)
    .filter(r => {
      if (seen.has(r.poem.id)) return false
      seen.add(r.poem.id)
      return true
    })
}

export interface PoemFilter {
  dynasty?: string
  author?: string
  theme?: string
  form?: string
}

/**
 * 按条件筛选诗词
 */
export function filterPoems(filter: PoemFilter): Poem[] {
  return allPoems.filter(poem => {
    if (filter.dynasty && poem.dynasty !== filter.dynasty) return false
    if (filter.author && poem.author !== filter.author) return false
    if (filter.form && poem.form !== filter.form) return false
    if (filter.theme && !poem.tags.includes(filter.theme)) return false
    return true
  })
}

/**
 * 获取所有朝代列表
 */
export function getDynasties(): string[] {
  return [...new Set(allPoems.map(p => p.dynasty))]
}

/**
 * 获取所有作者列表
 */
export function getAuthors(): string[] {
  return [...new Set(allPoems.map(p => p.author))].sort()
}

/**
 * 获取所有主题标签
 */
export function getThemes(): string[] {
  const themes = new Set<string>()
  allPoems.forEach(p => p.tags.forEach(t => themes.add(t)))
  return [...themes]
}

/**
 * 获取所有体裁
 */
export function getForms(): string[] {
  return [...new Set(allPoems.map(p => p.form))]
}

/**
 * 获取每日一诗（基于日期的确定性选择）
 */
export function getDailyPoem(): Poem {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  )
  return allPoems[dayOfYear % allPoems.length]
}

/**
 * 获取热门诗词推荐
 */
export function getPopularPoems(count: number = 8): Poem[] {
  const popularIds = [1, 3, 7, 12, 14, 33, 34, 38, 42, 47, 54, 63, 78, 79]
  return popularIds
    .slice(0, count)
    .map(id => allPoems.find(p => p.id === id))
    .filter((p): p is Poem => p !== undefined)
}
