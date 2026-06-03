import { View, Text, ScrollView } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { useState } from 'react';
import './poem-detail.scss';

// Static data (in production fetched from API)
const poemsMap: Record<string, any> = {
  '1': {
    id: 1, title: '静夜思', author: '李白', dynasty: '唐', form: '五绝',
    content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
    translation: '明亮的月光洒在床前，好像地上泛起了一层白霜。我抬起头来看到窗外的一轮明月，不由得低头沉思，想起远方的家乡。',
    appreciation: '这首诗写的是在寂静的月夜思念家乡的感受。全诗没有奇特新颖的想象，没有精工华美的辞藻，只是用叙述的语气，写远客思乡之情，然它却意味深长，耐人寻味。',
    tags: ['思乡', '月亮', '五绝'],
  },
};

export default function PoemDetailPage() {
  const router = useRouter();
  const { id = '1' } = router.params;
  const poem = poemsMap[id] || poemsMap['1'];
  const [showTranslation, setShowTranslation] = useState(false);
  const [showAppreciation, setShowAppreciation] = useState(false);

  if (!poem) {
    return (
      <View className="page">
        <Text className="empty">未找到该诗词</Text>
      </View>
    );
  }

  return (
    <ScrollView className="page" scrollY>
      {/* Header */}
      <View className="poem-header">
        <Text className="poem-title">{poem.title}</Text>
        <Text className="poem-info">{poem.author} · {poem.dynasty} · {poem.form}</Text>
        <View className="poem-tags">
          {poem.tags.map((t: string) => (
            <View key={t} className="poem-tag"><Text className="poem-tag-text">{t}</Text></View>
          ))}
        </View>
      </View>

      {/* Content */}
      <View className="poem-content">
        {poem.content.split('\n').map((line: string, i: number) => (
          <Text key={i} className="poem-line">{line}</Text>
        ))}
      </View>

      {/* Actions */}
      <View className="poem-actions">
        <View className="action-btn">
          <Text className="action-text">♡ 收藏</Text>
        </View>
        <View className="action-btn">
          <Text className="action-text">标记已背</Text>
        </View>
      </View>

      {/* Translation */}
      <View className="poem-section">
        <View className="section-header" onClick={() => setShowTranslation(!showTranslation)}>
          <Text className="section-title">译文</Text>
          <Text className="section-arrow">{showTranslation ? '▲' : '▼'}</Text>
        </View>
        {showTranslation && <Text className="section-text">{poem.translation}</Text>}
      </View>

      {/* Appreciation */}
      <View className="poem-section">
        <View className="section-header" onClick={() => setShowAppreciation(!showAppreciation)}>
          <Text className="section-title">赏析</Text>
          <Text className="section-arrow">{showAppreciation ? '▲' : '▼'}</Text>
        </View>
        {showAppreciation && <Text className="section-text">{poem.appreciation}</Text>}
      </View>
    </ScrollView>
  );
}
