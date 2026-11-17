import { router } from 'expo-router';
import React from 'react';
import { Image, Linking, StyleSheet, View } from 'react-native';
import { Icon } from '../components/Icon';
import { AppText, Button, Card, PressableScale, Row, Screen, SectionTitle, Segmented, Toggle } from '../components/ui';
import { buildAlphabet } from '../data/alphabet';
import { APP_VERSION, AUTHOR, REPO_URL } from '../lib/appInfo';
import { confirmAction } from '../lib/confirm';
import { playSound, setSoundPack, setSoundVolume, SOUND_PACKS, type SoundPackId, type SoundVolume } from '../lib/sound';
import { colors, radius } from '../lib/theme';
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
        {settings.sound ? (
          <>
            <Row label="Volumen" icon="volume" />
            <Segmented
              value={settings.soundVolume}
              onChange={(v: SoundVolume) => {
                updateSettings({ soundVolume: v });
                setSoundVolume(v);
                playSound('tap');
              }}
              options={[
                { value: 'bajo', label: 'Bajo' },
                { value: 'medio', label: 'Medio' },
                { value: 'alto', label: 'Alto' },
              ]}
            />
            <Toggle
              icon="clock"
              label="Tic-tac final"
              hint="Suena en los últimos 3 segundos del turno."
              value={settings.tickSound}
              onChange={(v) => updateSettings({ tickSound: v })}
            />
          </>
        ) : null}
      </Card>

      {settings.sound ? (
        <>
          <SectionTitle icon="music">Estilo de sonido · toca para escucharlo</SectionTitle>
          <View style={styles.packs}>
            {SOUND_PACKS.map((p) => {
              const active = settings.soundPack === p.id;
              return (
                <PressableScale
                  key={p.id}
                  containerStyle={styles.packCell}
                  accessibilityLabel={`Estilo ${p.name}`}
                  accessibilityState={{ selected: active }}
                  onPress={() => {
                    updateSettings({ soundPack: p.id as SoundPackId });
                    setSoundPack(p.id);
                    setTimeout(() => playSound('tap'), 80);
                    setTimeout(() => playSound('golden'), 420);
                  }}
                  style={[styles.pack, active && styles.packActive]}
                >
                  <Icon name={active ? 'check' : p.icon} size={22} color={active ? colors.bgTop : colors.yellow} />
                  <View style={{ flex: 1 }}>
                    <AppText variant="bodyBold" color={active ? colors.bgTop : colors.text}>
                      {p.name}
                    </AppText>
                    <AppText variant="caption" color={active ? colors.bgTop : colors.textDim}>
                      {p.description}
                    </AppText>
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </>
      ) : null}

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
      </Card>
      <Card style={styles.author}>
        <AppText variant="label" color={colors.textDim}>
          Hecho con cariño por
        </AppText>
        <Image source={AUTHOR.logo} style={styles.authorLogo} resizeMode="contain" accessibilityLabel={`Logotipo de ${AUTHOR.name}`} />
        <AppText variant="small" color={colors.textDim} align="center">
          {AUTHOR.role}
        </AppText>
      </Card>
      <Button icon="earth" label={`Portafolio de ${AUTHOR.name}`} subtitle="andercmd.dev" tone="primary" onPress={() => Linking.openURL(AUTHOR.portfolio)} />
      <Button icon="github" label="Ver el código en GitHub" subtitle="AnderCMD/Basta" tone="secondary" onPress={() => Linking.openURL(REPO_URL)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  packs: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  packCell: { flexGrow: 1, flexBasis: 240 },
  pack: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  packActive: { backgroundColor: colors.yellow, borderColor: colors.yellow },
  author: { alignItems: 'center' },
  authorLogo: { width: 220, height: 57 },
});
