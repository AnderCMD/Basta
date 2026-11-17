import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLayout } from '../../lib/responsive';
import { colors } from '../../lib/theme';

/**
 * Capa modal a pantalla completa dentro de una pantalla (pausa, resultados…).
 * Entra con fundido y el contenido con un "zoom" con resorte.
 */
export function Overlay({ children, maxWidth = 560 }: { children: React.ReactNode; maxWidth?: number }) {
  const { s, width } = useLayout();
  return (
    <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(150)} style={[StyleSheet.absoluteFill, styles.overlay]}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Animated.View
            entering={ZoomIn.springify().damping(14)}
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
