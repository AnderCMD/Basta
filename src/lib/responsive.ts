import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Ancho de referencia (iPhone estándar) para la escala. */
const BASE_WIDTH = 390;

export type Layout = {
  width: number;
  height: number;
  /** Lado más corto de la pantalla. */
  short: number;
  isTablet: boolean;
  isLandscape: boolean;
  /** Factor de escala para tipografía y componentes (0.85 – 1.45). */
  scale: number;
  /** Ancho máximo recomendado para el contenido de una pantalla. */
  contentWidth: number;
  /** Escala un valor en puntos. */
  s: (n: number) => number;
};

export function computeLayout(width: number, height: number): Layout {
  const short = Math.min(width, height);
  const isTablet = short >= 600;
  const isLandscape = width > height;
  const scale = clamp(short / BASE_WIDTH, 0.85, isTablet ? 1.45 : 1.12);
  const contentWidth = Math.min(width - 32, isTablet ? 880 : 600);
  return {
    width,
    height,
    short,
    isTablet,
    isLandscape,
    scale,
    contentWidth,
    s: (n: number) => Math.round(n * scale),
  };
}

/** Información de diseño responsivo que se actualiza al rotar o cambiar el tamaño. */
export function useLayout(): Layout {
  const { width, height } = useWindowDimensions();
  return useMemo(() => computeLayout(width, height), [width, height]);
}

/** Número de columnas que caben con un ancho mínimo por elemento. */
export function gridColumns(available: number, minItem: number, gap: number, max = 8): number {
  return clamp(Math.floor((available + gap) / (minItem + gap)), 1, max);
}
