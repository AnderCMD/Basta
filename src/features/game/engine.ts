/**
 * Motor del juego Basta.
 *
 * Es un reducer PURO: no usa Math.random, timers ni React. Toda la aleatoriedad
 * (mazo barajado, categoría siguiente, letras doradas) llega dentro de las acciones,
 * lo que permite probarlo con `node:test` y reproducir cualquier partida.
 *
 * Conceptos:
 * - Competidor: quien tiene vidas y puntos. En modos individuales es un jugador;
 *   en el modo Equipos es un equipo con varios integrantes que se turnan.
 * - Ficha: cada una de las 6 letras visibles. Puede ser "dorada" (vale doble).
 * - Ronda: termina cuando alguien falla (salvo en partida clásica, que es una sola ronda).
 */
import { isHardLetter, letterValue } from '../../data/alphabet';

export const VISIBLE_LETTERS = 6;
export const MIN_TURN_MS = 3000;
export const TURBO_STEP_MS = 300;
export const WILDCARD_EXTRA_MS = 5000;
export const POINTS_MODE_PENALTY = 20;
const MAX_UNDO = 10;

export type GameMode = 'classic' | 'tournament' | 'points' | 'teams';

export type Modifiers = {
  /** El tiempo por turno baja con cada letra (mínimo 3 s). */
  turbo: boolean;
  /** La categoría cambia en cada turno. */
  chaos: boolean;
  /** Aparecen letras doradas que valen doble. */
  golden: boolean;
};

export type GameConfig = {
  mode: GameMode;
  turnSeconds: number;
  /** Vidas por competidor (torneo y equipos). */
  lives: number;
  /** Rondas a jugar en el modo Puntos. */
  rounds: number;
  /** Comodines por competidor (pasar turno o +5 s). */
  wildcards: number;
  modifiers: Modifiers;
};

export type Member<L = unknown> = { id: string; name: string; look: L };

export type Competitor<L = unknown> = {
  id: string;
  name: string;
  color: string;
  members: Member<L>[];
  /** Integrante que juega en el próximo turno de este competidor. */
  memberIndex: number;
  lives: number;
  out: boolean;
  score: number;
  streak: number;
  wildcards: number;
};

export type MemberStats = {
  letters: number;
  points: number;
  totalMs: number;
  fastestMs: number | null;
  bestStreak: number;
  mistakes: number;
  timeouts: number;
  hardLetters: number;
  golden: number;
  wildcardsUsed: number;
};

export type Tile = { id: number; letter: string; golden: boolean };

export type GameStatus = 'ready' | 'playing' | 'paused' | 'fail' | 'finished';

export type FailInfo = {
  competitorId: string;
  memberId: string;
  reason: 'timeout' | 'mistake' | 'kicked';
  eliminated: boolean;
  penalty: number;
};

export type PlayInfo = {
  seq: number;
  letter: string;
  competitorId: string;
  memberId: string;
  points: number;
  golden: boolean;
  ms: number;
};

type Snapshot<L> = Omit<GameState<L>, 'history'>;

export type GameState<L = unknown> = {
  config: GameConfig;
  competitors: Competitor<L>[];
  turn: number;
  deck: string[];
  tiles: (Tile | null)[];
  used: string[];
  category: string;
  round: number;
  lap: number;
  /** Duración del turno actual en ms (baja con Turbo). */
  turnMs: number;
  timeLeft: number;
  status: GameStatus;
  pausedFrom?: 'ready' | 'playing';
  fail?: FailInfo;
  lastPlay?: PlayInfo;
  eliminationOrder: string[];
  stats: Record<string, MemberStats>;
  /** Contador para dar ids únicos a las fichas (anima cada letra nueva). */
  tileSeq: number;
  playSeq: number;
  history: Snapshot<L>[];
};

/** Datos aleatorios que el llamador debe proveer en cada jugada. */
export type Entropy = {
  /** Mazo barajado para reponer cuando se acaba el abecedario. */
  refill: string[];
  /** Siguiente categoría (para Caos). */
  nextCategory: string;
  /** Si la ficha nueva sale dorada (solo se usa si el modificador está activo). */
  golden: boolean;
};

export type GameAction<L = unknown> =
  | { type: 'START' }
  | { type: 'TICK'; dt: number }
  | ({ type: 'PLAY'; slot: number } & Entropy)
  | ({ type: 'WILDCARD'; kind: 'pass' | 'time' } & Pick<Entropy, 'nextCategory'>)
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'MISTAKE'; competitorId: string }
  | { type: 'KICK'; competitorId: string }
  | { type: 'UNDO' }
  | { type: 'CONTINUE'; deck: string[]; category: string; goldenSlots: boolean[] }
  | { type: 'CHANGE_CATEGORY'; category: string }
  | { type: 'RESET_LETTERS'; deck: string[]; goldenSlots: boolean[] }
  | { type: 'REPLACE'; state: GameState<L> };

