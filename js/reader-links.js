/* Link to the local EPUB reader for installed editions, including matching Google results. */
(function () {
  'use strict';
  const catalog = window.ReadShelfEbooks;
  const rs = window.ReadShelf;
  if (!rs || !catalog) return;
  const originalCard = rs.bookCard;
  rs.bookCard = function (book) {
    let html = originalCard(book);
    const local = catalog.findForBook(book);
    const primary = /<a class="btn btn-primary btn-small"[^>]*>[\s\S]*?<\/a>/;
    if (local) {
      const url = `reader.html?id=${encodeURIComponent(local.id)}`;
      html = html.replace(primary, `<a class="btn btn-primary btn-small" href="${url}">Read on ReadShelf</a>`);
    } else if (book.source !== 'google' && !String(book.id || '').startsWith('google:')) {
      // Starter sample paragraphs are not a complete book. Don't label them "Read".
      html = html.replace(primary, `<a class="btn btn-primary btn-small" href="book.html?id=${encodeURIComponent(book.id)}">Details</a>`);
    }
    return html;
  };
})();
