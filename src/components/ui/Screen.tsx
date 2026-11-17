import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLayout } from '../../lib/responsive';
import { AppText } from './AppText';
import { Background } from './Background';
import { IconButton } from './IconButton';

type ScreenProps = {
  title?: string;
  children: React.ReactNode;
  /** Contenido a la derecha del encabezado (p. ej. un botón). */
  right?: React.ReactNode;
  /** Pie fijo (p. ej. botón principal) fuera del scroll. */
  footer?: React.ReactNode;
  scroll?: boolean;
};

/** Volver atrás o al menú si no hay historial (p. ej. al abrir una URL directa). */
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

/**
 * Plantilla de pantalla: fondo, áreas seguras, encabezado con botón atrás,
 * contenido centrado con ancho máximo responsivo y animación de entrada.
 */
export function Screen({ title, children, right, footer, scroll = true }: ScreenProps) {
  const { contentWidth, s } = useLayout();
  const inner = { width: contentWidth, alignSelf: 'center' as const, gap: s(14) };

  return (
    <Background>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom', 'left', 'right']}>
        {title ? (
          <View style={[styles.header, { width: contentWidth }]}>
            <IconButton icon="back" label="Volver" onPress={goBack} />
            <AppText variant="h1" style={styles.title} numberOfLines={1} accessibilityRole="header">
              {title}
            </AppText>
            {right ?? <View style={{ width: s(46) }} />}
          </View>
        ) : null}
        {scroll ? (
          <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: s(40) }]} keyboardShouldPersistTaps="handled">
            <Animated.View entering={FadeIn.duration(250)} style={inner}>
              {children}
            </Animated.View>
          </ScrollView>
        ) : (
          <View style={[styles.flex, inner]}>{children}</View>
        )}
        {footer ? <View style={[styles.footer, { width: contentWidth }]}>{footer}</View> : null}
      </SafeAreaView>
    </Background>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', gap: 12, paddingTop: 8, paddingBottom: 6 },
  title: { flex: 1 },
  scroll: { paddingTop: 8 },
  footer: { alignSelf: 'center', paddingVertical: 10 },
});
