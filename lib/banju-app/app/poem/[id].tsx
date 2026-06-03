import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { useThemeStore } from '../../src/store/useThemeStore';
import { usePoetryStore } from '../../src/store/usePoetryStore';

// Static poem data (in production, fetched from API)
const poemsMap: Record<string, any> = {
  '1': { id: 1, title: '静夜思', author: '李白', dynasty: '唐', form: '五绝',
    content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
    translation: '明亮的月光洒在床前，好像地上泛起了一层白霜。我抬起头来看到窗外的一轮明月，不由得低头沉思，想起远方的家乡。',
    appreciation: '这首诗写的是在寂静的月夜思念家乡的感受。诗的前两句写诗人在作客他乡的特定环境中一刹那间所产生的错觉。',
    tags: ['思乡', '月亮', '五绝'],
  },
};

export default function PoemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const poem = poemsMap[id || '1'] || poemsMap['1'];
  const { colors } = useThemeStore();
  const { toggleFavorite, isFavorite, toggleMemorized, isMemorized } = usePoetryStore();

  if (!poem) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 60 }}>未找到该诗词</Text>
      </View>
    );
  }

  const fav = isFavorite(poem.id);
  const mem = isMemorized(poem.id);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen options={{ title: poem.title }} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.accent, fontFamily: 'serif' }]}>{poem.title}</Text>
        <Text style={[styles.author, { color: colors.textSecondary }]}>
          {poem.author} · {poem.dynasty} · {poem.form}
        </Text>
        <View style={styles.tags}>
          {poem.tags.map((tag: string) => (
            <View key={tag} style={[styles.tag, { backgroundColor: colors.bgTag }]}>
              <Text style={[styles.tagText, { color: colors.accent }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        {poem.content.split('\n').map((line: string, i: number) => (
          <Text key={i} style={[styles.poemLine, { color: colors.textPrimary, fontFamily: 'serif' }]}>
            {line}
          </Text>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => toggleFavorite(poem.id)}
          style={[styles.actionBtn, { backgroundColor: fav ? 'rgba(239,68,68,0.1)' : colors.bgTag }]}
        >
          <Text style={{ color: fav ? '#EF4444' : colors.textMuted, fontSize: 14 }}>
            {fav ? '♥ 已收藏' : '♡ 收藏'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleMemorized(poem.id)}
          style={[styles.actionBtn, { backgroundColor: mem ? 'rgba(22,163,74,0.1)' : colors.bgTag }]}
        >
          <Text style={{ color: mem ? '#16A34A' : colors.textMuted, fontSize: 14 }}>
            {mem ? '✓ 已背' : '标记已背'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Translation */}
      <View style={[styles.section, { borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>译文</Text>
        <Text style={[styles.sectionText, { color: colors.textSecondary }]}>{poem.translation}</Text>
      </View>

      {/* Appreciation */}
      <View style={[styles.section, { borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>赏析</Text>
        <Text style={[styles.sectionText, { color: colors.textSecondary }]}>{poem.appreciation}</Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '600', marginBottom: 4 },
  author: { fontSize: 14, marginBottom: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  tag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  tagText: { fontSize: 12 },
  card: { borderRadius: 12, padding: 24, borderWidth: 1, marginBottom: 16, alignItems: 'center' },
  poemLine: { fontSize: 20, lineHeight: 32, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 20 },
  actionBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  section: { marginBottom: 16, paddingTop: 16, borderTopWidth: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '500', marginBottom: 8 },
  sectionText: { fontSize: 15, lineHeight: 24 },
});
