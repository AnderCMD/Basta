# Categorías

Hay **2,146 categorías únicas** en **36 paquetes**. Cada paquete se puede activar o desactivar en la pantalla *Categorías*, y cada quien puede agregar las suyas.

## Paquetes escritos a mano (`src/data/categories/packs.ts`)

Clásicas · Comida y bebida · Hecho en México · Geografía y viajes · Animales y naturaleza · Cine, TV y series · Música · Deportes · En casa · Escuela · Trabajo y oficios · Ciencia y tecnología · Historia y cultura · Moda y belleza · Cuerpo y salud · Transporte · Fiestas y celebraciones · Para niños · Para expertos · Locas y divertidas · Personas y personajes · Arte y creatividad · Juegos y pasatiempos · Sentimientos y vida.

Para agregar categorías basta con sumarlas al texto separado por `|`:

```ts
categories: l(`Frutas|Verduras|Mi categoría nueva`),
```

Para un paquete nuevo agrega un objeto con `id` único, `name`, `icon` (nombre de `components/Icon.tsx`) y `description`.

## Paquetes generados (`src/data/categories/generators.ts`)

Combinan una **plantilla** con una **lista**, por ejemplo:

| Plantilla | Lista | Ejemplo |
| --- | --- | --- |
| `Cosas que hay en {x}` | 170+ lugares | Cosas que hay en un circo |
| `Cosas que se pueden {x}` | 150+ verbos | Cosas que se pueden inflar |
| `Cosas que usa / dice {x}` | 100+ oficios y personajes | Cosas que dice un taquero |
| `Palabras relacionadas con {x}` | 350+ temas | Palabras relacionadas con Oaxaca |
| `Cosas {x}` | 100 cualidades | Cosas pegajosas |

Para crecer la lista solo agrega elementos a la constante correspondiente (`PLACES`, `VERBS`, `TOPICS`…). Cuida el artículo y el género ("un hospital", "una escuela").

## Reglas que verifican las pruebas

`src/data/categories/categories.test.ts` comprueba que haya **al menos 2,000** categorías únicas, que los ids de paquetes no se repitan, que no haya espacios sobrantes y que el repartidor no repita hasta agotar la lista. Corre `npm test` después de editar.

## Cómo se eligen en el juego

`createCategoryDealer` baraja las categorías activas y las reparte sin repetir hasta agotarlas; después vuelve a barajar.
