#!/usr/bin/env python3
"""Download curated Standard Ebooks EPUB editions into this static ReadShelf site.

Run once from the repository root: python3 scripts/install_ebooks.py --limit 24
Only verified EPUB archives are placed in assets/ebooks and listed in js/installed-books.js.

Works are selected as believed public domain in the U.S.; check the jurisdiction where
books are served. This small educational import is intentionally limited and paced;
do not use it to bulk scrape the publisher.
"""
import argparse
import json
import pathlib
import sys
import time
import urllib.error
import urllib.request
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
CATALOG = ROOT / 'ebooks' / 'catalog.json'
DEST = ROOT / 'assets' / 'ebooks'
MANIFEST = ROOT / 'js' / 'installed-books.js'


def valid_epub(path):
    try:
        with zipfile.ZipFile(path) as archive:
            if archive.testzip():
                return False
            return archive.read('mimetype').strip() == b'application/epub+zip'
    except (OSError, KeyError, zipfile.BadZipFile):
        return False


def download_book(entry):
    slug = entry['slug']
    filename = slug.replace('/', '_') + '.epub'
    # Standard Ebooks download endpoints display an HTML interstitial unless source=download.
    url = f'https://standardebooks.org/ebooks/{slug}/downloads/{filename}?source=download'
    req = urllib.request.Request(url, headers={'User-Agent': 'ReadShelf educational ebook downloader (individual editions)',
                                               'Accept': 'application/epub+zip'})
    tmp = DEST / (entry['file'] + '.part')
    try:
        with urllib.request.urlopen(req, timeout=40) as response:
            if response.status != 200:
                raise RuntimeError(f'HTTP {response.status}')
            with tmp.open('wb') as f:
                count = 0
                while True:
                    data = response.read(64 * 1024)
                    if not data:
                        break
                    count += len(data)
                    if count > 25 * 1024 * 1024:
                        raise RuntimeError('EPUB exceeds 25 MB safety limit')
                    f.write(data)
        if not valid_epub(tmp):
            raise RuntimeError('Downloaded content is not a valid EPUB archive (may be a download page)')
        tmp.replace(DEST / entry['file'])
        return True
    except (urllib.error.URLError, TimeoutError, OSError, RuntimeError) as error:
        print(f'  Failed: {error}')
        return False
    finally:
        tmp.unlink(missing_ok=True)


def write_manifest(catalog):
    installed = []
    demo_file = DEST / 'readshelf-demo.epub'
    if valid_epub(demo_file):
        installed.append({
            'id': 'readshelf-demo',
            'title': 'The ReadShelf Reader: An Original Demonstration',
            'author': 'ReadShelf', 'genre': 'Fiction',
            'epubPath': 'assets/ebooks/readshelf-demo.epub',
            'sourcePage': 'Original ReadShelf demo ebook, created for this project'
        })
    for entry in catalog:
        path = DEST / entry['file']
        if not path.is_file() or not valid_epub(path):
            continue
        installed.append({**{k: entry[k] for k in ('id', 'title', 'author', 'genre')},
                          'epubPath': f'assets/ebooks/{entry["file"]}',
                          'sourcePage': f'https://standardebooks.org/ebooks/{entry["slug"]}'})
    MANIFEST.write_text('/* Generated from verified, installed EPUB files. */\n'
                        'window.ReadShelfEbookManifest = ' + json.dumps(installed, ensure_ascii=False, indent=2) + ';\n',
                        encoding='utf-8')
    return installed


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--limit', type=int, default=24, help='maximum curated titles to process (default 24)')
    parser.add_argument('--verify-only', action='store_true', help='do not download; rebuild manifest from existing EPUBs')
    parser.add_argument('--delay', type=float, default=2.0, help='seconds to pause between requests (default 2)')
    args = parser.parse_args()
    catalog = json.loads(CATALOG.read_text(encoding='utf-8'))
    DEST.mkdir(parents=True, exist_ok=True)
    if not args.verify_only:
        num_requested = 0
        for entry in catalog[:max(0, args.limit)]:
            dest = DEST / entry['file']
            if dest.exists() and valid_epub(dest):
                print(f'Already installed: {entry["title"]}')
                continue
            if num_requested:
                time.sleep(max(1.0, args.delay))
            num_requested += 1
            print(f'Downloading: {entry["title"]} ({entry["author"]})')
            download_book(entry)
    installed = write_manifest(catalog)
    print(f'\nReady: {len(installed)} complete EPUBs. Generated {MANIFEST.relative_to(ROOT)}')
    if len(installed) == 0:
        print('No complete book installed. You can manually download compatible EPUBs from each source page')
        print('to assets/ebooks/ using the catalog filenames, then run --verify-only.')
    return 0 if installed else 1


if __name__ == '__main__':
    sys.exit(main())
