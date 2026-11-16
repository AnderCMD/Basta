import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimalAvatar } from '../components/AnimalAvatar';
import { Icon } from '../components/Icon';
import { Card, GradientButton, Screen, SectionTitle, Stepper, Toggle } from '../components/ui';
import type { GameMode } from '../lib/game';
import { haptic } from '../lib/haptics';
import { colors, gradients, radius, fonts } from '../lib/theme';
import { useAppStore } from '../store/AppStore';

const TIME_OPTIONS = [3, 5, 7, 10, 12, 15, 20, 30, 45, 60];
const LIVES_OPTIONS = [1, 2, 3, 4, 5];

export default function SetupScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode: GameMode = params.mode === 'tournament' ? 'tournament' : 'quick';
  const { players, settings, updateSettings, setPending, pending } = useAppStore();

  // Por defecto se seleccionan todos (o los de la última partida).
  const [selected, setSelected] = useState<string[]>(() => {
    const prev = pending?.playerIds.filter((id) => players.some((p) => p.id === id));
    return prev && prev.length >= 2 ? prev : players.map((p) => p.id);
  });
  // Si se agrega alguien desde aquí, entra seleccionado automáticamente.
  const [knownIds, setKnownIds] = useState(() => players.map((p) => p.id));
  const currentIds = players.map((p) => p.id);
  if (currentIds.join('|') !== knownIds.join('|')) {
    const added = currentIds.filter((id) => !knownIds.includes(id));
    setKnownIds(currentIds);
    setSelected((sel) => [...sel.filter((id) => currentIds.includes(id)), ...added]);
  }

  const toggle = (id: string) => {
    haptic.light();
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  // Mantener el orden de turnos en el orden en que se tocaron.
  const ordered = selected.map((id) => players.find((p) => p.id === id)).filter(Boolean);
  const canStart = ordered.length >= 2;

  const start = () => {
    setPending({ mode, playerIds: selected });
    router.push('/game');
  };

  return (
    <Screen title={mode === 'tournament' ? 'Torneo' : 'Partida rápida'}>
      <Card style={{ backgroundColor: mode === 'tournament' ? 'rgba(255,210,63,0.12)' : 'rgba(255,77,141,0.12)' }}>
        <Text style={styles.modeText}>
          {mode === 'tournament'
            ? 'Cada quien tiene vidas. Si se te acaba el tiempo o te equivocas pierdes una y empieza otra ronda con nueva categoría. Sin vidas, quedas fuera. ¡El último en pie es el campeón!'
            : 'Una sola ronda: si se te acaba el tiempo o te equivocas, quedas fuera. El último en pie gana.'}
        </Text>
      </Card>

      <SectionTitle>
        ¿Quién juega? ({ordered.length}) · toca en orden de turno
      </SectionTitle>
      {players.length < 2 ? (
        <Card>
          <Text style={styles.empty}>Necesitas al menos 2 jugadores registrados.</Text>
          <GradientButton label="Agregar jugadores" icon="plus" colors={gradients.secondary} onPress={() => router.push('/players')} />
        </Card>
      ) : (
        <View style={styles.grid}>
          {players.map((p) => {
            const idx = selected.indexOf(p.id);
            const on = idx >= 0;
            return (
              <Pressable key={p.id} onPress={() => toggle(p.id)} style={[styles.chip, on && styles.chipOn]}>
                <AnimalAvatar animal={p.animal} size={56} dimmed={!on} />
                <Text style={[styles.chipName, !on && { color: colors.textFaint }]} numberOfLines={1}>
                  {p.name}
                </Text>
                {on ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{idx + 1}</Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
          <Pressable onPress={() => router.push('/players')} style={[styles.chip, styles.addChip]}>
            <View style={styles.addCircle}>
              <Icon name="plus" size={28} />
            </View>
            <Text style={styles.chipName}>Agregar</Text>
          </Pressable>
        </View>
      )}

      <SectionTitle>Reglas</SectionTitle>
      <Card>
        <Stepper
          label="Tiempo por turno"
          value={settings.turnSeconds}
          options={TIME_OPTIONS}
          format={(v) => `${v}s`}
          onChange={(v) => updateSettings({ turnSeconds: v })}
        />
        {mode === 'tournament' ? (
          <Stepper
            label="Vidas por jugador"
            value={settings.lives}
            options={LIVES_OPTIONS}
            format={(v) => `${v} ${v === 1 ? 'vida' : 'vidas'}`}
            onChange={(v) => updateSettings({ lives: v })}
          />
        ) : null}
        <Toggle
          label="Usar categorías"
          hint="Ej. “Frutas”: la palabra debe ser de esa categoría."
          value={settings.useCategories}
          onChange={(v) => updateSettings({ useCategories: v })}
        />
        <Toggle
          label="Incluir CH y LL"
          hint="Abecedario tradicional de 29 letras."
          value={settings.includeDigraphs}
          onChange={(v) => updateSettings({ includeDigraphs: v })}
        />
        <Toggle
          label="Quitar letras difíciles"
          hint="Sin K, Ñ, Q, W, X ni Y."
          value={settings.excludeHard}
          onChange={(v) => updateSettings({ excludeHard: v })}
        />
      </Card>

      <GradientButton
        size="lg"
        icon="rocket"
        label="¡A jugar!"
        subtitle={canStart ? `${ordered.length} jugadores · ${settings.turnSeconds}s por turno` : 'Selecciona al menos 2 jugadores'}
        colors={mode === 'tournament' ? gradients.gold : gradients.primary}
        disabled={!canStart}
        onPress={start}
        style={{ marginTop: 8 }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  modeText: { color: colors.text, fontSize: 15, lineHeight: 22, fontFamily: fonts.semiBold },
  empty: { color: colors.textDim, fontSize: 15, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    width: 96,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chipOn: { borderColor: colors.green, backgroundColor: 'rgba(46,230,166,0.12)' },
  chipName: { color: colors.text, fontFamily: fonts.extraBold, fontSize: 14, maxWidth: 86 },
  badge: {
    position: 'absolute',
    top: 6,
    right: 8,
    backgroundColor: colors.green,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#0B3B2E', fontFamily: fonts.black, fontSize: 13 },
  addChip: { borderStyle: 'dashed', borderColor: colors.border },
  addCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.cardStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
