export const colors = {
  bgTop: '#1A0B3D',
  bgMid: '#2E0F6E',
  bgBottom: '#4A148C',
  card: 'rgba(255,255,255,0.08)',
  cardStrong: 'rgba(255,255,255,0.14)',
  border: 'rgba(255,255,255,0.16)',
  text: '#FFFFFF',
  textDim: 'rgba(255,255,255,0.72)',
  textFaint: 'rgba(255,255,255,0.45)',
  pink: '#FF4D8D',
  yellow: '#FFD23F',
  green: '#2EE6A6',
  blue: '#3DA5FF',
  orange: '#FF8A3D',
  red: '#FF4757',
  purple: '#9B5CFF',
  overlay: 'rgba(10,4,30,0.86)',
};

/** Colores vivos que rotan entre las fichas de letras. */
export const tileGradients: [string, string][] = [
  ['#FF4D8D', '#FF7A59'],
  ['#FFD23F', '#FF9F1C'],
  ['#2EE6A6', '#00B4D8'],
  ['#3DA5FF', '#6A5BFF'],
  ['#C86BFA', '#FF4D8D'],
  ['#FF8A3D', '#FF4757'],
];

export const gradients = {
  background: [colors.bgTop, colors.bgMid, colors.bgBottom] as const,
  primary: ['#FF4D8D', '#FF8A3D'] as const,
  secondary: ['#3DA5FF', '#9B5CFF'] as const,
  success: ['#2EE6A6', '#00B4D8'] as const,
  gold: ['#FFD23F', '#FF9F1C'] as const,
  danger: ['#FF4757', '#C2185B'] as const,
  neutral: ['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.08)'] as const,
};

export const radius = { sm: 12, md: 18, lg: 26, xl: 36 };

/**
 * Tipografía: Nunito (Google Fonts, licencia SIL OFL), redondeada y amigable.
 * Se carga en `src/app/_layout.tsx`.
 */
export const fonts = {
  regular: 'Nunito_400Regular',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
};
