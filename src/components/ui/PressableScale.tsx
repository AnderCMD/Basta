import React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { haptic } from '../../lib/haptics';

export type PressableScaleProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Estilo del contenedor animado externo (márgenes, flex, posición). */
  containerStyle?: StyleProp<ViewStyle>;
  /** Escala al presionar (0.97 por defecto). */
  pressedScale?: number;
  /** Vibración ligera al tocar. */
  hapticFeedback?: boolean;
};

/**
 * Base de todos los elementos tocables: se encoge un poco al presionar
 * y vuelve sin rebote (nada de "brincos" que mareen). Reutilizado por botones, fichas, tarjetas y chips.
 */
export function PressableScale({
  children,
  style,
  containerStyle,
  pressedScale = 0.97,
  hapticFeedback = true,
  onPressIn,
  onPressOut,
  onPress,
  disabled,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <Animated.View style={[animated, containerStyle, disabled && { opacity: 0.45 }]}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPressIn={(e) => {
          scale.set(withTiming(pressedScale, { duration: 90 }));
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.set(withTiming(1, { duration: 140 }));
          onPressOut?.(e);
        }}
        onPress={(e) => {
          if (hapticFeedback) haptic.select();
          onPress?.(e);
        }}
        style={style}
        {...rest}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
