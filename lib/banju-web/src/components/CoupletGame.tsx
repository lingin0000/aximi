import { useState } from 'react';
import { aiApi } from '@/api/ai';
import { useThemeStore } from '@/store/useThemeStore';

export default function CoupletGame() {
  const [firstLine, setFirstLine] = useState('');
  const [secondLine, setSecondLine] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ first: string; second: string }[]>([]);
  const { currentTheme } = useThemeStore();

  async function handleGenerate() {
    if (!firstLine.trim() || loading) return;
    setLoading(true);
    try {
      const { data } = await aiApi.generateCouplet(firstLine.trim());
      const result = data.data?.secondLine || '对不出...';
      setSecondLine(result);
      setHistory((prev) => [{ first: firstLine.trim(), second: result }, ...prev].slice(0, 10));
    } catch {
      setSecondLine('AI 暂时不可用...');
    } finally {
      setLoading(false);
    }
  }

  const isTech = currentTheme === 'tech';

  return (
    <div className="card p-5">
      <h3 className="text-sm font-medium mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>
        {isTech ? '// couplet_generator' : '🏮 AI 对联'}
      </h3>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={firstLine}
          onChange={(e) => setFirstLine(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="输入上联..."
          className="flex-1 px-3 py-2 text-sm rounded-lg focus:outline-none"
          style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !firstLine.trim()}
          className="px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--text-on-header)' }}
        >
          {loading ? '...' : isTech ? 'Generate' : '对下联'}
        </button>
      </div>

      {secondLine && (
        <div className="p-4 rounded-lg mb-3 text-center" style={{ backgroundColor: 'var(--bg-tag)', border: '1px solid var(--border)' }}>
          <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>上联：{firstLine}</p>
          <p className="text-lg font-medium" style={{ color: 'var(--accent)', fontFamily: 'var(--font-poem)' }}>
            下联：{secondLine}
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>历史</p>
          {history.slice(0, 3).map((h, i) => (
            <div key={i} className="text-xs flex gap-2" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{h.first}</span>
              <span>→</span>
              <span style={{ color: 'var(--accent)' }}>{h.second}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
