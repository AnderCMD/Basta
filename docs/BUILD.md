# Compilación y optimización

## APK para instalar directo (sin tiendas)

### Con EAS (en la nube, cuenta gratuita de Expo)

```bash
npx eas-cli@latest login
npx eas-cli@latest build --platform android --profile preview
```

El perfil `preview` de `eas.json` genera un **.apk** con distribución interna. Descárgalo desde el enlace que imprime EAS e instálalo en el teléfono.

### Local (Android Studio + JDK 17)

```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
# APK en android/app/build/outputs/apk/release/
```

Las carpetas `android/` e `ios/` se generan (Continuous Native Generation) y están en `.gitignore`: **no se editan a mano**, toda la configuración vive en `app.config.ts`.

## iOS

- Simulador: `npx expo run:ios`.
- Dispositivo físico: necesitas una cuenta de Apple Developer y `eas build --platform ios --profile preview`.

## Optimizaciones del APK

| Optimización | Dónde | Efecto |
| --- | --- | --- |
| R8 (minify) + shrink resources | `expo-build-properties` en `app.config.ts` | Quita código Java/Kotlin y recursos sin usar |
| PNG crunch | `enablePngCrunchInReleaseBuilds` | Comprime imágenes |
| Solo `arm64-v8a` y `armeabi-v7a` | `buildArchs` | Sin librerías x86 de emuladores Intel (APK mucho más chico) |
| Hermes | Por defecto en Expo | Bytecode precompilado: arranque más rápido |
| Fuentes recortadas | `scripts/subset-fonts.sh` | SF Pro Rounded de 2.3 MB → ~41 KB por peso; FA Brands → 1 KB |
| Sonidos sintetizados | `scripts/generate-sounds.mjs` | 6 estilos × 8 efectos WAV mono (≈ 670 KB en total) |
| Sin permisos extra | `blockedPermissions` + `expo-audio` sin micrófono | Sin `RECORD_AUDIO` |
| SVG en vez de imágenes | Avatares, accesorios e íconos | Cero PNG para personajes |

> Si quieres un APK por arquitectura (aún más pequeño), usa un **AAB** (`eas build --profile production`) o activa *splits* de ABI.

## Versión

Cambia solo `"version"` en `package.json`. `app.config.ts` deriva `versionCode` (Android) y `buildNumber` (iOS).

## Fuentes

`scripts/subset-fonts.sh` recorta SF Pro Rounded a los caracteres del español:

```bash
pip install fonttools
SF_DIR="/ruta/a/San Francisco Pro Rounded Fonts" ./scripts/subset-fonts.sh
```

## Sonidos

```bash
npm run sounds   # regenera assets/sounds/<estilo>/*.wav y src/lib/soundPacks.ts
```

Para crear un estilo nuevo agrega una entrada a `PACKS` en el script y su descripción en `SOUND_PACKS` (`src/lib/sound.ts`) y en `SOUND_PACK_IDS` (`src/store/schema.ts`).

## Publicar una versión

1. Cambia `version` en `package.json` y agrega la entrada en `CHANGELOG.md`.
2. Abre un PR de `dev` → `main` y fusiónalo (`main` está protegida: no acepta push directo):
   ```bash
   gh pr create --base main --head dev --title "release: vX.Y.Z" --fill
   gh pr merge --merge
   ```
3. Crea y sube la etiqueta sobre `main` actualizada:
   ```bash
   git checkout main && git pull
   git tag -a vX.Y.Z -m "Basta vX.Y.Z" && git push origin vX.Y.Z
   ```
4. El workflow **Release APK** (`.github/workflows/release.yml`) compila el APK en GitHub Actions y lo publica en *Releases* como `basta-vX.Y.Z.apk`, con las notas de `CHANGELOG.md`.

> El APK se firma con la llave de depuración que genera `expo prebuild`: sirve para instalarlo directo, no para Play Store. Para Play Store usa `eas build --profile production` con tu propia llave.
