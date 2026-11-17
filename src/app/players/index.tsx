import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Avatar } from '../../components/avatar';
import { Icon } from '../../components/Icon';
import { AppText, Button, EmptyState, IconButton, PressableScale, Screen } from '../../components/ui';
import { gridColumns, useLayout } from '../../lib/responsive';
import { colors, radius } from '../../lib/theme';
import { useAppStore } from '../../store/AppStore';

/** Lista de jugadores registrados. */
export default function PlayersScreen() {
  const { players } = useAppStore();
  const { contentWidth, s } = useLayout();
  const cols = gridColumns(contentWidth, s(150), 12, 6);
  const cell = (contentWidth - (cols - 1) * 12) / cols;

  return (
    <Screen
      title="Jugadores"
      right={<IconButton icon="userPlus" label="Nuevo jugador" background={colors.green} color={colors.bgTop} onPress={() => router.push('/players/edit')} />}
    >
      {players.length === 0 ? (
        <EmptyState icon="paw" title="¡Arma tu grupo!" message="Agrega a tus amigos y familia. Cada quien elige su animal y lo decora con sombreros, lentes y más.">
          <Button icon="userPlus" label="Crear primer jugador" tone="success" onPress={() => router.push('/players/edit')} />
        </EmptyState>
      ) : (
        <View style={styles.grid}>
          {players.map((p, i) => (
            <Animated.View key={p.id} entering={FadeInDown.delay(i * 40)} layout={LinearTransition} style={{ width: cell }}>
              <PressableScale
                accessibilityLabel={`Editar a ${p.name}`}
                onPress={() => router.push({ pathname: '/players/edit', params: { id: p.id } })}
                style={styles.card}
              >
                <Avatar look={p.look} size={s(92)} />
                <AppText variant="h3" numberOfLines={1}>
                  {p.name}
                </AppText>
                <View style={styles.stats}>
                  <Icon name="trophy" size={14} color={colors.yellow} />
                  <AppText variant="caption" color={colors.textDim}>
                    {p.career.wins}
                  </AppText>
                  <Icon name="medal" size={14} color={colors.yellow} />
                  <AppText variant="caption" color={colors.textDim}>
                    {p.achievements.length}
                  </AppText>
                </View>
              </PressableScale>
            </Animated.View>
          ))}
        </View>
      )}
      {players.length > 0 ? <Button icon="userPlus" label="Agregar jugador" tone="success" onPress={() => router.push('/players/edit')} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { alignItems: 'center', gap: 6, padding: 14, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
