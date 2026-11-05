Full EPUB files are installed here by:
  python3 scripts/install_ebooks.py --limit 24

The installer downloads only publicly offered, compatible EPUB editions from
Standard Ebooks and verifies each EPUB archive. It generates js/installed-books.js
with ONLY the books installed successfully. The EPUB files themselves are NOT
included in the reader update ZIP.

If the publisher is unreachable, manually download compatible EPUB editions from
the corresponding Standard Ebooks title pages and save them here with the exact
filenames in ebooks/catalog.json. Then run:
  python3 scripts/install_ebooks.py --verify-only

Do not upload copyrighted books you are not authorized to redistribute.
