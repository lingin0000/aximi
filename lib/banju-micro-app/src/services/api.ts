import Taro from '@tarojs/taro';

const API_BASE = 'http://localhost:3000/api';

// In production, use real server URL
// const API_BASE = 'https://api.banju.app';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  params?: Record<string, any>;
  auth?: boolean;
}

async function request<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', data, params, auth = false } = options;

  const header: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = Taro.getStorageSync('banju-token');
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const res = await Taro.request({
      url: `${API_BASE}${url}`,
      method,
      data,
      header,
    });

    if (res.statusCode >= 400) {
      throw new Error((res.data as any)?.message || '请求失败');
    }

    return res.data as T;
  } catch (error: any) {
    console.error('API Error:', error.message);
    throw error;
  }
}

// Poems API
export const poemsApi = {
  list: (params?: any) => request('/poems', { params }),
  getById: (id: number) => request(`/poems/${id}`),
  getDaily: () => request('/poems/daily'),
  search: (q: string) => request('/poems/search', { params: { q } }),
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', data: { email, password } }),
  register: (username: string, email: string, password: string) =>
    request('/auth/register', { method: 'POST', data: { username, email, password } }),
};

// AI API
export const aiApi = {
  chat: (question: string) =>
    request('/ai/chat', { method: 'POST', data: { question } }),
  getVoices: () => request('/ai/tts/voices'),
  generateCouplet: (firstLine: string) =>
    request('/ai/couplet', { method: 'POST', data: { firstLine } }),
};

export default request;
