import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useState, useEffect } from 'react';
import './search.scss';

const allPoems = [
  { id: 1, title: '静夜思', author: '李白', dynasty: '唐', content: '床前明月光，疑是地上霜。' },
  { id: 2, title: '春晓', author: '孟浩然', dynasty: '唐', content: '春眠不觉晓，处处闻啼鸟。' },
  { id: 3, title: '登鹳雀楼', author: '王之涣', dynasty: '唐', content: '白日依山尽，黄河入海流。' },
];

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.params;
  const [query, setQuery] = useState(q || '');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (query.trim()) {
      const r = allPoems.filter(
        (p) => p.title.includes(query) || p.author.includes(query) || p.content.includes(query),
      );
      setResults(r);
    } else {
      setResults([]);
    }
  }, [query]);

  function handleSearch() {
    if (query.trim()) {
      const r = allPoems.filter(
        (p) => p.title.includes(query) || p.author.includes(query) || p.content.includes(query),
      );
      setResults(r);
    }
  }

  return (
    <ScrollView className="page" scrollY>
      <View className="search-bar">
        <Input
          className="search-input"
          value={query}
          onInput={(e) => setQuery(e.detail.value)}
          onConfirm={handleSearch}
          placeholder="输入关键词、半句诗或拼音..."
          confirmType="search"
        />
        <View className="search-btn" onClick={handleSearch}>
          <Text className="search-btn-text">搜索</Text>
        </View>
      </View>

      {results.length > 0 ? (
        <View className="results">
          {results.map((p) => (
            <View
              key={p.id}
              className="result-item"
              onClick={() => Taro.navigateTo({ url: `/pages/poem-detail/poem-detail?id=${p.id}` })}
            >
              <View className="result-header">
                <Text className="result-title">{p.title}</Text>
                <Text className="result-author">{p.author} · {p.dynasty}</Text>
              </View>
              <Text className="result-preview">{p.content}</Text>
            </View>
          ))}
        </View>
      ) : query.trim() ? (
        <Text className="empty">未找到相关诗词</Text>
      ) : (
        <Text className="empty">输入关键词搜索诗词</Text>
      )}
    </ScrollView>
  );
}
