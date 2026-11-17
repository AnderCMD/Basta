import React from 'react';
import { StyleSheet, Switch, View, type StyleProp, type ViewStyle } from 'react-native';
import { haptic } from '../../lib/haptics';
import { useLayout } from '../../lib/responsive';
import { colors, radius } from '../../lib/theme';
import { Icon, type IconName } from '../Icon';
import { AppText } from './AppText';
import { IconButton } from './IconButton';
import { PressableScale } from './PressableScale';

/** Contenedor translúcido con borde suave. */
export function Card({ children, style, tint }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; tint?: string }) {
  const { s } = useLayout();
  return <View style={[styles.card, { padding: s(16), gap: s(12) }, tint ? { backgroundColor: tint } : null, style]}>{children}</View>;
}

export function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: IconName }) {
  return (
    <View style={styles.sectionRow}>
      {icon ? <Icon name={icon} size={14} color={colors.textDim} /> : null}
      <AppText variant="label" color={colors.textDim}>
        {children}
      </AppText>
    </View>
  );
}

/** Fila con etiqueta a la izquierda y control a la derecha. */
export function Row({ label, hint, icon, children }: { label: string; hint?: string; icon?: IconName; children?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      {icon ? <Icon name={icon} size={20} color={colors.textDim} /> : null}
      <View style={{ flex: 1 }}>
        <AppText variant="bodyBold">{label}</AppText>
        {hint ? (
          <AppText variant="small" color={colors.textFaint}>
            {hint}
          </AppText>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/** Selector numérico con − y + sobre una lista de opciones válidas. */
export function Stepper<T extends number>({
  label,
  hint,
  icon,
  value,
  options,
  format = (v) => String(v),
  onChange,
}: {
  label: string;
  hint?: string;
  icon?: IconName;
  value: T;
  options: readonly T[];
  format?: (v: T) => string;
  onChange: (v: T) => void;
}) {
  const idx = Math.max(0, options.indexOf(value));
  return (
    <Row label={label} hint={hint} icon={icon}>
      <View style={styles.stepper}>
        <IconButton icon="minus" size={36} label={`Menos ${label}`} disabled={idx === 0} onPress={() => onChange(options[Math.max(0, idx - 1)])} />
        <AppText variant="h3" align="center" style={{ minWidth: 64 }}>
          {format(value)}
        </AppText>
        <IconButton
          icon="plus"
          size={36}
          label={`Más ${label}`}
          disabled={idx === options.length - 1}
          onPress={() => onChange(options[Math.min(options.length - 1, idx + 1)])}
        />
      </View>
    </Row>
  );
}

export function Toggle({ label, hint, icon, value, onChange }: { label: string; hint?: string; icon?: IconName; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Row label={label} hint={hint} icon={icon}>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={(v) => {
          haptic.select();
          onChange(v);
        }}
        trackColor={{ false: 'rgba(255,255,255,0.2)', true: colors.green }}
        thumbColor="#fff"
      />
    </Row>
  );
}

/** Control segmentado (pestañas compactas). */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly { value: T; label: string; icon?: IconName }[];
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.segmented} accessibilityRole="tablist">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <PressableScale
            key={o.value}
            containerStyle={{ flex: 1 }}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={o.label}
            onPress={() => onChange(o.value)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            {o.icon ? <Icon name={o.icon} size={16} color={active ? colors.bgTop : colors.textDim} /> : null}
            <AppText variant="small" weight="bold" color={active ? colors.bgTop : colors.textDim} numberOfLines={1}>
              {o.label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

/** Chip seleccionable. */
export function Chip({
  label,
  icon,
  selected,
  color = colors.green,
  onPress,
}: {
  label: string;
  icon?: IconName;
  selected?: boolean;
  color?: string;
  onPress?: () => void;
}) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={[styles.chip, selected && { backgroundColor: color, borderColor: color }]}
    >
      {icon ? <Icon name={icon} size={14} color={selected ? colors.bgTop : colors.textDim} /> : null}
      <AppText variant="small" weight="bold" color={selected ? colors.bgTop : colors.text}>
        {label}
      </AppText>
    </PressableScale>
  );
}

/** Estado vacío con ícono y mensaje. */
export function EmptyState({ icon, title, message, children }: { icon: IconName; title: string; message?: string; children?: React.ReactNode }) {
  return (
    <Card style={{ alignItems: 'center' }}>
      <Icon name={icon} size={40} color={colors.textFaint} />
      <AppText variant="h3" align="center">
        {title}
      </AppText>
      {message ? (
        <AppText variant="small" color={colors.textDim} align="center">
          {message}
        </AppText>
      ) : null}
      {children}
    </Card>
  );
}

/** Insignia pequeña con número o texto. */
export function Badge({ children, color = colors.green, textColor = colors.bgTop }: { children: React.ReactNode; color?: string; textColor?: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <AppText variant="caption" weight="black" color={textColor}>
        {children}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  segmented: { flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: radius.md, padding: 4, gap: 4 },
  segment: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 6, borderRadius: radius.sm },
  segmentActive: { backgroundColor: colors.yellow },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  badge: { minWidth: 24, height: 24, paddingHorizontal: 6, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
