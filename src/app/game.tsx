import { useKeepAwake } from 'expo-keep-awake';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { AnimalAvatar, type AnimalId } from '../components/AnimalAvatar';
import { Icon } from '../components/Icon';
import { LetterTile } from '../components/LetterTile';
import { Background, GradientButton, IconButton } from '../components/ui';
import { buildAlphabet, shuffle } from '../lib/alphabet';
import { DEFAULT_CATEGORIES, FREE_CATEGORY } from '../lib/categories';
import { confirmAction } from '../lib/confirm';
import {
  activePlayers,
  createGame,
  gameReducer,
  ranking,
  type GameConfig,
  type GamePlayer,
  type GameState,
} from '../lib/game';
import { haptic } from '../lib/haptics';
import { colors, gradients, radius, fonts } from '../lib/theme';
import { useAppStore } from '../store/AppStore';

const TICK_MS = 100;

/** Reparte categorías sin repetir hasta agotar la lista. */
function useCategoryPicker(enabled: boolean, custom: string[]) {
  const pool = useRef<string[]>([]);
  return useCallback(() => {
    if (!enabled) return FREE_CATEGORY;
    if (pool.current.length === 0) pool.current = shuffle([...DEFAULT_CATEGORIES, ...custom]);
    return pool.current.pop() ?? FREE_CATEGORY;
  }, [enabled, custom]);
}

/** Mantiene la pantalla encendida en el teléfono (en web el wake lock es poco fiable). */
function KeepAwake() {
  useKeepAwake();
  return null;
}

