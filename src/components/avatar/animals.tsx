import React from 'react';
import { Circle, Ellipse, G, Path, Polygon, Rect } from 'react-native-svg';

/**
 * Animales dibujados a mano en SVG (viewBox 100×100), originales de este proyecto.
 * Cada uno define `anchors`: puntos donde se colocan los accesorios.
 */
export type AnimalId =
  | 'gato'
  | 'perro'
  | 'zorro'
  | 'panda'
  | 'leon'
  | 'rana'
  | 'buho'
  | 'cerdo'
  | 'oso'
  | 'conejo'
  | 'koala'
  | 'tigre'
  | 'mono'
  | 'pinguino'
  | 'pollito'
  | 'ajolote';

const INK = '#2B1B3F';

/** Ojos redondos con brillo, compartidos por casi todos los animales. */
function Eyes({ y = 52, dx = 11, r = 4.5, color = INK }: { y?: number; dx?: number; r?: number; color?: string }) {
  return (
    <G>
      <Circle cx={50 - dx} cy={y} r={r} fill={color} />
      <Circle cx={50 + dx} cy={y} r={r} fill={color} />
      <Circle cx={50 - dx + r * 0.35} cy={y - r * 0.4} r={r * 0.35} fill="#fff" />
      <Circle cx={50 + dx + r * 0.35} cy={y - r * 0.4} r={r * 0.35} fill="#fff" />
    </G>
  );
}

function Cheeks({ y = 62, dx = 20, color = '#FF8FAB', r = 5 }: { y?: number; dx?: number; color?: string; r?: number }) {
  return (
    <G opacity={0.7}>
      <Ellipse cx={50 - dx} cy={y} rx={r} ry={r * 0.7} fill={color} />
      <Ellipse cx={50 + dx} cy={y} rx={r} ry={r * 0.7} fill={color} />
    </G>
  );
}

function Smile({ y = 66, w = 5, color = INK }: { y?: number; w?: number; color?: string }) {
  return (
    <Path
      d={`M${50 - w} ${y} Q${50 - w / 2} ${y + 4} 50 ${y} Q${50 + w / 2} ${y + 4} ${50 + w} ${y}`}
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      fill="none"
    />
  );
}

export type Anchors = {
  /** Altura de los ojos y separación desde el centro. */
  eyeY: number;
  eyeDX: number;
  /** Parte superior de la cabeza (donde se apoyan los sombreros). */
  top: number;
  mouthY: number;
  /** Barbilla (donde van moños y bufandas). */
  chinY: number;
};

export type AnimalDef = { name: string; bg: string; anchors: Anchors; draw: () => React.ReactElement };

