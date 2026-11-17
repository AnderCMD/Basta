import React from 'react';
import { useLayout } from '../../lib/responsive';
import { colors } from '../../lib/theme';
import { Icon, type IconName } from '../Icon';
import { PressableScale } from './PressableScale';

export type IconButtonProps = {
  icon: IconName;
  onPress: () => void;
  /** Texto para lectores de pantalla (obligatorio: el botón no tiene texto visible). */
  label: string;
  size?: number;
  background?: string;
  color?: string;
  disabled?: boolean;
};

/** Botón circular solo con ícono. */
export function IconButton({ icon, onPress, label, size = 46, background = colors.cardStrong, color = colors.text, disabled }: IconButtonProps) {
  const { s } = useLayout();
  const d = s(size);
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={label}
      hitSlop={8}
      pressedScale={0.88}
      style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: background, alignItems: 'center', justifyContent: 'center' }}
    >
      <Icon name={icon} size={d * 0.46} color={color} />
    </PressableScale>
  );
}
