import React, { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { FadeOutUp, ZoomIn } from 'react-native-reanimated';
import { Icon } from '../../../components/Icon';
import { AppText } from '../../../components/ui/AppText';
import { colors } from '../../../lib/theme';
import { currentMember, type GameState } from '../engine';
import type { AvatarLook } from '../../../components/avatar/Avatar';
import { LetterTile } from './LetterTile';
import { TimerCore } from './TimerCore';

type Props = {
  state: GameState<AvatarLook>;
  onPlay: (slot: number, golden: boolean) => void;
  onStart: () => void;
};

/** "+N" que flota sobre el tablero después de cada jugada. */
function ScorePopup({ points, golden, size }: { points: number; golden: boolean; size: number }) {
  return (
    <Animated.View entering={ZoomIn.springify().damping(9)} exiting={FadeOutUp.duration(500)} style={styles.popup} pointerEvents="none">
      <View style={[styles.popupPill, golden && { backgroundColor: colors.yellow }]}>
        {golden ? <Icon name="gem" size={size * 0.05} color="#7A4A00" /> : null}
        <AppText weight="black" size={size * 0.06} color={golden ? '#7A4A00' : colors.bgTop}>
          +{points}
        </AppText>
      </View>
    </Animated.View>
  );
}

/**
 * Tablero hexagonal: 6 letras alrededor del reloj para que se alcancen desde
 * cualquier lado de la mesa. Se ajusta al espacio disponible (teléfono o tableta).
 */
export function Board({ state, onPlay, onStart }: Props) {
  const [box, setBox] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  const D = Math.min(box.w, box.h, 760);
  const R = D * 0.34;
  const tile = D * 0.25;
  const center = D * 0.38;
  const playable = state.status === 'ready' || state.status === 'playing';
  const ready = state.status === 'ready';
  const showPopup = state.lastPlay && state.status === 'playing';

  return (
    <View style={styles.board} onLayout={onLayout}>
      {D > 0 ? (
        // La key por tamaño vuelve a montar las fichas al rotar para que la animación de entrada no quede a medias.
        <View key={Math.round(D)} style={{ width: D, height: D }}>
          {state.tiles.map((t, i) => {
            const a = ((-90 + 60 * i) * Math.PI) / 180;
            return (
              <View key={i} style={{ position: 'absolute', left: D / 2 + Math.cos(a) * R - tile / 2, top: D / 2 + Math.sin(a) * R - tile / 2 }}>
                <LetterTile tile={t} size={tile} colorIndex={i} disabled={!playable} onPress={() => t && onPlay(i, t.golden)} />
              </View>
            );
          })}
          <View style={{ position: 'absolute', left: (D - center) / 2, top: (D - center) / 2 }}>
            <TimerCore
              size={center}
              progress={state.timeLeft / state.turnMs}
              seconds={Math.ceil(state.timeLeft / 1000)}
              ready={ready}
              look={currentMember(state).look}
              onStart={onStart}
            />
          </View>
          {showPopup ? <ScorePopup key={state.lastPlay!.seq} points={state.lastPlay!.points} golden={state.lastPlay!.golden} size={D} /> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { flex: 1, alignItems: 'center', justifyContent: 'center', margin: 6, minHeight: 200 },
  popup: { position: 'absolute', top: '38%', left: 0, right: 0, alignItems: 'center', zIndex: 5 },
  popupPill: { flexDirection: 'row', gap: 4, alignItems: 'center', backgroundColor: colors.green, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
});
