/** 诗词实体 */
export interface Poem {
  id: number;
  title: string;
  author: string;
  dynasty: string;
  content: string;
  translation: string;
  appreciation: string;
  tags: string[];
  form: string;
}

/** 诗词搜索结果 */
export interface PoemSearchResult {
  poem: Poem;
  score: number;
  matchedLine?: string;
}

/** 诗词筛选条件 */
export interface PoemFilter {
  dynasty?: string;
  author?: string;
  theme?: string;
  form?: string;
  page?: number;
  pageSize?: number;
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** 用户实体 */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** 诗单 */
export interface PoetryCollection {
  id: string;
  name: string;
  poemIds: number[];
  createdAt: number;
}

/** 已背诗词 */
export interface MemorizedItem {
  poemId: number;
  progress: number;
  memorizedAt: string;
  poem?: Poem;
}

/** 主题ID */
export type ThemeId = 'classical' | 'tech' | 'ai' | 'stock' | 'ink';

/** 主题色板 */
export interface ThemeColors {
  bg: string;
  bgCard: string;
  bgHeader: string;
  bgInput: string;
  bgHover: string;
  bgTag: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnHeader: string;
  accent: string;
  accentLight: string;
  accentGlow: string;
  border: string;
  shadow: string;
}

/** AI 讲解章节 */
export interface LectureChapter {
  title: string;
  content: string;
  order: number;
}

/** AI 讲解结果 */
export interface LectureResult {
  poemId: number;
  poemTitle: string;
  chapters: LectureChapter[];
}

/** 视频生成任务 */
export interface VideoTask {
  id: string;
  poemId: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  resultUrl?: string;
  errorMessage?: string;
  createdAt: Date;
}

/** TTS 音色 */
export interface TtsVoice {
  id: string;
  name: string;
  description: string;
  style: 'normal' | 'ancient' | 'emotional';
}

/** 视频模板 */
export interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
}

/** 分镜场景 */
export interface StoryboardScene {
  index: number;
  description: string;
  duration: number;
  transition: string;
}
