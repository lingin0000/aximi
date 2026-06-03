import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: any | null;
  isLoggedIn: boolean;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      setAuth: (token, user) => set({ token, user, isLoggedIn: true }),
      logout: () => {
        localStorage.removeItem('banju-token');
        set({ token: null, user: null, isLoggedIn: false });
      },
    }),
    { name: 'banju-auth' }
  )
);
