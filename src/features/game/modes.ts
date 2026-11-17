import type { IconName } from '../../components/Icon';
import type { GradientName } from '../../lib/theme';
import type { GameMode, Modifiers } from './engine';

/** Descripción de cada modo para menús y reglas. */
export type ModeInfo = {
  id: GameMode;
  name: string;
  tagline: string;
  rules: string;
  icon: IconName;
  tone: GradientName;
  minPlayers: number;
};

export const MODES: ModeInfo[] = [
  {
    id: 'classic',
    name: 'Clásico',
    tagline: 'Si fallas, quedas fuera. Gana el último.',
    rules: 'Una sola ronda con las mismas letras. Quien se tarda o se equivoca queda eliminado y los demás siguen.',
    icon: 'bolt',
    tone: 'primary',
    minPlayers: 2,
  },
  {
    id: 'tournament',
    name: 'Torneo',
    tagline: 'Vidas y rondas hasta coronar al campeón.',
    rules: 'Cada quien tiene vidas. Al fallar pierdes una y empieza una ronda nueva con otra categoría. Sin vidas quedas fuera.',
    icon: 'trophy',
    tone: 'gold',
    minPlayers: 2,
  },
  {
    id: 'points',
    name: 'Puntos',
    tagline: 'Nadie sale: gana quien sume más.',
    rules: 'Cada letra da puntos (más por letras difíciles, rapidez y rachas). Fallar resta puntos y termina la ronda. Gana el mejor marcador al final de las rondas.',
    icon: 'ranking',
    tone: 'secondary',
    minPlayers: 1,
  },
  {
    id: 'teams',
    name: 'Equipos',
    tagline: 'Equipo contra equipo, por turnos.',
    rules: 'Arma de 2 a 4 equipos. Los integrantes se turnan y el equipo comparte vidas. El último equipo en pie gana.',
    icon: 'peopleGroup',
    tone: 'success',
    minPlayers: 4,
  },
];

export const modeInfo = (id: GameMode) => MODES.find((m) => m.id === id) ?? MODES[0];

export type ModifierInfo = { id: keyof Modifiers; name: string; description: string; icon: IconName };

export const MODIFIERS: ModifierInfo[] = [
  { id: 'turbo', name: 'Turbo', description: 'El reloj se acelera con cada letra (hasta 3 s).', icon: 'fire' },
  { id: 'chaos', name: 'Caos', description: 'La categoría cambia en cada turno.', icon: 'shuffle' },
  { id: 'golden', name: 'Letras doradas', description: 'Algunas letras brillan y valen el doble.', icon: 'gem' },
];

/** Probabilidad de que una ficha nueva salga dorada. */
export const GOLDEN_CHANCE = 0.12;
