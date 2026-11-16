import React, { useState } from 'react';
import { Linking, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, GradientButton, IconButton, Screen, SectionTitle, Toggle } from '../components/ui';
import { buildAlphabet } from '../lib/alphabet';
import { DEFAULT_CATEGORIES } from '../lib/categories';
import { confirmAction } from '../lib/confirm';
import { colors, gradients, radius, fonts } from '../lib/theme';
import { useAppStore } from '../store/AppStore';

const REPO_URL = 'https://github.com/AnderCMD/Basta';

export default function SettingsScreen() {
  const { settings, updateSettings, resetWins } = useAppStore();
  const [newCat, setNewCat] = useState('');
  const alphabet = buildAlphabet(settings);

  const addCategory = () => {
    const c = newCat.trim();
    if (!c || settings.customCategories.includes(c)) return;
    updateSettings({ customCategories: [...settings.customCategories, c] });
    setNewCat('');
  };

  return (
    <Screen title="Ajustes">
      <SectionTitle>General</SectionTitle>
      <Card>
        <Toggle label="Vibración" hint="Al tocar letras, al fallar y en los últimos segundos." value={settings.haptics} onChange={(v) => updateSettings({ haptics: v })} />
        <Toggle label="Usar categorías" value={settings.useCategories} onChange={(v) => updateSettings({ useCategories: v })} />
      </Card>

      <SectionTitle>Abecedario ({alphabet.length} letras)</SectionTitle>
      <Card>
        <Toggle label="Incluir CH y LL" value={settings.includeDigraphs} onChange={(v) => updateSettings({ includeDigraphs: v })} />
        <Toggle label="Quitar letras difíciles" hint="K, Ñ, Q, W, X, Y" value={settings.excludeHard} onChange={(v) => updateSettings({ excludeHard: v })} />
        <Text style={styles.alphabet}>{alphabet.join(' ')}</Text>
      </Card>

      <SectionTitle>Mis categorías</SectionTitle>
      <Card>
        <Text style={styles.hint}>Se mezclan con las {DEFAULT_CATEGORIES.length} categorías incluidas.</Text>
        <View style={styles.addRow}>
          <TextInput
            value={newCat}
            onChangeText={setNewCat}
            placeholder="Ej. Cosas de la abuela"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
            onSubmitEditing={addCategory}
            returnKeyType="done"
            maxLength={32}
          />
          <IconButton icon="plus" onPress={addCategory} color={colors.green} label="Agregar categoría" />
        </View>
        {settings.customCategories.map((c) => (
          <View key={c} style={styles.catRow}>
            <Text style={styles.catText}>{c}</Text>
            <IconButton
              icon="trash"
              size={36}
              color="rgba(255,71,87,0.25)"
              label={`Quitar ${c}`}
              onPress={() => updateSettings({ customCategories: settings.customCategories.filter((x) => x !== c) })}
            />
          </View>
        ))}
      </Card>

      <SectionTitle>Datos</SectionTitle>
      <GradientButton
        icon="trophy"
        label="Reiniciar victorias"
        colors={gradients.neutral}
        onPress={() => confirmAction('Reiniciar victorias', 'Todos los jugadores quedarán con 0 victorias.', resetWins)}
      />

      <SectionTitle>Acerca de</SectionTitle>
      <Card>
        <Text style={styles.hint}>Basta es un proyecto de código abierto bajo licencia MIT. ¡Las contribuciones son bienvenidas!</Text>
        <GradientButton icon="github" label="Ver en GitHub" colors={gradients.secondary} onPress={() => Linking.openURL(REPO_URL)} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  alphabet: { color: colors.yellow, fontSize: 18, fontFamily: fonts.black, letterSpacing: 2, lineHeight: 28, textAlign: 'center' },
  hint: { color: colors.textDim, fontSize: 14, lineHeight: 20 },
  addRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
    fontFamily: fonts.bold,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  catText: { color: colors.text, fontSize: 16, fontFamily: fonts.bold, flex: 1 },
});
