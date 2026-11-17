import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

/**
 * Íconos de Font Awesome Free 7 (Icons: CC BY 4.0, Font: SIL OFL 1.1).
 * Usamos la fuente `fa-solid-900.ttf` directamente con el código de cada glifo
 * (tomado de `css/all.css` de Font Awesome). Para agregar un ícono:
 *   grep -A2 '^\.fa-NOMBRE {' all.css   →  copia el código "\fXXX" aquí.
 */
const SOLID = {
  back: '',
  forwardChevron: '',
  pause: '',
  play: '',
  plus: '+',
  plusCircle: '',
  minus: '',
  trash: '',
  check: '',
  gear: '',
  refresh: '',
  undo: '',
  close: '',
  heart: '',
  trophy: '',
  bolt: '',
  paw: '',
  bookOpen: '',
  book: '',
  rocket: '',
  userX: '',
  userPlus: '',
  user: '',
  users: '',
  userGroup: '',
  peopleGroup: '',
  font: '',
  home: '',
  crown: '',
  stopwatch: '',
  hourglass: '',
  clock: '',
  repeat: '',
  mobile: '',
  layers: '',
  pointer: '',
  gavel: '',
  fire: '',
  skull: '',
  star: '',
  info: '',
  question: '',
  flag: '',
  dice: '',
  palette: '',
  glasses: '',
  hat: '',
  medal: '',
  award: '',
  ranking: '',
  chart: '',
  list: '',
  volume: '',
  mute: '',
  shuffle: '',
  forward: '',
  shield: '',
  sliders: '',
  tag: '',
  tags: '',
  search: '',
  lock: '',
  unlock: '',
  gem: '',
  magic: '',
  smile: '',
  theater: '',
  music: '',
  film: '',
  gamepad: '',
  futbol: '',
  utensils: '',
  earth: '',
  leaf: '',
  flask: '',
  landmark: '',
  briefcase: '',
  school: '',
  shirt: '',
  car: '',
  pen: '',
  eye: '',
  bullseye: '',
  brain: '',
  lightbulb: '',
  seedling: '',
  bug: '',
  fish: '',
  dragon: '',
  ghost: '',
  wizard: '',
  graduation: '',
  headphones: '',
  mug: '',
  cake: '',
  gift: '',
  sun: '',
  moon: '',
  snowflake: '',
  beach: '',
  tree: '',
  mountain: '',
  city: '',
  plane: '',
  bus: '',
  guitar: '',
  microphone: '',
  tv: '',
  laptop: '',
  robot: '',
  atom: '',
  dna: '',
  heartPulse: '',
  dumbbell: '',
  basketball: '',
  running: '',
  brush: '',
  scroll: '',
  chess: '',
  dog: '',
  cat: '',
  frog: '',
  horse: '',
  dove: '',
} as const;

const BRANDS = {
  github: '',
} as const;

export type IconName = keyof typeof SOLID | keyof typeof BRANDS;

/** Fuentes que deben cargarse con `useFonts` antes de mostrar íconos. */
export const ICON_FONTS = {
  FASolid: require('../../assets/fonts/fa-solid-900.ttf'),
  FABrands: require('../../assets/fonts/fa-brands-400.ttf'),
};

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function Icon({ name, size = 24, color = '#fff', style }: Props) {
  const brand = name in BRANDS;
  const glyph = brand ? BRANDS[name as keyof typeof BRANDS] : SOLID[name as keyof typeof SOLID];
  return (
    <Text
      allowFontScaling={false}
      accessible={false}
      importantForAccessibility="no"
      style={[
        {
          fontFamily: brand ? 'FABrands' : 'FASolid',
          fontSize: size * 0.9,
          lineHeight: size,
          minWidth: size * 1.15,
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