export default function GameScreen() {
  const { pending, players: roster, settings, recordWin } = useAppStore();

  const alphabet = useMemo(
    () => buildAlphabet({ includeDigraphs: settings.includeDigraphs, excludeHard: settings.excludeHard }),
    [settings.includeDigraphs, settings.excludeHard],
  );
  const pickCategory = useCategoryPicker(settings.useCategories, settings.customCategories);
  const freshDeck = useCallback(() => shuffle(alphabet), [alphabet]);

  const buildGame = useCallback((): GameState | null => {
    if (!pending) return null;
    const ps = pending.playerIds
      .map((id) => roster.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => !!p)
      .map((p) => ({ id: p.id, name: p.name, animal: p.animal }));
    if (ps.length < 2) return null;
    const config: GameConfig = {
      mode: pending.mode,
      turnSeconds: settings.turnSeconds,
      lives: settings.lives,
      alphabet,
    };
    return createGame(config, ps, freshDeck(), pickCategory());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  const [initial] = useState(buildGame);
  if (!initial) {
    return (
      <Background>
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
          <Text style={styles.bigText}>No hay partida configurada</Text>
          <GradientButton label="Volver al menú" onPress={() => router.dismissTo('/')} />
        </SafeAreaView>
      </Background>
    );
  }
  return (
    <>
      {Platform.OS !== 'web' ? <KeepAwake /> : null}
      <Game initial={initial} rebuild={buildGame} freshDeck={freshDeck} pickCategory={pickCategory} recordWin={recordWin} />
    </>
  );
}

function Game({
  initial,
  rebuild,
  freshDeck,
  pickCategory,
  recordWin,
}: {
  initial: GameState;
  rebuild: () => GameState | null;
  freshDeck: () => string[];
  pickCategory: () => string;
  recordWin: (id: string) => void;
}) {
  const [state, dispatch] = useReducer(gameReducer, initial);
  const [mistakeMode, setMistakeMode] = useState(false);
  const current = state.players[state.turn];

  // Reloj del turno.
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

  // Vibración en los últimos 3 segundos.
  const secondsLeft = Math.ceil(state.timeLeft / 1000);
  const lastBuzz = useRef(0);
  useEffect(() => {
    if (state.status === 'playing' && secondsLeft <= 3 && secondsLeft > 0 && lastBuzz.current !== secondsLeft) {
      lastBuzz.current = secondsLeft;
      haptic.warn();
    }
    if (secondsLeft > 3) lastBuzz.current = 0;
  }, [secondsLeft, state.status]);

  useEffect(() => {
    if (state.status === 'fail') haptic.fail();
    if (state.status === 'finished') haptic.win();
  }, [state.status]);

  const tap = (slot: number) => {
    if (state.status === 'ready') dispatch({ type: 'START' });
    haptic.tap();
    dispatch({ type: 'TAP', slot, refill: freshDeck() });
  };

  const leave = (rematch: boolean) => {
    const champ = state.status === 'finished' ? activePlayers(state)[0] : undefined;
    if (champ) recordWin(champ.id);
    if (rematch) {
      const next = rebuild();
      if (next) dispatch({ type: 'REPLACE', state: next });
    } else {
      router.dismissTo('/');
    }
  };

  const pause = () => {
    setMistakeMode(false);
    dispatch({ type: 'PAUSE' });
  };

  const ready = state.status === 'ready';
  const playing = state.status === 'playing';

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Banner volteado para quien está del otro lado de la mesa */}
        <View style={{ transform: [{ rotate: '180deg' }] }}>
          <TurnBanner state={state} player={current} onPause={pause} />
        </View>

        <Board
          state={state}
          onTap={tap}
          onStart={() => {
            haptic.tap();
            dispatch({ type: 'START' });
          }}
          disabled={!(ready || playing)}
        />

        <TurnBanner state={state} player={current} onPause={pause} />
        <PlayersStrip state={state} />
      </SafeAreaView>

      {state.status === 'paused' ? (
        <Overlay>
          {mistakeMode ? (
            <>
              <Text style={styles.overlayTitle}>¿Quién se equivocó?</Text>
              <Text style={styles.overlaySub}>
                {state.config.mode === 'tournament' ? 'Perderá una vida y empieza una ronda nueva.' : 'Quedará fuera de la partida.'}
              </Text>
              <View style={styles.pickGrid}>
                {activePlayers(state).map((p) => (
                  <Pressable
                    key={p.id}
                    style={styles.pickCell}
                    onPress={() => {
                      haptic.light();
                      dispatch({ type: 'MISTAKE', playerId: p.id });
                    }}
                  >
                    <AnimalAvatar animal={p.animal as AnimalId} size={64} />
                    <Text style={styles.pickName} numberOfLines={1}>
                      {p.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <GradientButton label="Cancelar" colors={gradients.neutral} onPress={() => setMistakeMode(false)} />
            </>
          ) : (
            <>
              <Icon name="pause" size={44} color={colors.yellow} style={{ alignSelf: 'center' }} />
              <Text style={styles.overlayTitle}>Pausa</Text>
              <GradientButton icon="play" label="Continuar" colors={gradients.success} onPress={() => dispatch({ type: 'RESUME' })} />
              <GradientButton
                icon="userX"
                label="Alguien se equivocó"
                subtitle="Sácalo o quítale una vida"
                colors={gradients.danger}
                onPress={() => setMistakeMode(true)}
              />
              {state.undo ? (
                <GradientButton
                  icon="undo"
                  label={`Deshacer ${state.lastLetter ? `letra ${state.lastLetter}` : 'último movimiento'}`}
                  subtitle="Regresa el turno al jugador anterior"
                  colors={gradients.secondary}
                  onPress={() => dispatch({ type: 'UNDO' })}
                />
              ) : null}
              <GradientButton
                icon="refresh"
                label="Cambiar categoría"
                subtitle={`Ahora: ${state.category}`}
                colors={gradients.neutral}
                onPress={() => dispatch({ type: 'CHANGE_CATEGORY', category: pickCategory() })}
              />
              <GradientButton
                icon="font"
                label="Reiniciar letras"
                colors={gradients.neutral}
                onPress={() => dispatch({ type: 'RESET_LETTERS', deck: freshDeck() })}
              />
              <GradientButton
                icon="close"
                label="Terminar partida"
                colors={gradients.neutral}
                onPress={() => confirmAction('Terminar partida', '¿Salir al menú? Se perderá el progreso.', () => router.dismissTo('/'))}
              />
            </>
          )}
        </Overlay>
      ) : null}

      {state.status === 'fail' && state.fail ? <FailOverlay state={state} onUndo={() => dispatch({ type: 'UNDO' })} onNext={() => dispatch({ type: 'CONTINUE', deck: freshDeck(), category: pickCategory() })} /> : null}

      {state.status === 'finished' ? (
        <FinishedOverlay state={state} onUndo={() => dispatch({ type: 'UNDO' })} onRematch={() => leave(true)} onMenu={() => leave(false)} />
      ) : null}
    </Background>
  );
}

function TurnBanner({ state, player, onPause }: { state: GameState; player: GamePlayer; onPause: () => void }) {
  const canPause = state.status === 'playing' || state.status === 'ready';
  const danger = state.status === 'playing' && state.timeLeft <= 3000;
  return (
    <View style={styles.banner}>
      <AnimalAvatar animal={player.animal as AnimalId} size={48} ring={colors.yellow} />
      <View style={{ flex: 1 }}>
        <Text style={styles.bannerSmall} numberOfLines={1}>
          {state.config.mode === 'tournament' ? `Ronda ${state.round} · ` : ''}Turno de
        </Text>
        <Text style={styles.bannerName} numberOfLines={1}>
          {player.name}
        </Text>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText} numberOfLines={1}>
            <Text style={styles.categoryLabel}>CATEGORÍA </Text>
            {state.category}
          </Text>
        </View>
      </View>
      <Text style={[styles.bannerTime, danger && { color: colors.red }]}>{Math.ceil(state.timeLeft / 1000)}</Text>
      {canPause ? <IconButton icon="pause" size={44} onPress={onPause} label="Pausa" /> : <View style={{ width: 44 }} />}
    </View>
  );
}

function Board({
  state,
  onTap,
  onStart,
  disabled,
}: {
  state: GameState;
  onTap: (slot: number) => void;
  onStart: () => void;
  disabled: boolean;
}) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  const D = Math.min(box.w, box.h, 720);
  const R = D * 0.34;
  const tile = D * 0.25;
  const center = D * 0.38;

  return (
    <View style={styles.board} onLayout={onLayout}>
      {D > 0 ? (
        <View style={{ width: D, height: D }}>
          {state.slots.map((letter, i) => {
            const a = ((-90 + 60 * i) * Math.PI) / 180;
            return (
              <View
                key={i}
                style={{ position: 'absolute', left: D / 2 + Math.cos(a) * R - tile / 2, top: D / 2 + Math.sin(a) * R - tile / 2 }}
              >
                <LetterTile letter={letter} size={tile} colorIndex={i} disabled={disabled} onPress={() => onTap(i)} />
              </View>
            );
          })}
          <View style={{ position: 'absolute', left: (D - center) / 2, top: (D - center) / 2 }}>
            <TimerCore state={state} size={center} onStart={onStart} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

function TimerCore({ state, size, onStart }: { state: GameState; size: number; onStart: () => void }) {
  const total = state.config.turnSeconds * 1000;
  const progress = Math.max(0, Math.min(1, state.timeLeft / total));
  const stroke = size * 0.08;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const color = progress > 0.5 ? colors.green : progress > 0.25 ? colors.yellow : colors.red;
  const player = state.players[state.turn];
  const ready = state.status === 'ready';

  const pulse = useState(() => new Animated.Value(1))[0];
  useEffect(() => {
    if (!ready) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.06, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [ready, pulse]);

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <Pressable
        disabled={!ready}
        onPress={onStart}
        accessibilityRole="button"
        accessibilityLabel={ready ? 'Empezar turno' : `Quedan ${Math.ceil(state.timeLeft / 1000)} segundos`}
        style={[styles.core, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} fill="none" />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={ready ? colors.green : color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circ} ${circ}`}
            strokeDashoffset={ready ? 0 : circ * (1 - progress)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <AnimalAvatar animal={player.animal as AnimalId} size={size * 0.5} />
        {ready ? (
          <View style={styles.startPill}>
            <Icon name="play" size={size * 0.1} />
            <Text style={[styles.startText, { fontSize: size * 0.09 }]}>EMPEZAR</Text>
          </View>
        ) : (
          <Text style={[styles.coreTime, { fontSize: size * 0.16, color }]}>{Math.ceil(state.timeLeft / 1000)}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

function Lives({ player, max }: { player: GamePlayer; max: number }) {
  if (max <= 1) return null;
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {Array.from({ length: max }).map((_, i) => (
        <Icon key={i} name="heart" size={11} color={i < player.lives ? colors.pink : 'rgba(255,255,255,0.2)'} />
      ))}
    </View>
  );
}

function PlayersStrip({ state }: { state: GameState }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={styles.strip}>
      {state.players.map((p, i) => {
        const isTurn = i === state.turn && !p.out;
        return (
          <View key={p.id} style={[styles.stripItem, isTurn && styles.stripTurn]}>
            <View>
              <AnimalAvatar animal={p.animal as AnimalId} size={36} dimmed={p.out} />
              {p.out ? (
                <View style={styles.outMark}>
                  <Icon name="close" size={22} color={colors.red} />
                </View>
              ) : null}
            </View>
            <Text style={[styles.stripName, p.out && { color: colors.textFaint, textDecorationLine: 'line-through' }]} numberOfLines={1}>
              {p.name}
            </Text>
            <Lives player={p} max={state.config.lives} />
          </View>
        );
      })}
    </ScrollView>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  const fade = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  }, [fade]);
  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, { opacity: fade }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.overlayBody}>{children}</ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

function FailOverlay({ state, onUndo, onNext }: { state: GameState; onUndo: () => void; onNext: () => void }) {
  const fail = state.fail!;
  const p = state.players[fail.playerIndex];
  const tournament = state.config.mode === 'tournament';
  const shake = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    Animated.sequence(
      [12, -12, 8, -8, 4, 0].map((v) => Animated.timing(shake, { toValue: v, duration: 60, useNativeDriver: true })),
    ).start();
  }, [shake]);

  return (
    <Overlay>
      <Icon name={fail.reason === 'timeout' ? 'stopwatch' : 'userX'} size={60} color={colors.red} style={{ alignSelf: 'center' }} />
      <Text style={styles.overlayTitle}>{fail.reason === 'timeout' ? '¡Se acabó el tiempo!' : '¡Error!'}</Text>
      <Animated.View style={{ transform: [{ translateX: shake }], alignItems: 'center', gap: 8 }}>
        <AnimalAvatar animal={p.animal as AnimalId} size={120} ring={colors.red} />
        <Text style={styles.bigText}>{p.name}</Text>
        {fail.eliminated ? (
          <Text style={[styles.overlaySub, { color: colors.red }]}>¡Queda eliminado!</Text>
        ) : (
          <View style={{ alignItems: 'center', gap: 6 }}>
            <Text style={styles.overlaySub}>Pierde una vida</Text>
            <Lives player={p} max={state.config.lives} />
          </View>
        )}
      </Animated.View>
      <Text style={styles.overlaySub}>Quedan {activePlayers(state).length} jugadores</Text>
      <GradientButton
        size="lg"
        icon="play"
        label={tournament ? `Ronda ${state.round + 1}` : 'Siguiente turno'}
        subtitle={tournament ? 'Nueva categoría y letras frescas' : `Sigue la categoría: ${state.category}`}
        colors={gradients.success}
        onPress={onNext}
      />
      <GradientButton icon="undo" label="Fue un error, deshacer" colors={gradients.neutral} onPress={onUndo} />
    </Overlay>
  );
}

function FinishedOverlay({
  state,
  onUndo,
  onRematch,
  onMenu,
}: {
  state: GameState;
  onUndo: () => void;
  onRematch: () => void;
  onMenu: () => void;
}) {
  const ranked = ranking(state);
  const champ = ranked[0];
  const bounce = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    Animated.spring(bounce, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }).start();
  }, [bounce]);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <Overlay>
      <Icon name={state.config.mode === 'tournament' ? 'trophy' : 'star'} size={60} color={colors.yellow} style={{ alignSelf: 'center' }} />
      <Text style={styles.overlayTitle}>{state.config.mode === 'tournament' ? '¡Campeón del torneo!' : '¡Ganador!'}</Text>
      {champ ? (
        <Animated.View style={{ alignItems: 'center', gap: 8, transform: [{ scale: bounce }] }}>
          <Icon name="crown" size={48} color={colors.yellow} style={{ marginBottom: -14, zIndex: 2 }} />
          <AnimalAvatar animal={champ.animal as AnimalId} size={150} ring={colors.yellow} />
          <Text style={[styles.bigText, { fontSize: 34 }]}>{champ.name}</Text>
        </Animated.View>
      ) : null}
      <View style={styles.rankList}>
        {ranked.map((p, i) => (
          <View key={p.id} style={styles.rankRow}>
            <Text style={styles.rankPos}>{medals[i] ?? `${i + 1}.`}</Text>
            <AnimalAvatar animal={p.animal as AnimalId} size={36} />
            <Text style={styles.rankName} numberOfLines={1}>
              {p.name}
            </Text>
          </View>
        ))}
      </View>
      <GradientButton size="lg" icon="repeat" label="Revancha" subtitle="Mismos jugadores" colors={gradients.gold} onPress={onRematch} />
      <GradientButton icon="back" label="Menú principal" colors={gradients.secondary} onPress={onMenu} />
      <GradientButton icon="undo" label="Fue un error, deshacer" colors={gradients.neutral} onPress={onUndo} />
    </Overlay>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 12,
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bannerSmall: { color: colors.textDim, fontSize: 12, fontFamily: fonts.bold },
  bannerName: { color: colors.text, fontSize: 20, fontFamily: fonts.black },
  categoryChip: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,210,63,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,210,63,0.45)',
  },
  categoryLabel: { color: colors.yellow, fontSize: 11, fontFamily: fonts.black, letterSpacing: 1 },
  categoryText: { color: colors.text, fontSize: 15, fontFamily: fonts.black },
  bannerTime: { color: colors.text, fontSize: 30, fontFamily: fonts.black, minWidth: 34, textAlign: 'center' },
  board: { flex: 1, alignItems: 'center', justifyContent: 'center', margin: 8 },
  core: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  coreTime: { fontFamily: fonts.black, marginTop: 2 },
  startPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: colors.green,
  },
  startText: { color: '#fff', fontFamily: fonts.black, letterSpacing: 1 },
  strip: { gap: 8, paddingHorizontal: 12, paddingBottom: 8 },
  stripItem: { alignItems: 'center', gap: 2, padding: 6, borderRadius: radius.md, minWidth: 64, borderWidth: 2, borderColor: 'transparent' },
  stripTurn: { borderColor: colors.yellow, backgroundColor: 'rgba(255,210,63,0.12)' },
  stripName: { color: colors.text, fontSize: 11, fontFamily: fonts.extraBold, maxWidth: 64 },
  outMark: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  overlay: { backgroundColor: colors.overlay },
  overlayBody: { padding: 24, gap: 14, alignItems: 'stretch', justifyContent: 'center', flexGrow: 1, maxWidth: 520, width: '100%', alignSelf: 'center' },
  overlayTitle: { color: colors.text, fontSize: 32, fontFamily: fonts.black, textAlign: 'center' },
  overlaySub: { color: colors.textDim, fontSize: 16, fontFamily: fonts.bold, textAlign: 'center' },
  bigText: { color: colors.text, fontSize: 26, fontFamily: fonts.black, textAlign: 'center' },
  pickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginVertical: 8 },
  pickCell: { width: 100, alignItems: 'center', gap: 6, padding: 10, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  pickName: { color: colors.text, fontFamily: fonts.extraBold, maxWidth: 90 },
  rankList: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 12, gap: 8 },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankPos: { color: colors.text, fontSize: 20, width: 34, textAlign: 'center', fontFamily: fonts.black },
  rankName: { color: colors.text, fontSize: 17, fontFamily: fonts.extraBold, flex: 1 },
});
