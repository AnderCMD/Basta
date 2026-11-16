# Cómo contribuir

¡Gracias por querer mejorar **Basta**!

## Flujo de ramas

- `main` → estable. No se hace push directo.
- `dev` → integración. Todas las ramas nuevas salen de aquí.

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
npm run typecheck
npm run lint
npm test
```

El CI de GitHub Actions corre lo mismo en cada PR.

## Guía rápida

- Instala paquetes con `npx expo install <paquete>` para obtener versiones compatibles con el SDK.
- La lógica del juego vive en `src/lib/game.ts` y es un reducer puro: si cambias reglas, agrega una prueba en `src/lib/game.test.ts`.
- Textos de la interfaz en español de México.
- Nuevos animales: agrégalos en `src/components/AnimalAvatar.tsx` (SVG en un `viewBox` de 100×100).
- Nuevas categorías: `src/lib/categories.ts`.

## Reportar errores

Usa las plantillas de *Issues*, con pasos para reproducir y el dispositivo (Android/iOS, versión).
