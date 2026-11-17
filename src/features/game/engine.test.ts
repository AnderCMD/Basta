/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildAlphabet, MX_ALPHABET } from '../../data/alphabet';
import { computeAwards } from './awards';
import {
  createGame,
  currentMember,
  gameReducer,
  MIN_TURN_MS,
  ranking,
  scorePlay,
  type CompetitorInput,
  type GameAction,
  type GameConfig,
  type GameState,
} from './engine';

const ABC = [...MX_ALPHABET];
const solo = (id: string): CompetitorInput<null> => ({ id, name: id.toUpperCase(), color: '#fff', members: [{ id, name: id, look: null }] });
const players = [solo('a'), solo('b'), solo('c')];

const cfg = (over: Partial<GameConfig> = {}): GameConfig => ({
  mode: 'classic',
  turnSeconds: 10,
  lives: 3,
  rounds: 3,
  wildcards: 1,
  modifiers: { turbo: false, chaos: false, golden: false },
  ...over,
});

const play = (slot: number, over: Partial<Extract<GameAction<null>, { type: 'PLAY' }>> = {}): GameAction<null> => ({
  type: 'PLAY',
  slot,
  refill: [...ABC],
  nextCategory: 'Otra',
  golden: false,
  ...over,
});

const start = (over: Partial<GameConfig> = {}, comps = players) =>
  gameReducer(createGame(cfg(over), comps, [...ABC], 'Frutas'), { type: 'START' });

const letters = (s: GameState<null>) => s.tiles.map((t) => t?.letter ?? null);

test('el abecedario mexicano tiene 27 letras con Ñ y opciones CH/LL', () => {
  assert.equal(MX_ALPHABET.length, 27);
  assert.ok(MX_ALPHABET.includes('Ñ'));
  const withDigraphs = buildAlphabet({ includeDigraphs: true, excludeHard: false });
  assert.equal(withDigraphs.length, 29);
  assert.equal(withDigraphs[withDigraphs.indexOf('C') + 1], 'CH');
  assert.equal(buildAlphabet({ includeDigraphs: false, excludeHard: true }).includes('W'), false);
});

test('se muestran 6 letras y al tocar una se reemplaza y pasa el turno', () => {
  let s = start();
  assert.deepEqual(letters(s), ['A', 'B', 'C', 'D', 'E', 'F']);
  s = gameReducer(s, play(2));
  assert.deepEqual(letters(s), ['A', 'B', 'G', 'D', 'E', 'F']);
  assert.deepEqual(s.used, ['C']);
  assert.equal(s.turn, 1);
  assert.equal(s.timeLeft, 10_000);
  assert.ok(s.competitors[0].score > 0);
  assert.equal(s.stats.a.letters, 1);
});

test('al acabarse el abecedario se vuelve a repartir', () => {
  let s = start();
  for (let i = 0; i < 27; i++) s = gameReducer(s, play(s.tiles.findIndex(Boolean)));
  assert.equal(s.lap, 2);
  assert.equal(s.tiles.filter(Boolean).length, 6);
  assert.equal(s.used.length, 0);
});

test('clásico: si se acaba el tiempo quedas fuera y gana el último', () => {
  let s = start();
  s = gameReducer(s, { type: 'TICK', dt: 10_000 });
  assert.equal(s.status, 'fail');
  assert.equal(s.competitors[0].out, true);
  s = gameReducer(s, { type: 'CONTINUE', deck: [], category: 'x', goldenSlots: [] });
  assert.equal(s.turn, 1);
  assert.equal(s.category, 'Frutas');
  s = gameReducer(s, { type: 'MISTAKE', competitorId: 'c' });
  assert.equal(s.status, 'finished');
  assert.deepEqual(ranking(s).map((c) => c.id), ['b', 'c', 'a']);
});

test('torneo: cada error quita una vida y abre ronda nueva', () => {
  let s = start({ mode: 'tournament', lives: 2 });
  s = gameReducer(s, { type: 'MISTAKE', competitorId: 'b' });
  assert.equal(s.competitors[1].lives, 1);
  assert.equal(s.competitors[1].out, false);
  s = gameReducer(s, { type: 'CONTINUE', deck: ['X', 'Y', 'Z', 'A', 'B', 'C', 'D'], category: 'Países', goldenSlots: [] });
  assert.equal(s.round, 2);
  assert.equal(s.category, 'Países');
  assert.equal(s.turn, 2);
  assert.deepEqual(letters(s), ['X', 'Y', 'Z', 'A', 'B', 'C']);
});

