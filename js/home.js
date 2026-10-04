(function () {
  function init() {
    const { BOOKS, bookCard, getProgress, getUser, isConfigured } = window.ReadShelf;
    const grid = document.querySelector("#featuredBooks");
    if (grid) grid.innerHTML = BOOKS.filter(book => book.featured).map(bookCard).join("");

    const form = document.querySelector("#heroSearch");
    form?.addEventListener("submit", event => {
      event.preventDefault();
      const q = form.querySelector("input").value.trim();
      location.href = `browse.html${q ? `?q=${encodeURIComponent(q)}` : ""}`;
    });

    document.querySelectorAll("[data-genre-link]").forEach(button => {
      button.addEventListener("click", () => {
        location.href = `browse.html?genre=${encodeURIComponent(button.dataset.genreLink)}`;
      });
    });

    const progress = getProgress();
    const entries = Object.entries(progress)
      .filter(([, value]) => value > 0 && value < 100)
      .sort((a, b) => b[1] - a[1]);
    const continuePanel = document.querySelector("#continuePanel");

    if (continuePanel) {
      if (entries.length) {
        const [id, value] = entries[0];
        const book = BOOKS.find(item => item.id === id) || BOOKS[0];
        continuePanel.innerHTML = `
          <div class="continue-label"><span>Continue reading</span><strong>${value}%</strong></div>
          <div class="continue-book">
            <div class="mini-cover ${book.coverClass}">${book.initials}</div>
            <div><h3>${book.title}</h3><p>${book.author}</p><div class="progress-track"><span style="width:${value}%"></span></div></div>
          </div>
          <a class="btn btn-dark btn-full" href="reader.html?id=${encodeURIComponent(book.id)}">Continue reading</a>`;
      } else {
        const book = BOOKS.find(item => item.featured) || BOOKS[0];
        continuePanel.innerHTML = `
          <div class="continue-label"><span>${isConfigured() && !getUser() ? "Your account" : "Start reading"}</span><strong>ReadShelf</strong></div>
          <div class="continue-book">
            <div class="mini-cover ${book.coverClass}">${book.initials}</div>
            <div><h3>${book.title}</h3><p>${book.author}</p><p class="continue-helper">${isConfigured() && !getUser() ? "Sign in to sync your shelf and reading progress." : "Choose a book and your progress will appear here."}</p></div>
          </div>
          <a class="btn btn-dark btn-full" href="${isConfigured() && !getUser() ? "signin.html" : `reader.html?id=${encodeURIComponent(book.id)}`}">${isConfigured() && !getUser() ? "Sign in" : "Start reading"}</a>`;
      }
    }

    window.ReadShelf.syncShelfButtons();
  }

  if (window.ReadShelf?.isReady()) init();
  else window.addEventListener("readshelf:ready", init, { once: true });
})();
