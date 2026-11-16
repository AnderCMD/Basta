/// <reference types="node" />
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAlphabet, MX_ALPHABET } from './alphabet.ts';
import { createGame, gameReducer, ranking, type GameConfig, type GameState } from './game.ts';

const players = [
  { id: 'a', name: 'Ana', animal: 'gato' },
  { id: 'b', name: 'Beto', animal: 'perro' },
  { id: 'c', name: 'Caro', animal: 'ajolote' },
];

const cfg = (over: Partial<GameConfig> = {}): GameConfig => ({
  mode: 'quick',
  turnSeconds: 10,
  lives: 3,
  alphabet: MX_ALPHABET,
  ...over,
});

const start = (over: Partial<GameConfig> = {}) =>
  gameReducer(createGame(cfg(over), players, [...MX_ALPHABET], 'Frutas'), { type: 'START' });

test('el abecedario mexicano tiene 27 letras e incluye Ñ', () => {
  assert.equal(MX_ALPHABET.length, 27);
  assert.ok(MX_ALPHABET.includes('Ñ'));
  const withDigraphs = buildAlphabet({ includeDigraphs: true, excludeHard: false });
  assert.equal(withDigraphs.length, 29);
  assert.equal(withDigraphs[withDigraphs.indexOf('C') + 1], 'CH');
  assert.equal(buildAlphabet({ includeDigraphs: false, excludeHard: true }).includes('W'), false);
});

test('solo se muestran 6 letras y al tocar una se reemplaza', () => {
  let s = start();
  assert.deepEqual(s.slots, ['A', 'B', 'C', 'D', 'E', 'F']);
  s = gameReducer(s, { type: 'TAP', slot: 2, refill: [] });
  assert.deepEqual(s.slots, ['A', 'B', 'G', 'D', 'E', 'F']);
  assert.deepEqual(s.used, ['C']);
  assert.equal(s.turn, 1);
  assert.equal(s.timeLeft, 10_000);
});

test('al acabarse el abecedario se vuelve a repartir', () => {
  let s = start();
  for (let i = 0; i < 27; i++) {
    const slot = s.slots.findIndex((l) => l !== null);
    s = gameReducer(s, { type: 'TAP', slot, refill: [...MX_ALPHABET] });
  }
  assert.equal(s.lap, 2);
  assert.equal(s.slots.filter(Boolean).length, 6);
  assert.equal(s.used.length, 0);
});

test('partida rápida: si se acaba el tiempo quedas fuera y gana el último', () => {
  let s = start();
  s = gameReducer(s, { type: 'TICK', dt: 10_000 });
  assert.equal(s.status, 'fail');
  assert.equal(s.players[0].out, true);
  s = gameReducer(s, { type: 'CONTINUE', deck: [], category: 'x' });
  assert.equal(s.turn, 1);
  assert.equal(s.category, 'Frutas');
  s = gameReducer(s, { type: 'START' });
  s = gameReducer(s, { type: 'MISTAKE', playerId: 'c' });
  assert.equal(s.status, 'finished');
  assert.deepEqual(ranking(s).map((p) => p.id), ['b', 'c', 'a']);
});

test('torneo: cada error quita una vida y abre ronda nueva', () => {
  let s = start({ mode: 'tournament', lives: 2 });
  s = gameReducer(s, { type: 'MISTAKE', playerId: 'b' });
  assert.equal(s.players[1].lives, 1);
  assert.equal(s.players[1].out, false);
  s = gameReducer(s, { type: 'CONTINUE', deck: ['X', 'Y', 'Z', 'A', 'B', 'C', 'D'], category: 'Países' });
  assert.equal(s.round, 2);
  assert.equal(s.category, 'Países');
  assert.equal(s.turn, 2);
  assert.deepEqual(s.slots, ['X', 'Y', 'Z', 'A', 'B', 'C']);
});

test('deshacer regresa la letra y el turno', () => {
  let s: GameState = start();
  s = gameReducer(s, { type: 'TAP', slot: 0, refill: [] });
  s = gameReducer(s, { type: 'PAUSE' });
  s = gameReducer(s, { type: 'UNDO' });
  assert.equal(s.status, 'ready');
  assert.equal(s.turn, 0);
  assert.equal(s.slots[0], 'A');
});

test('pausa congela el tiempo', () => {
  let s = start();
  s = gameReducer(s, { type: 'PAUSE' });
  s = gameReducer(s, { type: 'TICK', dt: 50_000 });
  assert.equal(s.status, 'paused');
  s = gameReducer(s, { type: 'RESUME' });
  assert.equal(s.status, 'playing');
  assert.equal(s.timeLeft, 10_000);
});