export const emptyStats = (): MemberStats => ({
  letters: 0,
  points: 0,
  totalMs: 0,
  fastestMs: null,
  bestStreak: 0,
  mistakes: 0,
  timeouts: 0,
  hardLetters: 0,
  golden: 0,
  wildcardsUsed: 0,
});

const ms = (s: number) => Math.round(s * 1000);

/** Puntos de una jugada: valor de la letra, rapidez, racha y bonus dorado. */
export function scorePlay(letter: string, timeLeft: number, turnMs: number, streak: number, golden: boolean): number {
  const base = 10 * letterValue(letter);
  const speed = Math.round(10 * Math.max(0, Math.min(1, timeLeft / turnMs)));
  const combo = Math.min(streak, 10) * 2;
  const total = base + speed + combo;
  return golden ? total * 2 : total;
}

function deal(deck: string[], seq: number, goldenSlots: boolean[] = []) {
  const tiles: (Tile | null)[] = [];
  let tileSeq = seq;
  for (let i = 0; i < VISIBLE_LETTERS; i++) {
    const letter = deck[i];
    tiles.push(letter ? { id: ++tileSeq, letter, golden: !!goldenSlots[i] } : null);
  }
  return { tiles, deck: deck.slice(VISIBLE_LETTERS), tileSeq };
}

export type CompetitorInput<L> = { id: string; name: string; color: string; members: Member<L>[] };

export function createGame<L>(
  config: GameConfig,
  competitors: CompetitorInput<L>[],
  deck: string[],
  category: string,
  goldenSlots: boolean[] = [],
): GameState<L> {
  const lives = config.mode === 'classic' || config.mode === 'points' ? 1 : Math.max(1, config.lives);
  const dealt = deal(deck, 0, config.modifiers.golden ? goldenSlots : []);
  const stats: Record<string, MemberStats> = {};
  for (const c of competitors) for (const m of c.members) stats[m.id] = emptyStats();
  return {
    config: { ...config, lives },
    competitors: competitors.map((c) => ({ ...c, memberIndex: 0, lives, out: false, score: 0, streak: 0, wildcards: config.wildcards })),
    turn: 0,
    deck: dealt.deck,
    tiles: dealt.tiles,
    used: [],
    category,
    round: 1,
    lap: 1,
    turnMs: ms(config.turnSeconds),
    timeLeft: ms(config.turnSeconds),
    status: 'ready',
    eliminationOrder: [],
    stats,
    tileSeq: dealt.tileSeq,
    playSeq: 0,
    history: [],
  };
}

export const activeCompetitors = <L>(s: Pick<GameState<L>, 'competitors'>) => s.competitors.filter((c) => !c.out);

/** Integrante que tiene el turno ahora. */
export function currentMember<L>(s: GameState<L>): Member<L> {
  const c = s.competitors[s.turn];
  return c.members[c.memberIndex % c.members.length];
}

/** Siguiente competidor activo después de `from` (sin incluirlo). */
export function nextActiveIndex<L>(competitors: Competitor<L>[], from: number): number {
  const n = competitors.length;
  for (let step = 1; step <= n; step++) {
    const i = (from + step) % n;
    if (!competitors[i].out) return i;
  }
  return from;
}

function withSnapshot<L>(state: GameState<L>): Snapshot<L>[] {
  const { history, ...rest } = state;
  return [...history, rest].slice(-MAX_UNDO);
}

function bumpStats(stats: Record<string, MemberStats>, id: string, patch: (s: MemberStats) => Partial<MemberStats>) {
  const prev = stats[id] ?? emptyStats();
  return { ...stats, [id]: { ...prev, ...patch(prev) } };
}

/** Rota al siguiente integrante del competidor (equipos). */
const rotate = <L>(c: Competitor<L>): Competitor<L> => ({ ...c, memberIndex: (c.memberIndex + 1) % c.members.length });

function isGameOver<L>(state: GameState<L>, competitors: Competitor<L>[]): boolean {
  if (state.config.mode === 'points') return false;
  return competitors.filter((c) => !c.out).length <= 1;
}

