import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './library.scss';

const poems = [
  { id: 1, title: '静夜思', author: '李白', dynasty: '唐' },
  { id: 3, title: '登鹳雀楼', author: '王之涣', dynasty: '唐' },
  { id: 7, title: '将进酒', author: '李白', dynasty: '唐' },
  { id: 33, title: '水调歌头', author: '苏轼', dynasty: '宋' },
];

export default function LibraryPage() {
  return (
    <ScrollView className="page" scrollY>
      <View className="header">
        <Text className="header-title">诗库</Text>
        <Text className="header-count">共 {poems.length} 首</Text>
      </View>

      <View className="poem-list">
        {poems.map((p) => (
          <View
            key={p.id}
            className="poem-card card"
            onClick={() => Taro.navigateTo({ url: `/pages/poem-detail/poem-detail?id=${p.id}` })}
          >
            <Text className="poem-title">{p.title}</Text>
            <Text className="poem-meta">{p.author} · {p.dynasty}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
