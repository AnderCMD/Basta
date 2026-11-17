import type { GameAward } from '../game/awards';
import { ranking, type GameState } from '../game/engine';
import { emptyCareer, unlockedIds, type CareerStats } from './achievements';

/** Resultado de aplicar una partida al historial de un jugador. */
export type CareerUpdate = { playerId: string; career: CareerStats; newAchievements: string[] };

/**
 * Suma una partida terminada a las estadísticas de cada jugador y devuelve
 * qué logros se desbloquearon. Función pura (fácil de probar).
 */
export function applyGameToCareers<L>(
  state: GameState<L>,
  awards: GameAward[],
  careers: Record<string, CareerStats | undefined>,
): CareerUpdate[] {
  const champion = ranking(state)[0];
  const mode = state.config.mode;
  const updates: CareerUpdate[] = [];

  for (const competitor of state.competitors) {
    const won = competitor.id === champion?.id;
    for (const member of competitor.members) {
      const prev = careers[member.id] ?? emptyCareer();
      const g = state.stats[member.id];
      if (!g) continue;
      const next: CareerStats = {
        ...prev,
        games: prev.games + 1,
        wins: prev.wins + (won ? 1 : 0),
        tournamentWins: prev.tournamentWins + (won && mode === 'tournament' ? 1 : 0),
        pointsWins: prev.pointsWins + (won && mode === 'points' ? 1 : 0),
        teamWins: prev.teamWins + (won && mode === 'teams' ? 1 : 0),
        flawlessWins: prev.flawlessWins + (won && mode === 'tournament' && competitor.lives === state.config.lives ? 1 : 0),
        points: prev.points + g.points,
        letters: prev.letters + g.letters,
        bestStreak: Math.max(prev.bestStreak, g.bestStreak),
        fastestMs: g.fastestMs === null ? prev.fastestMs : prev.fastestMs === null ? g.fastestMs : Math.min(prev.fastestMs, g.fastestMs),
        hardLetters: prev.hardLetters + g.hardLetters,
        golden: prev.golden + g.golden,
        mistakes: prev.mistakes + g.mistakes + g.timeouts,
        awards: prev.awards + awards.filter((a) => a.memberId === member.id).length,
      };
      const before = new Set(unlockedIds(prev));
      const newAchievements = unlockedIds(next).filter((id) => !before.has(id));
      updates.push({ playerId: member.id, career: next, newAchievements });
    }
  }
  return updates;
}
