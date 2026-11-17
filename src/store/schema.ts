/**
 * Esquema de los datos guardados en el dispositivo, con validación y migraciones.
 * Funciones puras: si el almacenamiento trae algo corrupto o de una versión vieja,
 * la app se recupera con valores por defecto en vez de fallar.
 */
import type { AvatarLook } from '../components/avatar/Avatar';
import { ALL_PACK_IDS, CUSTOM_PACK_ID } from '../data/categories';
import type { GameMode, Modifiers } from '../features/game/engine';
import { emptyCareer, type CareerStats } from '../features/stats/achievements';
import type { SoundPackId, SoundVolume } from '../lib/sound';

export const SCHEMA_VERSION = 2;
export const STORAGE_KEY = 'basta.state.v2';
export const LEGACY_KEYS = { players: 'basta.players.v1', settings: 'basta.settings.v1' };

export type PlayerProfile = {
  id: string;
  name: string;
  look: AvatarLook;
  createdAt: number;
  career: CareerStats;
  achievements: string[];
};

export type Settings = {
  turnSeconds: number;
  lives: number;
  rounds: number;
  wildcards: number;
  modifiers: Modifiers;
  includeDigraphs: boolean;
  excludeHard: boolean;
  useCategories: boolean;
  enabledPacks: string[];
  customCategories: string[];
  haptics: boolean;
  sound: boolean;
  /** Estilo de los efectos de sonido. */
  soundPack: SoundPackId;
  soundVolume: SoundVolume;
  /** Tic-tac en los últimos 3 segundos. */
  tickSound: boolean;
};

export type GameSummary = {
  id: string;
  date: number;
  mode: GameMode;
  winner: string;
  players: string[];
  rounds: number;
};

export type PersistedState = {
  version: number;
  players: PlayerProfile[];
  settings: Settings;
  history: GameSummary[];
};

export const TIME_OPTIONS = [3, 5, 7, 10, 12, 15, 20, 30, 45, 60] as const;
export const LIVES_OPTIONS = [1, 2, 3, 4, 5] as const;
export const ROUND_OPTIONS = [3, 5, 7, 10, 15, 20] as const;
export const WILDCARD_OPTIONS = [0, 1, 2, 3] as const;
export const MAX_NAME_LENGTH = 14;
export const MAX_PLAYERS = 20;
export const MAX_HISTORY = 30;

export const DEFAULT_SETTINGS: Settings = {
  turnSeconds: 10,
  lives: 3,
  rounds: 5,
  wildcards: 1,
  modifiers: { turbo: false, chaos: false, golden: true },
  includeDigraphs: false,
  excludeHard: false,
  useCategories: true,
  enabledPacks: [...ALL_PACK_IDS, CUSTOM_PACK_ID],
  customCategories: [],
  haptics: true,
  sound: true,
  soundPack: 'clasico',
  soundVolume: 'medio',
  tickSound: true,
};

export const SOUND_PACK_IDS: readonly SoundPackId[] = ['clasico', 'suave', 'burbujas', 'madera', 'campanitas', 'minimo'];
const SOUND_VOLUME_IDS: readonly SoundVolume[] = ['bajo', 'medio', 'alto'];
const oneOfStr = <T extends string>(v: unknown, options: readonly T[], fallback: T): T => (options.includes(v as T) ? (v as T) : fallback);

export const emptyState = (): PersistedState => ({ version: SCHEMA_VERSION, players: [], settings: DEFAULT_SETTINGS, history: [] });

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown, fallback: string) => (typeof v === 'string' ? v : fallback);
const bool = (v: unknown, fallback: boolean) => (typeof v === 'boolean' ? v : fallback);
const num = (v: unknown, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);
const oneOf = <T extends number>(v: unknown, options: readonly T[], fallback: T): T => (options.includes(v as T) ? (v as T) : fallback);
const strList = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);
const nullableStr = (v: unknown) => (typeof v === 'string' ? v : null);

export const cleanName = (name: string) => name.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME_LENGTH);

export function sanitizeLook(v: unknown): AvatarLook {
  const o = isObj(v) ? v : {};
  return {
    animal: str(o.animal, 'gato') as AvatarLook['animal'],
    hat: nullableStr(o.hat) as AvatarLook['hat'],
    glasses: nullableStr(o.glasses) as AvatarLook['glasses'],
    extra: nullableStr(o.extra) as AvatarLook['extra'],
    bg: nullableStr(o.bg),
  };
}

