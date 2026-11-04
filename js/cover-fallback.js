/* If a remote cover fails, replace the huge broken-image alt text with initials. */
(function () {
  "use strict";
  document.addEventListener("error", event => {
    const img = event.target;
    if (!(img instanceof HTMLImageElement)) return;
    const cover = img.closest(".book-cover, .detail-cover");
    if (!cover) return;
    const id = cover.closest("[data-book-id]")?.dataset.bookId ||
      new URLSearchParams(location.search).get("id") || "";
    const book = window.ReadShelf?.findBook(id);
    const letters = book?.initials || String(book?.title || "Book")
      .split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
    const fallback = document.createElement("span");
    fallback.className = "book-cover-placeholder";
    fallback.textContent = letters;
    cover.classList.add("missing-cover");
    img.replaceWith(fallback);
  }, true);
})();
