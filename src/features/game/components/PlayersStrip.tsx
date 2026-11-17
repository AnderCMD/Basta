import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Avatar, type AvatarLook } from '../../../components/avatar/Avatar';
import { Icon } from '../../../components/Icon';
import { AppText } from '../../../components/ui/AppText';
import { colors, radius } from '../../../lib/theme';
import type { Competitor, GameState } from '../engine';

/** Corazones de vidas restantes. */
export function Lives({ lives, max, size = 11 }: { lives: number; max: number; size?: number }) {
  if (max <= 1) return null;
  return (
    <View style={{ flexDirection: 'row', gap: 1 }} accessibilityLabel={`${lives} de ${max} vidas`}>
      {Array.from({ length: max }).map((_, i) => (
        <Icon key={i} name="heart" size={size} color={i < lives ? colors.pink : 'rgba(255,255,255,0.2)'} />
      ))}
    </View>
  );
}

function CompetitorChip({ c, isTurn, maxLives, vertical }: { c: Competitor<AvatarLook>; isTurn: boolean; maxLives: number; vertical?: boolean }) {
  const team = c.members.length > 1;
  return (
    <Animated.View layout={LinearTransition} style={[styles.item, vertical && styles.itemVertical, isTurn && { borderColor: team ? c.color : colors.yellow, backgroundColor: 'rgba(255,210,63,0.1)' }]}>
      <View style={{ flexDirection: 'row' }}>
        {c.members.slice(0, 3).map((m, i) => (
          <View key={m.id} style={{ marginLeft: i ? -14 : 0 }}>
            <Avatar look={m.look} size={34} dimmed={c.out} ring={team ? c.color : undefined} />
          </View>
        ))}
        {c.out ? (
          <View style={styles.outMark}>
            <Icon name="close" size={22} color={colors.red} />
          </View>
        ) : null}
      </View>
      <View style={vertical ? { flex: 1 } : { alignItems: 'center' }}>
        <AppText variant="caption" weight="heavy" numberOfLines={1} style={[{ maxWidth: vertical ? undefined : 76 }, c.out && { textDecorationLine: 'line-through' }]} color={c.out ? colors.textFaint : colors.text}>
          {c.name}
        </AppText>
        <View style={styles.meta}>
          <Lives lives={c.lives} max={maxLives} size={10} />
          <AppText variant="caption" color={colors.yellow} weight="black">
            {c.score}
          </AppText>
        </View>
      </View>
    </Animated.View>
  );
}

/** Lista de competidores con vidas, puntos y quién tiene el turno. */
export function PlayersStrip({ state, vertical }: { state: GameState<AvatarLook>; vertical?: boolean }) {
  return (
    <ScrollView
      horizontal={!vertical}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={{ flexGrow: 0 }}
      contentContainerStyle={vertical ? styles.listV : styles.listH}
    >
      {state.competitors.map((c, i) => (
        <CompetitorChip key={c.id} c={c} isTurn={i === state.turn && !c.out} maxLives={state.config.lives} vertical={vertical} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listH: { gap: 6, paddingHorizontal: 10, paddingBottom: 6 },
  listV: { gap: 6, padding: 6 },
  item: { alignItems: 'center', gap: 2, padding: 6, borderRadius: radius.md, minWidth: 70, borderWidth: 2, borderColor: 'transparent' },
  itemVertical: { flexDirection: 'row', gap: 8, minWidth: 0 },
  outMark: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
