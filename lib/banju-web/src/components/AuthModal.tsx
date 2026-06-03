import { useState } from 'react';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res;
      if (mode === 'login') {
        res = await authApi.login(email, password);
      } else {
        res = await authApi.register(username, email, password);
      }
      const { token, user } = res.data.data;
      localStorage.setItem('banju-token', token);
      setAuth(token, user);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm p-6 rounded-xl"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>
          {mode === 'login' ? '登录' : '注册'}
        </h2>

        {error && (
          <div className="text-sm text-red-500 mb-3 p-2 rounded" style={{ background: 'rgba(239,68,68,0.1)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="用户名"
              required
              className="w-full px-3 py-2.5 text-sm rounded-lg focus:outline-none"
              style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="邮箱"
            required
            className="w-full px-3 py-2.5 text-sm rounded-lg focus:outline-none"
            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码（至少6位）"
            required
            minLength={6}
            className="w-full px-3 py-2.5 text-sm rounded-lg focus:outline-none"
            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-sm hover:underline" style={{ color: 'var(--accent)' }}
          >
            {mode === 'login' ? '没有账号？去注册' : '已有账号？去登录'}
          </button>
        </div>
      </div>
    </div>
  );
}
