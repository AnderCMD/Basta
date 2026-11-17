import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AvatarLook } from '../components/avatar/Avatar';
import { computeAwards } from '../features/game/awards';
import { ranking, type GameMode, type GameState } from '../features/game/engine';
import { emptyCareer } from '../features/stats/achievements';
import { applyGameToCareers } from '../features/stats/career';
import { newId } from '../lib/random';
import {
  cleanName,
  emptyState,
  LEGACY_KEYS,
  MAX_HISTORY,
  migrateV1,
  sanitizeState,
  STORAGE_KEY,
  type PersistedState,
  type PlayerProfile,
  type Settings,
} from './schema';

/** Partida configurada en la pantalla de preparación, lista para empezar. */
export type PendingGame = {
  mode: GameMode;
  competitors: { id: string; name: string; color: string; memberIds: string[] }[];
};

/** Logros nuevos por jugador al terminar una partida. */
export type GameRecordResult = { playerId: string; achievements: string[] }[];

type Store = {
  loaded: boolean;
  players: PlayerProfile[];
  settings: Settings;
  history: PersistedState['history'];
  pending: PendingGame | null;
  getPlayer: (id: string) => PlayerProfile | undefined;
  savePlayer: (p: { id?: string; name: string; look: AvatarLook }) => string;
  removePlayer: (id: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  setPending: (g: PendingGame | null) => void;
  /** Guarda una partida terminada: estadísticas, logros e historial. */
  recordGame: (state: GameState<AvatarLook>) => GameRecordResult;
  resetStats: () => void;
};

const Ctx = createContext<Store | null>(null);

async function loadState(): Promise<PersistedState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return sanitizeState(JSON.parse(raw));
    const [p, s] = await Promise.all([AsyncStorage.getItem(LEGACY_KEYS.players), AsyncStorage.getItem(LEGACY_KEYS.settings)]);
    if (p || s) return migrateV1(p ? JSON.parse(p) : [], s ? JSON.parse(s) : {});
  } catch {
    // Datos ilegibles: se empieza de cero sin romper la app.
  }
  return emptyState();
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<PersistedState>(emptyState);
  const [pending, setPending] = useState<PendingGame | null>(null);
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    let alive = true;
    loadState().then((s) => {
      if (!alive) return;
      setData(s);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Guardado con pequeño retraso para agrupar cambios seguidos.
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [data, loaded]);

  const getPlayer = useCallback((id: string) => data.players.find((p) => p.id === id), [data.players]);

  const savePlayer = useCallback<Store['savePlayer']>(({ id, name, look }) => {
    const finalId = id ?? newId();
    setData((d) => {
      const exists = d.players.some((p) => p.id === finalId);
      const players = exists
        ? d.players.map((p) => (p.id === finalId ? { ...p, name: cleanName(name), look } : p))
        : [...d.players, { id: finalId, name: cleanName(name), look, createdAt: Date.now(), career: emptyCareer(), achievements: [] }];
      return { ...d, players };
    });
    return finalId;
  }, []);

  const removePlayer = useCallback((id: string) => setData((d) => ({ ...d, players: d.players.filter((p) => p.id !== id) })), []);

  const updateSettings = useCallback((patch: Partial<Settings>) => setData((d) => ({ ...d, settings: { ...d.settings, ...patch } })), []);

  const recordGame = useCallback((state: GameState<AvatarLook>): GameRecordResult => {
    const current = dataRef.current;
    const careers = Object.fromEntries(current.players.map((p) => [p.id, p.career]));
    const updates = applyGameToCareers(state, computeAwards(state), careers);
    const champion = ranking(state)[0];
    const summary = {
      id: newId(),
      date: Date.now(),
      mode: state.config.mode,
      winner: champion?.name ?? '',
      players: state.competitors.flatMap((c) => c.members.map((m) => m.name)),
      rounds: state.round,
    };
    setData((d) => ({
      ...d,
      players: d.players.map((p) => {
        const u = updates.find((x) => x.playerId === p.id);
        return u ? { ...p, career: u.career, achievements: [...new Set([...p.achievements, ...u.newAchievements])] } : p;
      }),
      history: [summary, ...d.history].slice(0, MAX_HISTORY),
    }));
    return updates.map((u) => ({ playerId: u.playerId, achievements: u.newAchievements }));
  }, []);

  const resetStats = useCallback(
    () => setData((d) => ({ ...d, history: [], players: d.players.map((p) => ({ ...p, career: emptyCareer(), achievements: [] })) })),
    [],
  );

  const value = useMemo<Store>(
    () => ({
      loaded,
      players: data.players,
      settings: data.settings,
      history: data.history,
      pending,
      getPlayer,
      savePlayer,
      removePlayer,
      updateSettings,
      setPending,
      recordGame,
      resetStats,
    }),
    [loaded, data, pending, getPlayer, savePlayer, removePlayer, updateSettings, recordGame, resetStats],
  );

  // Nada se dibuja hasta leer los datos guardados: así ninguna pantalla arranca con datos vacíos.
  if (!loaded) return null;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppStore debe usarse dentro de AppStoreProvider');
  return ctx;
}