export const ANIMALS: Record<AnimalId, AnimalDef> = {
  gato: {
    anchors: { eyeY: 53, eyeDX: 11, top: 25, mouthY: 67, chinY: 87 },
    name: 'Gato',
    bg: '#FFE0C2',
    draw: () => (
      <G>
        <Polygon points="20,44 26,12 46,30" fill="#F4A259" />
        <Polygon points="80,44 74,12 54,30" fill="#F4A259" />
        <Polygon points="25,38 28,20 39,30" fill="#FFB5A7" />
        <Polygon points="75,38 72,20 61,30" fill="#FFB5A7" />
        <Circle cx={50} cy={56} r={31} fill="#F4A259" />
        <Path d="M42 27 L44 37 M50 25 L50 36 M58 27 L56 37" stroke="#D97B2B" strokeWidth={3} strokeLinecap="round" />
        <Ellipse cx={50} cy={66} rx={14} ry={10} fill="#FFE8D1" />
        <Eyes y={53} />
        <Polygon points="46,61 54,61 50,66" fill="#FF6F91" />
        <Smile y={67} w={5} />
        <Path d="M20 62 L33 64 M20 70 L33 68 M80 62 L67 64 M80 70 L67 68" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      </G>
    ),
  },
  perro: {
    anchors: { eyeY: 48, eyeDX: 11, top: 24, mouthY: 67, chinY: 84 },
    name: 'Perro',
    bg: '#D6F0FF',
    draw: () => (
      <G>
        <Circle cx={50} cy={54} r={30} fill="#C98B5A" />
        <Ellipse cx={23} cy={50} rx={10} ry={22} fill="#7A4B2A" transform="rotate(18 23 50)" />
        <Ellipse cx={77} cy={50} rx={10} ry={22} fill="#7A4B2A" transform="rotate(-18 77 50)" />
        <Ellipse cx={61} cy={47} rx={9} ry={8} fill="#A86A3D" />
        <Ellipse cx={50} cy={67} rx={15} ry={11} fill="#F1D3B3" />
        <Eyes y={48} />
        <Ellipse cx={50} cy={61} rx={6.5} ry={4.5} fill={INK} />
        <Smile y={67} w={5} />
        <Path d="M47 70 Q50 79 53 70 Z" fill="#FF6F91" />
      </G>
    ),
  },
  zorro: {
    anchors: { eyeY: 50, eyeDX: 13, top: 30, mouthY: 73, chinY: 86 },
    name: 'Zorro',
    bg: '#FFF1C9',
    draw: () => (
      <G>
        <Polygon points="18,42 24,10 46,30" fill="#F28C28" />
        <Polygon points="82,42 76,10 54,30" fill="#F28C28" />
        <Polygon points="23,36 25,18 37,29" fill={INK} />
        <Polygon points="77,36 75,18 63,29" fill={INK} />
        <Path d="M16 44 Q22 30 50 30 Q78 30 84 44 Q78 78 50 86 Q22 78 16 44 Z" fill="#F28C28" />
        <Path d="M16 44 Q30 52 50 64 Q70 52 84 44 Q78 78 50 86 Q22 78 16 44 Z" fill="#FFF8EE" />
        <Eyes y={50} dx={13} />
        <Ellipse cx={50} cy={68} rx={5} ry={3.6} fill={INK} />
        <Smile y={73} w={4} />
      </G>
    ),
  },
  panda: {
    anchors: { eyeY: 51, eyeDX: 12, top: 23, mouthY: 69, chinY: 87 },
    name: 'Panda',
    bg: '#D9F7E8',
    draw: () => (
      <G>
        <Circle cx={24} cy={28} r={11} fill={INK} />
        <Circle cx={76} cy={28} r={11} fill={INK} />
        <Circle cx={50} cy={55} r={32} fill="#FFFFFF" />
        <Ellipse cx={37} cy={52} rx={8} ry={10} fill={INK} transform="rotate(30 37 52)" />
        <Ellipse cx={63} cy={52} rx={8} ry={10} fill={INK} transform="rotate(-30 63 52)" />
        <Circle cx={38} cy={51} r={3.4} fill="#fff" />
        <Circle cx={62} cy={51} r={3.4} fill="#fff" />
        <Circle cx={38.5} cy={51.5} r={1.8} fill={INK} />
        <Circle cx={62.5} cy={51.5} r={1.8} fill={INK} />
        <Ellipse cx={50} cy={64} rx={5.5} ry={4} fill={INK} />
        <Smile y={69} w={5} />
        <Cheeks y={66} dx={22} />
      </G>
    ),
  },
  leon: {
    anchors: { eyeY: 50, eyeDX: 10, top: 20, mouthY: 66, chinY: 84 },
    name: 'León',
    bg: '#FFE7A3',
    draw: () => (
      <G>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <Circle key={i} cx={50 + Math.cos(a) * 30} cy={54 + Math.sin(a) * 30} r={12} fill={i % 2 ? '#D9631E' : '#E8822A'} />;
        })}
        <Circle cx={50} cy={54} r={30} fill="#E8822A" />
        <Circle cx={30} cy={34} r={7} fill="#F6C453" />
        <Circle cx={70} cy={34} r={7} fill="#F6C453" />
        <Circle cx={50} cy={55} r={25} fill="#F6C453" />
        <Eyes y={50} dx={10} />
        <Ellipse cx={50} cy={64} rx={11} ry={8} fill="#FFE8B0" />
        <Polygon points="45,59 55,59 50,64" fill="#7A3E10" />
        <Smile y={66} w={5} />
      </G>
    ),
  },
  rana: {
    anchors: { eyeY: 35, eyeDX: 19, top: 22, mouthY: 70, chinY: 88 },
    name: 'Rana',
    bg: '#E2F9C9',
    draw: () => (
      <G>
        <Circle cx={31} cy={36} r={14} fill="#4CC34C" />
        <Circle cx={69} cy={36} r={14} fill="#4CC34C" />
        <Ellipse cx={50} cy={62} rx={37} ry={26} fill="#4CC34C" />
        <Circle cx={31} cy={35} r={9} fill="#fff" />
        <Circle cx={69} cy={35} r={9} fill="#fff" />
        <Circle cx={32} cy={36} r={5} fill={INK} />
        <Circle cx={68} cy={36} r={5} fill={INK} />
        <Circle cx={33.5} cy={34} r={1.6} fill="#fff" />
        <Circle cx={69.5} cy={34} r={1.6} fill="#fff" />
        <Path d="M28 64 Q50 82 72 64" stroke={INK} strokeWidth={3} strokeLinecap="round" fill="none" />
        <Circle cx={45} cy={56} r={1.6} fill="#2E7D32" />
        <Circle cx={55} cy={56} r={1.6} fill="#2E7D32" />
        <Cheeks y={66} dx={28} />
      </G>
    ),
  },
  buho: {
    anchors: { eyeY: 46, eyeDX: 14, top: 22, mouthY: 60, chinY: 88 },
    name: 'Búho',
    bg: '#E8DDFF',
    draw: () => (
      <G>
        <Polygon points="20,30 26,12 40,26" fill="#7B5236" />
        <Polygon points="80,30 74,12 60,26" fill="#7B5236" />
        <Ellipse cx={50} cy={56} rx={33} ry={32} fill="#9C6B47" />
        <Ellipse cx={50} cy={70} rx={20} ry={16} fill="#E8C9A0" />
        <Path d="M42 66 Q45 70 48 66 M52 72 Q55 76 58 72 M42 76 Q45 80 48 76" stroke="#C49A6C" strokeWidth={2} fill="none" strokeLinecap="round" />
        <Circle cx={36} cy={46} r={13} fill="#FFFFFF" />
        <Circle cx={64} cy={46} r={13} fill="#FFFFFF" />
        <Circle cx={36} cy={46} r={13} fill="none" stroke="#FFB238" strokeWidth={3} />
        <Circle cx={64} cy={46} r={13} fill="none" stroke="#FFB238" strokeWidth={3} />
        <Circle cx={37} cy={47} r={6} fill={INK} />
        <Circle cx={63} cy={47} r={6} fill={INK} />
        <Circle cx={39} cy={44.5} r={2} fill="#fff" />
        <Circle cx={65} cy={44.5} r={2} fill="#fff" />
        <Polygon points="45,56 55,56 50,65" fill="#FF9F1C" />
      </G>
    ),
  },
  cerdo: {
    anchors: { eyeY: 48, eyeDX: 12, top: 25, mouthY: 76, chinY: 87 },
    name: 'Cerdo',
    bg: '#FFE3EC',
    draw: () => (
      <G>
        <Polygon points="20,40 22,14 42,28" fill="#F48FA6" />
        <Polygon points="80,40 78,14 58,28" fill="#F48FA6" />
        <Circle cx={50} cy={56} r={31} fill="#F7A8B8" />
        <Eyes y={48} dx={12} />
        <Ellipse cx={50} cy={63} rx={14} ry={10} fill="#F48FA6" />
        <Ellipse cx={45} cy={63} rx={2.8} ry={4} fill="#B5476A" />
        <Ellipse cx={55} cy={63} rx={2.8} ry={4} fill="#B5476A" />
        <Smile y={76} w={5} />
        <Cheeks y={60} dx={23} color="#FF6F91" />
      </G>
    ),
  },
  oso: {
    anchors: { eyeY: 49, eyeDX: 12, top: 22, mouthY: 68, chinY: 86 },
    name: 'Oso',
    bg: '#FFE8D6',
    draw: () => (
      <G>
        <Circle cx={24} cy={30} r={12} fill="#8B5A3C" />
        <Circle cx={76} cy={30} r={12} fill="#8B5A3C" />
        <Circle cx={24} cy={30} r={6} fill="#C98B5A" />
        <Circle cx={76} cy={30} r={6} fill="#C98B5A" />
        <Circle cx={50} cy={55} r={31} fill="#8B5A3C" />
        <Ellipse cx={50} cy={65} rx={15} ry={12} fill="#D9A877" />
        <Eyes y={49} dx={12} />
        <Ellipse cx={50} cy={60} rx={6.5} ry={4.5} fill={INK} />
        <Path d="M50 64 L50 68" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <Smile y={68} w={5} />
      </G>
    ),
  },
  conejo: {
    anchors: { eyeY: 56, eyeDX: 11, top: 30, mouthY: 72, chinY: 88 },
    name: 'Conejo',
    bg: '#DFF3FF',
    draw: () => (
      <G>
        <Ellipse cx={37} cy={24} rx={8} ry={22} fill="#F3EEF7" transform="rotate(-10 37 24)" />
        <Ellipse cx={63} cy={24} rx={8} ry={22} fill="#F3EEF7" transform="rotate(10 63 24)" />
        <Ellipse cx={37} cy={25} rx={4} ry={15} fill="#FFB5C8" transform="rotate(-10 37 25)" />
        <Ellipse cx={63} cy={25} rx={4} ry={15} fill="#FFB5C8" transform="rotate(10 63 25)" />
        <Circle cx={50} cy={60} r={28} fill="#F3EEF7" />
        <Eyes y={56} dx={11} />
        <Ellipse cx={50} cy={64} rx={4} ry={3} fill="#FF6F91" />
        <Path d="M50 67 L50 70 M45 70 Q50 74 55 70" stroke={INK} strokeWidth={2} strokeLinecap="round" fill="none" />
        <Rect x={47} y={71} width={6} height={5} rx={1.5} fill="#fff" stroke="#D8CFE3" strokeWidth={1} />
        <Cheeks y={66} dx={19} />
      </G>
    ),
  },
  koala: {
    anchors: { eyeY: 50, eyeDX: 12, top: 27, mouthY: 76, chinY: 85 },
    name: 'Koala',
    bg: '#E3F6F1',
    draw: () => (
      <G>
        <Circle cx={20} cy={40} r={17} fill="#9AA5B1" />
        <Circle cx={80} cy={40} r={17} fill="#9AA5B1" />
        <Circle cx={20} cy={40} r={10} fill="#F2D7E0" />
        <Circle cx={80} cy={40} r={10} fill="#F2D7E0" />
        <Circle cx={50} cy={56} r={29} fill="#B8C2CC" />
        <Eyes y={50} dx={12} r={4} />
        <Ellipse cx={50} cy={62} rx={8} ry={11} fill="#4A4453" />
        <Ellipse cx={47.5} cy={57} rx={2} ry={3} fill="#7A7385" />
        <Smile y={76} w={4} />
      </G>
    ),
  },
  tigre: {
    anchors: { eyeY: 50, eyeDX: 12, top: 22, mouthY: 68, chinY: 86 },
    name: 'Tigre',
    bg: '#FFF0D1',
    draw: () => (
      <G>
        <Circle cx={26} cy={30} r={10} fill="#FF8C1A" />
        <Circle cx={74} cy={30} r={10} fill="#FF8C1A" />
        <Circle cx={26} cy={30} r={5} fill="#FFE8D1" />
        <Circle cx={74} cy={30} r={5} fill="#FFE8D1" />
        <Circle cx={50} cy={55} r={31} fill="#FF8C1A" />
        <Path d="M50 24 L46 34 L54 34 Z M22 50 L32 52 L22 56 Z M78 50 L68 52 L78 56 Z M40 26 L42 36 M60 26 L58 36" fill={INK} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
        <Ellipse cx={50} cy={67} rx={18} ry={13} fill="#FFF8EE" />
        <Eyes y={50} dx={12} />
        <Polygon points="45,61 55,61 50,66" fill="#FF6F91" />
        <Smile y={68} w={5} />
      </G>
    ),
  },
  mono: {
    anchors: { eyeY: 48, eyeDX: 10, top: 21, mouthY: 69, chinY: 83 },
    name: 'Mono',
    bg: '#FFE2CF',
    draw: () => (
      <G>
        <Circle cx={18} cy={54} r={11} fill="#8B5A3C" />
        <Circle cx={82} cy={54} r={11} fill="#8B5A3C" />
        <Circle cx={18} cy={54} r={6} fill="#F1C9A0" />
        <Circle cx={82} cy={54} r={6} fill="#F1C9A0" />
        <Circle cx={50} cy={52} r={31} fill="#8B5A3C" />
        <Circle cx={39} cy={48} r={11} fill="#F1C9A0" />
        <Circle cx={61} cy={48} r={11} fill="#F1C9A0" />
        <Ellipse cx={50} cy={64} rx={20} ry={14} fill="#F1C9A0" />
        <Eyes y={48} dx={10} r={4} />
        <Circle cx={47} cy={60} r={1.6} fill={INK} />
        <Circle cx={53} cy={60} r={1.6} fill={INK} />
        <Path d="M40 67 Q50 76 60 67" stroke={INK} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      </G>
    ),
  },
  pinguino: {
    anchors: { eyeY: 52, eyeDX: 11, top: 22, mouthY: 64, chinY: 88 },
    name: 'Pingüino',
    bg: '#D4ECFF',
    draw: () => (
      <G>
        <Ellipse cx={50} cy={55} rx={33} ry={33} fill="#263859" />
        <Path d="M50 40 Q36 30 28 44 Q24 62 34 74 Q50 86 66 74 Q76 62 72 44 Q64 30 50 40 Z" fill="#FFFFFF" />
        <Eyes y={52} dx={11} />
        <Path d="M42 60 L58 60 L50 69 Z" fill="#FF9F1C" />
        <Cheeks y={64} dx={19} />
      </G>
    ),
  },
  pollito: {
    anchors: { eyeY: 50, eyeDX: 11, top: 25, mouthY: 63, chinY: 87 },
    name: 'Pollito',
    bg: '#FFF7D1',
    draw: () => (
      <G>
        <Path d="M48 24 Q44 12 52 14 Q50 18 56 16 Q58 22 52 26 Z" fill="#FFB703" />
        <Circle cx={50} cy={56} r={31} fill="#FFD23F" />
        <Ellipse cx={22} cy={64} rx={7} ry={11} fill="#FFC300" transform="rotate(25 22 64)" />
        <Ellipse cx={78} cy={64} rx={7} ry={11} fill="#FFC300" transform="rotate(-25 78 64)" />
        <Eyes y={50} dx={11} />
        <Path d="M42 59 L50 55 L58 59 L50 63 Z" fill="#FF8A3D" />
        <Path d="M43 60 L50 68 L57 60 Z" fill="#F4762A" />
        <Cheeks y={60} dx={21} />
      </G>
    ),
  },
  ajolote: {
    anchors: { eyeY: 50, eyeDX: 15, top: 30, mouthY: 66, chinY: 82 },
    name: 'Ajolote',
    bg: '#FFE0EF',
    draw: () => (
      <G>
        {[-1, 1].map((s) =>
          [26, 40, 54].map((y, i) => (
            <G key={`${s}-${y}`}>
              <Path
                d={`M${50 + s * 26} ${y + 6} Q${50 + s * (36 + i * 2)} ${y - 2} ${50 + s * (44 - i)} ${y - 6 + i * 6}`}
                stroke="#E0569B"
                strokeWidth={6}
                strokeLinecap="round"
                fill="none"
              />
              <Circle cx={50 + s * (44 - i)} cy={y - 6 + i * 6} r={3.4} fill="#FF7FB8" />
            </G>
          )),
        )}
        <Ellipse cx={50} cy={56} rx={30} ry={26} fill="#FFA3CE" />
        <Ellipse cx={50} cy={64} rx={22} ry={14} fill="#FFC2DF" />
        <Eyes y={50} dx={15} r={4} />
        <Path d="M38 62 Q50 72 62 62" stroke={INK} strokeWidth={2.4} strokeLinecap="round" fill="none" />
        <Cheeks y={60} dx={22} color="#FF5FA2" />
      </G>
    ),
  },
};

export const ANIMAL_IDS = Object.keys(ANIMALS) as AnimalId[];
