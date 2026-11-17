#!/usr/bin/env bash
# Genera las imágenes de marca (docs/branding) con Chrome sin interfaz.
# Requiere el servidor web de desarrollo corriendo:  npx expo start --web --port 8081
set -euo pipefail
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
URL="${URL:-http://localhost:8081}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/docs/branding"
mkdir -p "$OUT"
shot() { # nombre ancho alto kind
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --default-background-color=00000000 \
    --virtual-time-budget=20000 --window-size="$2,$3" --screenshot="$OUT/$1.png" "$URL/brand?kind=$4" >/dev/null 2>&1
  echo "✓ $1.png ($2×$3)"
}
shot social-preview 1280 640 social
shot banner 1600 520 banner
shot logo 1600 420 logo
