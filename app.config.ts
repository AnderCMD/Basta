import type { ConfigContext, ExpoConfig } from 'expo/config';
import pkg from './package.json';

/**
 * Configuración de Expo. La versión sale SIEMPRE de package.json:
 * para publicar una versión nueva solo hay que cambiar "version" ahí.
 */
const [major, minor, patch] = pkg.version.split('.').map((n) => parseInt(n, 10) || 0);
/** Código de versión de Android derivado de semver: 1.2.3 → 10203. */
const versionCode = major * 10000 + minor * 100 + patch;

const BG = '#1A0B3D';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Basta',
  slug: 'basta',
  version: pkg.version,
  scheme: 'basta',
  orientation: 'default',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  backgroundColor: BG,
  ios: {
    supportsTablet: true,
    requireFullScreen: false,
    bundleIdentifier: 'com.opensource.basta',
    buildNumber: String(versionCode),
    infoPlist: { ITSAppUsesNonExemptEncryption: false },
  },
  android: {
    package: 'com.opensource.basta',
    versionCode,
    adaptiveIcon: {
      backgroundColor: BG,
      foregroundImage: './assets/android-icon-foreground.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    // El juego no usa micrófono, ubicación ni internet obligatorio.
    blockedPermissions: ['android.permission.RECORD_AUDIO', 'android.permission.MODIFY_AUDIO_SETTINGS'],
  },
  web: { favicon: './assets/favicon.png' },
  plugins: [
    'expo-router',
    'expo-font',
    ['expo-audio', { microphonePermission: false, recordAudioAndroid: false, enableBackgroundPlayback: false }],
    ['expo-splash-screen', { image: './assets/splash-icon.png', imageWidth: 200, backgroundColor: BG }],
    [
      'expo-build-properties',
      {
        android: {
          // APK más pequeño: R8 elimina código sin usar y recursos sobrantes.
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          enablePngCrunchInReleaseBuilds: true,
          // Solo arquitecturas de teléfonos reales (sin x86 de emuladores Intel).
          buildArchs: ['arm64-v8a', 'armeabi-v7a'],
        },
      },
    ],
  ],
  experiments: { typedRoutes: false },
});
