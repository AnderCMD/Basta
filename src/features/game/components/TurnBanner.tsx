import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { Avatar, type AvatarLook } from '../../../components/avatar/Avatar';
import { Icon } from '../../../components/Icon';
import { AppText } from '../../../components/ui/AppText';
import { IconButton } from '../../../components/ui/IconButton';
import { useLayout } from '../../../lib/responsive';
import { colors, radius } from '../../../lib/theme';
import { currentMember, type GameState } from '../engine';

/** Todos los botones redondos del banner miden lo mismo. */
const BANNER_BUTTON = 38;

type Props = {
  state: GameState<AvatarLook>;
  onPause: () => void;
  onWildcard: (kind: 'pass' | 'time') => void;
  compact?: boolean;
  /** Versión en columna para paneles laterales angostos (teléfono acostado). */
  column?: boolean;
};

/**
 * Banner del turno: quién juega, categoría, tiempo, puntos y comodines.
 * Se dibuja dos veces (una volteada) para que se lea desde ambos lados de la mesa.
 */
export function TurnBanner({ state, onPause, onWildcard, compact, column }: Props) {
  const { s } = useLayout();
  const competitor = state.competitors[state.turn];
  const member = currentMember(state);
  const canAct = state.status === 'playing' || state.status === 'ready';
  const danger = state.status === 'playing' && state.timeLeft <= 3000;
  const isTeam = state.config.mode === 'teams';
  const roundLabel = state.config.mode === 'classic' ? '' : state.config.mode === 'points' ? `Ronda ${state.round}/${state.config.rounds} · ` : `Ronda ${state.round} · `;

  const wildcardButtons =
    state.config.wildcards > 0 ? (
      <View style={styles.wildcards}>
        <IconButton icon="forward" label="Comodín: pasar turno" size={BANNER_BUTTON} background="rgba(61,165,255,0.35)" disabled={!canAct || competitor.wildcards <= 0} onPress={() => onWildcard('pass')} />
        <IconButton icon="hourglass" label="Comodín: más tiempo" size={BANNER_BUTTON} background="rgba(46,230,166,0.35)" disabled={!canAct || competitor.wildcards <= 0} onPress={() => onWildcard('time')} />
        <AppText variant="caption" weight="black" color={colors.textDim}>
          ×{competitor.wildcards}
        </AppText>
      </View>
    ) : null;

  if (column) {
    return (
      <View style={[styles.banner, styles.column, { borderColor: isTeam ? competitor.color : colors.border }]}>
        <View style={styles.top}>
          <Avatar look={member.look} size={s(40)} ring={isTeam ? competitor.color : colors.yellow} />
          <AppText weight="black" size={26} color={danger ? colors.red : colors.text} style={{ flex: 1, textAlign: 'right' }}>
            {Math.ceil(state.timeLeft / 1000)}
          </AppText>
          <IconButton icon="pause" label="Pausa" size={BANNER_BUTTON} onPress={onPause} disabled={!canAct} />
        </View>
        <AppText variant="h3" numberOfLines={1}>
          {member.name}
          {isTeam ? ` · ${competitor.name}` : ''}
        </AppText>
        <View style={styles.categoryColumn}>
          <AppText variant="caption" weight="black" color={colors.yellow}>
            CATEGORÍA
          </AppText>
          <AppText variant="small" weight="bold" numberOfLines={2}>
            {state.category}
          </AppText>
        </View>
        <View style={[styles.top, { justifyContent: 'space-between' }]}>
          <View style={styles.score}>
            <Icon name="star" size={s(12)} color={colors.yellow} />
            <AppText variant="caption" weight="black">
              {competitor.score}
            </AppText>
          </View>
          {wildcardButtons}
        </View>
      </View>
    );
  }

  return (
    <Animated.View layout={LinearTransition} style={[styles.banner, { padding: s(compact ? 8 : 10), borderColor: isTeam ? competitor.color : colors.border }]}>
      <View style={styles.top}>
        <Animated.View key={member.id} entering={FadeIn.duration(250)}>
          <Avatar look={member.look} size={s(compact ? 40 : 48)} ring={isTeam ? competitor.color : colors.yellow} />
        </Animated.View>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" color={colors.textDim} numberOfLines={1}>
            {roundLabel}
            {isTeam ? `Equipo ${competitor.name}` : 'Turno de'}
          </AppText>
          <AppText variant="h2" numberOfLines={1}>
            {member.name}
          </AppText>
        </View>
        <View style={styles.score}>
          <Icon name="star" size={s(12)} color={colors.yellow} />
          <AppText variant="caption" weight="black">
            {competitor.score}
          </AppText>
        </View>
        <AppText weight="black" size={compact ? 26 : 30} color={danger ? colors.red : colors.text} style={{ minWidth: s(34), textAlign: 'center' }}>
          {Math.ceil(state.timeLeft / 1000)}
        </AppText>
        <IconButton icon="pause" label="Pausa" size={BANNER_BUTTON} onPress={onPause} disabled={!canAct} />
      </View>
      <View style={styles.bottom}>
        <View style={styles.category}>
          <AppText variant="caption" weight="black" color={colors.yellow}>
            CATEGORÍA
          </AppText>
          <AppText variant="bodyBold" numberOfLines={1} style={{ flexShrink: 1 }}>
            {state.category}
          </AppText>
        </View>
        {wildcardButtons}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 10,
    marginVertical: 4,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1.5,
    gap: 6,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bottom: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  score: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(255,210,63,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  category: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,210,63,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,210,63,0.4)',
  },
  wildcards: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  column: { padding: 10, gap: 8 },
  categoryColumn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,210,63,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,210,63,0.4)',
  },
});
