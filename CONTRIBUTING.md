# Cómo contribuir

¡Gracias por querer mejorar **Basta**!

## Flujo de ramas

- `main` → estable y **protegida**: solo recibe cambios por Pull Request (sin push directo ni force-push, aplica también a administradores). Cada PR recibe revisión automática de Copilot.
- `dev` → integración (protegida contra borrado y force-push). Todas las ramas nuevas salen de aquí.
- Las ramas de los PR se borran solas al fusionarse.

```bash
git checkout dev
git pull
git checkout -b feature/mi-cambio
# ...cambios...
git push -u origin feature/mi-cambio
```

Abre un Pull Request **hacia `dev`**. Cuando `dev` está estable se abre un PR de `dev` → `main`.

Nombres sugeridos: `feature/...`, `fix/...`, `docs/...`.

## Antes de abrir el PR

```bash
npm run check   # typecheck + lint + pruebas
```

El CI de GitHub Actions corre lo mismo en cada PR.

## Guía rápida

- Instala paquetes con `npx expo install <paquete>` para obtener versiones compatibles con el SDK.
- Lee [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) antes de un cambio grande.
- La lógica del juego vive en `src/features/game/engine.ts` y es un reducer puro: si cambias reglas, agrega una prueba en `engine.test.ts`.
- Usa los componentes de `src/components/ui` (AppText, Button, Card…) y los tokens de `src/lib/theme.ts`; nada de colores o tamaños sueltos.
- Íconos solo de Font Awesome vía `<Icon>`, sin emojis en la interfaz.
- Textos de la interfaz en español de México.
- Avatares y accesorios: [docs/AVATARS.md](docs/AVATARS.md). Categorías: [docs/CATEGORIES.md](docs/CATEGORIES.md).
- Para publicar una versión cambia solo `version` en `package.json` y agrega una entrada en `CHANGELOG.md`.

## Reportar errores

Usa las plantillas de *Issues*, con pasos para reproducir y el dispositivo (Android/iOS, versión).
