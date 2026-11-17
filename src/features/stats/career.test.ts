/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MX_ALPHABET } from '../../data/alphabet';
import { computeAwards } from '../game/awards';
import { createGame, gameReducer, type CompetitorInput } from '../game/engine';
import { applyGameToCareers } from './career';

const solo = (id: string): CompetitorInput<null> => ({ id, name: id, color: '#fff', members: [{ id, name: id, look: null }] });

test('una partida terminada suma estadísticas y desbloquea logros', () => {
  let s = createGame(
    { mode: 'tournament', turnSeconds: 10, lives: 1, rounds: 3, wildcards: 0, modifiers: { turbo: false, chaos: false, golden: false } },
    [solo('a'), solo('b')],
    [...MX_ALPHABET],
    'Frutas',
  );
  s = gameReducer(s, { type: 'START' });
  s = gameReducer(s, { type: 'TICK', dt: 500 });
  s = gameReducer(s, { type: 'PLAY', slot: 0, refill: [], nextCategory: 'x', golden: false });
  s = gameReducer(s, { type: 'MISTAKE', competitorId: 'b' });
  assert.equal(s.status, 'finished');

  const updates = applyGameToCareers(s, computeAwards(s), {});
  const a = updates.find((u) => u.playerId === 'a')!;
  const b = updates.find((u) => u.playerId === 'b')!;
  assert.equal(a.career.wins, 1);
  assert.equal(a.career.tournamentWins, 1);
  assert.equal(a.career.flawlessWins, 1);
  assert.equal(a.career.fastestMs, 500);
  assert.ok(a.newAchievements.includes('primera-victoria'));
  assert.ok(a.newAchievements.includes('rayo'));
  assert.ok(a.newAchievements.includes('relampago'));
  assert.equal(b.career.wins, 0);
  assert.deepEqual(b.newAchievements, ['debut']);
});
