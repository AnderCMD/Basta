import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/** Efectos disponibles (generados con scripts/generate-sounds.mjs). */
const SOURCES = {
  tap: require('../../assets/sounds/tap.wav'),
  tick: require('../../assets/sounds/tick.wav'),
  start: require('../../assets/sounds/start.wav'),
  fail: require('../../assets/sounds/fail.wav'),
  win: require('../../assets/sounds/win.wav'),
  golden: require('../../assets/sounds/golden.wav'),
  wildcard: require('../../assets/sounds/wildcard.wav'),
  achievement: require('../../assets/sounds/achievement.wav'),
} as const;

export type SoundName = keyof typeof SOURCES;

let enabled = true;
let ready = false;
const players = new Map<SoundName, AudioPlayer>();

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

/** Crea los reproductores una sola vez. Seguro de llamar varias veces. */
export async function initSounds() {
  if (ready) return;
  ready = true;
  try {
    // Suena aunque el iPhone esté en modo silencio: es un juego de mesa.
    await setAudioModeAsync({ playsInSilentMode: true });
  } catch {
    // En web u otras plataformas puede no estar disponible.
  }
  for (const name of Object.keys(SOURCES) as SoundName[]) {
    try {
      players.set(name, createAudioPlayer(SOURCES[name]));
    } catch {
      // Si un sonido falla, el juego sigue sin él.
    }
  }
}

export function playSound(name: SoundName) {
  if (!enabled) return;
  const player = players.get(name);
  if (!player) return;
  try {
    player.seekTo(0);
    player.play();
  } catch {
    // Ignorado a propósito: el sonido nunca debe romper una partida.
  }
}
