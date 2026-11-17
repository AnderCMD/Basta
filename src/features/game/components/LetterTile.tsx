import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import { Icon } from '../../../components/Icon';
import { AppText } from '../../../components/ui/AppText';
import { PressableScale } from '../../../components/ui/PressableScale';
import { colors, fonts, goldenTile, tileGradients } from '../../../lib/theme';
import type { Tile } from '../engine';

type Props = {
  tile: Tile | null;
  size: number;
  colorIndex: number;
  disabled?: boolean;
  onPress?: () => void;
};

/** Brillo que recorre las fichas doradas. */
function GoldenGlow({ size }: { size: number }) {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(withSequence(withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) }), withTiming(0, { duration: 700 })), -1);
  }, [pulse]);
  const style = useAnimatedStyle(() => ({ opacity: 0.35 + pulse.value * 0.5, transform: [{ scale: 1 + pulse.value * 0.08 }] }));
  return <Animated.View pointerEvents="none" style={[styles.glow, { borderRadius: size * 0.34, margin: -size * 0.08 }, style]} />;
}

/**
 * Ficha de letra. Cada letra nueva (id distinto) entra girando con resorte y
 * la que se usó sale encogiéndose. Las doradas brillan y muestran una estrella.
 */
export function LetterTile({ tile, size, colorIndex, disabled, onPress }: Props) {
  if (!tile) return <View style={[styles.empty, { width: size, height: size, borderRadius: size * 0.28 }]} />;
  const grad = tile.golden ? goldenTile : tileGradients[colorIndex % tileGradients.length];
  return (
    <Animated.View key={tile.id} entering={ZoomIn.springify().damping(11).stiffness(180)} exiting={ZoomOut.duration(160)}>
      {tile.golden ? <GoldenGlow size={size} /> : null}
      <PressableScale
        onPress={onPress}
        disabled={disabled}
        hapticFeedback={false}
        pressedScale={0.86}
        accessibilityLabel={`Letra ${tile.letter}${tile.golden ? ', dorada' : ''}`}
      >
        <LinearGradient
          colors={grad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.tile, { width: size, height: size, borderRadius: size * 0.28, borderColor: tile.golden ? '#FFF7CC' : 'rgba(255,255,255,0.55)' }]}
        >
          <View style={[styles.shine, { width: size * 0.5, height: size * 0.16, borderRadius: size * 0.08 }]} />
          <AppText
            allowFontScaling={false}
            style={[styles.letter, { fontFamily: fonts.black, fontSize: size * (tile.letter.length > 1 ? 0.42 : 0.56), lineHeight: size * 0.7 }]}
            color={tile.golden ? '#7A4A00' : colors.text}
          >
            {tile.letter}
          </AppText>
          {tile.golden ? (
            <View style={styles.star}>
              <Icon name="star" size={size * 0.2} color="#FFFFFF" />
            </View>
          ) : null}
        </LinearGradient>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  shine: { position: 'absolute', top: '10%', left: '14%', backgroundColor: 'rgba(255,255,255,0.35)' },
  letter: { textShadowColor: 'rgba(0,0,0,0.22)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 4 },
  empty: { borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border },
  glow: { ...StyleSheet.absoluteFill, backgroundColor: colors.yellow },
  star: { position: 'absolute', top: 6, right: 6 },
});
