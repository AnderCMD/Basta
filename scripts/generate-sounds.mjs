#!/usr/bin/env node
/**
 * Genera los efectos de sonido del juego sintetizando ondas (sin descargar nada).
 *
 * Hay varios ESTILOS (paquetes) para que cada grupo elija el que le guste;
 * todos tienen los mismos 8 efectos. Salida: WAV mono 16-bit a 22 050 Hz en
 * assets/sounds/<estilo>/<efecto>.wav, y el módulo src/lib/soundPacks.ts con
 * los `require` que Metro necesita (estáticos).
 *
 * Uso: node scripts/generate-sounds.mjs
 */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RATE = 22050;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets', 'sounds');

/**
 * Nota sintetizada.
 * - type: sine | triangle | square | soft (seno + armónico suave) | bell | wood | noise
 * - decay: caída exponencial (0 = envolvente plana); da el carácter "percusivo".
 */
function tone({ freq, freqEnd = freq, dur, type = 'soft', vol = 0.5, attack = 0.005, release = 0.05, decay = 0 }) {
  const n = Math.floor(dur * RATE);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const f = freq + (freqEnd - freq) * t;
    phase += (2 * Math.PI * f) / RATE;
    let v;
    switch (type) {
      case 'square':
        v = Math.sign(Math.sin(phase)) * 0.5;
        break;
      case 'triangle':
        v = (2 / Math.PI) * Math.asin(Math.sin(phase));
        break;
      case 'sine':
        v = Math.sin(phase);
        break;
      case 'bell':
        // Campana: parciales inarmónicos que se apagan a distinto ritmo.
        v = Math.sin(phase) + 0.45 * Math.sin(phase * 2.76) * Math.exp(-t * 6) + 0.25 * Math.sin(phase * 5.4) * Math.exp(-t * 12);
        break;
      case 'wood':
        // Marimba: fundamental + cuarto armónico muy breve.
        v = Math.sin(phase) + 0.3 * Math.sin(phase * 4) * Math.exp(-t * 25);
        break;
      case 'noise':
        v = Math.random() * 2 - 1;
        break;
      default:
        v = Math.sin(phase) + 0.2 * Math.sin(phase * 2);
    }
    const time = i / RATE;
    let env = Math.min(1, time / attack) * Math.min(1, (dur - time) / release);
    if (decay) env *= Math.exp(-time * decay);
    out[i] = v * vol * Math.max(0, env);
  }
  return out;
}

const silence = (dur) => new Float32Array(Math.floor(dur * RATE));

