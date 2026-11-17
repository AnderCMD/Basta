# Marca

| Archivo | Tamaño | Uso |
| --- | --- | --- |
| `docs/branding/logo.png` | 1600 × 420 | Logotipo "¡BASTA!" de fichas |
| `docs/branding/banner.png` | 1600 × 520 | Encabezado del README |
| `docs/branding/social-preview.png` | 1280 × 640 | Vista previa al compartir el repositorio |
| `assets/icon.png` | 1024 × 1024 | Ícono de la app |

## Poner el social preview en GitHub

GitHub no permite configurarlo por API: ve a **Settings → General → Social preview → Edit → Upload an image** y elige `docs/branding/social-preview.png`.

## Regenerar las imágenes

Las imágenes salen de la ruta de desarrollo `src/app/brand.tsx`, que usa los mismos componentes que la app (logo, avatares, fuentes, íconos):

```bash
npx expo start --web --port 8081   # en otra terminal
npm run brand
```

## Colores

| Token | Color |
| --- | --- |
| Fondo | `#1A0B3D` → `#2E0F6E` → `#4A148C` |
| Rosa | `#FF4D8D` |
| Amarillo | `#FFD23F` |
| Verde | `#2EE6A6` |
| Azul | `#3DA5FF` |
| Morado | `#9B5CFF` |

Tipografía: SF Pro Rounded (Black/Heavy para títulos). Íconos: Font Awesome Free 7 (sólidos).
