import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Button, Card, Screen, SectionTitle } from '../components/ui';
import { AppText } from '../components/ui/AppText';
import { Icon } from '../components/Icon';
import { MODES, MODIFIERS } from '../features/game/modes';
import { useLayout } from '../lib/responsive';
import { colors } from '../lib/theme';

/** Elegir modo de juego. */
export default function PlayScreen() {
  const { isTablet, isLandscape } = useLayout();
  const grid = isTablet || isLandscape;
  return (
    <Screen title="¿Cómo jugamos?">
      <View style={[styles.list, grid && styles.grid]}>
        {MODES.map((m, i) => (
          <Animated.View key={m.id} entering={FadeIn.delay(i * 40).duration(250)} style={grid ? styles.half : undefined}>
            <Button
              size="lg"
              alignStart
              icon={m.icon}
              tone={m.tone}
              label={m.name}
              subtitle={m.tagline}
              onPress={() => router.push({ pathname: '/setup', params: { mode: m.id } })}
            />
          </Animated.View>
        ))}
      </View>
      <SectionTitle icon="magic">Modificadores (se activan al preparar la partida)</SectionTitle>
      <Card>
        {MODIFIERS.map((m) => (
          <View key={m.id} style={styles.mod}>
            <Icon name={m.icon} size={22} color={colors.yellow} />
            <View style={{ flex: 1 }}>
              <AppText variant="bodyBold">{m.name}</AppText>
              <AppText variant="small" color={colors.textDim}>
                {m.description}
              </AppText>
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  half: { width: '48.8%' },
  mod: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
