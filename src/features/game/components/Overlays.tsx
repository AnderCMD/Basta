import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { Avatar, type AvatarLook } from '../../../components/avatar/Avatar';
import { Confetti } from '../../../components/Confetti';
import { Icon } from '../../../components/Icon';
import { AppText, Button, Card, Overlay, PressableScale, Segmented } from '../../../components/ui';
import { confirmAction } from '../../../lib/confirm';
import { useLayout } from '../../../lib/responsive';
import { colors, radius } from '../../../lib/theme';
import { ACHIEVEMENTS, TIER_COLORS } from '../../stats/achievements';
import { computeAwards } from '../awards';
import { activeCompetitors, canUndo, ranking, type GameState } from '../engine';
import { Lives } from './PlayersStrip';

type GS = GameState<AvatarLook>;

/* ----------------------------- Pausa ----------------------------- */

type PauseProps = {
  state: GS;
  onResume: () => void;
  onMistake: (id: string) => void;
  onKick: (id: string) => void;
  onUndo: () => void;
  onChangeCategory: () => void;
  onResetLetters: () => void;
  onQuit: () => void;
};

export function PauseMenu({ state, onResume, onMistake, onKick, onUndo, onChangeCategory, onResetLetters, onQuit }: PauseProps) {
  const [judge, setJudge] = useState<null | 'mistake' | 'kick'>(null);
  const { s } = useLayout();
  const mode = state.config.mode;

  if (judge) {
    const consequence =
      judge === 'kick'
        ? 'Saldrá de la partida definitivamente.'
        : mode === 'points'
          ? 'Pierde puntos y empieza una ronda nueva.'
          : mode === 'classic'
            ? 'Quedará fuera de la partida.'
            : 'Pierde una vida y empieza una ronda nueva.';
    return (
      <Overlay>
        <AppText variant="h1" align="center">
          {judge === 'kick' ? '¿A quién sacamos?' : '¿Quién se equivocó?'}
        </AppText>
        <Segmented
          value={judge}
          onChange={setJudge}
          options={[
            { value: 'mistake', label: 'Se equivocó', icon: 'gavel' },
            { value: 'kick', label: 'Sacar', icon: 'userX' },
          ]}
        />
        <AppText variant="body" align="center" color={colors.textDim}>
          {consequence}
        </AppText>
        <View style={styles.pickGrid}>
          {activeCompetitors(state).map((c) => (
            <PressableScale
              key={c.id}
              accessibilityLabel={c.name}
              style={[styles.pickCell, { width: s(104) }]}
              onPress={() =>
                judge === 'kick'
                  ? confirmAction('Sacar de la partida', `¿Sacar a ${c.name}?`, () => onKick(c.id), 'Sacar')
                  : onMistake(c.id)
              }
            >
              <View style={{ flexDirection: 'row' }}>
                {c.members.slice(0, 2).map((m, i) => (
                  <View key={m.id} style={{ marginLeft: i ? -18 : 0 }}>
                    <Avatar look={m.look} size={s(60)} />
                  </View>
                ))}
              </View>
              <AppText variant="small" weight="heavy" numberOfLines={1}>
                {c.name}
              </AppText>
            </PressableScale>
          ))}
        </View>
        <Button label="Cancelar" tone="neutral" onPress={() => setJudge(null)} />
      </Overlay>
    );
  }

  return (
    <Overlay>
      <Animated.View entering={FadeIn.duration(250)} style={{ alignItems: 'center' }}>
        <Icon name="pause" size={46} color={colors.yellow} />
      </Animated.View>
      <AppText variant="h1" align="center">
        Pausa
      </AppText>
      <Button icon="play" label="Continuar" tone="success" onPress={onResume} />
      <Button icon="gavel" label="Alguien se equivocó" subtitle="Quitar vida, puntos o sacarlo" tone="danger" onPress={() => setJudge('mistake')} />
      {canUndo(state) ? (
        <Button
          icon="undo"
          label={state.lastPlay ? `Deshacer letra ${state.lastPlay.letter}` : 'Deshacer'}
          subtitle="Regresa el turno anterior"
          tone="secondary"
          onPress={onUndo}
        />
      ) : null}
      <Button icon="refresh" label="Cambiar categoría" subtitle={`Ahora: ${state.category}`} tone="neutral" onPress={onChangeCategory} />
      <Button icon="font" label="Reiniciar letras" tone="neutral" onPress={onResetLetters} />
      <Button
        icon="close"
        label="Terminar partida"
        tone="neutral"
        onPress={() => confirmAction('Terminar partida', '¿Salir al menú? Se perderá el progreso de esta partida.', onQuit, 'Salir')}
      />
    </Overlay>
  );
}

