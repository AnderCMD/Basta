import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { LinearTransition, ZoomIn } from 'react-native-reanimated';
import { Avatar } from '../components/avatar';
import { Icon } from '../components/Icon';
import { AppText, Badge, Button, Card, Chip, EmptyState, PressableScale, Screen, SectionTitle, Stepper, Toggle } from '../components/ui';
import { buildAlphabet } from '../data/alphabet';
import { collectCategories } from '../data/categories';
import type { GameMode } from '../features/game/engine';
import { modeInfo, MODIFIERS } from '../features/game/modes';
import { shuffle } from '../lib/random';
import { gridColumns, useLayout } from '../lib/responsive';
import { colors, radius, teamColors } from '../lib/theme';
import { useAppStore, type PendingGame } from '../store/AppStore';
import { LIVES_OPTIONS, MAX_PLAYERS, ROUND_OPTIONS, TIME_OPTIONS, WILDCARD_OPTIONS } from '../store/schema';


const TEAM_NAMES = ['Rosa', 'Azul', 'Verde', 'Amarillo'];
const MODES: GameMode[] = ['classic', 'tournament', 'points', 'teams'];

/** Preparar partida: quién juega (y en qué orden), equipos y reglas. */
export default function SetupScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode: GameMode = MODES.includes(params.mode as GameMode) ? (params.mode as GameMode) : 'classic';
  const info = modeInfo(mode);
  const { players, settings, updateSettings, setPending, pending } = useAppStore();
  const { contentWidth, s } = useLayout();

  const [selected, setSelected] = useState<string[]>(() => {
    const prev = pending?.competitors.flatMap((c) => c.memberIds).filter((id) => players.some((p) => p.id === id));
    return (prev && prev.length >= 2 ? prev : players.map((p) => p.id)).slice(0, MAX_PLAYERS);
  });
  const [teamCount, setTeamCount] = useState(2);
  const [teamOf, setTeamOf] = useState<Record<string, number>>({});

  // Jugadores nuevos (agregados desde aquí) entran seleccionados.
  const [knownIds, setKnownIds] = useState(() => players.map((p) => p.id));
  const currentIds = players.map((p) => p.id);
  if (currentIds.join('|') !== knownIds.join('|')) {
    const added = currentIds.filter((id) => !knownIds.includes(id));
    setKnownIds(currentIds);
    setSelected((sel) => [...sel.filter((id) => currentIds.includes(id)), ...added].slice(0, MAX_PLAYERS));
  }

  const ordered = selected.map((id) => players.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p);
  const teamIndex = (id: string, i: number) => teamOf[id] ?? i % teamCount;
  const teams = Array.from({ length: teamCount }, (_, t) => ordered.filter((p, i) => teamIndex(p.id, i) === t));

  const categoriesCount = useMemo(() => collectCategories(settings.enabledPacks, settings.customCategories).length, [settings.enabledPacks, settings.customCategories]);
  const lettersCount = buildAlphabet(settings).length;

  const problems: string[] = [];
  if (ordered.length < info.minPlayers) problems.push(`Este modo necesita al menos ${info.minPlayers} jugadores.`);
  if (mode === 'teams' && teams.some((t) => t.length === 0)) problems.push('Cada equipo necesita al menos un integrante.');
  if (mode !== 'points' && ordered.length < 2) problems.push('Selecciona al menos 2 jugadores.');
  if (settings.useCategories && categoriesCount === 0) problems.push('Activa al menos un paquete de categorías.');

  const toggle = (id: string) =>
    setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : sel.length >= MAX_PLAYERS ? sel : [...sel, id]));

  const cycleTeam = (id: string, i: number) => setTeamOf((t) => ({ ...t, [id]: (teamIndex(id, i) + 1) % teamCount }));

  const shuffleTeams = () => {
    const mixed = shuffle(ordered.map((p) => p.id));
    setTeamOf(Object.fromEntries(mixed.map((id, i) => [id, i % teamCount])));
  };

  const start = () => {
    const competitors: PendingGame['competitors'] =
      mode === 'teams'
        ? teams.map((members, t) => ({ id: `team-${t}`, name: TEAM_NAMES[t], color: teamColors[t], memberIds: members.map((m) => m.id) }))
        : ordered.map((p, i) => ({ id: p.id, name: p.name, color: teamColors[i % teamColors.length], memberIds: [p.id] }));
    setPending({ mode, competitors });
    router.push('/game');
  };

  const cols = gridColumns(contentWidth, s(96), 10);
  const cell = (contentWidth - (cols - 1) * 10) / cols;

  return (
    <Screen
      title={info.name}
      footer={
        <Button
          size="lg"
          icon="rocket"
          label="¡A jugar!"
          subtitle={problems[0] ?? `${ordered.length} jugadores · ${settings.turnSeconds}s por turno`}
          tone={info.tone}
          disabled={problems.length > 0}
          onPress={start}
        />
      }
    >
      <Card tint="rgba(255,255,255,0.06)">
        <View style={styles.modeRow}>
          <Icon name={info.icon} size={26} color={colors.yellow} />
          <AppText variant="body" style={{ flex: 1 }}>
            {info.rules}
          </AppText>
        </View>
      </Card>

      <SectionTitle icon="users">
        {`¿Quién juega? (${ordered.length}) · toca en orden de turno`}
      </SectionTitle>
      {players.length === 0 ? (
        <EmptyState icon="userPlus" title="Aún no hay jugadores" message="Crea jugadores con su animal para empezar.">
          <Button icon="userPlus" label="Agregar jugadores" tone="secondary" onPress={() => router.push('/players')} />
        </EmptyState>
      ) : (
        <View style={styles.grid}>
          {players.map((p) => {
            const idx = selected.indexOf(p.id);
            const on = idx >= 0;
            return (
              <PressableScale
                key={p.id}
                accessibilityLabel={`${p.name}${on ? `, turno ${idx + 1}` : ''}`}
                accessibilityState={{ selected: on }}
                onPress={() => toggle(p.id)}
                style={[styles.chip, { width: cell }, on && styles.chipOn]}
              >
                <Avatar look={p.look} size={s(56)} dimmed={!on} />
                <AppText variant="small" weight="heavy" numberOfLines={1} color={on ? colors.text : colors.textFaint}>
                  {p.name}
                </AppText>
                {on ? (
                  <Animated.View entering={ZoomIn} style={styles.badge}>
                    <Badge>{idx + 1}</Badge>
                  </Animated.View>
                ) : null}
              </PressableScale>
            );
          })}
          <PressableScale accessibilityLabel="Agregar jugador" onPress={() => router.push('/players/edit')} style={[styles.chip, styles.addChip, { width: cell }]}>
            <View style={[styles.addCircle, { width: s(56), height: s(56), borderRadius: s(28) }]}>
              <Icon name="plus" size={28} />
            </View>
            <AppText variant="small" weight="heavy">
              Nuevo
            </AppText>
          </PressableScale>
        </View>
      )}

      {mode === 'teams' && ordered.length > 0 ? (
        <>
          <SectionTitle icon="peopleGroup">Equipos · toca a alguien para cambiarlo de equipo</SectionTitle>
          <Card>
            <Stepper label="Número de equipos" value={teamCount} options={[2, 3, 4] as const} onChange={setTeamCount} />
            <Button icon="shuffle" label="Mezclar equipos al azar" tone="neutral" size="sm" onPress={shuffleTeams} />
            {teams.map((members, t) => (
              <Animated.View key={t} layout={LinearTransition} style={[styles.team, { borderColor: teamColors[t] }]}>
                <AppText variant="bodyBold" color={teamColors[t]}>
                  Equipo {TEAM_NAMES[t]} ({members.length})
                </AppText>
                <View style={styles.teamMembers}>
                  {members.map((p) => (
                    <PressableScale key={p.id} accessibilityLabel={`Mover a ${p.name}`} onPress={() => cycleTeam(p.id, ordered.indexOf(p))} style={styles.teamMember}>
                      <Avatar look={p.look} size={40} ring={teamColors[t]} />
                      <AppText variant="caption" numberOfLines={1}>
                        {p.name}
                      </AppText>
                    </PressableScale>
                  ))}
                </View>
              </Animated.View>
            ))}
          </Card>
        </>
      ) : null}

      <SectionTitle icon="sliders">Reglas</SectionTitle>
      <Card>
        <Stepper label="Tiempo por turno" icon="stopwatch" value={settings.turnSeconds} options={TIME_OPTIONS} format={(v) => `${v} s`} onChange={(v) => updateSettings({ turnSeconds: v })} />
        {mode === 'tournament' || mode === 'teams' ? (
          <Stepper label="Vidas" icon="heart" value={settings.lives} options={LIVES_OPTIONS} onChange={(v) => updateSettings({ lives: v })} />
        ) : null}
        {mode === 'points' ? (
          <Stepper label="Rondas" icon="flag" value={settings.rounds} options={ROUND_OPTIONS} onChange={(v) => updateSettings({ rounds: v })} />
        ) : null}
        <Stepper
          label="Comodines"
          hint="Pasar turno o +5 s"
          icon="magic"
          value={settings.wildcards}
          options={WILDCARD_OPTIONS}
          onChange={(v) => updateSettings({ wildcards: v })}
        />
      </Card>

      <SectionTitle icon="magic">Modificadores</SectionTitle>
      <View style={styles.chips}>
        {MODIFIERS.map((m) => (
          <Chip
            key={m.id}
            icon={m.icon}
            label={m.name}
            selected={settings.modifiers[m.id]}
            color={colors.yellow}
            onPress={() => updateSettings({ modifiers: { ...settings.modifiers, [m.id]: !settings.modifiers[m.id] } })}
          />
        ))}
      </View>

      <SectionTitle icon="tags">Letras y categorías</SectionTitle>
      <Card>
        <Toggle
          label="Usar categorías"
          hint={settings.useCategories ? `${categoriesCount.toLocaleString('es-MX')} categorías activas` : 'Vale cualquier palabra'}
          value={settings.useCategories}
          onChange={(v) => updateSettings({ useCategories: v })}
        />
        <Button icon="tags" size="sm" tone="neutral" label="Elegir paquetes de categorías" onPress={() => router.push('/categories')} />
        <Toggle label="Incluir CH y LL" hint="Abecedario tradicional" value={settings.includeDigraphs} onChange={(v) => updateSettings({ includeDigraphs: v })} />
        <Toggle label="Quitar letras difíciles" hint={`K, Ñ, Q, W, X, Y · ${lettersCount} letras en juego`} value={settings.excludeHard} onChange={(v) => updateSettings({ excludeHard: v })} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  modeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chipOn: { borderColor: colors.green, backgroundColor: 'rgba(46,230,166,0.12)' },
  badge: { position: 'absolute', top: 6, right: 6 },
  addChip: { borderStyle: 'dashed', borderColor: colors.border },
  addCircle: { backgroundColor: colors.cardStrong, alignItems: 'center', justifyContent: 'center' },
  team: { borderWidth: 2, borderRadius: radius.md, padding: 10, gap: 8 },
  teamMembers: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  teamMember: { alignItems: 'center', width: 64, gap: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
