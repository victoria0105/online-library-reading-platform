#!/usr/bin/env python3
"""Build the original ReadShelf demo EPUB (no copyrighted third-party content)."""
import pathlib
import textwrap
import zipfile
from datetime import datetime
from xml.sax.saxutils import escape

ROOT=pathlib.Path(__file__).resolve().parent.parent
DEST=ROOT/'assets/ebooks/readshelf-demo.epub'
CHAPTERS=[
 ('A Library of Possibilities', [
  'Maya opened her laptop at the end of a long afternoon. On the screen was a quiet library with a single shelf. She had collected titles for years, but collecting them was different from reading them. There was always another tab, another distraction, another place to click. She wanted a reading space that felt as simple as turning a page.',
  'She started with the question she knew best: Where should the story live? A list of links was useful, but it was not a library. A library should welcome someone back to the exact sentence where they stopped. It should remember the pages that mattered and leave enough room for the reader to think. To do that, a website needed more than a search bar.',
  'Maya made a list of essentials: a readable page, reliable page navigation, bookmarks, and a personal shelf. The final item took a little longer to write. She wanted the ability to leave notes in the margins, because the best books became more meaningful when the reader could talk back to the text.',
  'The first working reader did not need a thousand books. It needed one complete book, opened without leaving the site, with a place saved after closing the browser. Maya decided to build the experience in that order.'
 ]),
 ('The Page Remembers', [
  'The next day, she experimented with different text sizes. When the font grew larger, the number of pages changed. A percentage alone could not always restore the exact spot. She discovered that an electronic book contains structural locations that are tied to the text rather than to the number of pixels on the screen.',
  'That insight changed the shape of the project. Instead of remembering that a person had reached page twenty-four, ReadShelf could remember a precise reading location. The page might look different on a phone, tablet, or laptop, but the passage would still be there.',
  'Maya read a paragraph slowly, selected a line, and pressed the highlight button. The words glowed in soft yellow. She added a note: This is the moment the story becomes personal. The note was small, but it made the page feel like hers. Then she made a bookmark and moved forward.',
  'When she reopened the book, the highlight was still there. Her note had not vanished. The bookmark carried her to the chosen spot. She smiled, not because the interface was complicated, but because it had stopped getting in the way.'
 ]),
 ('A Shelf of Your Own', [
  'A good reading tool respects the difference between a guest and someone who has signed in. A guest might choose to keep reading in one browser. A member might want to begin on a laptop and continue on a phone. The same simple controls could serve both people, so long as the website explained clearly where each person’s data was saved.',
  'Maya tested the reader with a second device. The account remembered the book and its position. Highlights and notes appeared again. The result was more than a display of text: it was a personal reading history that belonged to the reader, not to the browser window.',
  'There were limits worth respecting. A search service could describe books it could not legally provide. A title might appear in a catalog even when no complete edition could be hosted. Maya decided the site would never confuse the two. Search results would remain available, but the full reader button would appear only on books that really existed in the local library.',
  'Now the shelf could grow. Every additional book would give its readers the same dependable features: turn a page, select a passage, save a thought, and find their way back. The small library was finally ready to become a larger one.'
 ])
]


def xhtml(title,paras):
    body='\n'.join(f'<p>{escape(p)}</p>' for p in paras)
    return (f'<?xml version="1.0" encoding="utf-8"?>\n'
            f'<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">'
            f'<head><title>{escape(title)}</title><link href="style.css" rel="stylesheet" type="text/css" /></head>'
            f'<body><section><h1>{escape(title)}</h1>{body}</section></body></html>').encode()


nav_items=''.join(f'<li><a href="chapter{i}.xhtml">{escape(title)}</a></li>' for i,(title,_) in enumerate(CHAPTERS,1))
nav=f'''<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en">
<head><title>Contents</title></head><body><nav epub:type="toc" id="toc"><h1>Contents</h1><ol>{nav_items}</ol></nav></body></html>'''
manifest='\n'.join(f'<item id="chapter{i}" href="chapter{i}.xhtml" media-type="application/xhtml+xml" />' for i in range(1,len(CHAPTERS)+1))
spine='\n'.join(f'<itemref idref="chapter{i}" />' for i in range(1,len(CHAPTERS)+1))
opf=f'''<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/" version="3.0" unique-identifier="book-id">
<metadata><dc:identifier id="book-id">urn:uuid:readshelf-original-demo-2026</dc:identifier>
<dc:title>The ReadShelf Reader: An Original Demonstration</dc:title>
<dc:creator>ReadShelf</dc:creator><dc:language>en</dc:language><meta property="dcterms:modified">2026-11-04T00:00:00Z</meta>
</metadata>
<manifest><item id="toc" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="css" href="style.css" media-type="text/css" />{manifest}</manifest>
<spine>{spine}</spine></package>'''
container='''<?xml version="1.0" encoding="utf-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles>
<rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml" />
</rootfiles></container>'''
css='''body {font-family: Georgia, serif; line-height:1.75;} h1 {font-size:1.65em; margin-bottom:1em;} p {margin-bottom:1em;}'''
DEST.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(DEST,'w') as out:
    out.writestr('mimetype','application/epub+zip',compress_type=zipfile.ZIP_STORED)
    out.writestr('META-INF/container.xml',container)
    out.writestr('EPUB/package.opf',opf)
    out.writestr('EPUB/nav.xhtml',nav)
    out.writestr('EPUB/style.css',css)
    for i,(title,paras) in enumerate(CHAPTERS,1):
        out.writestr(f'EPUB/chapter{i}.xhtml',xhtml(title,paras))
print(f'Wrote original demo EPUB: {DEST.name}, {DEST.stat().st_size} bytes')
