import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, ANIMAL_IDS, defaultLook } from '../components/avatar';
import { Logo } from '../components/Logo';
import { AppText, Background, Button, IconButton } from '../components/ui';
import { TOTAL_CATEGORIES } from '../data/categories';
import { APP_VERSION } from '../lib/appInfo';
import { useLayout } from '../lib/responsive';
import { colors } from '../lib/theme';
import { useAppStore } from '../store/AppStore';

export default function Home() {
  const { players } = useAppStore();
  const { contentWidth, isTablet, isLandscape, s } = useLayout();
  const parade = players.length ? players.map((p) => p.look) : ANIMAL_IDS.slice(0, 7).map((a) => defaultLook(a));
  const twoColumns = isTablet || isLandscape;

  const menu = [
    { icon: 'play', label: 'Jugar', subtitle: '4 modos · hasta 20 jugadores', tone: 'primary', href: '/play' },
    { icon: 'paw', label: 'Jugadores', subtitle: players.length ? `${players.length} registrados · personaliza su avatar` : 'Crea jugadores con su animal', tone: 'secondary', href: '/players' },
    { icon: 'trophy', label: 'Salón de la fama', subtitle: 'Marcadores, premios y logros', tone: 'gold', href: '/hall-of-fame' },
    { icon: 'tags', label: 'Categorías', subtitle: `${TOTAL_CATEGORIES.toLocaleString('es-MX')} categorías en paquetes`, tone: 'purple', href: '/categories' },
    { icon: 'bookOpen', label: 'Cómo jugar', subtitle: 'Reglas, modos y puntos', tone: 'success', href: '/how-to' },
  ] as const;

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={[styles.container, { width: contentWidth, gap: s(16) }]}>
          <View style={styles.topBar}>
            <View />
            <IconButton icon="gear" label="Ajustes" onPress={() => router.push('/settings')} />
          </View>

          <Animated.View entering={FadeIn.duration(300)}>
            <Logo size={s(isTablet ? 78 : 54)} />
          </Animated.View>
          <AppText variant="h3" align="center" color={colors.textDim}>
            Di una palabra, toca la letra y pasa el turno.
          </AppText>

          <Animated.View entering={FadeInUp.delay(150)} style={styles.parade}>
            {parade.slice(0, 9).map((look, i) => (
              <View key={i} style={{ marginLeft: i ? -s(12) : 0 }}>
                <Avatar look={look} size={s(46)} ring={colors.bgMid} />
              </View>
            ))}
          </Animated.View>

          <View style={[styles.menu, twoColumns && styles.menuGrid]}>
            {menu.map((item, i) => (
              <Animated.View key={item.href} entering={FadeIn.delay(150 + i * 40).duration(250)} style={twoColumns ? styles.gridItem : undefined}>
                <Button size="lg" alignStart icon={item.icon} label={item.label} subtitle={item.subtitle} tone={item.tone} onPress={() => router.push(item.href)} />
              </Animated.View>
            ))}
          </View>

          <AppText variant="caption" align="center" color={colors.textFaint}>
            Basta v{APP_VERSION} · Código abierto · MIT
          </AppText>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: { alignSelf: 'center', paddingVertical: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between' },
  parade: { flexDirection: 'row', justifyContent: 'center' },
  menu: { gap: 12 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '48.8%' },
});
