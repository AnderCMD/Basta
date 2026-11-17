import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Avatar } from '../components/avatar';
import { Icon, type IconName } from '../components/Icon';
import { AppText, Card, EmptyState, PressableScale, Screen, SectionTitle, Segmented } from '../components/ui';
import { modeInfo } from '../features/game/modes';
import { ACHIEVEMENTS, TIER_COLORS } from '../features/stats/achievements';
import { colors, radius } from '../lib/theme';
import { useAppStore } from '../store/AppStore';
import type { PlayerProfile } from '../store/schema';

type Sort = 'wins' | 'points' | 'letters' | 'achievements';

const SORTS = [
  { value: 'wins', label: 'Victorias', icon: 'trophy' },
  { value: 'points', label: 'Puntos', icon: 'star' },
  { value: 'letters', label: 'Letras', icon: 'font' },
  { value: 'achievements', label: 'Logros', icon: 'medal' },
] as const;

const metric = (p: PlayerProfile, sort: Sort) =>
  sort === 'achievements' ? p.achievements.length : sort === 'wins' ? p.career.wins : sort === 'points' ? p.career.points : p.career.letters;

function Stat({ icon, label, value }: { icon: IconName; label: string; value: string | number }) {
  return (
    <View style={styles.stat}>
      <Icon name={icon} size={16} color={colors.yellow} />
      <AppText variant="bodyBold">{value}</AppText>
      <AppText variant="caption" color={colors.textDim}>
        {label}
      </AppText>
    </View>
  );
}

/** Marcadores históricos, logros por jugador e historial de partidas. */
export default function HallOfFame() {
  const { players, history } = useAppStore();
  const [sort, setSort] = useState<Sort>('wins');
  const [open, setOpen] = useState<string | null>(null);
  const ranked = [...players].sort((a, b) => metric(b, sort) - metric(a, sort));

  if (players.length === 0) {
    return (
      <Screen title="Salón de la fama">
        <EmptyState icon="trophy" title="Todavía no hay leyendas" message="Juega partidas para llenar este salón con victorias, premios y logros." />
      </Screen>
    );
  }

  return (
    <Screen title="Salón de la fama">
      <Segmented value={sort} onChange={setSort} options={SORTS} />
      {ranked.map((p, i) => {
        const expanded = open === p.id;
        return (
          <Animated.View key={p.id} entering={FadeInDown.delay(i * 50)} layout={LinearTransition}>
            <PressableScale onPress={() => setOpen(expanded ? null : p.id)} accessibilityLabel={`${p.name}, ver detalles`} style={[styles.row, i === 0 && styles.first]}>
              <AppText weight="black" size={20} color={i === 0 ? colors.yellow : colors.textDim} style={{ width: 28, textAlign: 'center' }}>
                {i + 1}
              </AppText>
              <Avatar look={p.look} size={54} ring={i === 0 ? colors.yellow : undefined} />
              <View style={{ flex: 1 }}>
                <AppText variant="h3" numberOfLines={1}>
                  {p.name}
                </AppText>
                <AppText variant="caption" color={colors.textDim}>
                  {p.career.games} partidas · {p.achievements.length}/{ACHIEVEMENTS.length} logros
                </AppText>
              </View>
              <AppText variant="h2" color={colors.yellow}>
                {metric(p, sort).toLocaleString('es-MX')}
              </AppText>
            </PressableScale>
            {expanded ? (
              <Card style={{ marginTop: 6 }}>
                <View style={styles.stats}>
                  <Stat icon="trophy" label="Victorias" value={p.career.wins} />
                  <Stat icon="crown" label="Torneos" value={p.career.tournamentWins} />
                  <Stat icon="star" label="Puntos" value={p.career.points.toLocaleString('es-MX')} />
                  <Stat icon="font" label="Letras" value={p.career.letters} />
                  <Stat icon="fire" label="Mejor racha" value={p.career.bestStreak} />
                  <Stat icon="bolt" label="Más rápido" value={p.career.fastestMs ? `${(p.career.fastestMs / 1000).toFixed(1)} s` : '—'} />
                  <Stat icon="shield" label="Difíciles" value={p.career.hardLetters} />
                  <Stat icon="medal" label="Premios" value={p.career.awards} />
                </View>
                <View style={styles.badges}>
                  {ACHIEVEMENTS.map((a) => {
                    const got = p.achievements.includes(a.id);
                    return (
                      <View key={a.id} style={[styles.badge, !got && { opacity: 0.35 }]} accessibilityLabel={`${a.name}: ${a.description}${got ? ', desbloqueado' : ', bloqueado'}`}>
                        <View style={[styles.badgeIcon, { backgroundColor: got ? TIER_COLORS[a.tier] : colors.cardStrong }]}>
                          <Icon name={got ? a.icon : 'lock'} size={18} color={got ? colors.bgTop : colors.textDim} />
                        </View>
                        <AppText variant="caption" align="center" numberOfLines={2}>
                          {a.name}
                        </AppText>
                      </View>
                    );
                  })}
                </View>
              </Card>
            ) : null}
          </Animated.View>
        );
      })}

      {history.length ? (
        <>
          <SectionTitle icon="clock">Últimas partidas</SectionTitle>
          <Card>
            {history.slice(0, 10).map((h) => (
              <View key={h.id} style={styles.history}>
                <Icon name={modeInfo(h.mode).icon} size={18} color={colors.yellow} />
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold" numberOfLines={1}>
                    {h.winner} ganó · {modeInfo(h.mode).name}
                  </AppText>
                  <AppText variant="caption" color={colors.textDim} numberOfLines={1}>
                    {new Date(h.date).toLocaleDateString('es-MX')} · {h.players.join(', ')}
                  </AppText>
                </View>
              </View>
            ))}
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  first: { borderColor: colors.yellow, backgroundColor: 'rgba(255,210,63,0.1)' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  stat: { width: '23%', minWidth: 80, flexGrow: 1, alignItems: 'center', gap: 2, padding: 8, borderRadius: radius.sm, backgroundColor: 'rgba(0,0,0,0.2)' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  badge: { width: 76, alignItems: 'center', gap: 4 },
  badgeIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  history: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
