(function () {
  'use strict';
  function escapeHtml(value) {
    return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }
  const manifest = Array.isArray(window.ReadShelfEbookManifest) ? window.ReadShelfEbookManifest : [];
  const map = new Map(manifest.map(book => [book.id, book.thumbnail || '']));
  function patchBooks() {
    const all = window.READSHELF_BOOKS || [];
    all.forEach(book => {
      if (map.has(book.id)) {
        book.thumbnail = map.get(book.id);
        book.coverClass = '';
      }
    });
  }
  patchBooks();
  if (window.ReadShelf?.registerBooks) {
    const original = window.ReadShelf.registerBooks;
    window.ReadShelf.registerBooks = function (books) {
      const result = original.call(this, books);
      patchBooks();
      return result;
    };
  }
  document.addEventListener('DOMContentLoaded', patchBooks);
})();
