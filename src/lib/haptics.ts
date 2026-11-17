import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

let enabled = true;

/** Activa o desactiva la vibración globalmente (se sincroniza con los ajustes). */
export function setHapticsEnabled(value: boolean) {
  enabled = value;
}

function run(fn: () => Promise<void>) {
  if (!enabled || Platform.OS === 'web') return;
  fn().catch(() => {});
}

/** Patrones de vibración con significado en el juego. */
export const haptic = {
  select: () => run(() => Haptics.selectionAsync()),
  tap: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  heavy: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
  warn: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  fail: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
};
