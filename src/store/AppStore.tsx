import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AnimalId } from '../components/AnimalAvatar';
import type { GameMode } from '../lib/game';

export type Player = { id: string; name: string; animal: AnimalId; wins: number };

export type Settings = {
  turnSeconds: number;
  lives: number;
  includeDigraphs: boolean;
  excludeHard: boolean;
  useCategories: boolean;
  haptics: boolean;
  customCategories: string[];
};

export type PendingGame = { mode: GameMode; playerIds: string[] };

const DEFAULT_SETTINGS: Settings = {
  turnSeconds: 10,
  lives: 3,
  includeDigraphs: false,
  excludeHard: false,
  useCategories: true,
  haptics: true,
  customCategories: [],
};

const KEYS = { players: 'basta.players.v1', settings: 'basta.settings.v1' };

type Store = {
  loaded: boolean;
  players: Player[];
  settings: Settings;
  pending: PendingGame | null;
  savePlayer: (p: Omit<Player, 'id' | 'wins'> & { id?: string }) => void;
  removePlayer: (id: string) => void;
  recordWin: (id: string) => void;
  resetWins: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  setPending: (g: PendingGame | null) => void;
};

const Ctx = createContext<Store | null>(null);

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [pending, setPending] = useState<PendingGame | null>(null);

  useEffect(() => {
    (async () => {
      const [p, s] = await Promise.all([
        readJson<Player[]>(KEYS.players, []),
        readJson<Partial<Settings>>(KEYS.settings, {}),
      ]);
      setPlayers(p);
      setSettings({ ...DEFAULT_SETTINGS, ...s });
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(KEYS.players, JSON.stringify(players)).catch(() => {});
  }, [players, loaded]);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(KEYS.settings, JSON.stringify(settings)).catch(() => {});
  }, [settings, loaded]);

  const savePlayer = useCallback<Store['savePlayer']>((p) => {
    setPlayers((list) => {
      if (p.id && list.some((x) => x.id === p.id)) {
        return list.map((x) => (x.id === p.id ? { ...x, name: p.name, animal: p.animal } : x));
      }
      return [...list, { id: newId(), name: p.name, animal: p.animal, wins: 0 }];
    });
  }, []);

  const removePlayer = useCallback((id: string) => setPlayers((list) => list.filter((x) => x.id !== id)), []);
  const recordWin = useCallback(
    (id: string) => setPlayers((list) => list.map((x) => (x.id === id ? { ...x, wins: x.wins + 1 } : x))),
    [],
  );
  const resetWins = useCallback(() => setPlayers((list) => list.map((x) => ({ ...x, wins: 0 }))), []);
  const updateSettings = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), []);

  const value = useMemo(
    () => ({ loaded, players, settings, pending, savePlayer, removePlayer, recordWin, resetWins, updateSettings, setPending }),
    [loaded, players, settings, pending, savePlayer, removePlayer, recordWin, resetWins, updateSettings],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppStore debe usarse dentro de AppStoreProvider');
  return ctx;
}
