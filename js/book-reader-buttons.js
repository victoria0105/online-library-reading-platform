(function () {
  'use strict';
  const detail = document.getElementById('bookDetail');
  if (!detail) return;
  function update() {
    const id = new URLSearchParams(location.search).get('id') || 'pride-and-prejudice';
    const book = window.ReadShelf?.findBook(id);
    const local = window.ReadShelfEbooks?.findForBook(book);
    const actions = detail.querySelector('.detail-actions');
    if (!book || !actions || actions.dataset.readerLinked) return;
    actions.dataset.readerLinked = '1';
    const primary = actions.querySelector('.detail-read-btn');
    if (local) {
      const link = document.createElement('a');
      link.className = 'btn btn-primary detail-read-btn';
      link.href = `reader.html?id=${encodeURIComponent(local.id)}`;
      link.textContent = 'Read full book on ReadShelf →';
      if (primary) primary.replaceWith(link); else actions.prepend(link);
      const title = detail.querySelector('.availability-row strong');
      const description = detail.querySelector('.availability-row div > span');
      if (title) title.textContent = 'Complete book available on ReadShelf';
      if (description) description.textContent = 'Read the full, locally hosted public-domain edition with bookmarks, highlights, notes, and saved progress.';
    } else if (book.source !== 'google' && !String(book.id || '').startsWith('google:')) {
      if (primary) {
        const link = document.createElement('a');
        link.className = 'btn btn-secondary detail-read-btn';
        link.href = 'browse.html?access=free';
        link.textContent = 'Browse complete books';
        primary.replaceWith(link);
      }
      const title = detail.querySelector('.availability-row strong');
      const description = detail.querySelector('.availability-row div > span');
      if (title) title.textContent = 'Full text not installed';
      if (description) description.textContent = 'This is a starter catalog entry. Complete books appear here once their EPUB editions have been added.';
    }
  }
  const observer = new MutationObserver(update);
  observer.observe(detail, { childList: true });
  update();
})();
