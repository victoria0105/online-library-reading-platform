/* Locally hosted, rights-checked EPUB titles. Never equate Google Books metadata with full-text permission. */
(function () {
  'use strict';
  const installed = Array.isArray(window.ReadShelfEbookManifest) ? window.ReadShelfEbookManifest : [];
  function normalize(value) {
    return String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, 'and').replace(/[^a-z0-9 ]/g, ' ').replace(/\b(the|a|an)\b/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  const books = installed.filter(entry => entry && /^[a-z0-9-]+$/.test(entry.id) &&
    /^assets\/ebooks\/[a-z0-9-]+\.epub$/.test(entry.epubPath))
    .map(entry => ({ ...entry, source: 'public-domain', availableOnReadShelf: true, sample: [],
      tags: ['Full book', entry.genre || 'Classic'], initials: (entry.title || 'Book').split(/\s+/).slice(0,2).map(p=>p[0]).join(''),
      description: `Read the complete ${entry.title} by ${entry.author}, right here on ReadShelf.`,
      sourcePage: entry.sourcePage || '', viewability: 'ALL_PAGES', featured: true }));
  function findForBook(book) {
    if (!book) return null;
    const direct = books.find(b => b.id === book.id);
    if (direct) return direct;
    const title = normalize(book.title), author = normalize(book.author);
    return books.find(b => normalize(b.title) === title &&
      (author === normalize(b.author) || author.includes(normalize(b.author)) || normalize(b.author).includes(author)) ) || null;
  }
  const starter = window.READSHELF_BOOKS || [];
  const overrides = new Map(books.map(book => [book.id, book]));
  window.READSHELF_BOOKS = starter.map(b => overrides.has(b.id) ? { ...b, ...overrides.get(b.id) } : b)
    .concat(books.filter(b => !starter.some(s => s.id === b.id)));
  window.ReadShelfEbooks = { all: () => books.slice(), findById: id => books.find(b => b.id === id) || null,
    findForBook, normalize };
})();
