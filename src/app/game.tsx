import { useKeepAwake } from 'expo-keep-awake';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AvatarLook } from '../components/avatar';
import { AppText, Background, Button } from '../components/ui';
import { Board } from '../features/game/components/Board';
import { FailOverlay, PauseMenu, ResultsOverlay } from '../features/game/components/Overlays';
import { PlayersStrip } from '../features/game/components/PlayersStrip';
import { TurnBanner } from '../features/game/components/TurnBanner';
import type { CompetitorInput } from '../features/game/engine';
import { useGameController, type GameSetup } from '../features/game/useGameController';
import { playSound } from '../lib/sound';
import { useLayout } from '../lib/responsive';
import { useAppStore, type GameRecordResult } from '../store/AppStore';

/** Mantiene la pantalla encendida durante la partida (en web el wake lock no es fiable). */
function KeepAwake() {
  useKeepAwake();
  return null;
}

export default function GameScreen() {
  const { pending, players, settings } = useAppStore();

  // La configuración se congela al entrar: cambios posteriores no alteran la partida.
  const [setup] = useState<GameSetup | null>(() => {
    if (!pending) return null;
    const competitors: CompetitorInput<AvatarLook>[] = pending.competitors
      .map((c) => ({
        id: c.id,
        name: c.name,
        color: c.color,
        members: c.memberIds
          .map((id) => players.find((p) => p.id === id))
          .filter((p): p is NonNullable<typeof p> => !!p)
          .map((p) => ({ id: p.id, name: p.name, look: p.look })),
      }))
      .filter((c) => c.members.length > 0);
    if (competitors.length < (pending.mode === 'points' ? 1 : 2)) return null;
    return { mode: pending.mode, competitors, settings };
  });

  if (!setup) {
    return (
      <Background>
        <SafeAreaView style={styles.center}>
          <AppText variant="h2" align="center">
            No hay una partida preparada
          </AppText>
          <Button icon="home" label="Volver al menú" onPress={() => router.dismissTo('/')} />
        </SafeAreaView>
      </Background>
    );
  }

  return (
    <>
      {Platform.OS !== 'web' ? <KeepAwake /> : null}
      <Game setup={setup} />
    </>
  );
}

function Game({ setup }: { setup: GameSetup }) {
  const { state, actions } = useGameController(setup);
  const { recordGame } = useAppStore();
  const { isLandscape, height } = useLayout();
  // Teléfono acostado: poco alto, los banners van a los lados en columna.
  const shortLandscape = isLandscape && height < 600;
  const [results, setResults] = useState<GameRecordResult>([]);

  // Guarda estadísticas una sola vez por partida terminada (si se deshace, no se vuelve a contar).
  const recorded = useRef(false);
  useEffect(() => {
    if (state.status === 'finished' && !recorded.current) {
      recorded.current = true;
      const r = recordGame(state);
      setResults(r);
      if (r.some((x) => x.achievements.length)) setTimeout(() => playSound('achievement'), 1200);
    }
  }, [state, recordGame]);

  const banner = (flipped: boolean, column = false) => (
    <View style={flipped ? styles.flipped : undefined}>
      <TurnBanner state={state} onPause={actions.pause} onWildcard={actions.wildcard} column={column} />
    </View>
  );

  const board = useMemo(() => <Board state={state} onPlay={actions.play} onStart={actions.start} />, [state, actions]);

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
        {shortLandscape ? (
          // Teléfono horizontal: un banner a cada lado del tablero.
          <View style={styles.row}>
            <View style={styles.side}>
              {banner(false, true)}
              <PlayersStrip state={state} vertical />
            </View>
            <View style={{ flex: 1.4 }}>{board}</View>
            <View style={[styles.side, { justifyContent: 'flex-start' }]}>{banner(true, true)}</View>
          </View>
        ) : isLandscape ? (
          // Tableta horizontal: banners arriba y abajo, jugadores al costado.
          <>
            {banner(true)}
            <View style={styles.row}>
              <View style={styles.playersSide}>
                <PlayersStrip state={state} vertical />
              </View>
              {board}
              <View style={styles.playersSide} />
            </View>
            {banner(false)}
          </>
        ) : (
          <>
            {banner(true)}
            {board}
            {banner(false)}
            <PlayersStrip state={state} />
          </>
        )}
      </SafeAreaView>

      {state.status === 'paused' ? (
        <PauseMenu
          state={state}
          onResume={actions.resume}
          onMistake={actions.mistake}
          onKick={actions.kick}
          onUndo={actions.undo}
          onChangeCategory={actions.changeCategory}
          onResetLetters={actions.resetLetters}
          onQuit={() => router.dismissTo('/')}
        />
      ) : null}

      {state.status === 'fail' && state.fail ? <FailOverlay state={state} onNext={actions.next} onUndo={actions.undo} /> : null}

      {state.status === 'finished' ? (
        <ResultsOverlay
          state={state}
          newAchievements={results}
          onRematch={() => {
            recorded.current = false;
            setResults([]);
            actions.rematch();
          }}
          onMenu={() => router.dismissTo('/')}
        />
      ) : null}
    </Background>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  flipped: { transform: [{ rotate: '180deg' }] },
  row: { flex: 1, flexDirection: 'row' },
  side: { width: 230, justifyContent: 'flex-end' },
  playersSide: { width: 220, justifyContent: 'center' },
});
