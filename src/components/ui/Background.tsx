import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, gradients } from '../../lib/theme';

function Blob({ color, size, style, duration, dx, dy }: { color: string; size: number; style: object; duration: number; dx: number; dy: number }) {
  const t = useSharedValue(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    t.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [t, duration, reduce]);
  const animated = useAnimatedStyle(() => ({
    transform: [{ translateX: t.value * dx }, { translateY: t.value * dy }, { scale: 1 + t.value * 0.08 }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: 0.2 }, style, animated]}
    />
  );
}

/** Fondo degradado con burbujas que flotan lentamente. */
export function Background({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.flex}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <Blob color={colors.pink} size={280} style={{ top: -90, left: -70 }} duration={9000} dx={30} dy={20} />
      <Blob color={colors.blue} size={320} style={{ bottom: -120, right: -90 }} duration={11000} dx={-25} dy={-30} />
      <Blob color={colors.yellow} size={150} style={{ top: '42%', right: -50 }} duration={7000} dx={-20} dy={25} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1, backgroundColor: colors.bgTop, overflow: 'hidden' } });
