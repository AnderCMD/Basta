import { Redirect, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, type AvatarLook } from '../components/avatar';
import { Icon, type IconName } from '../components/Icon';
import { Logo } from '../components/Logo';
import { AppText } from '../components/ui/AppText';
import { colors, gradients } from '../lib/theme';

/**
 * Composiciones para imágenes de marca (logo, banner del README y social preview).
 * Solo existe en desarrollo; `scripts/brand.sh` toma capturas con Chrome sin interfaz.
 *   /brand?kind=social   1280×640
 *   /brand?kind=banner   1600×520
 *   /brand?kind=logo     1600×420 (fondo transparente)
 */
const CAST: AvatarLook[] = [
  { animal: 'ajolote', hat: 'sombrero', glasses: null, extra: 'paliacate', bg: null },
  { animal: 'gato', hat: 'corona', glasses: 'corazon', extra: null, bg: null },
  { animal: 'perro', hat: 'gorra', glasses: 'sol', extra: null, bg: null },
  { animal: 'panda', hat: 'fiesta', glasses: null, extra: 'corbatin', bg: null },
  { animal: 'leon', hat: null, glasses: 'redondos', extra: 'bigote', bg: null },
  { animal: 'rana', hat: 'vikingo', glasses: null, extra: null, bg: null },
  { animal: 'buho', hat: 'birrete', glasses: 'monoculo', extra: null, bg: null },
  { animal: 'pinguino', hat: 'copa', glasses: null, extra: 'bufanda', bg: null },
  { animal: 'conejo', hat: 'flores', glasses: null, extra: 'collar', bg: null },
  { animal: 'tigre', hat: 'vaquero', glasses: '3d', extra: null, bg: null },
];

const FEATURES: [IconName, string][] = [
  ['users', 'Hasta 20 jugadores'],
  ['trophy', 'Torneos y equipos'],
  ['tags', '+2,000 categorías'],
  ['mobile', 'Un solo dispositivo'],
];

function Backdrop({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={[styles.blob, { top: -160, left: -120, width: 420, height: 420, backgroundColor: colors.pink }]} />
      <View style={[styles.blob, { bottom: -200, right: -140, width: 520, height: 520, backgroundColor: colors.blue }]} />
      <View style={[styles.blob, { top: 60, right: 260, width: 160, height: 160, backgroundColor: colors.yellow, opacity: 0.12 }]} />
      {children}
    </View>
  );
}

function Parade({ size, from = 0, count = CAST.length }: { size: number; from?: number; count?: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      {CAST.slice(from, from + count).map((look, i) => (
        <View key={i} style={{ marginLeft: i ? -size * 0.18 : 0, transform: [{ translateY: i % 2 ? size * 0.12 : 0 }] }}>
          <Avatar look={look} size={size} ring={colors.bgMid} />
        </View>
      ))}
    </View>
  );
}

function Features({ size = 22 }: { size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
      {FEATURES.map(([icon, label]) => (
        <View key={label} style={styles.pill}>
          <Icon name={icon} size={size} color={colors.yellow} />
          <AppText weight="heavy" size={size * 0.85} allowFontScaling={false}>
            {label}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export default function Brand() {
  const { kind = 'social' } = useLocalSearchParams<{ kind?: string }>();
  if (!__DEV__) return <Redirect href="/" />;

  if (kind === 'logo') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
        <Logo size={210} animated={false} />
      </View>
    );
  }

  if (kind === 'banner') {
    return (
      <Backdrop>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 80, gap: 40 }}>
          <View style={{ flex: 1.1, gap: 22 }}>
            <Logo size={118} animated={false} />
            <AppText weight="heavy" size={34} align="center" color={colors.textDim} allowFontScaling={false}>
              El juego de palabras para jugar en grupo con un solo teléfono
            </AppText>
            <Features size={22} />
          </View>
          <View style={{ flex: 0.9, alignItems: 'center', gap: 6 }}>
            <Parade size={128} count={5} />
            <Parade size={128} from={5} count={5} />
          </View>
        </View>
      </Backdrop>
    );
  }

  return (
    <Backdrop>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 26, padding: 40 }}>
        <Logo size={128} animated={false} />
        <AppText weight="heavy" size={38} align="center" allowFontScaling={false}>
          Pon el teléfono en el centro y que empiece el juego
        </AppText>
        <Parade size={112} />
        <Features size={24} />
      </View>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  blob: { position: 'absolute', borderRadius: 999, opacity: 0.22 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
});
