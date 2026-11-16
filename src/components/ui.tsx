import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { haptic } from '../lib/haptics';
import { colors, gradients, radius, fonts } from '../lib/theme';
import { Icon, type IconName } from './Icon';

type Grad = readonly [string, string, ...string[]];

/** Fondo degradado con burbujas decorativas. */
export function Background({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.flex}>
      <LinearGradient colors={gradients.background} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View pointerEvents="none" style={[styles.blob, { top: -80, left: -60, backgroundColor: colors.pink }]} />
      <View pointerEvents="none" style={[styles.blob, { bottom: -100, right: -80, backgroundColor: colors.blue }]} />
      <View pointerEvents="none" style={[styles.blobSmall, { top: '40%', right: -40, backgroundColor: colors.yellow }]} />
      {children}
    </View>
  );
}

export function Screen({
  title,
  children,
  scroll = true,
  right,
}: {
  title?: string;
  children: React.ReactNode;
  scroll?: boolean;
  right?: React.ReactNode;
}) {
  const body = scroll ? (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, styles.scrollNoPad]}>{children}</View>
  );
  return (
    <Background>
      <SafeAreaView style={styles.flex} edges={['top', 'bottom', 'left', 'right']}>
        {title ? (
          <View style={styles.header}>
            <IconButton icon="back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
            <View style={{ minWidth: 48, alignItems: 'flex-end' }}>{right}</View>
          </View>
        ) : null}
        {body}
      </SafeAreaView>
    </Background>
  );
}

function usePressScale() {
  const scale = useState(() => new Animated.Value(1))[0];
  const to = (v: number) => Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 8 }).start();
  return { scale, onPressIn: () => to(0.95), onPressOut: () => to(1) };
}

export function GradientButton({
  label,
  subtitle,
  emoji,
  icon,
  colors: grad = gradients.primary,
  onPress,
  disabled,
  style,
  size = 'md',
}: {
  label: string;
  subtitle?: string;
  emoji?: string;
  icon?: IconName;
  colors?: Grad;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  size?: 'md' | 'lg';
}) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  return (
    <Animated.View style={[{ transform: [{ scale }], opacity: disabled ? 0.45 : 1 }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => {
          haptic.light();
          onPress();
        }}
      >
        <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.btn, size === 'lg' && styles.btnLg]}>
          {emoji ? <Text style={[styles.btnEmoji, size === 'lg' && { fontSize: 34 }]}>{emoji}</Text> : null}
          {icon ? <Icon name={icon} size={size === 'lg' ? 30 : 22} /> : null}
          <View style={{ flexShrink: 1 }}>
            <Text style={[styles.btnLabel, size === 'lg' && { fontSize: 22 }]}>{label}</Text>
            {subtitle ? <Text style={styles.btnSub}>{subtitle}</Text> : null}
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

export function IconButton({
  icon,
  onPress,
  color = colors.cardStrong,
  size = 48,
  label,
}: {
  icon: IconName;
  onPress: () => void;
  color?: string;
  size?: number;
  label?: string;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label ?? icon}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => {
          haptic.light();
          onPress();
        }}
        hitSlop={8}
        style={[styles.iconBtn, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}
      >
        <Icon name={icon} size={size * 0.48} />
      </Pressable>
    </Animated.View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.section}>{children}</Text>;
}

export function Stepper({
  label,
  value,
  format = (v) => String(v),
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: number[];
  format?: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const idx = Math.max(0, options.indexOf(value));
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.stepper}>
        <IconButton icon="minus" size={38} onPress={() => onChange(options[Math.max(0, idx - 1)])} label={`Menos ${label}`} />
        <Text style={styles.stepValue}>{format(value)}</Text>
        <IconButton
          icon="plus"
          size={38}
          onPress={() => onChange(options[Math.min(options.length - 1, idx + 1)])}
          label={`Más ${label}`}
        />
      </View>
    </View>
  );
}

export function Toggle({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={(v) => {
          haptic.light();
          onChange(v);
        }}
        trackColor={{ false: 'rgba(255,255,255,0.2)', true: colors.green }}
        thumbColor="#fff"
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  blob: { position: 'absolute', width: 260, height: 260, borderRadius: 130, opacity: 0.22 },
  blobSmall: { position: 'absolute', width: 140, height: 140, borderRadius: 70, opacity: 0.14 },
  scroll: { padding: 20, paddingBottom: 48, gap: 14, width: '100%', maxWidth: 720, alignSelf: 'center' },
  scrollNoPad: { width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, gap: 12 },
  headerTitle: { flex: 1, color: colors.text, fontSize: 24, fontFamily: fonts.black, letterSpacing: 0.3 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  btnLg: { paddingVertical: 20, justifyContent: 'flex-start', paddingHorizontal: 22 },
  btnEmoji: { fontSize: 24 },
  btnLabel: { color: '#fff', fontSize: 18, fontFamily: fonts.black },
  btnSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: fonts.semiBold, marginTop: 2 },
  iconBtn: { alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 12 },
  section: { color: colors.textDim, fontSize: 13, fontFamily: fonts.extraBold, letterSpacing: 1.2, textTransform: 'uppercase', marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44 },
  rowLabel: { color: colors.text, fontSize: 16, fontFamily: fonts.bold },
  hint: { color: colors.textFaint, fontSize: 13, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepValue: { color: colors.text, fontSize: 18, fontFamily: fonts.black, minWidth: 54, textAlign: 'center' },
});
