import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLayout } from '../../lib/responsive';
import { colors } from '../../lib/theme';

/**
 * Capa modal a pantalla completa dentro de una pantalla (pausa, resultados…).
 * Entra con un fundido suave, sin rebotes (evita mareos).
 */
export function Overlay({ children, maxWidth = 560 }: { children: React.ReactNode; maxWidth?: number }) {
  const { s, width } = useLayout();
  return (
    <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(150)} style={[StyleSheet.absoluteFill, styles.overlay]}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Animated.View
            entering={FadeIn.duration(220)}
            style={{ width: Math.min(width - 32, s(maxWidth)), alignSelf: 'center', gap: s(14), paddingVertical: s(20) }}
          >
            {children}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: { backgroundColor: colors.overlay, zIndex: 50 },
  scroll: { flexGrow: 1, justifyContent: 'center' },
});
