import { View, Text, ScrollView } from '@tarojs/components';
import './my-box.scss';

export default function MyBoxPage() {
  return (
    <ScrollView className="page" scrollY>
      <View className="header">
        <Text className="header-title">我的诗匣</Text>
        <Text className="header-count">0 收藏</Text>
      </View>

      <View className="empty-state">
        <Text className="empty-icon">📚</Text>
        <Text className="empty-text">还没有收藏诗词</Text>
        <Text className="empty-hint">浏览诗库，收藏喜欢的诗词吧</Text>
      </View>
    </ScrollView>
  );
}
