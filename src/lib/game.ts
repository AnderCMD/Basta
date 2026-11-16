/**
 * Motor del juego. Es puro: toda la aleatoriedad (mazo barajado, categoría)
 * llega en las acciones, así se puede probar sin React.
 */

export const VISIBLE_LETTERS = 6;

export type GameMode = 'quick' | 'tournament';

export type GamePlayer = {
  id: string;
  name: string;
  animal: string;
  lives: number;
  out: boolean;
};

export type GameConfig = {
  mode: GameMode;
  turnSeconds: number;
  /** Vidas por jugador (en partida rápida siempre es 1). */
  lives: number;
  alphabet: string[];
};

export type GameStatus = 'ready' | 'playing' | 'paused' | 'fail' | 'finished';

export type FailInfo = {
  playerId: string;
  playerIndex: number;
  reason: 'timeout' | 'mistake';
  eliminated: boolean;
};

type Snapshot = Omit<GameState, 'undo'>;

export type GameState = {
  config: GameConfig;
  players: GamePlayer[];
  turn: number;
  /** Letras que aún no salen en esta vuelta del abecedario. */
  deck: string[];
  /** Las 6 letras en pantalla; null = hueco (ya no quedan letras). */
  slots: (string | null)[];
  used: string[];
  category: string;
  round: number;
  /** Veces que se completó el abecedario en la ronda. */
  lap: number;
  timeLeft: number;
  status: GameStatus;
  pausedFrom?: 'ready' | 'playing';
  fail?: FailInfo;
  eliminationOrder: string[];
  lastLetter?: string;
  undo?: Snapshot;
};

export type GameAction =
  | { type: 'START' }
  | { type: 'TICK'; dt: number }
  | { type: 'TAP'; slot: number; refill: string[] }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'MISTAKE'; playerId: string }
  | { type: 'UNDO' }
  | { type: 'CONTINUE'; deck: string[]; category: string }
  | { type: 'CHANGE_CATEGORY'; category: string }
  | { type: 'RESET_LETTERS'; deck: string[] }
  | { type: 'REPLACE'; state: GameState };

const ms = (s: number) => s * 1000;

function deal(deck: string[]): { slots: (string | null)[]; deck: string[] } {
  const slots: (string | null)[] = [];
  for (let i = 0; i < VISIBLE_LETTERS; i++) slots.push(deck[i] ?? null);
  return { slots, deck: deck.slice(VISIBLE_LETTERS) };
}

export function createGame(
  config: GameConfig,
  players: { id: string; name: string; animal: string }[],
  deck: string[],
  category: string,
): GameState {
  const lives = config.mode === 'quick' ? 1 : Math.max(1, config.lives);
  const dealt = deal(deck);
  return {
    config: { ...config, lives },
    players: players.map((p) => ({ ...p, lives, out: false })),
    turn: 0,
    deck: dealt.deck,
    slots: dealt.slots,
    used: [],
    category,
    round: 1,
    lap: 1,
    timeLeft: ms(config.turnSeconds),
    status: 'ready',
    eliminationOrder: [],
  };
}

export function activePlayers(state: Pick<GameState, 'players'>): GamePlayer[] {
  return state.players.filter((p) => !p.out);
}

/** Siguiente índice de jugador activo después de `from` (sin incluirlo). */
export function nextActiveIndex(players: GamePlayer[], from: number): number {
  const n = players.length;
  for (let step = 1; step <= n; step++) {
    const i = (from + step) % n;
    if (!players[i].out) return i;
  }
  return from;
}

function snapshot(state: GameState): Snapshot {
  const { undo: _undo, ...rest } = state;
  return rest;
}

