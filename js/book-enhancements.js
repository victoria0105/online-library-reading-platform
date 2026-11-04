/* ReadShelf: clean previously saved HTML descriptions and offer honest access alternatives. */
(function () {
  "use strict";

  function safeUrl(value) {
    try {
      const url = new URL(String(value || ""));
      return ["https:", "http:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  }

  function currentBook() {
    const id = new URLSearchParams(location.search).get("id") || "pride-and-prejudice";
    return window.ReadShelf?.findBook(id);
  }

  function enhance() {
    const detail = document.querySelector("#bookDetail");
    if (!detail || detail.dataset.accessEnhanced === "true") return;
    const book = currentBook();
    const description = detail.querySelector(".detail-description");
    if (!book || !description) return; // Book Details may still be loading asynchronously.
    detail.dataset.accessEnhanced = "true";

    const clean = window.ReadShelfGoogleBooks?.cleanDescription;
    if (typeof clean === "function") {
      description.textContent = clean(book.description || "No description is available.");
      description.style.whiteSpace = "pre-line";
    }

    const isGoogle = book.source === "google" || String(book.id || "").startsWith("google:");
    if (!isGoogle) return;

    const title = detail.querySelector(".availability-row strong");
    const detailText = detail.querySelector(".availability-row div > span");
    const actions = detail.querySelector(".detail-actions");
    if (!actions) return;
    const canRead = book.viewability === "ALL_PAGES";
    const canPreview = book.viewability === "PARTIAL";
    const validReader = canRead || canPreview;
    const readerLink = validReader ? safeUrl(book.webReaderLink || book.previewLink) : "";
    const infoLink = safeUrl(book.infoLink);
    const existingButton = actions.querySelector(".detail-read-btn");

    if (readerLink) {
      // Existing book.js already creates the correct Google Books Read/Preview link.
      if (title) title.textContent = canRead ? "Full book available" : "Preview available";
      if (detailText) detailText.textContent = canRead
        ? "Open the complete, publicly viewable edition on Google Books."
        : "Google Books allows a limited preview of this edition.";
    } else {
      if (title) title.textContent = "This edition cannot be read here";
      if (detailText) detailText.textContent = "Reading access depends on the edition, publisher, and your country. Search for a free-to-read edition instead.";
      if (existingButton) {
        const link = document.createElement("a");
        link.className = "btn btn-primary detail-read-btn";
        link.href = `browse.html?q=${encodeURIComponent(book.title)}&access=free`;
        link.textContent = "Find a free-to-read edition →";
        existingButton.replaceWith(link);
      }
    }
    if (infoLink && !actions.querySelector(".google-info-link")) {
      const link = document.createElement("a");
      link.className = "btn btn-secondary google-info-link";
      link.href = infoLink;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "View on Google Books ↗";
      actions.appendChild(link);
    }
  }

  const detail = document.querySelector("#bookDetail");
  if (detail) {
    const observer = new MutationObserver(() => enhance());
    observer.observe(detail, { childList: true });
    enhance();
  }
})();
