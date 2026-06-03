import { pinyin } from 'pinyin-pro';

/**
 * 获取文本的拼音首字母序列
 * 例如 "床前明月光" -> "cqmyg"
 */
export function getPinyinInitials(text: string): string {
  return pinyin(text, { pattern: 'first', toneType: 'none', type: 'array' })
    .filter((p) => /[a-zA-Z]/.test(p))
    .join('')
    .toLowerCase();
}

/**
 * 获取文本的全拼音（无声调、无空格）
 */
export function getFullPinyin(text: string): string {
  return pinyin(text, { toneType: 'none', type: 'array' })
    .filter((p) => /[a-zA-Z]/.test(p))
    .join('')
    .toLowerCase();
}

/**
 * 检查输入是否为纯拼音首字母
 */
export function isPinyinInput(input: string): boolean {
  return /^[a-zA-Z\s]+$/.test(input.trim());
}

/**
 * 计算两个字符串的编辑距离（Levenshtein distance）
 */
export function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * 根据诗词标签推荐朗读音色
 */
export function recommendVoice(tags: string[]): string {
  if (tags.includes('豪放') || tags.includes('边塞')) return 'echo';
  if (tags.includes('婉约') || tags.includes('爱情')) return 'shimmer';
  if (tags.includes('田园') || tags.includes('山水')) return 'nova';
  if (tags.includes('怀古') || tags.includes('哲理')) return 'onyx';
  return 'alloy';
}

/**
 * 计算当日诗词索引
 */
export function getDailyPoemIndex(total: number): number {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return dayOfYear % total;
}
