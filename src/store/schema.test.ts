/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEFAULT_SETTINGS, migrateV1, sanitizeState } from './schema';

test('datos corruptos se recuperan con valores por defecto', () => {
  const s = sanitizeState({ players: [{ id: 1 }, null, { id: 'x', name: '   ' }], settings: { turnSeconds: 999, sound: 'sí' } });
  assert.deepEqual(s.players, []);
  assert.equal(s.settings.turnSeconds, DEFAULT_SETTINGS.turnSeconds);
  assert.equal(s.settings.sound, true);
  assert.deepEqual(sanitizeState('basura').players, []);
});

test('los nombres se limpian y recortan', () => {
  const s = sanitizeState({ players: [{ id: 'a', name: '  Ana    María de la Luz Pérez ' }] });
  assert.equal(s.players[0].name, 'Ana María de l');
});

test('migración desde la versión 1 conserva jugadores, animal y victorias', () => {
  const s = migrateV1([{ id: '1', name: 'Ana', animal: 'ajolote', wins: 4 }], { turnSeconds: 15, haptics: false });
  assert.equal(s.players[0].look.animal, 'ajolote');
  assert.equal(s.players[0].career.wins, 4);
  assert.equal(s.settings.turnSeconds, 15);
  assert.equal(s.settings.haptics, false);
});

test('paquetes desconocidos se descartan', () => {
  const s = sanitizeState({ settings: { enabledPacks: ['clasicas', 'no-existe', 'custom'] } });
  assert.deepEqual(s.settings.enabledPacks, ['clasicas', 'custom']);
});