export function sanitizeCareer(v: unknown): CareerStats {
  const base = emptyCareer();
  if (!isObj(v)) return base;
  const out = { ...base };
  for (const key of Object.keys(base) as (keyof CareerStats)[]) {
    if (key === 'fastestMs') out.fastestMs = typeof v.fastestMs === 'number' ? v.fastestMs : null;
    else out[key] = Math.max(0, num(v[key], 0));
  }
  return out;
}

export function sanitizePlayer(v: unknown): PlayerProfile | null {
  if (!isObj(v) || typeof v.id !== 'string') return null;
  const name = cleanName(str(v.name, ''));
  if (!name) return null;
  return {
    id: v.id,
    name,
    look: sanitizeLook(v.look),
    createdAt: num(v.createdAt, Date.now()),
    career: sanitizeCareer(v.career),
    achievements: strList(v.achievements),
  };
}

export function sanitizeSettings(v: unknown): Settings {
  const o = isObj(v) ? v : {};
  const d = DEFAULT_SETTINGS;
  const m = isObj(o.modifiers) ? o.modifiers : {};
  const packs = Array.isArray(o.enabledPacks) ? strList(o.enabledPacks) : d.enabledPacks;
  return {
    turnSeconds: oneOf(o.turnSeconds, TIME_OPTIONS, d.turnSeconds as (typeof TIME_OPTIONS)[number]),
    lives: oneOf(o.lives, LIVES_OPTIONS, d.lives as (typeof LIVES_OPTIONS)[number]),
    rounds: oneOf(o.rounds, ROUND_OPTIONS, d.rounds as (typeof ROUND_OPTIONS)[number]),
    wildcards: oneOf(o.wildcards, WILDCARD_OPTIONS, d.wildcards as (typeof WILDCARD_OPTIONS)[number]),
    modifiers: { turbo: bool(m.turbo, d.modifiers.turbo), chaos: bool(m.chaos, d.modifiers.chaos), golden: bool(m.golden, d.modifiers.golden) },
    includeDigraphs: bool(o.includeDigraphs, d.includeDigraphs),
    excludeHard: bool(o.excludeHard, d.excludeHard),
    useCategories: bool(o.useCategories, d.useCategories),
    enabledPacks: packs.filter((p) => p === CUSTOM_PACK_ID || ALL_PACK_IDS.includes(p)),
    customCategories: strList(o.customCategories).map((c) => c.trim()).filter(Boolean).slice(0, 500),
    haptics: bool(o.haptics, d.haptics),
    sound: bool(o.sound, d.sound),
    soundPack: oneOfStr(o.soundPack, SOUND_PACK_IDS, d.soundPack),
    soundVolume: oneOfStr(o.soundVolume, SOUND_VOLUME_IDS, d.soundVolume),
    tickSound: bool(o.tickSound, d.tickSound),
  };
}

function sanitizeSummary(v: unknown): GameSummary | null {
  if (!isObj(v) || typeof v.id !== 'string') return null;
  const mode = ['classic', 'tournament', 'points', 'teams'].includes(v.mode as string) ? (v.mode as GameMode) : 'classic';
  return { id: v.id, date: num(v.date, 0), mode, winner: str(v.winner, ''), players: strList(v.players), rounds: num(v.rounds, 1) };
}

export function sanitizeState(v: unknown): PersistedState {
  if (!isObj(v)) return emptyState();
  const players = (Array.isArray(v.players) ? v.players : []).map(sanitizePlayer).filter((p): p is PlayerProfile => !!p);
  const unique = players.filter((p, i) => players.findIndex((q) => q.id === p.id) === i);
  const history = (Array.isArray(v.history) ? v.history : []).map(sanitizeSummary).filter((h): h is GameSummary => !!h).slice(0, MAX_HISTORY);
  return { version: SCHEMA_VERSION, players: unique, settings: sanitizeSettings(v.settings), history };
}

/** Convierte los datos de la versión 1 (jugadores con animal y victorias). */
export function migrateV1(players: unknown, settings: unknown): PersistedState {
  const list = Array.isArray(players) ? players : [];
  const migrated = list
    .map((p) => {
      if (!isObj(p)) return null;
      const career = emptyCareer();
      career.wins = Math.max(0, num(p.wins, 0));
      career.games = career.wins;
      return sanitizePlayer({ id: p.id, name: p.name, look: { animal: p.animal }, career, achievements: [], createdAt: Date.now() });
    })
    .filter((p): p is PlayerProfile => !!p);
  return sanitizeState({ players: migrated, settings, history: [] });
}
