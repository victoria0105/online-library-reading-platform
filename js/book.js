(function () {
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function render() {
    const { BOOKS, findBook, getShelf, getProgress, bookCard } = window.ReadShelf;
    const id = new URLSearchParams(location.search).get("id") || "pride-and-prejudice";
    const book = findBook(id);
    if (!book) return location.replace("browse.html");

    const percent = getProgress()[book.id] || 0;
    const saved = getShelf().includes(book.id);
    const actionLabel = percent > 0 ? "Continue reading" : "Start reading";
    const tags = (book.tags || []).map(tag => `<span>${escapeHtml(tag)}</span>`).join("");

    document.title = `${book.title} — ReadShelf`;
    const crumb = document.querySelector("#breadcrumbTitle");
    if (crumb) crumb.textContent = book.title;

    document.querySelector("#bookDetail").innerHTML = `
      <aside class="detail-visual-column">
        <div class="detail-cover-frame">
          <div class="detail-cover ${book.coverClass}" aria-label="Cover placeholder for ${escapeHtml(book.title)}"><span>${escapeHtml(book.initials)}</span></div>
        </div>
        <div class="availability-card">
          <div class="availability-row">
            <span class="availability-dot" aria-hidden="true"></span>
            <div><strong>Available to read</strong><span>Reading access will be checked through the books API.</span></div>
          </div>
          <div class="availability-row muted-row">
            <span class="availability-icon" aria-hidden="true">↗</span>
            <div><strong>External book data</strong><span>Designed for Google Books metadata and reading links.</span></div>
          </div>
        </div>
      </aside>

      <div class="detail-copy">
        <div class="detail-tag-row">${tags}</div>
        <h1>${escapeHtml(book.title)}</h1>
        <p class="detail-author">by <strong>${escapeHtml(book.author)}</strong></p>

        <div class="detail-stats" aria-label="Book information">
          <span><b>★ ${escapeHtml(book.rating)}</b> rating</span>
          <span>${escapeHtml(book.pages)} pages</span>
          <span>${escapeHtml(book.year)}</span>
          <span>${escapeHtml(book.genre)}</span>
        </div>

        <section class="detail-about">
          <h2>About this book</h2>
          <p class="detail-description">${escapeHtml(book.description)}</p>
        </section>

        <div class="detail-actions">
          <a class="btn btn-primary detail-read-btn" href="reader.html?id=${encodeURIComponent(book.id)}">${actionLabel} <span aria-hidden="true">→</span></a>
          <button class="btn btn-secondary js-shelf-button" data-book-id="${escapeHtml(book.id)}" type="button">${saved ? "✓ Saved to My Shelf" : "+ Add to My Shelf"}</button>
        </div>

        <div class="detail-progress-card ${percent ? "has-progress" : ""}">
          <div class="detail-progress-heading">
            <div><p class="eyebrow">Your reading</p><strong>${percent ? "Continue where you left off" : "Not started yet"}</strong></div>
            <span>${percent}%</span>
          </div>
          <div class="progress-track"><span style="width:${percent}%"></span></div>
        </div>

        <dl class="detail-meta-grid">
          <div><dt>Published</dt><dd>${escapeHtml(book.year)}</dd></div>
          <div><dt>Genre</dt><dd>${escapeHtml(book.genre)}</dd></div>
          <div><dt>Length</dt><dd>${escapeHtml(book.pages)} pages</dd></div>
          <div><dt>Language</dt><dd>English</dd></div>
        </dl>
      </div>`;

    window.ReadShelf.syncShelfButtons();

    const related = BOOKS
      .filter(candidate => candidate.id !== book.id)
      .sort((a, b) => Number(b.genre === book.genre) - Number(a.genre === book.genre))
      .slice(0, 3);

    if (related.length) {
      document.querySelector("#relatedBooks").innerHTML = related.map(bookCard).join("");
      document.querySelector("#relatedSection").hidden = false;
      window.ReadShelf.syncShelfButtons();
    }
  }

  if (window.ReadShelf?.isReady()) render();
  else window.addEventListener("readshelf:ready", render, { once: true });
})();
