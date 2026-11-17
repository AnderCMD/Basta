import type { IconName } from '../../components/Icon';
import type { GameState, MemberStats } from './engine';

/** Premio de fin de partida ("el más rápido", "racha más larga"…). */
export type GameAward = { id: string; title: string; detail: string; icon: IconName; memberId: string };

type Entry = { memberId: string; stats: MemberStats };

function best(entries: Entry[], value: (s: MemberStats) => number | null, higherIsBetter = true): Entry | undefined {
  let top: Entry | undefined;
  let topValue = 0;
  for (const e of entries) {
    const v = value(e.stats);
    if (v === null || v <= 0) continue;
    if (!top || (higherIsBetter ? v > topValue : v < topValue)) {
      top = e;
      topValue = v;
    }
  }
  return top;
}

const secs = (msValue: number) => `${(msValue / 1000).toFixed(1)} s`;

/** Calcula los premios de la partida a partir de las estadísticas por integrante. */
export function computeAwards<L>(state: GameState<L>): GameAward[] {
  const entries: Entry[] = Object.entries(state.stats).map(([memberId, stats]) => ({ memberId, stats }));
  const awards: GameAward[] = [];

  const mvp = best(entries, (s) => s.points);
  if (mvp) awards.push({ id: 'mvp', title: 'MVP', detail: `${mvp.stats.points} puntos`, icon: 'crown', memberId: mvp.memberId });

  const fastest = best(entries, (s) => s.fastestMs, false);
  if (fastest?.stats.fastestMs)
    awards.push({ id: 'rayo', title: 'Rayo', detail: `Respuesta en ${secs(fastest.stats.fastestMs)}`, icon: 'bolt', memberId: fastest.memberId });

  const streak = best(entries, (s) => (s.bestStreak >= 2 ? s.bestStreak : 0));
  if (streak) awards.push({ id: 'racha', title: 'En racha', detail: `${streak.stats.bestStreak} seguidas`, icon: 'fire', memberId: streak.memberId });

  const letters = best(entries, (s) => s.letters);
  if (letters) awards.push({ id: 'letras', title: 'Palabrero', detail: `${letters.stats.letters} letras`, icon: 'font', memberId: letters.memberId });

  const hard = best(entries, (s) => s.hardLetters);
  if (hard) awards.push({ id: 'dificiles', title: 'Valiente', detail: `${hard.stats.hardLetters} letras difíciles`, icon: 'shield', memberId: hard.memberId });

  const golden = best(entries, (s) => s.golden);
  if (golden) awards.push({ id: 'dorado', title: 'Toque de oro', detail: `${golden.stats.golden} letras doradas`, icon: 'gem', memberId: golden.memberId });

  const avg = best(entries, (s) => (s.letters >= 3 ? s.totalMs / s.letters : null), false);
  if (avg) awards.push({ id: 'constante', title: 'Constante', detail: `Promedio ${secs(avg.stats.totalMs / avg.stats.letters)}`, icon: 'stopwatch', memberId: avg.memberId });

  return awards;
}
