/**
 * Sistema de diseño de Basta: colores, degradados, tipografía, espacios y radios.
 * Todo componente visual debe tomar sus valores de aquí para mantener la consistencia.
 */

export const colors = {
  bgTop: '#1A0B3D',
  bgMid: '#2E0F6E',
  bgBottom: '#4A148C',
  card: 'rgba(255,255,255,0.08)',
  cardStrong: 'rgba(255,255,255,0.14)',
  cardPressed: 'rgba(255,255,255,0.2)',
  border: 'rgba(255,255,255,0.16)',
  text: '#FFFFFF',
  textDim: 'rgba(255,255,255,0.74)',
  textFaint: 'rgba(255,255,255,0.46)',
  pink: '#FF4D8D',
  yellow: '#FFD23F',
  gold: '#FFB800',
  green: '#2EE6A6',
  blue: '#3DA5FF',
  orange: '#FF8A3D',
  red: '#FF4757',
  purple: '#9B5CFF',
  cyan: '#00D4E8',
  overlay: 'rgba(10,4,30,0.9)',
  shadow: '#000000',
} as const;

export type Gradient = readonly [string, string, ...string[]];

export const gradients = {
  background: [colors.bgTop, colors.bgMid, colors.bgBottom],
  primary: ['#FF4D8D', '#FF8A3D'],
  secondary: ['#3DA5FF', '#9B5CFF'],
  success: ['#2EE6A6', '#00B4D8'],
  gold: ['#FFD23F', '#FF9F1C'],
  danger: ['#FF4757', '#C2185B'],
  purple: ['#C86BFA', '#7B2FF7'],
  neutral: ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.08)'],
} satisfies Record<string, Gradient>;

export type GradientName = keyof typeof gradients;

/** Degradados que rotan entre las fichas de letras. */
export const tileGradients: Gradient[] = [
  ['#FF4D8D', '#FF7A59'],
  ['#FFD23F', '#FF9F1C'],
  ['#2EE6A6', '#00B4D8'],
  ['#3DA5FF', '#6A5BFF'],
  ['#C86BFA', '#FF4D8D'],
  ['#FF8A3D', '#FF4757'],
];

export const goldenTile: Gradient = ['#FFF3B0', '#FFC300', '#FF9F1C'];

/** Colores para equipos y acentos de jugadores. */
export const teamColors = ['#FF4D8D', '#3DA5FF', '#2EE6A6', '#FFD23F', '#C86BFA', '#FF8A3D'] as const;

/**
 * Tipografía: SF Pro Rounded (recortada a caracteres latinos, ver scripts/subset-fonts.sh).
 * Las claves coinciden con los nombres registrados en `src/app/_layout.tsx`.
 * En React Native las fuentes personalizadas se eligen por familia, no con `fontWeight`.
 */
export const fonts = {
  regular: 'SFRounded-Regular',
  medium: 'SFRounded-Medium',
  semiBold: 'SFRounded-Semibold',
  bold: 'SFRounded-Bold',
  heavy: 'SFRounded-Heavy',
  black: 'SFRounded-Black',
} as const;

export type FontWeightName = keyof typeof fonts;

export const radius = { xs: 8, sm: 12, md: 18, lg: 26, xl: 36, pill: 999 } as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

/** Escala tipográfica base (se multiplica por la escala responsiva). */
export const typeScale = {
  display: { size: 44, font: fonts.black },
  h1: { size: 30, font: fonts.black },
  h2: { size: 22, font: fonts.heavy },
  h3: { size: 18, font: fonts.bold },
  body: { size: 16, font: fonts.medium },
  bodyBold: { size: 16, font: fonts.bold },
  small: { size: 14, font: fonts.medium },
  caption: { size: 12, font: fonts.semiBold },
  label: { size: 12, font: fonts.heavy },
} as const;

export type TextVariant = keyof typeof typeScale;
