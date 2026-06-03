import { Tabs } from 'expo-router';
import { useThemeStore } from '../../src/store/useThemeStore';

export default function TabLayout() {
  const { colors } = useThemeStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.bgCard,
          borderTopColor: colors.border,
        },
        headerStyle: { backgroundColor: colors.bgHeader },
        headerTintColor: colors.textOnHeader,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: '首页', tabBarLabel: '首页' }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: '搜索', tabBarLabel: '搜索' }}
      />
      <Tabs.Screen
        name="library"
        options={{ title: '诗库', tabBarLabel: '诗库' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: '我的', tabBarLabel: '我的' }}
      />
    </Tabs>
  );
}
