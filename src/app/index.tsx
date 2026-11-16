import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ANIMAL_IDS, AnimalAvatar } from '../components/AnimalAvatar';
import { LetterTile } from '../components/LetterTile';
import { Background, GradientButton, IconButton } from '../components/ui';
import { colors, gradients, fonts } from '../lib/theme';
import { useAppStore } from '../store/AppStore';

const TITLE = ['B', 'A', 'S', 'T', 'A'];

function BouncingTitle() {
  const anims = useState(() => TITLE.map(() => new Animated.Value(0)))[0];
  useEffect(() => {
    const loops = anims.map((a, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 140),
          Animated.timing(a, { toValue: 1, duration: 380, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(a, { toValue: 0, duration: 380, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          Animated.delay((TITLE.length - i) * 140 + 1400),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [anims]);

  return (
    <View style={s.titleRow}>
      {TITLE.map((l, i) => (
        <Animated.View
          key={i}
          style={{ transform: [{ translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [0, -16] }) }, { rotate: `${(i - 2) * 4}deg` }] }}
        >
          <LetterTile letter={l} size={58} colorIndex={i} disabled />
        </Animated.View>
      ))}
    </View>
  );
}

export default function Home() {
  const { players } = useAppStore();
  const parade = players.length ? players.map((p) => p.animal) : ANIMAL_IDS.slice(0, 6);

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.container}>
          <View style={s.topBar}>
            <View />
            <IconButton icon="gear" onPress={() => router.push('/settings')} label="Ajustes" />
          </View>

          <BouncingTitle />
          <Text style={s.tagline}>¡Di una palabra, toca la letra y pasa el turno!</Text>

          <View style={s.parade}>
            {parade.slice(0, 8).map((a, i) => (
              <View key={`${a}-${i}`} style={{ marginLeft: i ? -12 : 0 }}>
                <AnimalAvatar animal={a} size={44} ring={colors.bgMid} />
              </View>
            ))}
          </View>

          <View style={s.menu}>
            <GradientButton
              size="lg"
              icon="bolt"
              label="Partida rápida"
              subtitle="Si fallas, quedas fuera. Gana el último."
              colors={gradients.primary}
              onPress={() => router.push({ pathname: '/setup', params: { mode: 'quick' } })}
            />
            <GradientButton
              size="lg"
              icon="trophy"
              label="Torneo"
              subtitle="Vidas, rondas y eliminación hasta el campeón."
              colors={gradients.gold}
              onPress={() => router.push({ pathname: '/setup', params: { mode: 'tournament' } })}
            />
            <GradientButton
              size="lg"
              icon="paw"
              label="Jugadores"
              subtitle={players.length ? `${players.length} registrados · elige su animal` : 'Agrega nombres y elige un animal'}
              colors={gradients.secondary}
              onPress={() => router.push('/players')}
            />
            <GradientButton
              size="lg"
              icon="book"
              label="Cómo jugar"
              subtitle="Reglas en 30 segundos"
              colors={gradients.success}
              onPress={() => router.push('/how-to')}
            />
          </View>

          <Text style={s.footer}>Basta v{Constants.expoConfig?.version ?? '1.0.0'} · Código abierto · MIT</Text>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

const s = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40, gap: 18, alignItems: 'stretch', maxWidth: 560, width: '100%', alignSelf: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  tagline: { color: colors.textDim, textAlign: 'center', fontSize: 16, fontFamily: fonts.bold },
  parade: { flexDirection: 'row', justifyContent: 'center', marginVertical: 4 },
  menu: { gap: 14, marginTop: 6 },
  footer: { color: colors.textFaint, textAlign: 'center', fontSize: 12, marginTop: 8 },
});
