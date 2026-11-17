import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { AvatarLook } from '../../components/avatar/Avatar';
import { buildAlphabet } from '../../data/alphabet';
import { collectCategories, createCategoryDealer, FREE_CATEGORY } from '../../data/categories';
import { haptic } from '../../lib/haptics';
import { shuffle } from '../../lib/random';
import { playSound } from '../../lib/sound';
import type { Settings } from '../../store/schema';
import { createGame, gameReducer, VISIBLE_LETTERS, type CompetitorInput, type GameConfig, type GameMode, type GameState } from './engine';
import { GOLDEN_CHANCE } from './modes';

const TICK_MS = 100;

export type GameSetup = { mode: GameMode; competitors: CompetitorInput<AvatarLook>[]; settings: Settings };

/** Fuente de aleatoriedad del juego (letras, categorías, doradas). */
function useEntropy(settings: Settings) {
  const { includeDigraphs, excludeHard, useCategories, enabledPacks, customCategories } = settings;
  const goldenOn = settings.modifiers.golden;
  const alphabet = useMemo(() => buildAlphabet({ includeDigraphs, excludeHard }), [includeDigraphs, excludeHard]);
  const dealCategory = useMemo(
    () => (useCategories ? createCategoryDealer(collectCategories(enabledPacks, customCategories)) : () => FREE_CATEGORY),
    [useCategories, enabledPacks, customCategories],
  );

  return useMemo(
    () => ({
      deck: () => shuffle(alphabet),
      category: dealCategory,
      golden: () => goldenOn && Math.random() < GOLDEN_CHANCE,
      goldenSlots: () => Array.from({ length: VISIBLE_LETTERS }, () => goldenOn && Math.random() < GOLDEN_CHANCE),
    }),
    [alphabet, dealCategory, goldenOn],
  );
}

export function buildConfig(mode: GameMode, s: Settings): GameConfig {
  return { mode, turnSeconds: s.turnSeconds, lives: s.lives, rounds: s.rounds, wildcards: s.wildcards, modifiers: s.modifiers };
}

/**
 * Controlador de partida: une el motor puro con el reloj, sonidos y vibración.
 * Las pantallas solo llaman a sus acciones y leen `state`.
 */
export function useGameController(setup: GameSetup) {
  const rand = useEntropy(setup.settings);
  const create = useCallback(
    () => createGame(buildConfig(setup.mode, setup.settings), setup.competitors, rand.deck(), rand.category(), rand.goldenSlots()),
    [setup, rand],
  );
  const [state, dispatch] = useReducer(gameReducer<AvatarLook>, undefined, create);

  // Reloj del turno: mide el tiempo real transcurrido para no acumular desfase.
  useEffect(() => {
    if (state.status !== 'playing') return;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      dispatch({ type: 'TICK', dt: now - last });
      last = now;
    }, TICK_MS);
    return () => clearInterval(id);
  }, [state.status]);

  // Aviso en los últimos 3 segundos (una vez por segundo).
  const seconds = Math.ceil(state.timeLeft / 1000);
  const lastWarn = useRef(0);
  useEffect(() => {
    if (state.status === 'playing' && seconds <= 3 && seconds > 0 && lastWarn.current !== seconds) {
      lastWarn.current = seconds;
      haptic.warn();
      playSound('tick');
    }
    if (seconds > 3) lastWarn.current = 0;
  }, [seconds, state.status]);

  // Retroalimentación al cambiar de estado.
  const prevStatus = useRef(state.status);
  useEffect(() => {
    if (prevStatus.current === state.status) return;
    if (state.status === 'fail') {
      haptic.fail();
      playSound('fail');
    }
    if (state.status === 'finished') {
      haptic.success();
      playSound('win');
    }
    prevStatus.current = state.status;
  }, [state.status]);

  const actions = useMemo(
    () => ({
      start: () => {
        haptic.tap();
        playSound('start');
        dispatch({ type: 'START' });
      },
      play: (slot: number, golden: boolean) => {
        haptic.tap();
        playSound(golden ? 'golden' : 'tap');
        dispatch({ type: 'PLAY', slot, refill: rand.deck(), nextCategory: rand.category(), golden: rand.golden() });
      },
      wildcard: (kind: 'pass' | 'time') => {
        haptic.success();
        playSound('wildcard');
        dispatch({ type: 'WILDCARD', kind, nextCategory: rand.category() });
      },
      pause: () => dispatch({ type: 'PAUSE' }),
      resume: () => dispatch({ type: 'RESUME' }),
      mistake: (competitorId: string) => dispatch({ type: 'MISTAKE', competitorId }),
      kick: (competitorId: string) => dispatch({ type: 'KICK', competitorId }),
      undo: () => dispatch({ type: 'UNDO' }),
      next: () => dispatch({ type: 'CONTINUE', deck: rand.deck(), category: rand.category(), goldenSlots: rand.goldenSlots() }),
      changeCategory: () => dispatch({ type: 'CHANGE_CATEGORY', category: rand.category() }),
      resetLetters: () => dispatch({ type: 'RESET_LETTERS', deck: rand.deck(), goldenSlots: rand.goldenSlots() }),
      rematch: () => dispatch({ type: 'REPLACE', state: create() }),
    }),
    [rand, create],
  );

  return { state, actions } as { state: GameState<AvatarLook>; actions: typeof actions };
}
