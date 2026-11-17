import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Icon, type IconName } from '../components/Icon';
import { AppText, Card, Screen, SectionTitle } from '../components/ui';
import { MODES, MODIFIERS } from '../features/game/modes';
import { colors } from '../lib/theme';

const STEPS: [IconName, string, string][] = [
  ['mobile', 'Teléfono al centro', 'Todos alrededor de la mesa. El turno se ve abajo y arriba (volteado) para que todos lo lean.'],
  ['tags', 'Mira la categoría', 'Ej. “Frutas”. Tu palabra debe ser de esa categoría.'],
  ['font', 'Elige una letra', 'Hay 6 letras a la vez. Di en voz alta una palabra que empiece con una de ellas y tócala.'],
  ['refresh', 'La letra cambia', 'La letra usada se va y entra otra del abecedario. El turno pasa con el reloj reiniciado.'],
  ['stopwatch', 'Que no se te acabe el tiempo', 'Si el reloj llega a cero, fallas. En los últimos 3 segundos suena y vibra.'],
  ['gavel', 'Todos son jueces', '¿Palabra repetida o que no vale? Pausa → “Alguien se equivocó”. También puedes deshacer o sacar a alguien.'],
];

const SCORING: [IconName, string][] = [
  ['font', 'Cada letra: 10 puntos (20 las de dificultad media y 30 las difíciles: K, Ñ, Q, W, X, Y).'],
  ['bolt', 'Rapidez: hasta +10 si respondes en cuanto empieza tu turno.'],
  ['fire', 'Racha: +2 por cada acierto seguido (hasta +20).'],
  ['gem', 'Letra dorada: todo se multiplica ×2.'],
  ['medal', 'Al final hay premios: MVP, Rayo, En racha, Valiente y más. Y logros permanentes en el Salón de la fama.'],
];

const ICON_BG = [colors.pink, colors.orange, colors.yellow, colors.green, colors.blue, colors.purple];

export default function HowTo() {
  return (
    <Screen title="Cómo jugar">
      {STEPS.map(([icon, title, text], i) => (
        <Animated.View key={title} entering={FadeInDown.delay(i * 60)}>
          <Card style={styles.step}>
            <View style={[styles.iconWrap, { backgroundColor: ICON_BG[i % ICON_BG.length] }]}>
              <Icon name={icon} size={22} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="h3">
                {i + 1}. {title}
              </AppText>
              <AppText variant="small" color={colors.textDim}>
                {text}
              </AppText>
            </View>
          </Card>
        </Animated.View>
      ))}

      <SectionTitle icon="gamepad">Modos de juego</SectionTitle>
      <Card>
        {MODES.map((m) => (
          <View key={m.id} style={styles.item}>
            <Icon name={m.icon} size={22} color={colors.yellow} />
            <View style={{ flex: 1 }}>
              <AppText variant="bodyBold">{m.name}</AppText>
              <AppText variant="small" color={colors.textDim}>
                {m.rules}
              </AppText>
            </View>
          </View>
        ))}
      </Card>

      <SectionTitle icon="magic">Modificadores y comodines</SectionTitle>
      <Card>
        {MODIFIERS.map((m) => (
          <View key={m.id} style={styles.item}>
            <Icon name={m.icon} size={22} color={colors.yellow} />
            <View style={{ flex: 1 }}>
              <AppText variant="bodyBold">{m.name}</AppText>
              <AppText variant="small" color={colors.textDim}>
                {m.description}
              </AppText>
            </View>
          </View>
        ))}
        <View style={styles.item}>
          <Icon name="forward" size={22} color={colors.blue} />
          <View style={{ flex: 1 }}>
            <AppText variant="bodyBold">Comodines</AppText>
            <AppText variant="small" color={colors.textDim}>
              Cada quien tiene comodines para pasar su turno o ganar 5 segundos extra. Se usan desde el banner del turno.
            </AppText>
          </View>
        </View>
      </Card>

      <SectionTitle icon="star">Puntos</SectionTitle>
      <Card>
        {SCORING.map(([icon, text]) => (
          <View key={text} style={styles.item}>
            <Icon name={icon} size={20} color={colors.yellow} />
            <AppText variant="small" style={{ flex: 1 }}>
              {text}
            </AppText>
          </View>
        ))}
      </Card>

      <SectionTitle icon="font">Abecedario</SectionTitle>
      <Card>
        <AppText variant="small" color={colors.textDim}>
          Se usa el abecedario de México: 27 letras con la Ñ. Puedes agregar CH y LL o quitar las letras difíciles. Cuando se acaban todas las letras se reparte de nuevo el abecedario.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  iconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
});
