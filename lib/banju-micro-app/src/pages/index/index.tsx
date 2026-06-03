import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';

const categoryTags = ['思乡', '送别', '边塞', '山水', '田园', '爱情', '咏物', '哲理'];

export default function HomePage() {
  const [searchText, setSearchText] = useState('');

  function handleSearch() {
    if (searchText.trim()) {
      Taro.navigateTo({ url: `/pages/search/search?q=${encodeURIComponent(searchText.trim())}` });
    }
  }

  return (
    <ScrollView className="page" scrollY>
      <View className="brand">
        <Text className="brand-title">半句</Text>
        <Text className="brand-subtitle">半句寻诗，全卷入怀</Text>
      </View>

      <View className="search-wrap">
        <Input
          className="search-input"
          value={searchText}
          onInput={(e) => setSearchText(e.detail.value)}
          onConfirm={handleSearch}
          placeholder="输入半句诗词..."
          confirmType="search"
        />
        <View className="search-btn" onClick={handleSearch}>
          <Text className="search-btn-text">搜诗</Text>
        </View>
      </View>

      <View className="daily-card" onClick={() => Taro.navigateTo({ url: '/pages/poem-detail/poem-detail?id=1' })}>
        <Text className="daily-badge">📜 每日一诗</Text>
        <Text className="daily-title">静夜思</Text>
        <Text className="daily-author">李白 · 唐</Text>
        <Text className="daily-line">床前明月光，疑是地上霜。</Text>
        <Text className="daily-line">举头望明月，低头思故乡。</Text>
      </View>

      <View className="section">
        <Text className="section-title">诗词分类</Text>
        <View className="tags">
          {categoryTags.map((tag) => (
            <View
              key={tag}
              className="tag"
              onClick={() => Taro.navigateTo({ url: `/pages/library/library?theme=${tag}` })}
            >
              <Text className="tag-text">{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