/* ------------------------------ Falla ----------------------------- */

export function FailOverlay({ state, onNext, onUndo }: { state: GS; onNext: () => void; onUndo: () => void }) {
  const fail = state.fail!;
  const competitor = state.competitors.find((c) => c.id === fail.competitorId)!;
  const member = competitor.members.find((m) => m.id === fail.memberId) ?? competitor.members[0];
  const mode = state.config.mode;
  const shake = useSharedValue(0);
  useEffect(() => {
    shake.value = withSequence(...[14, -14, 10, -10, 5, 0].map((v) => withTiming(v, { duration: 60 })));
  }, [shake]);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));
  const title = fail.reason === 'timeout' ? '¡Se acabó el tiempo!' : fail.reason === 'kicked' ? '¡Fuera de la partida!' : '¡Error!';
  const icon = fail.reason === 'timeout' ? 'stopwatch' : fail.reason === 'kicked' ? 'userX' : 'gavel';
  const nextLabel = mode === 'classic' ? 'Siguiente turno' : mode === 'points' ? `Ronda ${state.round + 1} de ${state.config.rounds}` : `Ronda ${state.round + 1}`;

  return (
    <Overlay>
      <Animated.View entering={FadeIn.duration(250)} style={{ alignItems: 'center' }}>
        <Icon name={icon} size={58} color={colors.red} />
      </Animated.View>
      <AppText variant="h1" align="center">
        {title}
      </AppText>
      <Animated.View style={[{ alignItems: 'center', gap: 8 }, shakeStyle]}>
        <Avatar look={member.look} size={120} ring={colors.red} />
        <AppText variant="h2" align="center">
          {member.name}
          {competitor.members.length > 1 ? ` · ${competitor.name}` : ''}
        </AppText>
        {fail.eliminated ? (
          <AppText variant="bodyBold" color={colors.red} align="center">
            {competitor.members.length > 1 ? '¡El equipo queda eliminado!' : '¡Queda eliminado!'}
          </AppText>
        ) : mode === 'points' ? (
          <AppText variant="bodyBold" color={colors.textDim} align="center">
            −{fail.penalty} puntos
          </AppText>
        ) : (
          <View style={{ alignItems: 'center', gap: 6 }}>
            <AppText variant="bodyBold" color={colors.textDim}>
              Pierde una vida
            </AppText>
            <Lives lives={competitor.lives} max={state.config.lives} size={22} />
          </View>
        )}
      </Animated.View>
      {mode !== 'points' ? (
        <AppText variant="small" color={colors.textDim} align="center">
          Quedan {activeCompetitors(state).length} en juego
        </AppText>
      ) : null}
      <Button
        icon="play"
        label={nextLabel}
        subtitle={mode === 'classic' ? `Sigue la categoría: ${state.category}` : 'Nueva categoría y letras frescas'}
        tone="success"
        onPress={onNext}
      />
      <Button icon="undo" label="Fue un error, deshacer" tone="neutral" onPress={onUndo} />
    </Overlay>
  );
}

/* ---------------------------- Resultados --------------------------- */

type ResultsProps = {
  state: GS;
  newAchievements: { playerId: string; achievements: string[] }[];
  onRematch: () => void;
  onMenu: () => void;
  onUndo?: () => void;
};

const MEDAL_COLORS = ['#FFD23F', '#C9D3E0', '#E0915A'];