function concat(...parts) {
  const out = new Float32Array(parts.reduce((a, p) => a + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function mix(...parts) {
  const out = new Float32Array(Math.max(...parts.map((p) => p.length)));
  for (const p of parts) for (let i = 0; i < p.length; i++) out[i] += p[i];
  return out;
}

/** Normaliza al pico indicado para que todos los estilos tengan volumen parejo. */
function normalize(samples, peak) {
  let max = 0;
  for (const s of samples) max = Math.max(max, Math.abs(s));
  const k = max > 0 ? peak / max : 1;
  return samples.map((s) => s * k);
}

function wav(samples) {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + samples.length * 2, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(RATE, 24);
  buf.writeUInt32LE(RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), 44 + i * 2));
  return buf;
}

const n = (freq, dur, o = {}) => tone({ freq, dur, ...o });

/** Estilos de sonido. `peak` controla qué tan fuerte suena cada estilo. */
const PACKS = {
  clasico: {
    peak: 0.8,
    sounds: {
      tap: mix(n(880, 0.09, { freqEnd: 1320, vol: 0.45 }), n(1760, 0.05, { vol: 0.12 })),
      tick: n(1200, 0.05, { type: 'triangle', vol: 0.4, release: 0.03 }),
      start: concat(n(523, 0.08), n(659, 0.08), n(784, 0.14, { vol: 0.55 })),
      fail: concat(n(330, 0.16, { type: 'square', freqEnd: 260, vol: 0.3 }), n(196, 0.32, { type: 'square', freqEnd: 140, vol: 0.3 })),
      win: concat(n(523, 0.1), n(659, 0.1), n(784, 0.1), n(1047, 0.18), silence(0.04), mix(n(784, 0.35, { vol: 0.35 }), n(1047, 0.35, { vol: 0.35 }), n(1319, 0.35, { vol: 0.3 }))),
      golden: concat(n(1319, 0.06), n(1568, 0.06), n(2093, 0.16)),
      wildcard: concat(n(440, 0.07, { type: 'triangle' }), n(660, 0.12, { type: 'triangle', freqEnd: 990 })),
      achievement: concat(n(659, 0.09), n(880, 0.09), n(1175, 0.22)),
    },
  },
  suave: {
    peak: 0.35,
    sounds: {
      tap: n(660, 0.12, { type: 'sine', attack: 0.012, release: 0.09 }),
      tick: n(880, 0.06, { type: 'sine', attack: 0.008, release: 0.05 }),
      start: concat(n(440, 0.12, { type: 'sine', attack: 0.02 }), n(554, 0.16, { type: 'sine', attack: 0.02, release: 0.12 })),
      fail: n(392, 0.4, { type: 'sine', freqEnd: 294, attack: 0.03, release: 0.25 }),
      win: concat(n(523, 0.16, { type: 'sine', attack: 0.02 }), n(659, 0.16, { type: 'sine', attack: 0.02 }), n(784, 0.4, { type: 'sine', attack: 0.02, release: 0.3 })),
      golden: concat(n(988, 0.1, { type: 'sine', attack: 0.015 }), n(1319, 0.18, { type: 'sine', attack: 0.015, release: 0.14 })),
      wildcard: n(587, 0.22, { type: 'sine', freqEnd: 740, attack: 0.02, release: 0.15 }),
      achievement: concat(n(587, 0.14, { type: 'sine' }), n(880, 0.32, { type: 'sine', release: 0.25 })),
    },
  },
  burbujas: {
    peak: 0.45,
    sounds: {
      tap: n(500, 0.07, { type: 'sine', freqEnd: 1100, release: 0.03 }),
      tick: n(900, 0.04, { type: 'sine', freqEnd: 1300, release: 0.02 }),
      start: concat(n(400, 0.06, { type: 'sine', freqEnd: 800 }), n(600, 0.06, { type: 'sine', freqEnd: 1200 }), n(800, 0.08, { type: 'sine', freqEnd: 1600 })),
      fail: concat(n(700, 0.1, { type: 'sine', freqEnd: 350 }), n(500, 0.22, { type: 'sine', freqEnd: 180, release: 0.12 })),
      win: concat(...[500, 650, 800, 1000, 1250].map((f) => n(f, 0.07, { type: 'sine', freqEnd: f * 2 })), n(1500, 0.2, { type: 'sine', freqEnd: 2200, release: 0.12 })),
      golden: concat(n(900, 0.05, { type: 'sine', freqEnd: 1800 }), silence(0.02), n(1200, 0.08, { type: 'sine', freqEnd: 2400 })),
      wildcard: concat(n(350, 0.08, { type: 'sine', freqEnd: 900 }), n(450, 0.1, { type: 'sine', freqEnd: 1100 })),
      achievement: concat(n(600, 0.07, { type: 'sine', freqEnd: 1200 }), n(800, 0.07, { type: 'sine', freqEnd: 1600 }), n(1000, 0.14, { type: 'sine', freqEnd: 2000 })),
    },
  },
  madera: {
    peak: 0.5,
    sounds: {
      tap: n(784, 0.18, { type: 'wood', decay: 22 }),
      tick: n(1047, 0.1, { type: 'wood', decay: 35 }),
      start: concat(n(523, 0.12, { type: 'wood', decay: 18 }), n(659, 0.12, { type: 'wood', decay: 18 }), n(784, 0.25, { type: 'wood', decay: 12 })),
      fail: concat(n(330, 0.16, { type: 'wood', decay: 14 }), n(247, 0.4, { type: 'wood', decay: 8 })),
      win: concat(...[523, 659, 784, 1047].map((f) => n(f, 0.13, { type: 'wood', decay: 16 })), mix(n(784, 0.5, { type: 'wood', decay: 6 }), n(1047, 0.5, { type: 'wood', decay: 6 }))),
      golden: concat(n(1175, 0.1, { type: 'wood', decay: 25 }), n(1568, 0.22, { type: 'wood', decay: 14 })),
      wildcard: concat(n(587, 0.1, { type: 'wood', decay: 22 }), n(880, 0.2, { type: 'wood', decay: 14 })),
      achievement: concat(n(659, 0.12, { type: 'wood', decay: 18 }), n(880, 0.12, { type: 'wood', decay: 18 }), n(1319, 0.3, { type: 'wood', decay: 10 })),
    },
  },
  campanitas: {
    peak: 0.4,
    sounds: {
      tap: n(1319, 0.3, { type: 'bell', decay: 12 }),
      tick: n(1760, 0.12, { type: 'bell', decay: 30 }),
      start: concat(n(1047, 0.15, { type: 'bell', decay: 14 }), n(1319, 0.3, { type: 'bell', decay: 9 })),
      fail: n(523, 0.6, { type: 'bell', freqEnd: 466, decay: 6 }),
      win: concat(...[1047, 1319, 1568].map((f) => n(f, 0.16, { type: 'bell', decay: 12 })), n(2093, 0.7, { type: 'bell', decay: 5 })),
      golden: mix(n(1568, 0.5, { type: 'bell', decay: 8 }), concat(silence(0.08), n(2093, 0.42, { type: 'bell', decay: 9 }))),
      wildcard: n(1175, 0.35, { type: 'bell', freqEnd: 1397, decay: 10 }),
      achievement: concat(n(1319, 0.14, { type: 'bell', decay: 14 }), n(1760, 0.5, { type: 'bell', decay: 7 })),
    },
  },
  minimo: {
    peak: 0.18,
    sounds: {
      tap: n(1000, 0.025, { type: 'sine', attack: 0.003, release: 0.015 }),
      tick: n(1400, 0.02, { type: 'sine', attack: 0.003, release: 0.012 }),
      start: n(800, 0.05, { type: 'sine', release: 0.03 }),
      fail: n(300, 0.18, { type: 'sine', release: 0.12 }),
      win: concat(n(700, 0.08, { type: 'sine' }), n(1050, 0.16, { type: 'sine', release: 0.1 })),
      golden: n(1500, 0.06, { type: 'sine', release: 0.04 }),
      wildcard: n(900, 0.05, { type: 'sine', release: 0.03 }),
      achievement: concat(n(900, 0.06, { type: 'sine' }), n(1200, 0.1, { type: 'sine', release: 0.07 })),
    },
  },
};

const EFFECTS = ['tap', 'tick', 'start', 'fail', 'win', 'golden', 'wildcard', 'achievement'];

rmSync(OUT, { recursive: true, force: true });
let total = 0;
for (const [pack, { peak, sounds }] of Object.entries(PACKS)) {
  mkdirSync(join(OUT, pack), { recursive: true });
  for (const effect of EFFECTS) {
    const data = wav(normalize(sounds[effect], peak));
    total += data.length;
    writeFileSync(join(OUT, pack, `${effect}.wav`), data);
  }
  console.log(`✓ ${pack}`);
}
console.log(`Total: ${(total / 1024).toFixed(0)} KB`);

// Módulo con requires estáticos para Metro.
const lines = Object.keys(PACKS).map(
  (pack) => `  ${pack}: {\n${EFFECTS.map((e) => `    ${e}: require('../../assets/sounds/${pack}/${e}.wav'),`).join('\n')}\n  },`,
);
writeFileSync(
  join(ROOT, 'src', 'lib', 'soundPacks.ts'),
  `// Archivo generado por scripts/generate-sounds.mjs — no editar a mano.\nexport const SOUND_FILES = {\n${lines.join('\n')}\n} as const;\n`,
);
console.log('✓ src/lib/soundPacks.ts');
