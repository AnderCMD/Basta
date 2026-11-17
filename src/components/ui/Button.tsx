import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useLayout } from '../../lib/responsive';
import { gradients, radius, type Gradient, type GradientName } from '../../lib/theme';
import { Icon, type IconName } from '../Icon';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

export type ButtonProps = {
  label: string;
  onPress: () => void;
  subtitle?: string;
  icon?: IconName;
  /** Nombre de un degradado del tema o un degradado propio. */
  tone?: GradientName | Gradient;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Alinea el contenido a la izquierda (botones grandes de menú). */
  alignStart?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

/** Altura mínima (en puntos, antes de escalar) de cada tamaño de botón. */
const MIN_HEIGHT = { sm: 44, md: 64, lg: 92 } as const;

/** Botón con degradado, ícono opcional y subtítulo. */
export function Button({
  label,
  onPress,
  subtitle,
  icon,
  tone = 'primary',
  size = 'md',
  disabled,
  alignStart,
  style,
  accessibilityHint,
}: ButtonProps) {
  const { s } = useLayout();
  const colors = typeof tone === 'string' ? gradients[tone] : tone;
  // Alturas fijas por tamaño: botones con y sin subtítulo quedan parejos.
  const minHeight = s(MIN_HEIGHT[size]);
  const pad = size === 'lg' ? s(14) : size === 'sm' ? s(8) : s(10);
  const iconSize = s(size === 'lg' ? 30 : size === 'sm' ? 16 : 20);

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      containerStyle={style}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint ?? subtitle}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.btn,
          {
            paddingVertical: pad,
            minHeight,
            paddingHorizontal: s(size === 'sm' ? 14 : 20),
            justifyContent: alignStart ? 'flex-start' : 'center',
            borderRadius: size === 'sm' ? radius.md : radius.lg,
          },
        ]}
      >
        {icon ? (
          <View style={size === 'lg' ? [styles.iconBubble, { width: s(52), height: s(52), borderRadius: s(18) }] : undefined}>
            <Icon name={icon} size={iconSize} />
          </View>
        ) : null}
        <View style={{ flexShrink: 1 }}>
          <AppText variant={size === 'lg' ? 'h2' : size === 'sm' ? 'small' : 'h3'} weight={size === 'sm' ? 'bold' : undefined} numberOfLines={1}>
            {label}
          </AppText>
          {subtitle ? (
            <AppText variant="small" color="rgba(255,255,255,0.88)" numberOfLines={2}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
      </LinearGradient>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    // Sin `elevation`: en Android la sombra se dibuja como un rectángulo gris
    // detrás del degradado (doble fondo), sobre todo en tonos translúcidos.
    overflow: 'hidden',
  },
  iconBubble: { backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
});
