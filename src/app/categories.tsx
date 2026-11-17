import React, { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Icon } from '../components/Icon';
import { AppText, Button, Card, IconButton, PressableScale, Screen, SectionTitle } from '../components/ui';
import { ALL_PACK_IDS, CATEGORY_PACKS, collectCategories, CUSTOM_PACK_ID } from '../data/categories';
import { pick } from '../lib/random';
import { colors, fonts, radius } from '../lib/theme';
import { useAppStore } from '../store/AppStore';

/** Paquetes de categorías: activar/desactivar, buscar, probar y crear propias. */
export default function CategoriesScreen() {
  const { settings, updateSettings } = useAppStore();
  const [query, setQuery] = useState('');
  const [newCat, setNewCat] = useState('');
  const [sample, setSample] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const enabled = settings.enabledPacks;

  const active = useMemo(() => collectCategories(enabled, settings.customCategories), [enabled, settings.customCategories]);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return collectCategories([...ALL_PACK_IDS, CUSTOM_PACK_ID], settings.customCategories)
      .filter((c) => c.toLowerCase().includes(q))
      .slice(0, 40);
  }, [query, settings.customCategories]);

  const togglePack = (id: string) => updateSettings({ enabledPacks: enabled.includes(id) ? enabled.filter((p) => p !== id) : [...enabled, id] });

  const addCategory = () => {
    const c = newCat.trim();
    if (!c || settings.customCategories.includes(c)) return;
    updateSettings({ customCategories: [...settings.customCategories, c] });
    setNewCat('');
  };

  return (
    <Screen title="Categorías">
      <Card tint="rgba(155,92,255,0.18)">
        <AppText variant="h2" align="center">
          {active.length.toLocaleString('es-MX')} categorías activas
        </AppText>
        {sample ? (
          <Animated.View key={sample} entering={ZoomIn.springify()}>
            <AppText variant="h3" align="center" color={colors.yellow}>
              “{sample}”
            </AppText>
          </Animated.View>
        ) : null}
        <View style={styles.actions}>
          <Button icon="dice" size="sm" label="Probar una al azar" tone="purple" disabled={!active.length} onPress={() => setSample(pick(active))} style={{ flex: 1 }} />
        </View>
        <View style={styles.actions}>
          <Button size="sm" icon="check" label="Activar todas" tone="neutral" onPress={() => updateSettings({ enabledPacks: [...ALL_PACK_IDS, CUSTOM_PACK_ID] })} style={{ flex: 1 }} />
          <Button size="sm" icon="close" label="Ninguna" tone="neutral" onPress={() => updateSettings({ enabledPacks: [] })} style={{ flex: 1 }} />
        </View>
      </Card>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar categoría…"
        placeholderTextColor={colors.textFaint}
        style={styles.input}
        accessibilityLabel="Buscar categoría"
      />
      {results.length ? (
        <Card>
          {results.map((r) => (
            <AppText key={r} variant="small">
              {r}
            </AppText>
          ))}
        </Card>
      ) : null}

      <SectionTitle icon="pen">Mis categorías</SectionTitle>
      <Card>
        <PackRow
          icon="pen"
          name="Personalizadas"
          description="Tus propias categorías"
          count={settings.customCategories.length}
          on={enabled.includes(CUSTOM_PACK_ID)}
          onToggle={() => togglePack(CUSTOM_PACK_ID)}
        />
        <View style={styles.addRow}>
          <TextInput
            value={newCat}
            onChangeText={setNewCat}
            placeholder="Ej. Cosas de la abuela"
            placeholderTextColor={colors.textFaint}
            style={[styles.input, { flex: 1 }]}
            onSubmitEditing={addCategory}
            returnKeyType="done"
            maxLength={48}
          />
          <IconButton icon="plus" label="Agregar categoría" background={colors.green} color={colors.bgTop} onPress={addCategory} />
        </View>
        {settings.customCategories.map((c) => (
          <View key={c} style={styles.customRow}>
            <AppText variant="body" style={{ flex: 1 }}>
              {c}
            </AppText>
            <IconButton icon="trash" size={34} label={`Quitar ${c}`} background="rgba(255,71,87,0.25)" onPress={() => updateSettings({ customCategories: settings.customCategories.filter((x) => x !== c) })} />
          </View>
        ))}
      </Card>

      <SectionTitle icon="layers">Paquetes</SectionTitle>
      {CATEGORY_PACKS.map((p) => (
        <Card key={p.id}>
          <PackRow
            icon={p.icon}
            name={p.name}
            description={p.description}
            count={p.categories.length}
            on={enabled.includes(p.id)}
            onToggle={() => togglePack(p.id)}
            onExpand={() => setExpanded(expanded === p.id ? null : p.id)}
            expanded={expanded === p.id}
          />
          {expanded === p.id ? (
            <Animated.View entering={FadeIn} style={styles.preview}>
              {p.categories.slice(0, 60).map((c) => (
                <View key={c} style={styles.tag}>
                  <AppText variant="caption">{c}</AppText>
                </View>
              ))}
              {p.categories.length > 60 ? (
                <AppText variant="caption" color={colors.textDim}>
                  y {p.categories.length - 60} más…
                </AppText>
              ) : null}
            </Animated.View>
          ) : null}
        </Card>
      ))}
    </Screen>
  );
}

function PackRow({
  icon,
  name,
  description,
  count,
  on,
  onToggle,
  onExpand,
  expanded,
}: {
  icon: React.ComponentProps<typeof Icon>['name'];
  name: string;
  description: string;
  count: number;
  on: boolean;
  onToggle: () => void;
  onExpand?: () => void;
  expanded?: boolean;
}) {
  return (
    <View style={styles.pack}>
      <PressableScale onPress={onToggle} accessibilityRole="switch" accessibilityState={{ checked: on }} accessibilityLabel={name} style={[styles.packIcon, on && { backgroundColor: colors.green }]}>
        <Icon name={on ? 'check' : icon} size={22} color={on ? colors.bgTop : colors.textDim} />
      </PressableScale>
      <PressableScale onPress={onExpand ?? onToggle} hapticFeedback={false} containerStyle={{ flex: 1 }} accessibilityLabel={`Ver ${name}`}>
        <AppText variant="bodyBold">
          {name} <AppText variant="caption" color={colors.textDim}>({count})</AppText>
        </AppText>
        <AppText variant="caption" color={colors.textDim} numberOfLines={2}>
          {description}
        </AppText>
      </PressableScale>
      {onExpand ? <Icon name={expanded ? 'minus' : 'plus'} size={16} color={colors.textDim} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 8 },
  input: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  customRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pack: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  packIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.cardStrong, alignItems: 'center', justifyContent: 'center' },
  preview: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.sm, backgroundColor: 'rgba(0,0,0,0.25)' },
});
