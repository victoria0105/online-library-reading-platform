(function () {
  function render() {
    const { findBook, getShelf, getProgress } = window.ReadShelf;
    const id = new URLSearchParams(location.search).get("id") || "pride-and-prejudice";
    const book = findBook(id);
    if (!book) return location.replace("browse.html");

    const percent = getProgress()[book.id] || 0;
    document.title = `${book.title} — ReadShelf`;
    document.querySelector("#bookDetail").innerHTML = `
      <div class="detail-cover ${book.coverClass}"><span>${book.initials}</span></div>
      <div class="detail-copy">
        <p class="eyebrow">${book.tags.join(" · ")}</p>
        <h1>${book.title}</h1>
        <p class="detail-author">by ${book.author} · ${book.year}</p>
        <div class="detail-stats"><span>★ ${book.rating}</span><span>${book.pages} pages</span><span>${book.genre}</span></div>
        <p class="detail-description">${book.description}</p>
        <div class="detail-actions">
          <a class="btn btn-primary" href="reader.html?id=${book.id}">Start reading</a>
          <button class="btn btn-secondary js-shelf-button" data-book-id="${book.id}" type="button">${getShelf().includes(book.id) ? "✓ Saved to shelf" : "+ Add to My Shelf"}</button>
        </div>
        <div class="detail-progress"><div><span>Reading progress</span><strong>${percent}%</strong></div><div class="progress-track"><span style="width:${percent}%"></span></div></div>
      </div>`;
    window.ReadShelf.syncShelfButtons();
  }

  if (window.ReadShelf?.isReady()) render();
  else window.addEventListener("readshelf:ready", render, { once: true });
})();
