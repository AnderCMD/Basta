import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Avatar, type AvatarLook } from '../../../components/avatar/Avatar';
import { Icon } from '../../../components/Icon';
import { AppText } from '../../../components/ui/AppText';
import { colors } from '../../../lib/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  size: number;
  /** Fracción de tiempo restante (0–1). */
  progress: number;
  seconds: number;
  ready: boolean;
  look: AvatarLook;
  onStart: () => void;
};

/**
 * Reloj circular del centro del tablero. El aro se anima de forma continua
 * (verde → amarillo → rojo) y late cuando quedan pocos segundos o al esperar.
 */
export function TimerCore({ size, progress, seconds, ready, look, onStart }: Props) {
  const stroke = size * 0.08;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;

  const p = useSharedValue(progress);
  useEffect(() => {
    p.value = withTiming(ready ? 1 : progress, { duration: ready ? 300 : 120, easing: Easing.linear });
  }, [progress, ready, p]);

  const ringProps = useAnimatedProps(() => ({ strokeDashoffset: circ * (1 - p.value) }));
  // El color se calcula en JS: funciona igual en iOS, Android y web.
  const ringColor = ready || progress > 0.5 ? colors.green : progress > 0.25 ? colors.yellow : colors.red;

  const beat = useSharedValue(1);
  const danger = !ready && seconds <= 3;
  useEffect(() => {
    if (ready || danger) {
      beat.value = withRepeat(withSequence(withTiming(danger ? 1.08 : 1.05, { duration: danger ? 250 : 600 }), withTiming(1, { duration: danger ? 250 : 600 })), -1);
    } else {
      beat.value = withTiming(1, { duration: 150 });
    }
  }, [ready, danger, beat]);
  const beatStyle = useAnimatedStyle(() => ({ transform: [{ scale: beat.value }] }));

  return (
    <Animated.View style={beatStyle}>
      <Pressable
        disabled={!ready}
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel={ready ? 'Empezar turno' : `Quedan ${seconds} segundos`}
        style={[styles.core, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} fill="none" />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={ringColor}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circ} ${circ}`}
            animatedProps={ringProps}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <Avatar look={look} size={size * 0.5} />
        {ready ? (
          <View style={styles.startPill}>
            <Icon name="play" size={size * 0.1} />
            <AppText weight="black" size={Math.max(10, size * 0.085)}>
              EMPEZAR
            </AppText>
          </View>
        ) : (
          <AppText weight="black" size={size * 0.15} color={danger ? colors.red : colors.text} style={{ lineHeight: size * 0.19 }}>
            {seconds}
          </AppText>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  core: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.32)' },
  startPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: colors.green,
  },
});
