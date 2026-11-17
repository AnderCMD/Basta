import React, { memo } from 'react';
import Svg, { Circle } from 'react-native-svg';
import { pick } from '../../lib/random';
import { AVATAR_BACKGROUNDS, EXTRAS, findExtra, findGlasses, findHat, GLASSES, HATS, type ExtraId, type GlassesId, type HatId } from './accessories';
import { ANIMAL_IDS, ANIMALS, type AnimalId } from './animals';

/** Apariencia completa de un avatar. Se guarda junto al jugador. */
export type AvatarLook = {
  animal: AnimalId;
  hat: HatId | null;
  glasses: GlassesId | null;
  extra: ExtraId | null;
  /** Color de fondo; null usa el color propio del animal. */
  bg: string | null;
};

export const defaultLook = (animal: AnimalId = 'gato'): AvatarLook => ({ animal, hat: null, glasses: null, extra: null, bg: null });

/** Apariencia aleatoria: cada accesorio aparece con cierta probabilidad. */
export function randomLook(random: () => number = Math.random): AvatarLook {
  return {
    animal: pick(ANIMAL_IDS, random),
    hat: random() < 0.6 ? pick(HATS, random).id : null,
    glasses: random() < 0.45 ? pick(GLASSES, random).id : null,
    extra: random() < 0.45 ? pick(EXTRAS, random).id : null,
    bg: random() < 0.5 ? pick(AVATAR_BACKGROUNDS, random) : null,
  };
}

type Props = {
  look: AvatarLook;
  size?: number;
  /** Color del aro exterior (turno actual, selección…). */
  ring?: string;
  dimmed?: boolean;
};

/** Avatar de animal con accesorios. Memorizado: se dibuja muchas veces por pantalla. */
export const Avatar = memo(function Avatar({ look, size = 64, ring, dimmed }: Props) {
  const animal = ANIMALS[look.animal] ?? ANIMALS.gato;
  const a = animal.anchors;
  const hat = findHat(look.hat);
  const glasses = findGlasses(look.glasses);
  const extra = findExtra(look.extra);
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={dimmed ? 0.35 : 1}>
      <Circle cx={50} cy={50} r={49} fill={look.bg ?? animal.bg} />
      {animal.draw()}
      {extra ? extra.draw(a) : null}
      {glasses ? glasses.draw(a) : null}
      {hat ? hat.draw(a) : null}
      {ring ? <Circle cx={50} cy={50} r={47} fill="none" stroke={ring} strokeWidth={4} /> : null}
    </Svg>
  );
});
