import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import type { IconName } from '../components/Icon';
import { SOUND_FILES } from './soundPacks';

/**
 * Efectos de sonido con varios ESTILOS seleccionables en Ajustes.
 * Los archivos se generan con `npm run sounds` (scripts/generate-sounds.mjs).
 */
export type SoundPackId = keyof typeof SOUND_FILES;
export type SoundName = keyof (typeof SOUND_FILES)['clasico'];
export type SoundVolume = 'bajo' | 'medio' | 'alto';

export const SOUND_PACKS: { id: SoundPackId; name: string; description: string; icon: IconName }[] = [
  { id: 'clasico', name: 'Clásico', description: 'Arcade alegre, el de siempre.', icon: 'gamepad' },
  { id: 'suave', name: 'Suave', description: 'Tonos redondos y tranquilos.', icon: 'moon' },
  { id: 'burbujas', name: 'Burbujas', description: 'Pops ligeros y juguetones.', icon: 'smile' },
  { id: 'madera', name: 'Madera', description: 'Golpecitos de marimba.', icon: 'tree' },
  { id: 'campanitas', name: 'Campanitas', description: 'Campanas cristalinas.', icon: 'magic' },
  { id: 'minimo', name: 'Mínimo', description: 'Clics casi imperceptibles.', icon: 'eye' },
];

export const SOUND_VOLUMES: Record<SoundVolume, number> = { bajo: 0.35, medio: 0.65, alto: 1 };

let enabled = true;
let volume = SOUND_VOLUMES.medio;
let pack: SoundPackId = 'clasico';
let audioReady = false;
const players = new Map<SoundName, AudioPlayer>();

function releasePlayers() {
  for (const p of players.values()) {
    try {
      p.remove();
    } catch {
      // Ya liberado.
    }
  }
  players.clear();
}

function loadPack() {
  releasePlayers();
  const files = SOUND_FILES[pack];
  for (const name of Object.keys(files) as SoundName[]) {
    try {
      const player = createAudioPlayer(files[name]);
      player.volume = volume;
      players.set(name, player);
    } catch {
      // Si un sonido falla, el juego sigue sin él.
    }
  }
}

/** Prepara el audio y carga el estilo actual. Seguro de llamar varias veces. */
export async function initSounds() {
  if (!audioReady) {
    audioReady = true;
    try {
      // Suena aunque el iPhone esté en modo silencio: es un juego de mesa.
      await setAudioModeAsync({ playsInSilentMode: true });
    } catch {
      // En web u otras plataformas puede no estar disponible.
    }
  }
  if (players.size === 0) loadPack();
}

export function setSoundEnabled(value: boolean) {
  enabled = value;
}

export function setSoundPack(id: SoundPackId) {
  if (!(id in SOUND_FILES) || id === pack) return;
  pack = id;
  if (audioReady) loadPack();
}

export function setSoundVolume(level: SoundVolume) {
  volume = SOUND_VOLUMES[level] ?? SOUND_VOLUMES.medio;
  for (const p of players.values()) p.volume = volume;
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
