/** Abecedario del español de México (27 letras, con Ñ). */
export const MX_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
] as const;

/** Dígrafos tradicionales que muchas familias todavía usan al jugar. */
export const DIGRAPHS = ['CH', 'LL'] as const;

/** Letras con pocas palabras; se pueden quitar y valen más puntos. */
export const HARD_LETTERS: readonly string[] = ['K', 'Ñ', 'Q', 'W', 'X', 'Y'];

/** Letras de dificultad media (valen 2). */
const MEDIUM_LETTERS: readonly string[] = ['F', 'G', 'H', 'J', 'U', 'V', 'Z', 'CH', 'LL'];

export type AlphabetOptions = { includeDigraphs: boolean; excludeHard: boolean };

export function buildAlphabet({ includeDigraphs, excludeHard }: AlphabetOptions): string[] {
  const base: string[] = excludeHard ? MX_ALPHABET.filter((l) => !HARD_LETTERS.includes(l)) : [...MX_ALPHABET];
  if (!includeDigraphs) return base;
  // CH va después de C y LL después de L, como en el abecedario tradicional.
  const out: string[] = [];
  for (const l of base) {
    out.push(l);
    if (l === 'C') out.push('CH');
    if (l === 'L') out.push('LL');
  }
  return out;
}

/** Valor de una letra para la puntuación: 1 común, 2 media, 3 difícil. */
export function letterValue(letter: string): 1 | 2 | 3 {
  if (HARD_LETTERS.includes(letter)) return 3;
  if (MEDIUM_LETTERS.includes(letter)) return 2;
  return 1;
}

export const isHardLetter = (letter: string) => HARD_LETTERS.includes(letter);
