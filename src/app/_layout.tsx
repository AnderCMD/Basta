import { useFonts } from 'expo-font';
import { SplashScreen, Stack, type ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ICON_FONTS } from '../components/Icon';
import { AppText, Button } from '../components/ui';
import { setHapticsEnabled } from '../lib/haptics';
import { initSounds, setSoundEnabled } from '../lib/sound';
import { colors, fonts } from '../lib/theme';
import { AppStoreProvider, useAppStore } from '../store/AppStore';

SplashScreen.preventAutoHideAsync().catch(() => {});

/** SF Pro Rounded recortada (ver scripts/subset-fonts.sh) + Font Awesome. */
const FONT_FILES = {
  [fonts.regular]: require('../../assets/fonts/SF-Pro-Rounded-Regular.otf'),
  [fonts.medium]: require('../../assets/fonts/SF-Pro-Rounded-Medium.otf'),
  [fonts.semiBold]: require('../../assets/fonts/SF-Pro-Rounded-Semibold.otf'),
  [fonts.bold]: require('../../assets/fonts/SF-Pro-Rounded-Bold.otf'),
  [fonts.heavy]: require('../../assets/fonts/SF-Pro-Rounded-Heavy.otf'),
  [fonts.black]: require('../../assets/fonts/SF-Pro-Rounded-Black.otf'),
  ...ICON_FONTS,
};

/** Mantiene vibración y sonido sincronizados con los ajustes guardados. */
function FeedbackSync() {
  const { settings } = useAppStore();
  useEffect(() => setHapticsEnabled(settings.haptics), [settings.haptics]);
  useEffect(() => setSoundEnabled(settings.sound), [settings.sound]);
  return null;
}

/** Oculta la pantalla de carga cuando fuentes y datos guardados ya están listos. */
function SplashHider() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);
  return null;
}

/** Pantalla de error amigable si algo falla al dibujar una ruta. */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bgTop, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
      <AppText variant="h1" align="center">
        ¡Ups! Algo salió mal
      </AppText>
      <AppText variant="small" color={colors.textDim} align="center">
        {error.message}
      </AppText>
      <Button icon="refresh" label="Intentar de nuevo" onPress={retry} />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(FONT_FILES);
  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    initSounds();
  }, []);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <SplashHider />
        <FeedbackSync />
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: colors.bgTop },
          }}
        >
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="game" options={{ animation: 'fade', gestureEnabled: false }} />
        </Stack>
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}
