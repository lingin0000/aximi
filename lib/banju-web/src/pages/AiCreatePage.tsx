import { useState } from 'react';
import { aiApi } from '@/api/ai';
import CoupletGame from '@/components/CoupletGame';
import { useThemeStore } from '@/store/useThemeStore';

export default function AiCreatePage() {
  const [inputLines, setInputLines] = useState('');
  const [style, setStyle] = useState('古典');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentTheme } = useThemeStore();

  async function handleContinue() {
    if (!inputLines.trim() || loading) return;
    setLoading(true);
    try {
      const { data } = await aiApi.continuePoem(inputLines.trim(), style);
      setResult(data.data?.continuation || '');
    } catch {
      setResult('AI 服务暂不可用，请稍后重试');
    } finally {
      setLoading(false);
    }
  }

  const styles = ['古典', '豪放', '婉约', '田园', '边塞', '哲理'];
  const isTech = currentTheme === 'tech';
  const isAi = currentTheme === 'ai';

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-8">
      {isAi ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI 创作工坊
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>与 AI 一起创作诗词</p>
        </div>
      ) : (
        <div>
          <h1 className="section-title text-xl" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>
            {isTech ? 'AI_CREATE' : 'AI 创作工坊'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {isTech ? '# ai辅助作诗 + ai对联' : '用AI辅助创作诗词，或试试对联互动'}
          </p>
        </div>
      )}

      {/* 诗词续写 */}
      <div className="card p-5">
        <h3 className="text-sm font-medium mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>
          {isTech ? '// poem_continue' : '✍️ AI 续写'}
        </h3>
        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          写出前几句，AI 帮你续写完成整首诗
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {styles.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className="text-xs px-3 py-1 rounded-full transition-all"
              style={{
                backgroundColor: style === s ? 'var(--accent)' : 'var(--bg-tag)',
                color: style === s ? 'var(--text-on-header)' : 'var(--text-secondary)',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <textarea
          value={inputLines}
          onChange={(e) => setInputLines(e.target.value)}
          placeholder="输入前两句诗，例如：春风又绿江南岸&#10;明月何时照我还"
          rows={4}
          className="w-full px-3 py-2.5 text-sm rounded-lg focus:outline-none resize-none mb-3"
          style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)', fontFamily: 'var(--font-poem)' }}
        />

        <button
          onClick={handleContinue}
          disabled={loading || !inputLines.trim()}
          className="px-5 py-2 text-sm font-medium rounded-lg disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent)', color: 'var(--text-on-header)' }}
        >
          {loading ? '创作中...' : isTech ? '> generate' : '续写'}
        </button>

        {result && (
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tag)', border: '1px solid var(--border)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>续写结果：</p>
            <div className="text-base leading-loose" style={{ fontFamily: 'var(--font-poem)', color: 'var(--text-primary)' }}>
              {result.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 对联游戏 */}
      <CoupletGame />
    </div>
  );
}
