#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p assets/ebooks

valid_epub() {
  [ "$(unzip -p "$1" mimetype 2>/dev/null)" = "application/epub+zip" ] &&
  unzip -tq "$1" >/dev/null 2>&1 &&
  unzip -p "$1" META-INF/container.xml >/dev/null 2>&1
}

fetch_book() {
  local id="$1" slug="$2" dest="assets/ebooks/$2.epub" tmp="assets/ebooks/$2.epub.part" url
  if [ -f "$dest" ] && valid_epub "$dest"; then
    echo "Already ready: $slug"
    return 0
  fi
  rm -f "$tmp"
  echo "Downloading $slug from Project Gutenberg..."
  for url in "https://www.gutenberg.org/ebooks/${id}.epub.images" "https://www.gutenberg.org/cache/epub/${id}/pg${id}-images.epub" "https://www.gutenberg.org/ebooks/${id}.epub3.images"; do
    if curl -fL --retry 2 --connect-timeout 15 --max-time 180 -A 'ReadShelf educational project (manual download)' -o "$tmp" "$url" && valid_epub "$tmp"; then
      mv "$tmp" "$dest"
      echo "Verified: $dest"
      return 0
    fi
    rm -f "$tmp"
  done
  echo "ERROR: Unable to retrieve $slug. Download the EPUB from https://www.gutenberg.org/ebooks/$id and save as $dest." >&2
  return 1
}

fail=0
fetch_book 120 treasure-island || fail=1
fetch_book 1184 count-of-monte-cristo || fail=1
fetch_book 74 tom-sawyer || fail=1
fetch_book 2852 hound-of-baskervilles || fail=1
fetch_book 236 jungle-book || fail=1

if [ "$fail" -ne 0 ]; then
  echo "One or more EPUBs are missing. Do not upload the new catalog until all five are present."
  exit 1
fi
echo "All five EPUBs are ready. Upload assets/ebooks/*.epub, assets/covers/*.jpg and js/installed-books.js to their corresponding GitHub folders."
