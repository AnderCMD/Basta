import React, { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { teamColors } from '../lib/theme';

/** Pseudoaleatorio determinista por índice (mulberry32): mismo confeti en cada render. */
function seeded(seed: number) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

type Piece = { x: number; delay: number; duration: number; rotate: number; drift: number; color: string; w: number; h: number };

function ConfettiPiece({ piece, height }: { piece: Piece; height: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(piece.delay, withTiming(1, { duration: piece.duration, easing: Easing.out(Easing.quad) }));
  }, [t, piece]);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - Math.max(0, t.value - 0.8) * 5,
    transform: [
      { translateY: -40 + t.value * (height + 80) },
      { translateX: Math.sin(t.value * Math.PI * 3) * piece.drift },
      { rotate: `${t.value * piece.rotate}deg` },
    ],
  }));
  return <Animated.View style={[{ position: 'absolute', left: piece.x, top: 0, width: piece.w, height: piece.h, backgroundColor: piece.color, borderRadius: 2 }, style]} />;
}

/** Lluvia de confeti para celebrar victorias. Respeta "reducir movimiento". */
export function Confetti({ count = 70 }: { count?: number }) {
  const { width, height } = useWindowDimensions();
  const reduce = useReducedMotion();
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (k: number) => seeded(i * 7 + k);
        return {
          x: r(1) * width,
          delay: r(2) * 600,
          duration: 2200 + r(3) * 1800,
          rotate: 360 + r(4) * 720,
          drift: 10 + r(5) * 30,
          color: teamColors[i % teamColors.length],
          w: 6 + r(6) * 6,
          h: 10 + r(7) * 8,
        };
      }),
    [count, width],
  );
  if (reduce) return null;
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { zIndex: 60 }]}>
      {pieces.map((p, i) => (
        <ConfettiPiece key={i} piece={p} height={height} />
      ))}
    </Animated.View>
  );
}
