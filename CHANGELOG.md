# Cambios

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [SemVer](https://semver.org/lang/es/).

## [1.0.0] - 2026-11-16

Primera versión pública. El APK está adjunto en la [release v1.0.0](https://github.com/AnderCMD/Basta/releases/tag/v1.0.0).

### Juego
- Un solo dispositivo al centro de la mesa, con el turno visible desde ambos lados.
- 6 letras del abecedario de México (27 con Ñ; opción CH/LL o sin letras difíciles) alrededor del reloj.
- Modos **Clásico**, **Torneo**, **Puntos** y **Equipos** (2–4 equipos que se turnan).
- Modificadores **Turbo**, **Caos** y **Letras doradas**; **comodines** para pasar turno o ganar 5 segundos.
- Jueces en la pausa: marcar errores, sacar jugadores, deshacer hasta 10 pasos, cambiar categoría o letras.
- **Puntuación** por letra, rapidez y rachas; **premios** de fin de partida, **22 logros** y **Salón de la fama**.
- **2,146 categorías** en 36 paquetes activables, buscador y categorías propias.

### Personalización
- **Avatares**: 16 animales con 13 sombreros, 8 lentes, 8 extras y 12 fondos.
- **6 estilos de sonido** (Clásico, Suave, Burbujas, Madera, Campanitas y Mínimo), volumen y tic-tac final opcional.
- Vibración configurable.

### Técnico
- Expo SDK 58, React Native 0.88, Reanimated 4, TypeScript estricto y pruebas del motor.
- Diseño responsivo para teléfono y tableta, vertical y horizontal.
- Datos guardados con esquema versionado y validación.
- APK optimizado: R8, shrink de recursos, solo ARM, fuentes recortadas y sin permiso de micrófono.
