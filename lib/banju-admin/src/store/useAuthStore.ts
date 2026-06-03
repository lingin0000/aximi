import { create } from 'zustand';
import { authApi } from '../api/client';

interface AuthState {
  token: string | null;
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('admin-token'),
  user: null,
  loading: false,

  login: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const { data } = await authApi.login(email, password);
      localStorage.setItem('admin-token', data.data.token);
      set({ token: data.data.token, user: data.data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('admin-token');
    set({ token: null, user: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('admin-token');
    if (!token) return;
    try {
      const { data } = await authApi.me();
      set({ user: data.data });
    } catch {
      localStorage.removeItem('admin-token');
      set({ token: null, user: null });
    }
  },
}));
