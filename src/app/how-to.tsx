import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, type IconName } from '../components/Icon';
import { Card, Screen, SectionTitle } from '../components/ui';
import { colors, fonts } from '../lib/theme';

const STEPS: [IconName, string, string][] = [
  ['mobile', 'Pon el teléfono en el centro', 'Todos alrededor de la mesa. La pantalla muestra el turno arriba (volteado) y abajo para que todos lo vean.'],
  ['layers', 'Mira la categoría', 'Ej. “Frutas”. Tu palabra debe ser de esa categoría.'],
  ['font', 'Elige una letra', 'Hay 6 letras a la vez. Di en voz alta una palabra que empiece con una de ellas y tócala.'],
  ['refresh', 'La letra cambia', 'La letra que usaste se va y aparece otra del abecedario. El turno pasa al siguiente con el reloj reiniciado.'],
  ['stopwatch', 'Que no se te acabe el tiempo', 'Si el reloj llega a cero, pierdes. En los últimos 3 segundos el teléfono vibra.'],
  ['gavel', 'Pausa y jueces', '¿Alguien dijo una palabra que no vale o repetida? Pausa → “Alguien se equivocó” y elige quién. También puedes deshacer la última letra.'],
];

const ICON_BG = [colors.pink, colors.orange, colors.yellow, colors.green, colors.blue, colors.purple];

export default function HowTo() {
  return (
    <Screen title="Cómo jugar">
      {STEPS.map(([icon, title, text], i) => (
        <Card key={title} style={styles.step}>
          <View style={[styles.iconWrap, { backgroundColor: ICON_BG[i % ICON_BG.length] }]}>
            <Icon name={icon} size={22} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {i + 1}. {title}
            </Text>
            <Text style={styles.text}>{text}</Text>
          </View>
        </Card>
      ))}

      <SectionTitle>Modos</SectionTitle>
      <Card>
        <Text style={styles.title}>
          <Icon name="bolt" size={16} color={colors.pink} /> Partida rápida
        </Text>
        <Text style={styles.text}>Una sola ronda. Quien falla queda fuera y los demás siguen con las mismas letras. Gana el último.</Text>
        <Text style={[styles.title, { marginTop: 8 }]}>
          <Icon name="trophy" size={16} color={colors.yellow} /> Torneo
        </Text>
        <Text style={styles.text}>
          Cada jugador tiene vidas (1 a 5). Al fallar pierdes una y empieza una ronda nueva con otra categoría y letras frescas. Sin vidas quedas
          eliminado. El último en pie es el campeón y suma una victoria a su récord.
        </Text>
      </Card>

      <SectionTitle>Abecedario</SectionTitle>
      <Card>
        <Text style={styles.text}>
          Se usa el abecedario de México: 27 letras con la Ñ. En la configuración puedes agregar CH y LL o quitar las letras difíciles (K, Ñ, Q, W, X,
          Y). Cuando se acaban todas las letras, se vuelve a repartir el abecedario completo.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  iconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 17, fontFamily: fonts.black },
  text: { color: colors.textDim, fontSize: 15, lineHeight: 21, marginTop: 4 },
});
