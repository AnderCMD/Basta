import React from 'react';
import { Circle, Ellipse, G, Path, Polygon, Rect } from 'react-native-svg';
import type { Anchors } from './animals';

/**
 * Accesorios preestablecidos para personalizar los avatares.
 * Se dibujan en el mismo espacio 100×100 que el animal, usando sus `anchors`
 * para quedar bien colocados en cualquier cabeza.
 */
export type Accessory = { id: string; name: string; draw: (a: Anchors) => React.ReactElement };

const INK = '#2B1B3F';

function star(cx: number, cy: number, r: number, inner = r * 0.45) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? inner : r;
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + Math.cos(ang) * rad).toFixed(1)},${(cy + Math.sin(ang) * rad).toFixed(1)}`);
  }
  return pts.join(' ');
}

function heart(cx: number, cy: number, s: number) {
  return `M${cx} ${cy + s * 0.9} C${cx - s * 1.6} ${cy - s * 0.1} ${cx - s * 0.7} ${cy - s * 1.3} ${cx} ${cy - s * 0.4} C${cx + s * 0.7} ${cy - s * 1.3} ${cx + s * 1.6} ${cy - s * 0.1} ${cx} ${cy + s * 0.9} Z`;
}

function flower(cx: number, cy: number, color: string, key: string) {
  return (
    <G key={key}>
      {[0, 72, 144, 216, 288].map((deg) => {
        const r = (deg * Math.PI) / 180;
        return <Circle key={deg} cx={cx + Math.cos(r) * 3.4} cy={cy + Math.sin(r) * 3.4} r={2.8} fill={color} />;
      })}
      <Circle cx={cx} cy={cy} r={2.2} fill="#FFD23F" />
    </G>
  );
}

const lensR = (a: Anchors) => Math.max(7, Math.min(11, a.eyeDX * 0.72));

export const HATS = [
  {
    id: 'sombrero',
    name: 'Sombrero charro',
    draw: (a) => {
      const b = a.top + 6;
      return (
        <G>
          <Ellipse cx={50} cy={b} rx={38} ry={8} fill="#C8963E" stroke="#9C6F25" strokeWidth={1.5} />
          <Path d={`M34 ${b} Q35 ${b - 24} 50 ${b - 25} Q65 ${b - 24} 66 ${b} Z`} fill="#E0B05A" stroke="#9C6F25" strokeWidth={1.5} />
          <Rect x={35} y={b - 7} width={30} height={5} rx={2} fill="#D7263D" />
          {[22, 34, 50, 66, 78].map((x, i) => (
            <Circle key={x} cx={x} cy={b + (i === 2 ? 4 : 2.5)} r={1.8} fill={i % 2 ? '#2EE6A6' : '#FFD23F'} />
          ))}
        </G>
      );
    },
  },
  {
    id: 'gorra',
    name: 'Gorra',
    draw: (a) => {
      const b = a.top + 5;
      return (
        <G>
          <Path d={`M27 ${b + 2} Q29 ${b - 21} 50 ${b - 21} Q71 ${b - 21} 73 ${b + 2} Z`} fill="#3DA5FF" />
          <Path d={`M50 ${b - 21} L50 ${b + 2}`} stroke="#2563EB" strokeWidth={1.5} />
          <Ellipse cx={66} cy={b + 2} rx={20} ry={5} fill="#2563EB" />
          <Circle cx={50} cy={b - 21} r={2.5} fill="#2563EB" />
        </G>
      );
    },
  },
  {
    id: 'corona',
    name: 'Corona',
    draw: (a) => {
      const b = a.top + 5;
      return (
        <G>
          <Polygon
            points={`31,${b} 31,${b - 15} 40,${b - 7} 50,${b - 20} 60,${b - 7} 69,${b - 15} 69,${b}`}
            fill="#FFC300"
            stroke="#E09B00"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <Circle cx={50} cy={b - 5} r={2.6} fill="#FF4757" />
          <Circle cx={39} cy={b - 4} r={2} fill="#3DA5FF" />
          <Circle cx={61} cy={b - 4} r={2} fill="#2EE6A6" />
          <Circle cx={50} cy={b - 20} r={2} fill="#FFF3B0" />
        </G>
      );
    },
  },
  {
    id: 'copa',
    name: 'Sombrero de copa',
    draw: (a) => {
      const b = a.top + 5;
      return (
        <G>
          <Rect x={34} y={b - 27} width={32} height={25} rx={3} fill="#2B2840" />
          <Rect x={34} y={b - 9} width={32} height={5} fill="#FF4D8D" />
          <Rect x={25} y={b - 3} width={50} height={6} rx={3} fill="#1E1B2E" />
        </G>
      );
    },
  },
  {
    id: 'fiesta',
    name: 'Gorro de fiesta',
    draw: (a) => {
      const b = a.top + 5;
      return (
        <G>
          <Polygon points={`38,${b + 1} 62,${b + 1} 50,${b - 27}`} fill="#9B5CFF" />
          <Path d={`M41 ${b - 6} L59 ${b - 9} M44 ${b - 15} L56 ${b - 17}`} stroke="#FFD23F" strokeWidth={2.5} strokeLinecap="round" />
          <Circle cx={50} cy={b - 27} r={4.5} fill="#FF4D8D" />
        </G>
      );
    },
  },
  {
    id: 'vaquero',
    name: 'Sombrero vaquero',
    draw: (a) => {
      const b = a.top + 5;
      return (
        <G>
          <Path d={`M33 ${b - 1} Q31 ${b - 23} 42 ${b - 21} Q50 ${b - 15} 58 ${b - 21} Q69 ${b - 23} 67 ${b - 1} Z`} fill="#A0522D" />
          <Rect x={33} y={b - 7} width={34} height={4} fill="#5C3317" />
          <Path d={`M16 ${b - 6} Q22 ${b + 6} 50 ${b + 4} Q78 ${b + 6} 84 ${b - 6} Q76 ${b - 1} 50 ${b - 2} Q24 ${b - 1} 16 ${b - 6} Z`} fill="#8B4513" />
        </G>
      );
    },
  },
  {
    id: 'gorro',
    name: 'Gorro de lana',
    draw: (a) => {
      const b = a.top + 6;
      return (
        <G>
          <Path d={`M28 ${b + 2} Q28 ${b - 23} 50 ${b - 23} Q72 ${b - 23} 72 ${b + 2} Z`} fill="#FF4757" />
          <Path d={`M38 ${b - 18} L38 ${b} M50 ${b - 22} L50 ${b} M62 ${b - 18} L62 ${b}`} stroke="#E02E40" strokeWidth={2} />
          <Rect x={26} y={b - 3} width={48} height={8} rx={4} fill="#FF8FA3" />
          <Circle cx={50} cy={b - 25} r={6} fill="#FFFFFF" />
        </G>
      );
    },
  },
  {
    id: 'mono',
    name: 'Moño',
    draw: (a) => {
      const y = a.top + 3;
      return (
        <G>
          <Path d={`M66 ${y} L54 ${y - 9} Q51 ${y} 54 ${y + 8} Z`} fill="#FF4D8D" />
          <Path d={`M66 ${y} L78 ${y - 9} Q81 ${y} 78 ${y + 8} Z`} fill="#FF4D8D" />
          <Circle cx={66} cy={y} r={3.8} fill="#C2185B" />
        </G>
      );
    },
  },
  {
    id: 'chef',
    name: 'Gorro de chef',
    draw: (a) => {
      const b = a.top + 5;
      return (
        <G>
          <Circle cx={40} cy={b - 15} r={10} fill="#FFFFFF" stroke="#E2E2EA" strokeWidth={1} />
          <Circle cx={60} cy={b - 15} r={10} fill="#FFFFFF" stroke="#E2E2EA" strokeWidth={1} />
          <Circle cx={50} cy={b - 21} r={11} fill="#FFFFFF" stroke="#E2E2EA" strokeWidth={1} />
          <Rect x={34} y={b - 10} width={32} height={11} rx={2} fill="#FFFFFF" stroke="#E2E2EA" strokeWidth={1} />
        </G>
      );
    },
  },
  {
    id: 'birrete',
    name: 'Birrete',
    draw: (a) => {
      const b = a.top + 5;
      return (
        <G>
          <Rect x={36} y={b - 9} width={28} height={9} rx={2} fill="#2B2D42" />
          <Polygon points={`22,${b - 11} 50,${b - 21} 78,${b - 11} 50,${b - 2}`} fill="#22223B" />
          <Path d={`M50 ${b - 11} L72 ${b - 7} L72 ${b + 6}`} stroke="#FFD23F" strokeWidth={1.8} fill="none" />
          <Rect x={70} y={b + 4} width={4} height={6} rx={1} fill="#FFD23F" />
        </G>
      );
    },
  },
  {
    id: 'flores',
    name: 'Corona de flores',
    draw: (a) => {
      const b = a.top + 3;
      const colorsList = ['#FF4D8D', '#FFFFFF', '#C86BFA', '#FF8A3D', '#3DA5FF'];
      return (
        <G>
          <Path d={`M26 ${b + 4} Q50 ${b - 8} 74 ${b + 4}`} stroke="#2E9E5B" strokeWidth={2.5} fill="none" />
          {[28, 39, 50, 61, 72].map((x, i) => flower(x, b + 3 - (i === 2 ? 7 : i === 1 || i === 3 ? 5 : 1), colorsList[i], `f${i}`))}
        </G>
      );
    },
  },
  {
    id: 'vikingo',
    name: 'Casco vikingo',
    draw: (a) => {
      const b = a.top + 6;
      return (
        <G>
          <Path d={`M32 ${b - 8} Q20 ${b - 10} 17 ${b - 26} Q26 ${b - 17} 35 ${b - 14} Z`} fill="#F5EBDD" stroke="#CDBFA8" strokeWidth={1} />
          <Path d={`M68 ${b - 8} Q80 ${b - 10} 83 ${b - 26} Q74 ${b - 17} 65 ${b - 14} Z`} fill="#F5EBDD" stroke="#CDBFA8" strokeWidth={1} />
          <Path d={`M29 ${b + 2} Q29 ${b - 20} 50 ${b - 20} Q71 ${b - 20} 71 ${b + 2} Z`} fill="#A8B2C1" />
          <Rect x={27} y={b - 2} width={46} height={6} rx={3} fill="#7D8797" />
          <Rect x={48} y={b - 20} width={4} height={20} fill="#7D8797" />
        </G>
      );
    },
  },
  {
    id: 'mago',
    name: 'Sombrero de mago',
    draw: (a) => {
      const b = a.top + 5;
      return (
        <G>
          <Polygon points={`32,${b + 1} 68,${b + 1} 58,${b - 30}`} fill="#4C2A85" />
          <Ellipse cx={50} cy={b + 1} rx={26} ry={4.5} fill="#3A1F68" />
          <Polygon points={star(47, b - 10, 4)} fill="#FFD23F" />
          <Circle cx={56} cy={b - 19} r={1.5} fill="#FFD23F" />
        </G>
      );
    },
  },
] as const satisfies readonly Accessory[];

export const GLASSES = [
  {
    id: 'redondos',
    name: 'Lentes redondos',
    draw: (a) => {
      const r = lensR(a);
      const y = a.eyeY;
      return (
        <G fill="rgba(255,255,255,0.18)" stroke={INK} strokeWidth={2.4}>
          <Circle cx={50 - a.eyeDX} cy={y} r={r} />
          <Circle cx={50 + a.eyeDX} cy={y} r={r} />
          <Path d={`M${50 - a.eyeDX + r} ${y} Q50 ${y - 4} ${50 + a.eyeDX - r} ${y}`} fill="none" />
        </G>
      );
    },
  },
  {
    id: 'sol',
    name: 'Lentes de sol',
    draw: (a) => {
      const r = lensR(a) + 1;
      const y = a.eyeY;
      return (
        <G>
          <Rect x={50 - a.eyeDX - r} y={y - r * 0.75} width={r * 2} height={r * 1.5} rx={r * 0.5} fill="#1E1B2E" />
          <Rect x={50 + a.eyeDX - r} y={y - r * 0.75} width={r * 2} height={r * 1.5} rx={r * 0.5} fill="#1E1B2E" />
          <Path d={`M${50 - a.eyeDX + r} ${y - 2} L${50 + a.eyeDX - r} ${y - 2}`} stroke="#1E1B2E" strokeWidth={2.4} />
          <Path d={`M${50 - a.eyeDX - r * 0.5} ${y - r * 0.3} L${50 - a.eyeDX} ${y - r * 0.3}`} stroke="#fff" strokeOpacity={0.6} strokeWidth={1.6} strokeLinecap="round" />
          <Path d={`M${50 + a.eyeDX - r * 0.5} ${y - r * 0.3} L${50 + a.eyeDX} ${y - r * 0.3}`} stroke="#fff" strokeOpacity={0.6} strokeWidth={1.6} strokeLinecap="round" />
        </G>
      );
    },
  },
  {
    id: 'corazon',
    name: 'Lentes de corazón',
    draw: (a) => {
      const sz = lensR(a) * 0.95;
      return (
        <G>
          <Path d={heart(50 - a.eyeDX, a.eyeY, sz)} fill="#FF4D8D" fillOpacity={0.85} stroke="#C2185B" strokeWidth={1.5} />
          <Path d={heart(50 + a.eyeDX, a.eyeY, sz)} fill="#FF4D8D" fillOpacity={0.85} stroke="#C2185B" strokeWidth={1.5} />
          <Path d={`M${50 - a.eyeDX + sz} ${a.eyeY - 2} L${50 + a.eyeDX - sz} ${a.eyeY - 2}`} stroke="#C2185B" strokeWidth={2} />
        </G>
      );
    },
  },
  {
    id: 'estrella',
    name: 'Lentes de estrella',
    draw: (a) => {
      const r = lensR(a) + 1.5;
      return (
        <G>
          <Polygon points={star(50 - a.eyeDX, a.eyeY, r)} fill="#FFD23F" fillOpacity={0.9} stroke="#FF9F1C" strokeWidth={1.5} />
          <Polygon points={star(50 + a.eyeDX, a.eyeY, r)} fill="#FFD23F" fillOpacity={0.9} stroke="#FF9F1C" strokeWidth={1.5} />
          <Path d={`M${50 - a.eyeDX + r * 0.5} ${a.eyeY} L${50 + a.eyeDX - r * 0.5} ${a.eyeY}`} stroke="#FF9F1C" strokeWidth={2} />
        </G>
      );
    },
  },
  {
    id: '3d',
    name: 'Lentes 3D',
    draw: (a) => {
      const r = lensR(a);
      const y = a.eyeY;
      return (
        <G>
          <Rect x={50 - a.eyeDX - r - 3} y={y - r} width={a.eyeDX * 2 + r * 2 + 6} height={r * 2} rx={3} fill="#FFFFFF" />
          <Rect x={50 - a.eyeDX - r + 1} y={y - r + 3} width={r * 2 - 2} height={r * 2 - 6} rx={2} fill="#FF4757" fillOpacity={0.85} />
          <Rect x={50 + a.eyeDX - r + 1} y={y - r + 3} width={r * 2 - 2} height={r * 2 - 6} rx={2} fill="#3DA5FF" fillOpacity={0.85} />
        </G>
      );
    },
  },
  {
    id: 'monoculo',
    name: 'Monóculo',
    draw: (a) => {
      const r = lensR(a) + 1;
      const cx = 50 + a.eyeDX;
      return (
        <G>
          <Circle cx={cx} cy={a.eyeY} r={r} fill="rgba(255,255,255,0.2)" stroke="#E0A800" strokeWidth={2.5} />
          <Path d={`M${cx + r * 0.7} ${a.eyeY + r * 0.7} Q${cx + r + 4} ${a.eyeY + 18} ${cx + 2} ${a.eyeY + 28}`} stroke="#E0A800" strokeWidth={1.3} fill="none" />
        </G>
      );
    },
  },
  {
    id: 'nerd',
    name: 'Lentes de pasta',
    draw: (a) => {
      const r = lensR(a) + 1;
      const y = a.eyeY;
      return (
        <G>
          <Rect x={50 - a.eyeDX - r} y={y - r * 0.85} width={r * 2} height={r * 1.7} rx={3} fill="rgba(255,255,255,0.15)" stroke={INK} strokeWidth={3.4} />
          <Rect x={50 + a.eyeDX - r} y={y - r * 0.85} width={r * 2} height={r * 1.7} rx={3} fill="rgba(255,255,255,0.15)" stroke={INK} strokeWidth={3.4} />
          <Rect x={46} y={y - 3} width={8} height={5} rx={1} fill="#FFFFFF" stroke="#D8D8E0" strokeWidth={1} />
        </G>
      );
    },
  },
  {
    id: 'antifaz',
    name: 'Antifaz',
    draw: (a) => {
      const r = lensR(a);
      const y = a.eyeY;
      const L = 50 - a.eyeDX;
      const R = 50 + a.eyeDX;
      return (
        <G>
          <Path
            d={`M${L - r - 5} ${y - 2} Q${L - r} ${y - r - 4} ${L} ${y - r - 2} Q50 ${y - r + 2} ${R} ${y - r - 2} Q${R + r} ${y - r - 4} ${R + r + 5} ${y - 2} Q${R + r} ${y + r + 3} ${R} ${y + r} Q50 ${y + 2} ${L} ${y + r} Q${L - r} ${y + r + 3} ${L - r - 5} ${y - 2} Z`}
            fill="#2B1B3F"
          />
          <Ellipse cx={L} cy={y} rx={r * 0.6} ry={r * 0.45} fill="#FFFFFF" fillOpacity={0.25} />
          <Ellipse cx={R} cy={y} rx={r * 0.6} ry={r * 0.45} fill="#FFFFFF" fillOpacity={0.25} />
        </G>
      );
    },
  },
] as const satisfies readonly Accessory[];

export const EXTRAS = [
  {
    id: 'corbatin',
    name: 'Corbatín',
    draw: (a) => {
      const y = a.chinY + 1;
      return (
        <G>
          <Path d={`M50 ${y} L39 ${y - 6} L39 ${y + 6} Z`} fill="#FF4757" />
          <Path d={`M50 ${y} L61 ${y - 6} L61 ${y + 6} Z`} fill="#FF4757" />
          <Rect x={47} y={y - 3} width={6} height={6} rx={2} fill="#C2185B" />
        </G>
      );
    },
  },
  {
    id: 'bigote',
    name: 'Bigote',
    draw: (a) => {
      const y = a.mouthY - 3;
      return (
        <Path
          d={`M50 ${y} Q44 ${y - 4} 38 ${y} Q33 ${y + 3} 30 ${y - 2} Q32 ${y + 6} 39 ${y + 4} Q45 ${y + 3} 50 ${y + 1} Q55 ${y + 3} 61 ${y + 4} Q68 ${y + 6} 70 ${y - 2} Q67 ${y + 3} 62 ${y} Q56 ${y - 4} 50 ${y} Z`}
          fill="#3B2A1A"
        />
      );
    },
  },
  {
    id: 'bufanda',
    name: 'Bufanda',
    draw: (a) => {
      const c = a.chinY;
      return (
        <G>
          <Path d={`M24 ${c - 5} Q50 ${c + 5} 76 ${c - 5} L76 ${c + 3} Q50 ${c + 13} 24 ${c + 3} Z`} fill="#2EE6A6" />
          <Rect x={58} y={c + 2} width={9} height={14} rx={2} fill="#22C38E" />
          <Path d={`M36 ${c - 1} L36 ${c + 7} M50 ${c + 1} L50 ${c + 9} M64 ${c - 1} L64 ${c + 7}`} stroke="#FFFFFF" strokeOpacity={0.6} strokeWidth={2} />
        </G>
      );
    },
  },
  {
    id: 'paliacate',
    name: 'Paliacate',
    draw: (a) => {
      const c = a.chinY;
      return (
        <G>
          <Path d={`M28 ${c - 5} Q50 ${c + 1} 72 ${c - 5} L50 ${c + 13} Z`} fill="#D7263D" />
          {[
            [42, c - 1],
            [50, c + 4],
            [58, c - 1],
            [50, c - 2],
          ].map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={1.3} fill="#FFFFFF" />
          ))}
        </G>
      );
    },
  },
  {
    id: 'audifonos',
    name: 'Audífonos',
    draw: (a) => {
      // Las copas se pegan a los lados de la cabeza según su anchura.
      const L = 50 - a.headHalf;
      const R = 50 + a.headHalf;
      const y = a.eyeY - 2;
      return (
        <G>
          <Path d={`M${L + 2} ${y + 2} Q${L} ${a.top - 8} 50 ${a.top - 8} Q${R} ${a.top - 8} ${R - 2} ${y + 2}`} stroke="#2B2840" strokeWidth={5} fill="none" strokeLinecap="round" />
          <Rect x={L - 6} y={y} width={12} height={18} rx={5} fill="#FF4D8D" />
          <Rect x={R - 6} y={y} width={12} height={18} rx={5} fill="#FF4D8D" />
        </G>
      );
    },
  },
  {
    id: 'collar',
    name: 'Collar de perlas',
    draw: (a) => {
      const c = a.chinY - 1;
      return (
        <G>
          {Array.from({ length: 9 }).map((_, i) => {
            const t = i / 8;
            const x = 30 + t * 40;
            const y = c + Math.sin(t * Math.PI) * 7;
            return <Circle key={i} cx={x} cy={y} r={2.4} fill="#FFFFFF" stroke="#E5DCEB" strokeWidth={0.8} />;
          })}
        </G>
      );
    },
  },
  {
    id: 'medalla',
    name: 'Medalla',
    draw: (a) => {
      const c = a.chinY;
      return (
        <G>
          <Path d={`M42 ${c - 6} L50 ${c + 4} L58 ${c - 6}`} stroke="#3DA5FF" strokeWidth={4} fill="none" />
          <Circle cx={50} cy={c + 8} r={6} fill="#FFC300" stroke="#E09B00" strokeWidth={1.5} />
          <Polygon points={star(50, c + 8, 3)} fill="#FFF3B0" />
        </G>
      );
    },
  },
  {
    id: 'brillos',
    name: 'Brillitos',
    draw: (a) => (
      <G>
        <Polygon points={star(16, a.top + 10, 5, 1.6)} fill="#FFD23F" />
        <Polygon points={star(84, a.top + 18, 4, 1.4)} fill="#FFFFFF" />
        <Polygon points={star(86, a.chinY - 6, 3.5, 1.2)} fill="#FF4D8D" />
        <Polygon points={star(13, a.chinY - 12, 3, 1)} fill="#3DA5FF" />
      </G>
    ),
  },
] as const satisfies readonly Accessory[];

export type HatId = (typeof HATS)[number]['id'];
export type GlassesId = (typeof GLASSES)[number]['id'];
export type ExtraId = (typeof EXTRAS)[number]['id'];

/** Colores de fondo para el avatar (null = color del animal). */
export const AVATAR_BACKGROUNDS = [
  '#FFD6E0',
  '#FFE8A3',
  '#C9F2E3',
  '#CFE6FF',
  '#E5D4FF',
  '#FFD8C2',
  '#B5F0FF',
  '#FFF4E0',
  '#FF4D8D',
  '#3DA5FF',
  '#2EE6A6',
  '#2E0F6E',
] as const;

export const findHat = (id?: string | null) => HATS.find((h) => h.id === id);
export const findGlasses = (id?: string | null) => GLASSES.find((g) => g.id === id);
export const findExtra = (id?: string | null) => EXTRAS.find((e) => e.id === id);
