import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useThemeStore } from '../../src/store/useThemeStore';
import { usePoetryStore } from '../../src/store/usePoetryStore';

// Static preview data (in production, fetched from API)
const dailyPoem = {
  id: 1,
  title: '静夜思',
  author: '李白',
  dynasty: '唐',
  content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
};

const tags = ['思乡', '送别', '边塞', '山水', '田园', '爱情', '咏物', '哲理'];

export default function HomeScreen() {
  const { colors } = useThemeStore();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Brand */}
      <View style={styles.brand}>
        <Text style={[styles.brandTitle, { color: colors.accent }]}>半句</Text>
        <Text style={[styles.brandSubtitle, { color: colors.accentGlow }]}>
          半句寻诗，全卷入怀
        </Text>
      </View>

      {/* Search prompt */}
      <Link href="/(tabs)/search" asChild>
        <TouchableOpacity style={[styles.searchBar, { backgroundColor: colors.bgInput, borderColor: colors.border }]}>
          <Text style={{ color: colors.textMuted }}>🔍 输入半句诗词...</Text>
        </TouchableOpacity>
      </Link>

      {/* Daily Poem */}
      <View style={[styles.card, { backgroundColor: colors.accent, borderColor: colors.border }]}>
        <Text style={styles.dailyBadge}>📜 每日一诗</Text>
        <Link href={`/poem/${dailyPoem.id}`}>
          <Text style={[styles.poemTitle, { color: '#fff' }]}>{dailyPoem.title}</Text>
          <Text style={[styles.poemAuthor, { color: 'rgba(255,255,255,0.65)' }]}>
            {dailyPoem.author} · {dailyPoem.dynasty}
          </Text>
          <View style={styles.poemLines}>
            {dailyPoem.content.split('\n').slice(0, 2).map((line, i) => (
              <Text key={i} style={[styles.poemLine, { color: 'rgba(255,255,255,0.9)' }]}>{line}</Text>
            ))}
          </View>
        </Link>
      </View>

      {/* Tags */}
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>诗词分类</Text>
      <View style={styles.tags}>
        {tags.map((tag) => (
          <Link key={tag} href={`/(tabs)/library?theme=${tag}`} asChild>
            <TouchableOpacity style={[styles.tag, { backgroundColor: colors.bgTag }]}>
              <Text style={[styles.tagText, { color: colors.accent }]}>{tag}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  brand: { alignItems: 'center', paddingTop: 40, paddingBottom: 20 },
  brandTitle: { fontSize: 32, fontWeight: '700', fontFamily: 'serif' },
  brandSubtitle: { fontSize: 14, marginTop: 4, fontFamily: 'serif' },
  searchBar: {
    padding: 14, borderRadius: 12, borderWidth: 1,
    alignItems: 'center', marginBottom: 24,
  },
  card: { borderRadius: 16, padding: 24, marginBottom: 24 },
  dailyBadge: { color: '#fff', fontSize: 12, marginBottom: 8, opacity: 0.8 },
  poemTitle: { fontSize: 24, fontWeight: '600', marginBottom: 4 },
  poemAuthor: { fontSize: 14, marginBottom: 12 },
  poemLines: { gap: 6 },
  poemLine: { fontSize: 18, lineHeight: 28, fontFamily: 'serif' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, fontFamily: 'serif' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 13 },
});
