/* ReadShelf home: load actual Google Books results, not the eight starter books. */
(function () {
  "use strict";
  let lastRequest = 0;

  function escapeHtml(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  async function loadPopular() {
    const grid = document.querySelector("#featuredBooks");
    if (!grid) return;
    const { bookCard, registerBooks, syncShelfButtons } = window.ReadShelf;
    const token = ++lastRequest;
    const hosted = window.ReadShelfEbooks?.all() || [];
    if (hosted.length >= 8) {
      registerBooks(hosted);
      grid.innerHTML = hosted.slice(0, 12).map(bookCard).join('');
      syncShelfButtons();
      const helper = grid.closest('.section')?.querySelector('.section-heading p:not(.eyebrow)');
      if (helper) helper.textContent = 'Complete books you can read and highlight directly on ReadShelf.';
      return;
    }
    grid.innerHTML = '<p class="catalog-message">Loading books from Google Books…</p>';
    try {
      const google = window.ReadShelfGoogleBooks;
      if (!google?.isConfigured()) throw new Error("Google Books API not configured");
      // Google's API has no 'most popular' sort. Use relevant classic literature
      // search results, then prefer editions that are actually viewable.
      let books = await google.search("classic literature", {
        filter: "free-ebooks", maxResults: 40, langRestrict: "en"
      });
      let available = books.filter(book => book.viewability === "ALL_PAGES" && (book.webReaderLink || book.previewLink));
      if (available.length < 8) {
        const more = await google.search("subject:fiction", {
          filter: "free-ebooks", maxResults: 40, langRestrict: "en"
        });
        available = available.concat(more.filter(book => book.viewability === "ALL_PAGES" && (book.webReaderLink || book.previewLink)));
      }
      if (token !== lastRequest) return;
      const seen = new Set();
      const unique = available.filter(book => {
        if (seen.has(book.googleVolumeId)) return false;
        seen.add(book.googleVolumeId);
        return true;
      });
      // Better-known titles first where Google supplies actual rating counts.
      unique.sort((a, b) => (b.ratingsCount || 0) - (a.ratingsCount || 0));
      const availableHosted = hosted.slice(0, 12);
      const shown = [...availableHosted, ...unique.filter(b =>
        !availableHosted.some(h => window.ReadShelfEbooks?.findForBook(b)?.id === h.id))].slice(0, 12);
      if (!shown.length) throw new Error('No available books were returned');
      registerBooks(shown);
      grid.innerHTML = shown.map(bookCard).join('');
      syncShelfButtons();
      const helper = grid.closest('.section')?.querySelector('.section-heading p:not(.eyebrow)');
      if (helper) helper.textContent = 'Read complete books on ReadShelf, or discover other editions through Google Books.';
    } catch (error) {
      console.warn("Unable to load home catalog:", error);
      if (token !== lastRequest) return;
      // Preserve demo accessibility if the Google API is offline/blocked.
      const fallback = hosted.length ? hosted : (window.READSHELF_BOOKS || []);
      grid.innerHTML = `<p class="catalog-message">${hosted.length ? 'Showing books hosted by ReadShelf.' : 'Google Books is offline; showing starter titles (full EPUBs not yet installed).'}</p>` +
        fallback.slice(0,12).map(bookCard).join('');
      syncShelfButtons();
    }
  }

  function init() {
    const { BOOKS, getProgress, getUser, isConfigured } = window.ReadShelf;
    document.querySelector("#heroSearch")?.addEventListener("submit", event => {
      event.preventDefault();
      const q = event.currentTarget.querySelector("input")?.value.trim() || "";
      location.href = `browse.html${q ? `?q=${encodeURIComponent(q)}` : ""}`;
    });
    document.querySelectorAll("[data-genre-link]").forEach(button => {
      button.addEventListener("click", () => {
        location.href = `browse.html?genre=${encodeURIComponent(button.dataset.genreLink)}&access=free`;
      });
    });

    const progress = getProgress();
    const entries = Object.entries(progress).filter(([, value]) => value > 0 && value < 100)
      .sort((a, b) => b[1] - a[1]);
    const continuePanel = document.querySelector("#continuePanel");
    if (continuePanel) {
      if (entries.length) {
        const [id, value] = entries[0];
        const book = BOOKS.find(item => item.id === id);
        if (book) {
          const isGoogle = book.source === "google" || id.startsWith("google:");
          const target = isGoogle ? `book.html?id=${encodeURIComponent(id)}` : `reader.html?id=${encodeURIComponent(id)}`;
          continuePanel.innerHTML = `
            <div class="continue-label"><span>Continue reading</span><strong>${value}%</strong></div>
            <div class="continue-book"><div class="mini-cover ${escapeHtml(book.coverClass || "")}">${escapeHtml(book.initials || "B")}</div>
            <div><h3>${escapeHtml(book.title)}</h3><p>${escapeHtml(book.author)}</p>
            <div class="progress-track"><span style="width:${value}%"></span></div></div></div>
            <a class="btn btn-dark btn-full" href="${target}">Continue reading</a>`;
        }
      }
      if (!continuePanel.innerHTML.trim()) {
        const book = BOOKS[0];
        const requiresSignin = isConfigured() && !getUser();
        continuePanel.innerHTML = `
          <div class="continue-label"><span>${requiresSignin ? "Your account" : "Start reading"}</span><strong>ReadShelf</strong></div>
          <div class="continue-book"><div class="mini-cover ${escapeHtml(book?.coverClass || "")}">${escapeHtml(book?.initials || "B")}</div>
          <div><h3>${escapeHtml(book?.title || "Find your next book")}</h3><p>${escapeHtml(book?.author || "")}</p>
          <p class="continue-helper">${requiresSignin ? "Sign in to sync your shelf and reading progress." : "Choose a book and your progress will appear here."}</p></div></div>
          <a class="btn btn-dark btn-full" href="${requiresSignin ? "signin.html" : "browse.html?access=free"}">${requiresSignin ? "Sign in" : "Browse books"}</a>`;
      }
    }
    loadPopular();
  }

  if (window.ReadShelf?.isReady()) init();
  else window.addEventListener("readshelf:ready", init, { once: true });
})();
