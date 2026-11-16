import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

/**
 * Íconos de Font Awesome Free 7 (Icons: CC BY 4.0, Font: SIL OFL 1.1).
 * Se usa directamente la fuente `fa-solid-900.ttf` y el código de cada glifo
 * (ver `all.css` de Font Awesome) para no depender de librerías extra.
 */
const SOLID = {
  back: '', // chevron-left
  pause: '',
  play: '',
  plus: '+',
  minus: '',
  trash: '', // trash-can
  check: '',
  gear: '',
  refresh: '', // arrows-rotate
  undo: '', // rotate-left
  close: '', // xmark
  heart: '',
  trophy: '',
  bolt: '',
  paw: '',
  book: '', // book-open
  rocket: '',
  userX: '', // user-xmark
  font: '',
  home: '', // house
  crown: '',
  stopwatch: '',
  repeat: '',
  mobile: '', // mobile-screen
  layers: '', // layer-group
  pointer: '', // hand-pointer
  gavel: '',
  users: '',
  fire: '',
  skull: '',
  star: '',
  info: '', // circle-info
  flag: '', // flag-checkered
  clock: '',
} as const;

const BRANDS = {
  github: '',
} as const;

export type IconName = keyof typeof SOLID | keyof typeof BRANDS;

export const ICON_FONTS = {
  FASolid: require('../../assets/fonts/fa-solid-900.ttf'),
  FABrands: require('../../assets/fonts/fa-brands-400.ttf'),
};

export function Icon({
  name,
  size = 24,
  color = '#fff',
  style,
}: {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}) {
  const brand = name in BRANDS;
  const glyph = brand ? BRANDS[name as keyof typeof BRANDS] : SOLID[name as keyof typeof SOLID];
  return (
    <Text
      allowFontScaling={false}
      accessible={false}
      style={[
        {
          fontFamily: brand ? 'FABrands' : 'FASolid',
          fontSize: size * 0.9,
          lineHeight: size,
          width: size * 1.15,
          textAlign: 'center',
          color,
          includeFontPadding: false,
        },
        style,
      ]}
    >
      {glyph}
    </Text>
  );
}
