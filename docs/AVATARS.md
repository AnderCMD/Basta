# Avatares

Todos los avatares son **SVG originales** de este proyecto, dibujados en un espacio de **100 × 100** con `react-native-svg`.

## Partes

| Parte | Archivo | Cantidad |
| --- | --- | --- |
| Animales | `src/components/avatar/animals.tsx` | 16 (gato, perro, zorro, panda, león, rana, búho, cerdo, oso, conejo, koala, tigre, mono, pingüino, pollito, ajolote) |
| Sombreros | `accessories.tsx` → `HATS` | 13 (sombrero charro, gorra, corona, copa, fiesta, vaquero, gorro de lana, moño, chef, birrete, flores, vikingo, mago) |
| Lentes | `accessories.tsx` → `GLASSES` | 8 (redondos, sol, corazón, estrella, 3D, monóculo, pasta, antifaz) |
| Extras | `accessories.tsx` → `EXTRAS` | 8 (corbatín, bigote, bufanda, paliacate, audífonos, perlas, medalla, brillitos) |
| Fondos | `AVATAR_BACKGROUNDS` | 12 colores + el original |

Un jugador guarda su apariencia como `AvatarLook`:

```ts
{ animal: 'ajolote', hat: 'sombrero', glasses: null, extra: 'paliacate', bg: null }
```

## Anclas

Cada animal declara `anchors` para que cualquier accesorio quede bien en cualquier cabeza:

| Ancla | Uso |
| --- | --- |
| `top` | Parte superior de la cabeza → sombreros |
| `eyeY`, `eyeDX` | Altura de los ojos y distancia al centro → lentes |
| `mouthY` | Boca → bigote |
| `chinY` | Barbilla → corbatín, bufanda, collar, medalla |

## Agregar un animal

1. Añade su id al tipo `AnimalId`.
2. Agrega la entrada en `ANIMALS` con `name`, `bg`, `anchors` y `draw()` (usa `<Eyes>`, `<Cheeks>` y `<Smile>` para mantener el estilo).
3. Revisa en el editor de jugadores que todos los sombreros y lentes se vean bien; ajusta las anclas si no.

## Agregar un accesorio

Agrega un objeto `{ id, name, draw: (a) => <G>…</G> }` a `HATS`, `GLASSES` o `EXTRAS` usando las anclas `a`. Aparece automáticamente en el editor y en el avatar aleatorio.

## Orden de dibujo

Fondo → animal → extra → lentes → sombrero → aro. El componente `<Avatar>` está memorizado porque se dibuja muchas veces por pantalla.
