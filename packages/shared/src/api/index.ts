/** 统一 API 响应格式 */
export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  timestamp: string;
}

/** 登录请求 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 注册请求 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/** 认证响应 */
export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
  };
  token: string;
}

/** 诗词查询参数 */
export interface PoemQueryParams {
  dynasty?: string;
  author?: string;
  theme?: string;
  form?: string;
  page?: number;
  pageSize?: number;
}

/** 诗词搜索参数 */
export interface PoemSearchParams {
  q: string;
  page?: number;
  pageSize?: number;
}

/** TTS 请求 */
export interface TtsRequest {
  poemId: number;
  voice?: string;
  speed?: number;
  style?: 'normal' | 'ancient' | 'emotional';
}

/** 视频生成请求 */
export interface VideoGenerateRequest {
  poemId: number;
  template?: string;
}

/** AI 对联请求 */
export interface CoupletRequest {
  firstLine: string;
}

/** AI 续写请求 */
export interface ContinuePoemRequest {
  lines: string;
  style?: string;
}

/** AI 对话请求 */
export interface ChatRequest {
  question: string;
  poemId?: number;
}
