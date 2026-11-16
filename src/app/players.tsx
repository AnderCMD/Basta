import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ANIMALS, ANIMAL_IDS, AnimalAvatar, type AnimalId } from '../components/AnimalAvatar';
import { Card, GradientButton, IconButton, Screen, SectionTitle } from '../components/ui';
import { confirmAction } from '../lib/confirm';
import { haptic } from '../lib/haptics';
import { colors, gradients, radius, fonts } from '../lib/theme';
import { useAppStore, type Player } from '../store/AppStore';

const MAX_NAME = 14;

export default function PlayersScreen() {
  const { players, savePlayer, removePlayer } = useAppStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState('');
  const firstFree = ANIMAL_IDS.find((a) => !players.some((p) => p.animal === a)) ?? 'gato';
  const [animal, setAnimal] = useState<AnimalId>(firstFree);

  const reset = (list: Player[] = players) => {
    setEditing(null);
    setName('');
    setAnimal(ANIMAL_IDS.find((a) => !list.some((p) => p.animal === a)) ?? 'gato');
  };

  const submit = () => {
    const clean = name.trim();
    if (!clean) return;
    savePlayer({ id: editing ?? undefined, name: clean, animal });
    haptic.win();
    reset([...players, { id: 'tmp', name: clean, animal, wins: 0 }]);
  };

  const startEdit = (p: Player) => {
    setEditing(p.id);
    setName(p.name);
    setAnimal(p.animal);
  };

  return (
    <Screen title="Jugadores">
      <Card>
        <View style={styles.preview}>
          <AnimalAvatar animal={animal} size={88} ring={colors.yellow} />
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={styles.label}>{editing ? 'Editar jugador' : 'Nuevo jugador'}</Text>
            <TextInput
              value={name}
              onChangeText={(t) => setName(t.slice(0, MAX_NAME))}
              placeholder="Nombre"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={submit}
              autoCapitalize="words"
              maxLength={MAX_NAME}
            />
          </View>
        </View>

        <Text style={styles.label}>Elige su animal · {ANIMALS[animal].name}</Text>
        <View style={styles.grid}>
          {ANIMAL_IDS.map((a) => {
            const taken = players.some((p) => p.animal === a && p.id !== editing);
            const selected = a === animal;
            return (
              <Pressable
                key={a}
                accessibilityLabel={ANIMALS[a].name}
                onPress={() => {
                  haptic.light();
                  setAnimal(a);
                }}
                style={[styles.animalCell, selected && styles.animalSelected]}
              >
                <AnimalAvatar animal={a} size={52} dimmed={taken && !selected} />
              </Pressable>
            );
          })}
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {editing ? (
            <GradientButton label="Cancelar" colors={gradients.neutral} onPress={() => reset()} style={{ flex: 1 }} />
          ) : null}
          <GradientButton
            label={editing ? 'Guardar' : 'Agregar'}
            icon={editing ? 'check' : 'plus'}
            colors={gradients.success}
            disabled={!name.trim()}
            onPress={submit}
            style={{ flex: 1 }}
          />
        </View>
      </Card>

      <SectionTitle>Registrados ({players.length})</SectionTitle>
      {players.length === 0 ? (
        <Text style={styles.empty}>Todavía no hay jugadores. ¡Agrega al menos 2 para jugar!</Text>
      ) : null}
      {players.map((p) => (
        <Pressable key={p.id} onPress={() => startEdit(p)} style={[styles.playerRow, editing === p.id && { borderColor: colors.yellow }]}>
          <AnimalAvatar animal={p.animal} size={52} />
          <View style={{ flex: 1 }}>
            <Text style={styles.playerName}>{p.name}</Text>
            <Text style={styles.playerSub}>
              {ANIMALS[p.animal]?.name} · {p.wins} {p.wins === 1 ? 'victoria' : 'victorias'}
            </Text>
          </View>
          <IconButton
            icon="trash"
            size={42}
            color="rgba(255,71,87,0.25)"
            label={`Eliminar a ${p.name}`}
            onPress={() =>
              confirmAction('Eliminar jugador', `¿Quitar a ${p.name} de la lista?`, () => {
                removePlayer(p.id);
                if (editing === p.id) reset();
              })
            }
          />
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  preview: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  label: { color: colors.textDim, fontFamily: fonts.extraBold, fontSize: 14 },
  input: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 20,
    fontFamily: fonts.extraBold,
    borderWidth: 1,
    borderColor: colors.border,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  animalCell: { padding: 4, borderRadius: 40, borderWidth: 3, borderColor: 'transparent' },
  animalSelected: { borderColor: colors.yellow, backgroundColor: 'rgba(255,210,63,0.15)' },
  empty: { color: colors.textFaint, textAlign: 'center', marginVertical: 12, fontSize: 15 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  playerName: { color: colors.text, fontSize: 18, fontFamily: fonts.black },
  playerSub: { color: colors.textDim, fontSize: 13, marginTop: 2 },
});
