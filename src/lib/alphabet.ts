/** Abecedario del español de México (27 letras, con Ñ). */
export const MX_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
  'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

/** Dígrafos tradicionales que muchas familias todavía usan al jugar. */
export const DIGRAPHS = ['CH', 'LL'];

/** Letras con pocas palabras; se pueden quitar para partidas más fáciles. */
export const HARD_LETTERS = ['K', 'Ñ', 'Q', 'W', 'X', 'Y'];

export type AlphabetOptions = { includeDigraphs: boolean; excludeHard: boolean };

export function buildAlphabet({ includeDigraphs, excludeHard }: AlphabetOptions): string[] {
  const base = excludeHard ? MX_ALPHABET.filter((l) => !HARD_LETTERS.includes(l)) : [...MX_ALPHABET];
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

export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
