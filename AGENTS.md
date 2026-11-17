# Basta — guía para agentes

Juego de palabras "Basta" para Android/iOS con un solo dispositivo al centro de la mesa. Expo SDK 58, React Native 0.88, TypeScript estricto, Expo Router, Reanimated 4. Textos en español de México.

- Arquitectura completa: `docs/ARCHITECTURE.md`. Grafo de código: `graphify-out/`.
- Motor puro en `src/features/game/engine.ts` (sin Math.random ni timers: la aleatoriedad llega en las acciones). Pruebas junto a cada módulo (`*.test.ts`, `npm test` con `node --import tsx --test`).
- UI: usa siempre `src/components/ui` (AppText, Button, Card, Stepper…) y los tokens de `src/lib/theme.ts`. Tipografía por familia (`fonts.black`), nunca `fontWeight`. Íconos solo con `<Icon>` (Font Awesome 7), sin emojis.
- Responsivo con `useLayout()` de `src/lib/responsive.ts`.
- Datos persistidos: `src/store/schema.ts` (validación + migraciones). Si cambias la forma de los datos, sube `SCHEMA_VERSION` y agrega migración + prueba.
- Animaciones con Reanimated: usa `.get()/.set()` en valores compartidos dentro de handlers (reglas de React Compiler).
- Versión: solo en `package.json` (la lee `app.config.ts`).
- Ramas: `main` (estable, protegida: solo por PR `dev` → `main`, nunca push directo ni force-push) y `dev` (desarrollo). Los PR de cambios van a `dev`. Releases: ver `docs/BUILD.md`.
- Antes de terminar: `npm run check`.

---


This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
