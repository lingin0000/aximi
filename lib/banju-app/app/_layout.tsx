import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useThemeStore } from '../src/store/useThemeStore';

export default function RootLayout() {
  const { colors } = useThemeStore();

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bgCard },
          headerTintColor: colors.accent,
          headerTitleStyle: { fontFamily: 'serif', color: colors.textPrimary },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="poem/[id]" options={{ title: '诗词详情' }} />
        <Stack.Screen name="login" options={{ title: '登录', presentation: 'modal' }} />
      </Stack>
    </>
  );
}
