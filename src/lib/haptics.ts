import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

let enabled = true;
export const setHapticsEnabled = (v: boolean) => {
  enabled = v;
};

const run = (fn: () => Promise<void>) => {
  if (!enabled || Platform.OS === 'web') return;
  fn().catch(() => {});
};

export const haptic = {
  tap: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  light: () => run(() => Haptics.selectionAsync()),
  warn: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  fail: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
  win: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
};
