# Cambios

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y [SemVer](https://semver.org/lang/es/).

## [2.0.0] - 2026-11-16

### Agregado
- Modos **Puntos** y **Equipos** (2–4 equipos que se turnan y comparten vidas).
- Modificadores **Turbo**, **Caos** y **Letras doradas**.
- **Comodines**: pasar turno o +5 segundos.
- **Puntuación** por letra, rapidez, rachas y letras doradas, con "+puntos" animados.
- **Premios** de fin de partida y **22 logros** permanentes; **Salón de la fama** con marcadores e historial.
- **Avatares personalizables**: 13 sombreros, 8 lentes, 8 extras y 12 fondos, con avatar aleatorio.
- **2,146 categorías** en 36 paquetes activables, buscador y categorías propias.
- Jueces: **sacar** a un jugador y **deshacer** hasta 10 pasos.
- **Efectos de sonido** sintetizados y vibración configurables.
- Distribuciones para **tableta** y **teléfono en horizontal**.
- Animaciones con **Reanimated 4**: fichas con resorte, reloj animado, confeti, temblor al fallar.
- Tipografía **SF Pro Rounded** recortada e íconos **Font Awesome 7** (sin emojis).
- Logo, banner y social preview; documentación completa en `docs/` y grafo de código con graphify.
- Versión única desde `package.json` (`app.config.ts`).

### Cambiado
- Arquitectura por funcionalidades (`features/`), kit de componentes reutilizables (`components/ui`) y motor puro con pruebas.
- Datos guardados con esquema versionado, validación y migración automática desde la v1.
- APK optimizado: R8, shrink de recursos, solo ARM, fuentes recortadas y sin permisos de micrófono.

## [1.0.0] - 2026-11-16

- Primera versión: partida rápida, torneo con vidas, 16 animales, 45 categorías, pausa con errores y deshacer.