function applyFail<L>(state: GameState<L>, competitorId: string, reason: FailInfo['reason']): GameState<L> {
  const idx = state.competitors.findIndex((c) => c.id === competitorId);
  if (idx < 0) return state;
  const target = state.competitors[idx];
  if (target.out) return state;
  const member = target.members[target.memberIndex % target.members.length];
  const points = state.config.mode === 'points';

  const lives = reason === 'kicked' ? 0 : points ? target.lives : target.lives - 1;
  const eliminated = !points && lives <= 0 ? true : reason === 'kicked';
  const penalty = points && reason !== 'kicked' ? Math.min(POINTS_MODE_PENALTY, target.score) : 0;

  const competitors = state.competitors.map((c, i) =>
    i === idx ? rotate({ ...c, lives: Math.max(0, lives), out: eliminated, streak: 0, score: c.score - penalty }) : c,
  );
  const stats =
    reason === 'kicked'
      ? state.stats
      : bumpStats(state.stats, member.id, (s) => (reason === 'timeout' ? { timeouts: s.timeouts + 1 } : { mistakes: s.mistakes + 1 }));
  const eliminationOrder = eliminated ? [...state.eliminationOrder, competitorId] : state.eliminationOrder;

  const next: GameState<L> = {
    ...state,
    competitors,
    stats,
    eliminationOrder,
    fail: { competitorId, memberId: member.id, reason, eliminated, penalty },
    pausedFrom: undefined,
    history: withSnapshot(state),
  };

  const lastPointsRound = points && state.round >= state.config.rounds;
  const over = isGameOver(state, competitors) || lastPointsRound;
  return { ...next, status: over ? 'finished' : 'fail' };
}

