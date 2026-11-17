import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import {
  ANIMAL_IDS,
  ANIMALS,
  Avatar,
  AVATAR_BACKGROUNDS,
  defaultLook,
  EXTRAS,
  GLASSES,
  HATS,
  randomLook,
  type AvatarLook,
} from '../../components/avatar';
import { Icon } from '../../components/Icon';
import { AppText, Button, Card, IconButton, PressableScale, Screen, Segmented } from '../../components/ui';
import { confirmAction } from '../../lib/confirm';
import { haptic } from '../../lib/haptics';
import { gridColumns, useLayout } from '../../lib/responsive';
import { colors, fonts, radius } from '../../lib/theme';
import { useAppStore } from '../../store/AppStore';
import { MAX_NAME_LENGTH } from '../../store/schema';

type Tab = 'animal' | 'hat' | 'glasses' | 'extra' | 'bg';

const TABS = [
  { value: 'animal', label: 'Animal', icon: 'paw' },
  { value: 'hat', label: 'Sombrero', icon: 'hat' },
  { value: 'glasses', label: 'Lentes', icon: 'glasses' },
  { value: 'extra', label: 'Extra', icon: 'gift' },
  { value: 'bg', label: 'Fondo', icon: 'palette' },
] as const;

/** Crear o editar un jugador con su avatar personalizado. */
export default function EditPlayerScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { players, getPlayer, savePlayer, removePlayer } = useAppStore();
  const existing = id ? getPlayer(id) : undefined;
  const firstFree = ANIMAL_IDS.find((a) => !players.some((p) => p.look.animal === a)) ?? 'gato';

  const [name, setName] = useState(existing?.name ?? '');
  const [look, setLook] = useState<AvatarLook>(existing?.look ?? defaultLook(firstFree));
  const [tab, setTab] = useState<Tab>('animal');
  const { contentWidth, s, isTablet } = useLayout();

  const set = (patch: Partial<AvatarLook>) => {
    haptic.select();
    setLook((l) => ({ ...l, ...patch }));
  };

  const save = () => {
    if (!name.trim()) return;
    savePlayer({ id: existing?.id, name, look });
    haptic.success();
    router.back();
  };

  const cols = gridColumns(contentWidth - 32, s(isTablet ? 96 : 76), 10, 8);
  const cell = (contentWidth - 32 - (cols - 1) * 10) / cols;

  // Opciones de la pestaña actual: cada una con su vista previa.
  const options: { key: string; label: string; look: AvatarLook; selected: boolean; onPress: () => void }[] =
    tab === 'animal'
      ? ANIMAL_IDS.map((a) => ({ key: a, label: ANIMALS[a].name, look: { ...look, animal: a }, selected: look.animal === a, onPress: () => set({ animal: a }) }))
      : tab === 'hat'
        ? [{ id: null, name: 'Ninguno' }, ...HATS].map((h) => ({ key: h.id ?? 'none', label: h.name, look: { ...look, hat: h.id }, selected: look.hat === h.id, onPress: () => set({ hat: h.id }) }))
        : tab === 'glasses'
          ? [{ id: null, name: 'Ninguno' }, ...GLASSES].map((g) => ({ key: g.id ?? 'none', label: g.name, look: { ...look, glasses: g.id }, selected: look.glasses === g.id, onPress: () => set({ glasses: g.id }) }))
          : tab === 'extra'
            ? [{ id: null, name: 'Ninguno' }, ...EXTRAS].map((e) => ({ key: e.id ?? 'none', label: e.name, look: { ...look, extra: e.id }, selected: look.extra === e.id, onPress: () => set({ extra: e.id }) }))
            : [null, ...AVATAR_BACKGROUNDS].map((bg) => ({ key: bg ?? 'default', label: bg ? 'Color' : 'Original', look: { ...look, bg }, selected: look.bg === bg, onPress: () => set({ bg }) }));

  return (
    <Screen
      title={existing ? 'Editar jugador' : 'Nuevo jugador'}
      footer={<Button icon="check" size="lg" label={existing ? 'Guardar cambios' : 'Crear jugador'} tone="success" disabled={!name.trim()} onPress={save} />}
    >
      <View style={styles.preview}>
        <Animated.View key={JSON.stringify(look)} entering={ZoomIn.springify().damping(12)}>
          <Avatar look={look} size={s(isTablet ? 200 : 150)} ring={colors.yellow} />
        </Animated.View>
        <View style={styles.previewActions}>
          <IconButton icon="dice" label="Avatar al azar" background={colors.purple} onPress={() => set(randomLook())} />
          <IconButton icon="refresh" label="Quitar accesorios" onPress={() => set({ hat: null, glasses: null, extra: null, bg: null })} />
        </View>
      </View>

      <TextInput
        value={name}
        onChangeText={(t) => setName(t.slice(0, MAX_NAME_LENGTH))}
        placeholder="Nombre"
        placeholderTextColor={colors.textFaint}
        style={[styles.input, { fontSize: s(22) }]}
        returnKeyType="done"
        onSubmitEditing={save}
        autoCapitalize="words"
        maxLength={MAX_NAME_LENGTH}
        accessibilityLabel="Nombre del jugador"
      />

      <Segmented value={tab} onChange={setTab} options={TABS} />

      <Card>
        <View style={styles.grid}>
          {options.map((o) => (
            <PressableScale
              key={o.key}
              accessibilityLabel={o.label}
              accessibilityState={{ selected: o.selected }}
              onPress={o.onPress}
              style={[styles.option, { width: cell }, o.selected && styles.optionSelected]}
            >
              <Avatar look={o.look} size={cell - 16} />
              <AppText variant="caption" numberOfLines={1} align="center" color={o.selected ? colors.yellow : colors.textDim}>
                {o.label}
              </AppText>
              {o.selected ? (
                <View style={styles.check}>
                  <Icon name="check" size={12} color={colors.bgTop} />
                </View>
              ) : null}
            </PressableScale>
          ))}
        </View>
      </Card>

      {existing ? (
        <Button
          icon="trash"
          label="Eliminar jugador"
          tone="danger"
          onPress={() =>
            confirmAction('Eliminar jugador', `¿Eliminar a ${existing.name}? Se perderán sus estadísticas y logros.`, () => {
              removePlayer(existing.id);
              router.back();
            }, 'Eliminar')
          }
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  preview: { alignItems: 'center', gap: 12 },
  previewActions: { flexDirection: 'row', gap: 12 },
  input: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    fontFamily: fonts.heavy,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  option: { alignItems: 'center', gap: 4, paddingVertical: 8, borderRadius: radius.md, borderWidth: 2, borderColor: 'transparent' },
  optionSelected: { borderColor: colors.yellow, backgroundColor: 'rgba(255,210,63,0.12)' },
  check: { position: 'absolute', top: 4, right: 4, backgroundColor: colors.yellow, borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
});
