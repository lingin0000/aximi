import { useState, useRef, useEffect } from 'react';
import { aiApi } from '@/api/ai';
import { useThemeStore } from '@/store/useThemeStore';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface AiChatBotProps {
  poemId?: number;
  poemTitle?: string;
  className?: string;
}

export default function AiChatBot({ poemId, poemTitle, className = '' }: AiChatBotProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const { data } = await aiApi.chat(question, poemId);
      const answer = data.data?.answer || '抱歉，我暂时无法回答这个问题。';
      setMessages((prev) => [...prev, { role: 'ai', content: answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', content: '抱歉，AI 服务暂不可用。' }]);
    } finally {
      setLoading(false);
    }
  }

  const isTech = currentTheme === 'tech';
  const isAi = currentTheme === 'ai';

  return (
    <div className={className}>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full transition-all ${
          open ? 'ring-1' : ''
        }`}
        style={{
          backgroundColor: open ? 'var(--accent)' : 'var(--bg-tag)',
          color: open ? 'var(--text-on-header)' : 'var(--text-muted)',
          fontFamily: isTech ? 'monospace' : undefined,
          boxShadow: open ? '0 0 12px rgba(139,92,246,0.3)' : undefined,
        }}
      >
        <span>🤖</span>
        <span>{isTech ? 'ai.chat()' : 'AI 问答'}</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="absolute bottom-full right-0 mb-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl overflow-hidden z-50"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
        >
          {/* Header */}
          <div className="p-3 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: isTech ? 'monospace' : undefined }}>
              {isTech ? '> ai_assistant' : 'AI 诗词助手'}
            </span>
            <button onClick={() => setOpen(false)} className="text-xs hover:opacity-70" style={{ color: 'var(--text-muted)' }}>✕</button>
          </div>

          {/* Messages */}
          <div className="p-3 h-64 overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                {poemTitle ? `问问关于《${poemTitle}》的任何问题吧~` : '问我任何关于诗词的问题吧~'}
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 text-sm rounded-xl ${
                    msg.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
                  }`}
                  style={{
                    backgroundColor: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-tag)',
                    color: msg.role === 'user' ? 'var(--text-on-header)' : 'var(--text-primary)',
                    fontFamily: isAi ? 'var(--font-poem)' : undefined,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 text-sm rounded-xl rounded-bl-sm" style={{ backgroundColor: 'var(--bg-tag)', color: 'var(--text-muted)' }}>
                  <span className="animate-pulse">思考中...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="输入问题..."
                className="flex-1 px-3 py-2 text-sm rounded-lg focus:outline-none"
                style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-3 py-2 text-sm rounded-lg font-medium disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--text-on-header)' }}
              >
                {isTech ? '>' : '发送'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
