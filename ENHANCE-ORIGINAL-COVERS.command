#!/bin/bash
# Run with bash on macOS. No changes are made to GitHub or to the originals.
set -u
cd "$(dirname "$0")" || exit 1
OUT="$PWD/assets/covers"
BACKUP="$PWD/original-covers-backup"
mkdir -p "$OUT" "$BACKUP"
SOURCE="${1:-}"
BASE="https://myreadshelf.vercel.app/assets/covers"
IDS=(
  readshelf-demo
  pride-and-prejudice
  sense-and-sensibility
  emma
  persuasion
  frankenstein
  dracula
  great-gatsby
  dorian-gray
  sherlock-holmes
  alice-wonderland
  little-women
  moby-dick
  jane-eyre
  wuthering-heights
  jekyll-hyde
  the-time-machine
  war-of-the-worlds
  wizard-of-oz
  christmas-carol
  great-expectations
  huckleberry-finn
  secret-garden
  call-of-the-wild
  anne-green-gables
)
fail=0
count=0
if ! command -v sips >/dev/null 2>&1; then echo "This installer needs macOS sips."; exit 1; fi
# Pillow, when already installed, provides Lanczos and mild sharpening.
if command -v python3 >/dev/null 2>&1 && python3 -c 'import PIL' >/dev/null 2>&1; then
  USE_PIL=1
  echo "Using Pillow: Lanczos resizing and mild sharpening."
else
  USE_PIL=0
  echo "Using macOS sips: high-quality JPEG resizing, no AI redraw."
fi
for id in "${IDS[@]}"; do
  name="$id.jpg"
  original="$BACKUP/$name"
  tmp="$OUT/.${id}.tmp.jpg"
  if [[ ! -s "$original" ]]; then
    if [[ -n "$SOURCE" && -f "$SOURCE/$name" ]]; then
      cp "$SOURCE/$name" "$original"
    elif ! curl -fLsS --retry 2 --connect-timeout 15 --max-time 90 "$BASE/$name" -o "$original"; then
      echo "FAILED download: $name"; rm -f "$original"; fail=$((fail+1)); continue
    fi
  fi
  if ! sips -g pixelHeight -g pixelWidth "$original" >/dev/null 2>&1; then
    echo "FAILED image validation: $name"; rm -f "$original"; fail=$((fail+1)); continue
  fi
  if [[ "$USE_PIL" == 1 ]]; then
    python3 - "$original" "$tmp" <<'PYIMG'
import sys
from PIL import Image, ImageOps, ImageFilter
im = ImageOps.exif_transpose(Image.open(sys.argv[1])).convert('RGB')
w,h = im.size
scale = max(1, 1995/max(w,h))
if scale > 1:
    im = im.resize((round(w*scale),round(h*scale)),Image.Resampling.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.1,percent=70,threshold=3))
im.save(sys.argv[2],quality=95,subsampling=0,optimize=True)
PYIMG
    ok=$?
  else
    width=$(sips -g pixelWidth "$original" | awk '/pixelWidth:/ {print $2}')
    height=$(sips -g pixelHeight "$original" | awk '/pixelHeight:/ {print $2}')
    if [[ "$height" =~ ^[0-9]+$ && "$width" =~ ^[0-9]+$ ]] && (( height < 1995 && width < 1995 )); then
      sips -Z 1995 -s format jpeg -s formatOptions best "$original" --out "$tmp" >/dev/null
      ok=$?
    else
      cp "$original" "$tmp"; ok=$?
    fi
  fi
  if [[ "$ok" == 0 && -s "$tmp" ]] && sips -g pixelWidth "$tmp" >/dev/null 2>&1; then
    mv "$tmp" "$OUT/$name"; count=$((count+1)); echo "OK $name"
  else
    rm -f "$tmp"; fail=$((fail+1)); echo "FAILED enhancement: $name"
  fi
done
echo "Finished: $count of 25 original covers prepared; $fail failed."
echo "Output: $OUT"
echo "Original backups: $BACKUP (do not upload this folder)."
if (( fail > 0 )); then exit 1; fi
