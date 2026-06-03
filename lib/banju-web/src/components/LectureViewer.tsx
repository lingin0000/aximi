import { useState } from 'react';
import { aiApi } from '@/api/ai';

interface LectureViewerProps {
  poemId: number;
}

interface Chapter {
  title: string;
  content: string;
  order: number;
}

export default function LectureViewer({ poemId }: LectureViewerProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapter, setActiveChapter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function loadLecture() {
    if (loaded) return;
    setLoading(true);
    try {
      const { data } = await aiApi.generateLecture(poemId);
      const lectureData = data.data;
      setChapters(lectureData.chapters || []);
      setLoaded(true);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={loadLecture}
        disabled={loading}
        className="flex items-center gap-2 text-sm px-4 py-2 rounded-full transition-all disabled:opacity-50"
        style={{ backgroundColor: 'var(--bg-tag)', color: 'var(--accent)' }}
      >
        <span>🎓</span>
        <span>{loading ? '生成讲解中...' : loaded ? 'AI 深度讲解' : 'AI 深度讲解'}</span>
      </button>

      {loaded && chapters.length > 0 && (
        <div className="mt-4 p-4 rounded-xl" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-card)' }}>
          {/* Chapter tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {chapters.map((ch, i) => (
              <button
                key={i}
                onClick={() => setActiveChapter(i)}
                className="text-xs px-3 py-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: activeChapter === i ? 'var(--accent)' : 'var(--bg-tag)',
                  color: activeChapter === i ? 'var(--text-on-header)' : 'var(--text-secondary)',
                }}
              >
                {ch.title}
              </button>
            ))}
          </div>

          {/* Active chapter content */}
          <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
            {chapters[activeChapter]?.content.split('\n').map((p, i) => (
              <p key={i} className="mb-2">{p}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
