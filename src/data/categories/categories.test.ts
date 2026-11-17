/// <reference types="node" />
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ALL_PACK_IDS, CATEGORY_PACKS, collectCategories, createCategoryDealer, CUSTOM_PACK_ID, TOTAL_CATEGORIES } from './index';

test('hay miles de categorías únicas', () => {
  assert.ok(TOTAL_CATEGORIES >= 2000, `solo hay ${TOTAL_CATEGORIES}`);
});

test('los ids de paquetes son únicos y ningún paquete está vacío', () => {
  assert.equal(new Set(ALL_PACK_IDS).size, ALL_PACK_IDS.length);
  for (const p of CATEGORY_PACKS) assert.ok(p.categories.length > 0, p.id);
});

test('ninguna categoría tiene espacios sobrantes ni está vacía', () => {
  for (const p of CATEGORY_PACKS)
    for (const c of p.categories) {
      assert.equal(c, c.trim(), `${p.id}: "${c}"`);
      assert.ok(!c.includes('  '), `${p.id}: "${c}"`);
      assert.ok(c.length >= 3, `${p.id}: "${c}"`);
    }
});

test('solo se usan los paquetes activos y las personalizadas', () => {
  const only = collectCategories(['clasicas']);
  assert.ok(only.includes('Frutas'));
  assert.ok(!only.includes('Cosas que hay en un hospital'));
  const withCustom = collectCategories(['clasicas', CUSTOM_PACK_ID], ['Cosas de la abuela']);
  assert.ok(withCustom.includes('Cosas de la abuela'));
});

test('el repartidor no repite hasta agotar la lista', () => {
  const deal = createCategoryDealer(['a', 'b', 'c']);
  const seen = new Set([deal(), deal(), deal()]);
  assert.equal(seen.size, 3);
});
