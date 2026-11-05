/* ReadShelf Browse: real Google Books catalog, optional free-reading filter and paging. */
(function () {
  "use strict";
  function init() {
    const { bookCard, registerBooks, syncShelfButtons } = window.ReadShelf;
    const google = window.ReadShelfGoogleBooks;
    const grid = document.querySelector("#browseGrid");
    const input = document.querySelector("#browseSearch");
    const genre = document.querySelector("#genreFilter");
    const count = document.querySelector("#resultCount");
    const empty = document.querySelector("#browseEmpty");
    const status = document.querySelector("#browseStatus");
    if (!grid || !input || !genre || !count || !empty || !status) return;

    const params = new URLSearchParams(location.search);
    const starterBooks = [...(window.READSHELF_BOOKS || [])];
    const hostedBooks = window.ReadShelfEbooks?.all() || [];
    const pageSize = 20;
    let timer;
    let generation = 0;
    let offset = 0;
    let resultBooks = [];
    let waiting = false;
    let exhausted = false;

    input.value = params.get("q") || "";
    genre.value = [...genre.options].some(option => option.value === params.get("genre"))
      ? params.get("genre") : "All";

    // Keep this filter visible and usable on all viewport sizes without
    // modifying the existing stylesheet or Firebase code.
    const accessLabel = document.createElement("label");
    accessLabel.className = "readable-only-control";
    const accessCheck = document.createElement("input");
    accessCheck.type = "checkbox";
    accessCheck.id = "freeBooksOnly";
    accessCheck.checked = params.get("access") === "free" || (!params.has("q") && !params.has("access"));
    const accessText = document.createElement("span");
    accessText.textContent = "Only books available to read for free";
    accessLabel.append(accessCheck, accessText);
    document.querySelector(".browse-toolbar")?.insertAdjacentElement("afterend", accessLabel);

    const loadMore = document.createElement("button");
    loadMore.type = "button";
    loadMore.className = "btn btn-secondary catalog-load-more";
    loadMore.textContent = "Load more books";
    loadMore.hidden = true;
    grid.insertAdjacentElement("afterend", loadMore);

    const subjects = {
      Classic: "classics", Romance: "romance", Mystery: "mystery",
      "Science Fiction": "science fiction", Fantasy: "fantasy", Horror: "horror",
      Adventure: "adventure", Fiction: "fiction"
    };

    function query() {
      const typed = input.value.trim();
      if (typed) return typed;
      return `subject:${subjects[genre.value] || "fiction"}`;
    }

    function matchingGenre(book) {
      if (genre.value === "All" || !input.value.trim()) return true;
      const haystack = `${book.genre || ""} ${(book.tags || []).join(" ")}`.toLowerCase();
      const wanted = genre.value.toLowerCase();
      return haystack.includes(wanted) || (wanted === "classic" && haystack.includes("literature"));
    }

    function isReadable(book) {
      return book.viewability === "ALL_PAGES" && Boolean(book.webReaderLink || book.previewLink);
    }

    function updateUrl() {
      const url = new URL(location.href);
      const q = input.value.trim();
      if (q) url.searchParams.set("q", q); else url.searchParams.delete("q");
      if (genre.value !== "All") url.searchParams.set("genre", genre.value);
      else url.searchParams.delete("genre");
      if (accessCheck.checked) url.searchParams.set("access", "free");
      else url.searchParams.delete("access");
      history.replaceState(null, "", url.pathname + url.search);
    }

    function render() {
      const filtered = resultBooks.filter(book => matchingGenre(book) && (!accessCheck.checked || book.source !== "google" || isReadable(book)));
      grid.innerHTML = filtered.map(bookCard).join("");
      count.textContent = `${filtered.length} ${filtered.length === 1 ? "book" : "books"} shown`;
      empty.hidden = filtered.length !== 0;
      loadMore.hidden = exhausted || !resultBooks.length;
      syncShelfButtons();
    }

    async function searchBooks(append = false) {
      if (waiting && append) return;
      if (!append) {
        generation++;
        offset = 0;
        resultBooks = hostedBooks.filter(book => {
          const term = input.value.trim().toLowerCase();
          return !term || `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(term);
        });
        exhausted = false;
        render();
      }
      const token = generation;
      const typed = input.value.trim();
      updateUrl();
      if (typed && typed.length < 2) {
        status.textContent = "Type at least two characters to search Google Books.";
        exhausted = true;
        render();
        return;
      }

      waiting = true;
      loadMore.disabled = true;
      loadMore.textContent = "Loading…";
      status.textContent = append ? "Loading more books…" : "Searching Google Books…";
      try {
        if (!google?.isConfigured()) throw new Error("Google Books API key is not configured");
        const options = {
          maxResults: pageSize,
          startIndex: offset,
          filter: accessCheck.checked ? "free-ebooks" : undefined
        };
        const batch = await google.search(query(), options);
        if (token !== generation) return;
        offset += batch.length;
        if (batch.length < pageSize || offset >= 200) exhausted = true;
        const seen = new Set(resultBooks.map(book => book.id));
        for (const book of batch) {
          if (seen.has(book.id)) continue;
          resultBooks.push(book);
          seen.add(book.id);
        }
        registerBooks(resultBooks);
        status.textContent = accessCheck.checked
          ? "Live Google Books results · free full-view editions only."
          : "Live Google Books results · full text, previews, and restricted editions may be included.";
        if (!resultBooks.length) status.textContent = "No matching Google Books editions found. Try a different search.";
        render();
      } catch (error) {
        if (token !== generation) return;
        console.error("Google Books search failed:", error);
        exhausted = true;
        const localQuery = typed.toLowerCase();
        resultBooks = hostedBooks.length ? hostedBooks.filter(book =>
          !localQuery || `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(localQuery)) : starterBooks.filter(book =>
          !localQuery || `${book.title} ${book.author} ${book.genre}`.toLowerCase().includes(localQuery));
        status.textContent = hostedBooks.length
          ? 'Google Books is unavailable; showing complete books hosted by ReadShelf.'
          : 'Google Books is unavailable. The starter collection is metadata-only until complete EPUBs are installed.';
        render();
      } finally {
        if (token === generation) {
          waiting = false;
          loadMore.disabled = false;
          loadMore.textContent = "Load more books";
        }
      }
    }

    function schedule() {
      clearTimeout(timer);
      // Invalidates a request before the debounce completes.
      generation++;
      timer = setTimeout(() => searchBooks(false), 350);
    }

    input.addEventListener("input", schedule);
    genre.addEventListener("change", () => searchBooks(false));
    accessCheck.addEventListener("change", () => searchBooks(false));
    loadMore.addEventListener("click", () => searchBooks(true));
    searchBooks(false);
  }

  if (window.ReadShelf?.isReady()) init();
  else window.addEventListener("readshelf:ready", init, { once: true });
})();
