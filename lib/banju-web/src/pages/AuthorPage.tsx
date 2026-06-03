import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { getAllPoems } from '@/data/poetryStore';
import PoemCard from '@/components/PoemCard';
import { useThemeStore } from '@/store/useThemeStore';

export default function AuthorPage() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name || '');
  const allPoems = getAllPoems();
  const { currentTheme } = useThemeStore();

  const authorPoems = useMemo(
    () => allPoems.filter((p) => p.author === decodedName),
    [decodedName],
  );

  const dynasty = authorPoems[0]?.dynasty || '';
  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    authorPoems.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return [...tagSet].slice(0, 10);
  }, [authorPoems]);

  if (authorPoems.length === 0) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: 'var(--text-muted)' }}>未找到该作者</p>
        <Link to="/library" className="text-sm" style={{ color: 'var(--accent)' }}>
          返回诗库
        </Link>
      </div>
    );
  }

  const isTech = currentTheme === 'tech';

  return (
    <div className="p-4 md:p-6">
      {/* Author header */}
      <div className="mb-6">
        {isTech ? (
          <div className="font-mono">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--accent)' }}>class</span> {decodedName}
            </h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {'// '}{dynasty} · {authorPoems.length} 首作品
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>
              {decodedName}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {dynasty} · {authorPoems.length} 首作品
            </p>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.map((t) => (
              <span key={t} className="theme-tag text-xs">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Poems list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {authorPoems.map((poem) => (
          <PoemCard key={poem.id} poem={poem} size="md" />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/library"
          className="text-sm hover:underline"
          style={{ color: 'var(--accent)' }}
        >
          ← 返回诗库浏览更多
        </Link>
      </div>
    </div>
  );
}
