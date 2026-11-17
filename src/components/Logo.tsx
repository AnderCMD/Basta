import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { fonts, tileGradients } from '../lib/theme';
import { AppText } from './ui/AppText';

const LETTERS = ['B', 'A', 'S', 'T', 'A'];

function LogoTile({ letter, index, size, animated }: { letter: string; index: number; size: number; animated: boolean }) {
  const y = useSharedValue(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!animated || reduce) return;
    y.value = withDelay(
      index * 120,
      withRepeat(
        withSequence(
          withTiming(-size * 0.28, { duration: 360, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 420, easing: Easing.bounce }),
          withTiming(0, { duration: 1800 }),
        ),
        -1,
      ),
    );
  }, [animated, reduce, index, size, y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }, { rotate: `${(index - 2) * 4}deg` }] }));

  return (
    <Animated.View style={style}>
      <LinearGradient
        colors={tileGradients[index % tileGradients.length]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.tile, { width: size, height: size, borderRadius: size * 0.28 }]}
      >
        <View style={[styles.shine, { width: size * 0.5, height: size * 0.15, borderRadius: size * 0.08 }]} />
        <AppText allowFontScaling={false} style={{ fontFamily: fonts.black, fontSize: size * 0.58, lineHeight: size * 0.72 }}>
          {letter}
        </AppText>
      </LinearGradient>
    </Animated.View>
  );
}

/** Logotipo "BASTA" hecho de fichas. Reutilizado en el menú y en las imágenes de marca. */
export function Logo({ size = 58, animated = true, exclamation = true }: { size?: number; animated?: boolean; exclamation?: boolean }) {
  return (
    <View style={styles.row} accessibilityRole="header" accessibilityLabel="Basta">
      {exclamation ? (
        <AppText allowFontScaling={false} style={{ fontFamily: fonts.black, fontSize: size * 0.9, lineHeight: size * 1.05 }} color="#FFD23F">
          ¡
        </AppText>
      ) : null}
      {LETTERS.map((l, i) => (
        <LogoTile key={i} letter={l} index={i} size={size} animated={animated} />
      ))}
      {exclamation ? (
        <AppText allowFontScaling={false} style={{ fontFamily: fonts.black, fontSize: size * 0.9, lineHeight: size * 1.05 }} color="#FFD23F">
          !
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  shine: { position: 'absolute', top: '10%', left: '14%', backgroundColor: 'rgba(255,255,255,0.35)' },
});
