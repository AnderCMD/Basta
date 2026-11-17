#!/usr/bin/env node
/**
 * Genera los efectos de sonido del juego sintetizando ondas (sin descargar nada).
 * Archivos WAV mono 16-bit a 22 050 Hz en assets/sounds/. Uso: node scripts/generate-sounds.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RATE = 22050;
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'sounds');

/** Nota con envolvente ADSR simple. */
function tone({ freq, freqEnd = freq, dur, type = 'sine', vol = 0.5, attack = 0.005, release = 0.06 }) {
  const n = Math.floor(dur * RATE);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const f = freq + (freqEnd - freq) * t;
    phase += (2 * Math.PI * f) / RATE;
    let v;
    if (type === 'square') v = Math.sign(Math.sin(phase)) * 0.6;
    else if (type === 'triangle') v = (2 / Math.PI) * Math.asin(Math.sin(phase));
    else if (type === 'noise') v = Math.random() * 2 - 1;
    else v = Math.sin(phase) + 0.25 * Math.sin(phase * 2);
    const time = i / RATE;
    const env = Math.min(1, time / attack) * Math.min(1, (dur - time) / release);
    out[i] = v * vol * Math.max(0, env);
  }
  return out;
}

const silence = (dur) => new Float32Array(Math.floor(dur * RATE));

function concat(...parts) {
  const total = parts.reduce((a, p) => a + p.length, 0);
  const out = new Float32Array(total);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function mix(...parts) {
  const len = Math.max(...parts.map((p) => p.length));
  const out = new Float32Array(len);
  for (const p of parts) for (let i = 0; i < p.length; i++) out[i] += p[i];
  return out;
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

const note = (f, d, o = {}) => tone({ freq: f, dur: d, ...o });

const sounds = {
  tap: mix(note(880, 0.09, { freqEnd: 1320, vol: 0.45 }), note(1760, 0.05, { vol: 0.12 })),
  tick: note(1200, 0.05, { type: 'triangle', vol: 0.4, release: 0.03 }),
  start: concat(note(523, 0.08), note(659, 0.08), note(784, 0.14, { vol: 0.55 })),
  fail: concat(note(330, 0.16, { type: 'square', freqEnd: 260, vol: 0.32 }), note(196, 0.32, { type: 'square', freqEnd: 140, vol: 0.32 })),
  win: concat(
    note(523, 0.1),
    note(659, 0.1),
    note(784, 0.1),
    note(1047, 0.18, { vol: 0.55 }),
    silence(0.04),
    mix(note(784, 0.35, { vol: 0.35 }), note(1047, 0.35, { vol: 0.35 }), note(1319, 0.35, { vol: 0.3 })),
  ),
  golden: concat(note(1319, 0.06, { vol: 0.35 }), note(1568, 0.06, { vol: 0.35 }), note(2093, 0.16, { vol: 0.35 })),
  wildcard: concat(note(440, 0.07, { type: 'triangle' }), note(660, 0.12, { type: 'triangle', freqEnd: 990 })),
  achievement: concat(note(659, 0.09), note(880, 0.09), note(1175, 0.22, { vol: 0.5 })),
};

mkdirSync(OUT, { recursive: true });
for (const [name, samples] of Object.entries(sounds)) {
  writeFileSync(join(OUT, `${name}.wav`), wav(samples));
  console.log(`✓ ${name}.wav (${((44 + samples.length * 2) / 1024).toFixed(1)} KB)`);
}
