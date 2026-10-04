(function () {
  function render() {
    const { BOOKS, getShelf, getProgress, bookCard, getUser, isConfigured } = window.ReadShelf;
    const grid = document.querySelector("#shelfGrid");
    const empty = document.querySelector("#shelfEmpty");
    const summary = document.querySelector("#shelfSummary");

    if (isConfigured() && !getUser()) {
      grid.innerHTML = "";
      empty.hidden = false;
      empty.innerHTML = `<h2>Sign in to see your shelf</h2><p>Your saved books are stored securely in your ReadShelf account.</p><a class="btn btn-primary" href="signin.html?next=shelf.html">Sign in</a>`;
      summary.textContent = "Sign in to sync your personal library";
      return;
    }

    const progress = getProgress();
    const ids = getShelf();
    const books = ids.map(id => BOOKS.find(book => book.id === id)).filter(Boolean);
    grid.innerHTML = books.map(book => {
      const percent = progress[book.id] || 0;
      return `<div class="shelf-item">${bookCard(book)}<div class="shelf-progress"><span>${percent ? `${percent}% read` : "Not started"}</span><div class="progress-track"><span style="width:${percent}%"></span></div></div></div>`;
    }).join("");

    empty.hidden = books.length !== 0;
    if (!books.length) empty.innerHTML = `<h2>Your shelf is empty</h2><p>Browse the library and press + on any book you want to save.</p><a class="btn btn-primary" href="browse.html">Browse books</a>`;
    summary.textContent = `${books.length} saved ${books.length === 1 ? "book" : "books"}`;
    window.ReadShelf.syncShelfButtons();
  }

  if (window.ReadShelf?.isReady()) render();
  else window.addEventListener("readshelf:ready", render, { once: true });
  window.addEventListener("readshelf:shelfchange", render);
})();
