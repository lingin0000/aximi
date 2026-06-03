import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { useThemeStore } from '../../src/store/useThemeStore';

// Static search for offline demo (in production, calls API)
const allPoems = [
  { id: 1, title: '静夜思', author: '李白', dynasty: '唐', content: '床前明月光...' },
  { id: 2, title: '春晓', author: '孟浩然', dynasty: '唐', content: '春眠不觉晓...' },
  { id: 3, title: '登鹳雀楼', author: '王之涣', dynasty: '唐', content: '白日依山尽...' },
  { id: 7, title: '将进酒', author: '李白', dynasty: '唐', content: '君不见黄河之水天上来...' },
  { id: 33, title: '水调歌头', author: '苏轼', dynasty: '宋', content: '明月几时有...' },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { colors } = useThemeStore();

  const results = query.trim()
    ? allPoems.filter((p) =>
        p.title.includes(query) || p.author.includes(query) || p.content.includes(query),
      )
    : [];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="输入半句诗词、作者或拼音..."
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { backgroundColor: colors.bgInput, color: colors.textPrimary, borderColor: colors.border }]}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Link href={`/poem/${item.id}`} asChild>
            <TouchableOpacity style={[styles.resultItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.resultAuthor, { color: colors.textMuted }]}>
                {item.author} · {item.dynasty}
              </Text>
              <Text style={[styles.resultPreview, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.content}
              </Text>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={
          query.trim() ? (
            <Text style={[styles.empty, { color: colors.textMuted }]}>未找到相关诗词</Text>
          ) : (
            <Text style={[styles.empty, { color: colors.textMuted }]}>支持全文搜索、拼音首字母搜索</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    padding: 14, borderRadius: 12, borderWidth: 1,
    fontSize: 16, marginBottom: 16,
  },
  resultItem: { paddingVertical: 14, borderBottomWidth: 1 },
  resultTitle: { fontSize: 17, fontWeight: '500' },
  resultAuthor: { fontSize: 13, marginTop: 2 },
  resultPreview: { fontSize: 14, marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 60, fontSize: 14 },
});
