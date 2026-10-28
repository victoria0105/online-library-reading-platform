(function () {
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function safeUrl(value) {
    try {
      const url = new URL(String(value || ""), location.origin);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  async function render() {
    const { BOOKS, findBook, registerBooks, getShelf, getProgress, bookCard } = window.ReadShelf;
    const id = new URLSearchParams(location.search).get("id") || "pride-and-prejudice";
    let book = findBook(id);

    if (!book && id.startsWith("google:") && window.ReadShelfGoogleBooks) {
      try {
        book = await window.ReadShelfGoogleBooks.getVolume(id.slice("google:".length));
        registerBooks([book]);
      } catch (error) {
        console.error(error);
      }
    }

    if (!book) return location.replace("browse.html");

    const percent = getProgress()[book.id] || 0;
    const saved = getShelf().includes(book.id);
    const isGoogleBook = book.source === "google" || id.startsWith("google:");
    const readerUrl = safeUrl(book.webReaderLink || book.previewLink);
    const actionLabel = percent > 0 ? "Continue reading" : "Start reading";
    const tags = (book.tags || []).map(tag => `<span>${escapeHtml(tag)}</span>`).join("");
    const cover = safeUrl(book.thumbnail)
      ? `<img src="${escapeHtml(safeUrl(book.thumbnail))}" alt="Cover of ${escapeHtml(book.title)}" style="width:100%;height:100%;object-fit:cover;display:block;">`
      : `<span>${escapeHtml(book.initials || "B")}</span>`;

    let availabilityTitle = "Reading access not confirmed";
    let availabilityText = "Google Books did not provide a public reading link for this volume.";
    if (!isGoogleBook) {
      availabilityTitle = "Available in ReadShelf prototype";
      availabilityText = "This starter title uses the built-in prototype reader.";
    } else if (book.viewability === "ALL_PAGES") {
      availabilityTitle = "Full view available";
      availabilityText = book.publicDomain
        ? "Google Books reports this volume as public domain for the current access region."
        : "Google Books reports that all pages are viewable.";
    } else if (book.viewability === "PARTIAL") {
      availabilityTitle = "Preview available";
      availabilityText = "Google Books allows a partial preview of this volume.";
    }

    const primaryAction = isGoogleBook
      ? (readerUrl
          ? `<a class="btn btn-primary detail-read-btn" href="${escapeHtml(readerUrl)}" target="_blank" rel="noopener">${book.viewability === "ALL_PAGES" ? "Read on Google Books" : "Preview on Google Books"} <span aria-hidden="true">↗</span></a>`
          : `<button class="btn btn-primary detail-read-btn" type="button" disabled>Reading preview unavailable</button>`)
      : `<a class="btn btn-primary detail-read-btn" href="reader.html?id=${encodeURIComponent(book.id)}">${actionLabel} <span aria-hidden="true">→</span></a>`;

    document.title = `${book.title} — ReadShelf`;
    const crumb = document.querySelector("#breadcrumbTitle");
    if (crumb) crumb.textContent = book.title;

    document.querySelector("#bookDetail").innerHTML = `
      <aside class="detail-visual-column">
        <div class="detail-cover-frame">
          <div class="detail-cover ${escapeHtml(book.coverClass || "")}" aria-label="Cover for ${escapeHtml(book.title)}">${cover}</div>
        </div>
        <div class="availability-card">
          <div class="availability-row">
            <span class="availability-dot" aria-hidden="true"></span>
            <div><strong>${escapeHtml(availabilityTitle)}</strong><span>${escapeHtml(availabilityText)}</span></div>
          </div>
          <div class="availability-row muted-row">
            <span class="availability-icon" aria-hidden="true">↗</span>
            <div><strong>${isGoogleBook ? "Google Books metadata" : "ReadShelf starter catalog"}</strong><span>${isGoogleBook ? `Viewability: ${escapeHtml(book.viewability || "UNKNOWN")}` : "Local prototype data"}</span></div>
          </div>
        </div>
      </aside>

      <div class="detail-copy">
        <div class="detail-tag-row">${tags || "<span>Book</span>"}</div>
        <h1>${escapeHtml(book.title)}</h1>
        <p class="detail-author">by <strong>${escapeHtml(book.author)}</strong></p>

        <div class="detail-stats" aria-label="Book information">
          ${book.rating ? `<span><b>★ ${escapeHtml(book.rating)}</b> rating</span>` : ""}
          ${book.pages ? `<span>${escapeHtml(book.pages)} pages</span>` : ""}
          ${book.year ? `<span>${escapeHtml(book.year)}</span>` : ""}
          <span>${escapeHtml(book.genre || "Book")}</span>
        </div>

        <section class="detail-about">
          <h2>About this book</h2>
          <p class="detail-description">${escapeHtml(book.description || "No description is available.")}</p>
        </section>

        <div class="detail-actions">
          ${primaryAction}
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
          <div><dt>Published</dt><dd>${escapeHtml(book.publishedDate || book.year || "Unknown")}</dd></div>
          <div><dt>Genre</dt><dd>${escapeHtml(book.genre || "Book")}</dd></div>
          <div><dt>Length</dt><dd>${book.pages ? `${escapeHtml(book.pages)} pages` : "Unknown"}</dd></div>
          <div><dt>Language</dt><dd>${escapeHtml(book.language || "Unknown")}</dd></div>
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
