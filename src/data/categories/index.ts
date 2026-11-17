import { shuffle, type Random } from '../../lib/random';
import { GENERATED_PACKS } from './generators';
import { HANDWRITTEN_PACKS, type CategoryPack } from './packs';

export type { CategoryPack } from './packs';

/** Categoría usada cuando las categorías están desactivadas. */
export const FREE_CATEGORY = 'Cualquier palabra';

/** Todos los paquetes disponibles: primero los escritos a mano, luego los generados. */
export const CATEGORY_PACKS: CategoryPack[] = [...HANDWRITTEN_PACKS, ...GENERATED_PACKS];

/** Paquete virtual con las categorías propias del usuario. */
export const CUSTOM_PACK_ID = 'custom';

export const ALL_PACK_IDS = CATEGORY_PACKS.map((p) => p.id);

/** Lista de categorías únicas de los paquetes activos (+ personalizadas). */
export function collectCategories(enabledPackIds: readonly string[], custom: readonly string[] = []): string[] {
  const set = new Set<string>();
  for (const pack of CATEGORY_PACKS) {
    if (!enabledPackIds.includes(pack.id)) continue;
    for (const c of pack.categories) set.add(c);
  }
  if (enabledPackIds.includes(CUSTOM_PACK_ID)) for (const c of custom) if (c.trim()) set.add(c.trim());
  return [...set];
}

/** Total de categorías únicas de todos los paquetes incluidos. */
export const TOTAL_CATEGORIES = collectCategories(ALL_PACK_IDS).length;

/**
 * Crea un repartidor de categorías: baraja la lista y la recorre sin repetir
 * hasta agotarla (después vuelve a barajar).
 */
export function createCategoryDealer(categories: readonly string[], random: Random = Math.random) {
  let pool: string[] = [];
  return () => {
    if (categories.length === 0) return FREE_CATEGORY;
    if (pool.length === 0) pool = shuffle(categories, random);
    return pool.pop() ?? FREE_CATEGORY;
  };
}
