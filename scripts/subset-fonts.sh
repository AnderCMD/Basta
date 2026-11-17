#!/usr/bin/env bash
# Recorta SF Pro Rounded a caracteres latinos (español) para reducir el tamaño del APK.
# Uso: SF_DIR="/ruta/a/San Francisco Pro Rounded Fonts" ./scripts/subset-fonts.sh
# Requiere: pip install fonttools
set -euo pipefail
SF_DIR="${SF_DIR:?Define SF_DIR con la carpeta de SF Pro Rounded}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/assets/fonts"
UNICODES="U+0020-007E,U+00A0-00FF,U+0152-0153,U+2013-2014,U+2018-201E,U+2022,U+2026,U+20AC,U+00BF,U+00A1"
for w in Regular Medium Semibold Bold Heavy Black; do
  python3 -m fontTools.subset "$SF_DIR/SF-Pro-Rounded-$w.otf" \
    --unicodes="$UNICODES" --layout-features='kern,liga,calt,ccmp,locl,mark,mkmk' \
    --no-hinting --desubroutinize \
    --output-file="$OUT/SF-Pro-Rounded-$w.otf"
done
ls -la "$OUT"
