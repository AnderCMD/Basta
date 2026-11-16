import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { colors, tileGradients, fonts } from '../lib/theme';

type Props = {
  letter: string | null;
  size: number;
  colorIndex: number;
  disabled?: boolean;
  dim?: boolean;
  onPress?: () => void;
};

/** Ficha de letra: entra con un "pop" cada vez que cambia la letra. */
export function LetterTile({ letter, size, colorIndex, disabled, dim, onPress }: Props) {
  const pop = useState(() => new Animated.Value(0))[0];
  const press = useState(() => new Animated.Value(1))[0];

  useEffect(() => {
    pop.setValue(0);
    Animated.spring(pop, { toValue: 1, useNativeDriver: true, friction: 5, tension: 120 }).start();
  }, [letter, pop]);

  const rotate = pop.interpolate({ inputRange: [0, 1], outputRange: ['-90deg', '0deg'] });
  const grad = tileGradients[colorIndex % tileGradients.length];

  if (!letter) {
    return <Animated.View style={[styles.empty, { width: size, height: size, borderRadius: size * 0.28 }]} />;
  }

  return (
    <Animated.View style={{ transform: [{ scale: Animated.multiply(pop, press) }, { rotate }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Letra ${letter}`}
        disabled={disabled}
        onPressIn={() => Animated.spring(press, { toValue: 0.88, useNativeDriver: true, speed: 50 }).start()}
        onPressOut={() => Animated.spring(press, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 12 }).start()}
        onPress={onPress}
      >
        <LinearGradient
          colors={grad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.tile, { width: size, height: size, borderRadius: size * 0.28, opacity: dim ? 0.55 : 1 }]}
        >
          <Animated.View style={[styles.shine, { width: size * 0.5, height: size * 0.18, borderRadius: size * 0.09 }]} />
          <Text style={[styles.letter, { fontSize: size * (letter.length > 1 ? 0.42 : 0.56) }]} allowFontScaling={false}>
            {letter}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.55)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  shine: { position: 'absolute', top: '10%', left: '14%', backgroundColor: 'rgba(255,255,255,0.35)' },
  letter: {
    color: '#fff',
    fontFamily: fonts.black,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
  empty: { borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border },
});