export function gameReducer<L>(state: GameState<L>, action: GameAction<L>): GameState<L> {
  switch (action.type) {
    case 'START':
      if (state.status !== 'ready') return state;
      return { ...state, status: 'playing', timeLeft: state.turnMs };

    case 'TICK': {
      if (state.status !== 'playing') return state;
      const timeLeft = state.timeLeft - action.dt;
      if (timeLeft > 0) return { ...state, timeLeft };
      return applyFail({ ...state, timeLeft: 0 }, state.competitors[state.turn].id, 'timeout');
    }

    case 'PLAY': {
      if (state.status !== 'playing' && state.status !== 'ready') return state;
      const tile = state.tiles[action.slot];
      if (!tile) return state;

      const competitor = state.competitors[state.turn];
      const member = currentMember(state);
      const elapsed = state.status === 'ready' ? 0 : state.turnMs - state.timeLeft;
      const streak = competitor.streak + 1;
      const points = scorePlay(tile.letter, state.status === 'ready' ? state.turnMs : state.timeLeft, state.turnMs, competitor.streak, tile.golden);

      // Reponer la ficha con la siguiente letra del mazo.
      const tiles = [...state.tiles];
      let tileSeq = state.tileSeq;
      let deck = state.deck;
      let used = [...state.used, tile.letter];
      let lap = state.lap;
      const nextLetter = deck[0];
      tiles[action.slot] = nextLetter ? { id: ++tileSeq, letter: nextLetter, golden: state.config.modifiers.golden && action.golden } : null;
      deck = deck.slice(1);

      // ¡Se acabó el abecedario! Se reparte de nuevo.
      if (!tiles.some(Boolean)) {
        const dealt = deal(action.refill, tileSeq);
        tiles.splice(0, tiles.length, ...dealt.tiles);
        deck = dealt.deck;
        tileSeq = dealt.tileSeq;
        used = [];
        lap += 1;
      }

      const competitors = state.competitors.map((c, i) => (i === state.turn ? rotate({ ...c, score: c.score + points, streak }) : c));
      const stats = bumpStats(state.stats, member.id, (s) => ({
        letters: s.letters + 1,
        points: s.points + points,
        totalMs: s.totalMs + elapsed,
        fastestMs: state.status === 'playing' ? (s.fastestMs === null ? elapsed : Math.min(s.fastestMs, elapsed)) : s.fastestMs,
        bestStreak: Math.max(s.bestStreak, streak),
        hardLetters: s.hardLetters + (isHardLetter(tile.letter) ? 1 : 0),
        golden: s.golden + (tile.golden ? 1 : 0),
      }));
      const turnMs = state.config.modifiers.turbo ? Math.max(MIN_TURN_MS, state.turnMs - TURBO_STEP_MS) : state.turnMs;
      const playSeq = state.playSeq + 1;

      return {
        ...state,
        competitors,
        stats,
        tiles,
        deck,
        used,
        lap,
        tileSeq,
        playSeq,
        turnMs,
        status: 'playing',
        category: state.config.modifiers.chaos ? action.nextCategory : state.category,
        lastPlay: { seq: playSeq, letter: tile.letter, competitorId: competitor.id, memberId: member.id, points, golden: tile.golden, ms: elapsed },
        turn: nextActiveIndex(competitors, state.turn),
        timeLeft: turnMs,
        history: withSnapshot(state),
      };
    }

    case 'WILDCARD': {
      if (state.status !== 'playing' && state.status !== 'ready') return state;
      const competitor = state.competitors[state.turn];
      if (competitor.wildcards <= 0) return state;
      const member = currentMember(state);
      const stats = bumpStats(state.stats, member.id, (s) => ({ wildcardsUsed: s.wildcardsUsed + 1 }));
      if (action.kind === 'time') {
        const competitors = state.competitors.map((c, i) => (i === state.turn ? { ...c, wildcards: c.wildcards - 1 } : c));
        return { ...state, competitors, stats, timeLeft: state.timeLeft + WILDCARD_EXTRA_MS, history: withSnapshot(state) };
      }
      const competitors = state.competitors.map((c, i) => (i === state.turn ? rotate({ ...c, wildcards: c.wildcards - 1 }) : c));
      return {
        ...state,
        competitors,
        stats,
        turn: nextActiveIndex(competitors, state.turn),
        timeLeft: state.turnMs,
        category: state.config.modifiers.chaos ? action.nextCategory : state.category,
        history: withSnapshot(state),
      };
    }

    case 'PAUSE':
      if (state.status !== 'playing' && state.status !== 'ready') return state;
      return { ...state, status: 'paused', pausedFrom: state.status };

    case 'RESUME':
      if (state.status !== 'paused') return state;
      return { ...state, status: state.pausedFrom ?? 'playing', pausedFrom: undefined };

    case 'MISTAKE':
      return applyFail(state, action.competitorId, 'mistake');

    case 'KICK':
      return applyFail(state, action.competitorId, 'kicked');

    case 'UNDO': {
      const prev = state.history[state.history.length - 1];
      if (!prev) return state;
      return {
        ...prev,
        status: 'ready',
        pausedFrom: undefined,
        fail: undefined,
        timeLeft: prev.turnMs,
        history: state.history.slice(0, -1),
      };
    }

    case 'CONTINUE': {
      if (state.status !== 'fail' || !state.fail) return state;
      const failedIdx = state.competitors.findIndex((c) => c.id === state.fail!.competitorId);
      // Sigue (o abre la ronda nueva) quien está después del que falló.
      const turn = nextActiveIndex(state.competitors, failedIdx);
      const base: GameState<L> = { ...state, turn, status: 'ready', fail: undefined };
      if (state.config.mode === 'classic') return { ...base, timeLeft: state.turnMs };
      // Torneo, equipos y puntos: ronda nueva con letras frescas y otra categoría.
      const dealt = deal(action.deck, state.tileSeq, state.config.modifiers.golden ? action.goldenSlots : []);
      const turnMs = ms(state.config.turnSeconds);
      return {
        ...base,
        ...dealt,
        used: [],
        lap: 1,
        round: state.round + 1,
        category: action.category,
        turnMs,
        timeLeft: turnMs,
      };
    }

    case 'CHANGE_CATEGORY':
      return { ...state, category: action.category };

    case 'RESET_LETTERS': {
      const dealt = deal(action.deck, state.tileSeq, state.config.modifiers.golden ? action.goldenSlots : []);
      return { ...state, ...dealt, used: [], lap: 1 };
    }

    case 'REPLACE':
      return action.state;

    default:
      return state;
  }
}

/**
 * Clasificación final. En Puntos ordena por puntaje; en los modos de eliminación
 * el sobreviviente va primero y después en orden inverso de eliminación.
 */
export function ranking<L>(state: GameState<L>): Competitor<L>[] {
  if (state.config.mode === 'points') return [...state.competitors].sort((a, b) => b.score - a.score);
  const alive = state.competitors.filter((c) => !c.out).sort((a, b) => b.score - a.score);
  const out = [...state.eliminationOrder]
    .reverse()
    .map((id) => state.competitors.find((c) => c.id === id))
    .filter((c): c is Competitor<L> => !!c);
  return [...alive, ...out];
}

export const winner = <L>(state: GameState<L>): Competitor<L> | undefined => (state.status === 'finished' ? ranking(state)[0] : undefined);

export const canUndo = <L>(state: GameState<L>) => state.history.length > 0;
