import React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { haptic } from '../../lib/haptics';

export type PressableScaleProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Estilo del contenedor animado externo (márgenes, flex, posición). */
  containerStyle?: StyleProp<ViewStyle>;
  /** Escala al presionar (0.94 por defecto). */
  pressedScale?: number;
  /** Vibración ligera al tocar. */
  hapticFeedback?: boolean;
};

/**
 * Base de todos los elementos tocables: se encoge con un resorte al presionar
 * y vuelve con rebote. Reutilizado por botones, fichas, tarjetas y chips.
 */
export function PressableScale({
  children,
  style,
  containerStyle,
  pressedScale = 0.94,
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
          scale.set(withSpring(pressedScale, { damping: 15, stiffness: 400 }));
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.set(withSpring(1, { damping: 9, stiffness: 260 }));
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
