import React from 'react';
import { Text, type TextProps } from 'react-native';
import { useLayout } from '../../lib/responsive';
import { colors, fonts, typeScale, type FontWeightName, type TextVariant } from '../../lib/theme';

export type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: string;
  weight?: FontWeightName;
  align?: 'left' | 'center' | 'right';
  /** Tamaño explícito (se escala igual que las variantes). */
  size?: number;
  uppercase?: boolean;
};

/**
 * Texto base de la app: aplica la tipografía, la escala responsiva y el color.
 * Usarlo en lugar de `Text` garantiza consistencia en teléfonos y tabletas.
 */
export function AppText({ variant = 'body', color = colors.text, weight, align, size, uppercase, style, ...rest }: AppTextProps) {
  const { scale } = useLayout();
  const v = typeScale[variant];
  const fontSize = Math.round((size ?? v.size) * scale);
  return (
    <Text
      maxFontSizeMultiplier={1.3}
      {...rest}
      style={[
        {
          fontFamily: weight ? fonts[weight] : v.font,
          fontSize,
          lineHeight: Math.round(fontSize * 1.28),
          color,
          textAlign: align,
          letterSpacing: variant === 'label' ? 1.2 : undefined,
          textTransform: uppercase || variant === 'label' ? 'uppercase' : undefined,
        },
        style,
      ]}
    />
  );
}
