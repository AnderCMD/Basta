import { router } from 'expo-router';
import React from 'react';
import { Linking } from 'react-native';
import { AppText, Button, Card, Screen, SectionTitle, Toggle } from '../components/ui';
import { buildAlphabet } from '../data/alphabet';
import { APP_VERSION, REPO_URL } from '../lib/appInfo';
import { confirmAction } from '../lib/confirm';
import { playSound } from '../lib/sound';
import { colors } from '../lib/theme';
import { useAppStore } from '../store/AppStore';

export default function SettingsScreen() {
  const { settings, updateSettings, resetStats } = useAppStore();
  const alphabet = buildAlphabet(settings);

  return (
    <Screen title="Ajustes">
      <SectionTitle icon="volume">Sonido y vibración</SectionTitle>
      <Card>
        <Toggle
          icon="volume"
          label="Efectos de sonido"
          value={settings.sound}
          onChange={(v) => {
            updateSettings({ sound: v });
            if (v) setTimeout(() => playSound('tap'), 50);
          }}
        />
        <Toggle icon="mobile" label="Vibración" hint="Al tocar letras, al fallar y en los últimos segundos." value={settings.haptics} onChange={(v) => updateSettings({ haptics: v })} />
      </Card>

      <SectionTitle icon="font">{`Abecedario (${alphabet.length} letras)`}</SectionTitle>
      <Card>
        <Toggle label="Incluir CH y LL" value={settings.includeDigraphs} onChange={(v) => updateSettings({ includeDigraphs: v })} />
        <Toggle label="Quitar letras difíciles" hint="K, Ñ, Q, W, X, Y" value={settings.excludeHard} onChange={(v) => updateSettings({ excludeHard: v })} />
        <AppText variant="h3" align="center" color={colors.yellow} style={{ letterSpacing: 2 }}>
          {alphabet.join(' ')}
        </AppText>
      </Card>

      <SectionTitle icon="tags">Categorías</SectionTitle>
      <Button icon="tags" label="Paquetes y categorías propias" tone="purple" onPress={() => router.push('/categories')} />

      <SectionTitle icon="chart">Datos</SectionTitle>
      <Button
        icon="trash"
        label="Reiniciar estadísticas y logros"
        tone="neutral"
        onPress={() => confirmAction('Reiniciar estadísticas', 'Se borrarán victorias, puntos, logros e historial de todos los jugadores. Los jugadores se conservan.', resetStats, 'Reiniciar')}
      />

      <SectionTitle icon="info">Acerca de</SectionTitle>
      <Card>
        <AppText variant="bodyBold">Basta v{APP_VERSION}</AppText>
        <AppText variant="small" color={colors.textDim}>
          Proyecto de código abierto bajo licencia MIT. Íconos de Font Awesome Free (CC BY 4.0). Funciona sin internet, sin cuentas y sin anuncios.
        </AppText>
        <Button icon="github" label="Ver el código en GitHub" tone="secondary" onPress={() => Linking.openURL(REPO_URL)} />
      </Card>
    </Screen>
  );
}