test('puntos: nadie sale, fallar resta y termina al llegar a las rondas', () => {
  let s = start({ mode: 'points', rounds: 2 });
  s = gameReducer(s, play(0));
  const scoreA = s.competitors[0].score;
  s = gameReducer(s, { type: 'MISTAKE', competitorId: 'a' });
  assert.equal(s.competitors[0].out, false);
  assert.equal(s.competitors[0].score, scoreA - Math.min(20, scoreA));
  s = gameReducer(s, { type: 'CONTINUE', deck: [...ABC], category: 'Y', goldenSlots: [] });
  s = gameReducer(s, { type: 'START' });
  s = gameReducer(s, play(0));
  s = gameReducer(s, { type: 'TICK', dt: 99_000 });
  assert.equal(s.status, 'finished');
  assert.equal(ranking(s)[0].score >= ranking(s)[1].score, true);
});

test('equipos: los integrantes se turnan y el equipo comparte vidas', () => {
  const teams: CompetitorInput<null>[] = [
    { id: 't1', name: 'Rojo', color: '#f00', members: [{ id: 'a', name: 'a', look: null }, { id: 'b', name: 'b', look: null }] },
    { id: 't2', name: 'Azul', color: '#00f', members: [{ id: 'c', name: 'c', look: null }, { id: 'd', name: 'd', look: null }] },
  ];
  let s = start({ mode: 'teams', lives: 1 }, teams);
  assert.equal(currentMember(s).id, 'a');
  s = gameReducer(s, play(0));
  assert.equal(currentMember(s).id, 'c');
  s = gameReducer(s, play(0));
  assert.equal(currentMember(s).id, 'b');
  s = gameReducer(s, { type: 'MISTAKE', competitorId: 't1' });
  assert.equal(s.status, 'finished');
  assert.equal(ranking(s)[0].id, 't2');
});

test('comodines: pasar turno y +5 segundos', () => {
  let s = start({ wildcards: 2 });
  s = gameReducer(s, { type: 'TICK', dt: 4000 });
  s = gameReducer(s, { type: 'WILDCARD', kind: 'time', nextCategory: 'x' });
  assert.equal(s.timeLeft, 11_000);
  s = gameReducer(s, { type: 'WILDCARD', kind: 'pass', nextCategory: 'x' });
  assert.equal(s.turn, 1);
  assert.equal(s.competitors[0].wildcards, 0);
  const again = gameReducer({ ...s, turn: 0 }, { type: 'WILDCARD', kind: 'pass', nextCategory: 'x' });
  assert.equal(again.turn, 0, 'sin comodines no se puede pasar');
});

test('turbo acelera el reloj hasta el mínimo y caos cambia la categoría', () => {
  let s = start({ turnSeconds: 4, modifiers: { turbo: true, chaos: true, golden: false } });
  for (let i = 0; i < 10; i++) s = gameReducer(s, play(0, { nextCategory: `Cat ${i}` }));
  assert.equal(s.turnMs, MIN_TURN_MS);
  assert.equal(s.category, 'Cat 9');
});

test('las letras doradas valen el doble', () => {
  assert.equal(scorePlay('A', 5000, 10_000, 0, true), scorePlay('A', 5000, 10_000, 0, false) * 2);
  let s = start({ modifiers: { turbo: false, chaos: false, golden: true } });
  s = gameReducer(s, play(0, { golden: true }));
  assert.equal(s.tiles[0]?.golden, true);
});

test('deshacer regresa la letra, el turno y los puntos', () => {
  let s = start();
  s = gameReducer(s, play(0));
  s = gameReducer(s, { type: 'PAUSE' });
  s = gameReducer(s, { type: 'UNDO' });
  assert.equal(s.status, 'ready');
  assert.equal(s.turn, 0);
  assert.equal(s.tiles[0]?.letter, 'A');
  assert.equal(s.competitors[0].score, 0);
});

test('sacar a un jugador lo elimina aunque tenga vidas', () => {
  let s = start({ mode: 'tournament', lives: 3 });
  s = gameReducer(s, { type: 'KICK', competitorId: 'a' });
  assert.equal(s.competitors[0].out, true);
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

test('premios de fin de partida', () => {
  let s = start();
  s = gameReducer(s, { type: 'TICK', dt: 1000 });
  s = gameReducer(s, play(0));
  s = gameReducer(s, { type: 'TICK', dt: 3000 });
  s = gameReducer(s, play(0));
  const awards = computeAwards(s);
  assert.equal(awards.find((a) => a.id === 'rayo')?.memberId, 'a');
  assert.ok(awards.some((a) => a.id === 'mvp'));
});