export function ResultsOverlay({ state, newAchievements, onRematch, onMenu, onUndo }: ResultsProps) {
  const ranked = ranking(state);
  const champ = ranked[0];
  const awards = computeAwards(state);
  const { s } = useLayout();
  const memberName = (id: string) => state.competitors.flatMap((c) => c.members).find((m) => m.id === id);
  const unlocked = newAchievements.flatMap((u) => u.achievements.map((a) => ({ playerId: u.playerId, achievement: ACHIEVEMENTS.find((x) => x.id === a) }))).filter((x) => x.achievement);

  return (
    <>
      <Overlay maxWidth={620}>
        <Animated.View entering={FadeIn.duration(250)} style={{ alignItems: 'center', gap: 6 }}>
          <Icon name="crown" size={50} color={colors.yellow} />
          <AppText variant="label" color={colors.yellow}>
            {state.config.mode === 'teams' ? 'Equipo ganador' : state.config.mode === 'tournament' ? 'Campeón del torneo' : '¡Ganador!'}
          </AppText>
          <View style={{ flexDirection: 'row' }}>
            {champ.members.slice(0, 4).map((m, i) => (
              <View key={m.id} style={{ marginLeft: i ? -30 : 0 }}>
                <Avatar look={m.look} size={s(champ.members.length > 1 ? 110 : 150)} ring={colors.yellow} />
              </View>
            ))}
          </View>
          <AppText variant="display" align="center">
            {champ.name}
          </AppText>
          <AppText variant="h3" color={colors.yellow}>
            {champ.score} puntos
          </AppText>
        </Animated.View>

        <Card>
          {ranked.map((c, i) => (
            <Animated.View key={c.id} entering={FadeIn.delay(100 + i * 50).duration(250)} style={styles.rankRow}>
              <View style={[styles.medal, { backgroundColor: MEDAL_COLORS[i] ?? colors.cardStrong }]}>
                <AppText weight="black" size={15} color={i < 3 ? colors.bgTop : colors.text}>
                  {i + 1}
                </AppText>
              </View>
              <Avatar look={c.members[0].look} size={38} />
              <AppText variant="bodyBold" numberOfLines={1} style={{ flex: 1 }}>
                {c.name}
              </AppText>
              <AppText variant="bodyBold" color={colors.yellow}>
                {c.score}
              </AppText>
            </Animated.View>
          ))}
        </Card>

        {awards.length ? (
          <>
            <AppText variant="label" color={colors.textDim}>
              Premios de la partida
            </AppText>
            <View style={styles.awards}>
              {awards.map((a, i) => {
                const m = memberName(a.memberId);
                return (
                  <Animated.View key={a.id} entering={FadeIn.delay(300 + i * 90).duration(250)} style={[styles.award, { width: s(140) }]}>
                    <Icon name={a.icon} size={26} color={colors.yellow} />
                    <AppText variant="small" weight="black" align="center">
                      {a.title}
                    </AppText>
                    {m ? <Avatar look={m.look} size={34} /> : null}
                    <AppText variant="caption" color={colors.textDim} align="center" numberOfLines={2}>
                      {m?.name} · {a.detail}
                    </AppText>
                  </Animated.View>
                );
              })}
            </View>
          </>
        ) : null}

        {unlocked.length ? (
          <>
            <AppText variant="label" color={colors.textDim}>
              ¡Logros desbloqueados!
            </AppText>
            {unlocked.map(({ playerId, achievement }, i) => {
              const m = memberName(playerId);
              return (
                <Animated.View key={`${playerId}-${achievement!.id}`} entering={FadeIn.delay(300 + i * 60).duration(250)} style={styles.achievement}>
                  <View style={[styles.achIcon, { backgroundColor: TIER_COLORS[achievement!.tier] }]}>
                    <Icon name={achievement!.icon} size={20} color={colors.bgTop} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText variant="bodyBold">{achievement!.name}</AppText>
                    <AppText variant="caption" color={colors.textDim}>
                      {m?.name} · {achievement!.description}
                    </AppText>
                  </View>
                </Animated.View>
              );
            })}
          </>
        ) : null}

        <Button icon="repeat" label="Revancha" subtitle="Mismos jugadores y reglas" tone="gold" onPress={onRematch} />
        <Button icon="home" label="Menú principal" tone="secondary" onPress={onMenu} />
        {onUndo ? <Button icon="undo" label="Fue un error, deshacer" tone="neutral" onPress={onUndo} /> : null}
      </Overlay>
      <Confetti />
    </>
  );
}

const styles = StyleSheet.create({
  pickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  pickCell: { alignItems: 'center', gap: 6, padding: 10, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  medal: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  awards: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  award: { alignItems: 'center', gap: 4, padding: 12, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: 'rgba(255,210,63,0.35)' },
  achievement: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.md, backgroundColor: colors.card },
  achIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
