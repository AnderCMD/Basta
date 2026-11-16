import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ICON_FONTS } from '../components/Icon';
import { setHapticsEnabled } from '../lib/haptics';
import { colors } from '../lib/theme';
import { AppStoreProvider, useAppStore } from '../store/AppStore';

SplashScreen.preventAutoHideAsync().catch(() => {});

function HapticsSync() {
  const { settings } = useAppStore();
  useEffect(() => setHapticsEnabled(settings.haptics), [settings.haptics]);
  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    ...ICON_FONTS,
  });
  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <HapticsSync />
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: colors.bgTop },
          }}
        >
          <Stack.Screen name="game" options={{ animation: 'fade', gestureEnabled: false }} />
        </Stack>
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}