function applyFail(state: GameState, playerId: string, reason: FailInfo['reason']): GameState {
  const playerIndex = state.players.findIndex((p) => p.id === playerId);
  if (playerIndex < 0) return state;
  const target = state.players[playerIndex];
  if (target.out) return state;

  const lives = target.lives - 1;
  const eliminated = lives <= 0;
  const players = state.players.map((p, i) => (i === playerIndex ? { ...p, lives: Math.max(0, lives), out: eliminated } : p));
  const eliminationOrder = eliminated ? [...state.eliminationOrder, playerId] : state.eliminationOrder;
  const alive = players.filter((p) => !p.out);

  return {
    ...state,
    players,
    eliminationOrder,
    fail: { playerId, playerIndex, reason, eliminated },
    status: alive.length <= 1 ? 'finished' : 'fail',
    pausedFrom: undefined,
    undo: snapshot(state),
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START':
      if (state.status !== 'ready') return state;
      return { ...state, status: 'playing', timeLeft: ms(state.config.turnSeconds) };

    case 'TICK': {
      if (state.status !== 'playing') return state;
      const timeLeft = state.timeLeft - action.dt;
      if (timeLeft > 0) return { ...state, timeLeft };
      return applyFail({ ...state, timeLeft: 0 }, state.players[state.turn].id, 'timeout');
    }

    case 'TAP': {
      if (state.status !== 'playing') return state;
      const letter = state.slots[action.slot];
      if (!letter) return state;

      const slots = [...state.slots];
      let deck = state.deck;
      let used = [...state.used, letter];
      let lap = state.lap;
      slots[action.slot] = deck[0] ?? null;
      deck = deck.slice(1);

      // ¡Se acabó el abecedario! Se reparte de nuevo y sigue el juego.
      if (!slots.some((s) => s !== null)) {
        const dealt = deal(action.refill);
        slots.splice(0, slots.length, ...dealt.slots);
        deck = dealt.deck;
        used = [];
        lap += 1;
      }

      return {
        ...state,
        slots,
        deck,
        used,
        lap,
        lastLetter: letter,
        turn: nextActiveIndex(state.players, state.turn),
        timeLeft: ms(state.config.turnSeconds),
        undo: snapshot(state),
      };
    }

    case 'PAUSE':
      if (state.status !== 'playing' && state.status !== 'ready') return state;
      return { ...state, status: 'paused', pausedFrom: state.status };

    case 'RESUME':
      if (state.status !== 'paused') return state;
      return { ...state, status: state.pausedFrom ?? 'playing', pausedFrom: undefined };

    case 'MISTAKE':
      return applyFail(state, action.playerId, 'mistake');

    case 'UNDO': {
      if (!state.undo) return state;
      // Se regresa al jugador anterior con tiempo completo y en espera.
      return {
        ...state.undo,
        status: 'ready',
        pausedFrom: undefined,
        fail: undefined,
        timeLeft: ms(state.config.turnSeconds),
        undo: undefined,
      };
    }

    case 'CONTINUE': {
      if (state.status !== 'fail' || !state.fail) return state;
      // Sigue (o abre la nueva ronda) quien está después del que falló.
      const turn = nextActiveIndex(state.players, state.fail.playerIndex);
      const base: GameState = {
        ...state,
        turn,
        status: 'ready',
        fail: undefined,
        timeLeft: ms(state.config.turnSeconds),
      };
      if (state.config.mode === 'tournament') {
        // En torneo cada error inicia una ronda nueva: letras frescas y otra categoría.
        const dealt = deal(action.deck);
        return { ...base, ...dealt, used: [], lap: 1, round: state.round + 1, category: action.category };
      }
      return base;
    }

    case 'CHANGE_CATEGORY':
      return { ...state, category: action.category };

    case 'RESET_LETTERS': {
      const dealt = deal(action.deck);
      return { ...state, ...dealt, used: [], lap: 1, undo: undefined };
    }

    case 'REPLACE':
      return action.state;

    default:
      return state;
  }
}

/** Ranking final: campeón primero, después en orden inverso de eliminación. */
export function ranking(state: GameState): GamePlayer[] {
  const alive = state.players.filter((p) => !p.out);
  const out = [...state.eliminationOrder]
    .reverse()
    .map((id) => state.players.find((p) => p.id === id))
    .filter((p): p is GamePlayer => !!p);
  return [...alive, ...out];
}

export function winner(state: GameState): GamePlayer | undefined {
  if (state.status !== 'finished') return undefined;
  return state.players.find((p) => !p.out);
}
