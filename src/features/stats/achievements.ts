import type { IconName } from '../../components/Icon';

/** Estadísticas acumuladas de un jugador entre partidas. */
export type CareerStats = {
  games: number;
  wins: number;
  tournamentWins: number;
  pointsWins: number;
  teamWins: number;
  /** Ganó un torneo sin perder ninguna vida. */
  flawlessWins: number;
  points: number;
  letters: number;
  bestStreak: number;
  fastestMs: number | null;
  hardLetters: number;
  golden: number;
  mistakes: number;
  awards: number;
};

export const emptyCareer = (): CareerStats => ({
  games: 0,
  wins: 0,
  tournamentWins: 0,
  pointsWins: 0,
  teamWins: 0,
  flawlessWins: 0,
  points: 0,
  letters: 0,
  bestStreak: 0,
  fastestMs: null,
  hardLetters: 0,
  golden: 0,
  mistakes: 0,
  awards: 0,
});

export type Tier = 'bronce' | 'plata' | 'oro' | 'diamante';

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  tier: Tier;
  unlocked: (s: CareerStats) => boolean;
};

export const TIER_COLORS: Record<Tier, string> = {
  bronce: '#E0915A',
  plata: '#C9D3E0',
  oro: '#FFD23F',
  diamante: '#7FE7FF',
};

/** Logros desbloqueables. Para agregar uno nuevo basta con sumarlo a la lista. */
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'debut', name: 'Debut', description: 'Juega tu primera partida.', icon: 'play', tier: 'bronce', unlocked: (s) => s.games >= 1 },
  { id: 'primera-victoria', name: 'Primera victoria', description: 'Gana una partida.', icon: 'trophy', tier: 'bronce', unlocked: (s) => s.wins >= 1 },
  { id: 'veterano', name: 'Veterano', description: 'Juega 25 partidas.', icon: 'medal', tier: 'plata', unlocked: (s) => s.games >= 25 },
  { id: 'maraton', name: 'Maratonista', description: 'Juega 100 partidas.', icon: 'running', tier: 'oro', unlocked: (s) => s.games >= 100 },
  { id: 'campeon-5', name: 'Campeón', description: 'Gana 5 partidas.', icon: 'award', tier: 'plata', unlocked: (s) => s.wins >= 5 },
  { id: 'leyenda', name: 'Leyenda', description: 'Gana 25 partidas.', icon: 'crown', tier: 'oro', unlocked: (s) => s.wins >= 25 },
  { id: 'inmortal', name: 'Inmortal', description: 'Gana 100 partidas.', icon: 'dragon', tier: 'diamante', unlocked: (s) => s.wins >= 100 },
  { id: 'torneo', name: 'Rey del torneo', description: 'Gana un torneo.', icon: 'trophy', tier: 'plata', unlocked: (s) => s.tournamentWins >= 1 },
  { id: 'intocable', name: 'Intocable', description: 'Gana un torneo sin perder una vida.', icon: 'shield', tier: 'oro', unlocked: (s) => s.flawlessWins >= 1 },
  { id: 'goleador', name: 'Goleador', description: 'Gana una partida de Puntos.', icon: 'ranking', tier: 'plata', unlocked: (s) => s.pointsWins >= 1 },
  { id: 'equipo', name: 'Trabajo en equipo', description: 'Gana con tu equipo.', icon: 'peopleGroup', tier: 'plata', unlocked: (s) => s.teamWins >= 1 },
  { id: 'letras-100', name: 'Cien palabras', description: 'Juega 100 letras.', icon: 'font', tier: 'bronce', unlocked: (s) => s.letters >= 100 },
  { id: 'letras-1000', name: 'Diccionario andante', description: 'Juega 1,000 letras.', icon: 'book', tier: 'oro', unlocked: (s) => s.letters >= 1000 },
  { id: 'puntos-1000', name: 'Mil puntos', description: 'Acumula 1,000 puntos.', icon: 'star', tier: 'bronce', unlocked: (s) => s.points >= 1000 },
  { id: 'puntos-10000', name: 'Millonario', description: 'Acumula 10,000 puntos.', icon: 'gem', tier: 'oro', unlocked: (s) => s.points >= 10000 },
  { id: 'racha-5', name: 'En llamas', description: 'Logra una racha de 5.', icon: 'fire', tier: 'bronce', unlocked: (s) => s.bestStreak >= 5 },
  { id: 'racha-10', name: 'Imparable', description: 'Logra una racha de 10.', icon: 'rocket', tier: 'oro', unlocked: (s) => s.bestStreak >= 10 },
  { id: 'rayo', name: 'Rayo', description: 'Responde en menos de 1.5 s.', icon: 'bolt', tier: 'plata', unlocked: (s) => s.fastestMs !== null && s.fastestMs <= 1500 },
  { id: 'relampago', name: 'Relámpago', description: 'Responde en menos de 0.8 s.', icon: 'bolt', tier: 'diamante', unlocked: (s) => s.fastestMs !== null && s.fastestMs <= 800 },
  { id: 'valiente', name: 'Valiente', description: 'Juega 10 letras difíciles (K, Ñ, Q, W, X, Y).', icon: 'shield', tier: 'plata', unlocked: (s) => s.hardLetters >= 10 },
  { id: 'dorado', name: 'Toque de Midas', description: 'Toca 10 letras doradas.', icon: 'gem', tier: 'plata', unlocked: (s) => s.golden >= 10 },
  { id: 'premiado', name: 'Coleccionista de premios', description: 'Gana 10 premios de fin de partida.', icon: 'medal', tier: 'oro', unlocked: (s) => s.awards >= 10 },
];

export const unlockedIds = (s: CareerStats) => ACHIEVEMENTS.filter((a) => a.unlocked(s)).map((a) => a.id);
