# Modos, reglas y puntos

## Turno básico

1. El jugador en turno dice una palabra de la **categoría** que empiece con una de las **6 letras** visibles.
2. Toca esa letra: sale del tablero, entra la siguiente del mazo y el turno pasa al siguiente jugador con el reloj completo.
3. Cuando se usan todas las letras del abecedario, se reparte de nuevo (una "vuelta").
4. Si el reloj llega a 0 → **falla por tiempo**. Si los demás deciden que la palabra no vale → **Pausa → Alguien se equivocó**.

## Modos

| Modo | Mín. jugadores | Al fallar | Termina cuando |
| --- | --- | --- | --- |
| **Clásico** | 2 | Quedas eliminado; los demás siguen con las mismas letras | Queda uno |
| **Torneo** | 2 | Pierdes una vida; ronda nueva (letras y categoría nuevas) | Queda uno con vidas |
| **Puntos** | 1 | Pierdes hasta 20 puntos; ronda nueva | Se juegan las N rondas |
| **Equipos** | 4 | El equipo pierde una vida; ronda nueva | Queda un equipo |

En **Equipos** los integrantes se turnan en orden: equipo A (jugador 1) → equipo B (jugador 1) → equipo A (jugador 2)…

## Modificadores (combinables)

- **Turbo**: cada letra jugada quita 0.3 s al turno, hasta un mínimo de 3 s. Se reinicia en cada ronda.
- **Caos**: la categoría cambia en cada turno.
- **Letras doradas**: cada ficha nueva tiene 12 % de probabilidad de salir dorada; vale el doble.

## Comodines

Cada competidor tiene de 0 a 3. Se usan desde el banner del turno:

- **Pasar** (⏩): el turno pasa al siguiente sin tocar letra.
- **Más tiempo** (⏳): +5 segundos al reloj actual.

## Puntos por letra

```
puntos = (10 × valor de la letra) + rapidez + racha        (×2 si es dorada)
```

- **Valor**: 1 letras comunes · 2 medias (F, G, H, J, U, V, Z, CH, LL) · 3 difíciles (K, Ñ, Q, W, X, Y).
- **Rapidez**: hasta +10, proporcional al tiempo que te sobró.
- **Racha**: +2 por cada acierto seguido previo (máx. +20). Se pierde al fallar.

## Jueces (menú de pausa)

- **Alguien se equivocó**: aplica la falla a quien elijas (no solo al que tiene el turno).
- **Sacar**: elimina a alguien de inmediato (por ejemplo, si se tiene que ir).
- **Deshacer**: regresa hasta 10 pasos (letras, comodines o fallas).
- **Cambiar categoría** y **Reiniciar letras**.

## Premios de fin de partida

MVP (más puntos) · Rayo (respuesta más rápida) · En racha (mejor racha ≥ 2) · Palabrero (más letras) · Valiente (más letras difíciles) · Toque de oro (más doradas) · Constante (mejor promedio con ≥ 3 letras).

## Logros permanentes

22 logros en 4 niveles (bronce, plata, oro, diamante), por ejemplo: *Primera victoria*, *Intocable* (ganar un torneo sin perder vidas), *Relámpago* (responder en < 0.8 s), *Diccionario andante* (1,000 letras). Ver `src/features/stats/achievements.ts`.
