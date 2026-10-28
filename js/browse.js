(function () {
  function init() {
    const { bookCard, registerBooks } = window.ReadShelf;
    const grid = document.querySelector("#browseGrid");
    const input = document.querySelector("#browseSearch");
    const genre = document.querySelector("#genreFilter");
    const count = document.querySelector("#resultCount");
    const empty = document.querySelector("#browseEmpty");
    const status = document.querySelector("#browseStatus");
    const params = new URLSearchParams(location.search);
    const localBooks = [...(window.READSHELF_BOOKS || [])];
    let timer = null;
    let requestNumber = 0;

    input.value = params.get("q") || "";
    genre.value = params.get("genre") || "All";

    function matchesGenre(book, selected) {
      if (selected === "All") return true;
      const tags = Array.isArray(book.tags) ? book.tags : [];
      return book.genre === selected || tags.includes(selected);
    }

    function renderBooks(books) {
      const selected = genre.value;
      const filtered = books.filter(book => matchesGenre(book, selected));
      grid.innerHTML = filtered.map(bookCard).join("");
      count.textContent = `${filtered.length} ${filtered.length === 1 ? "book" : "books"}`;
      empty.hidden = filtered.length !== 0;
      window.ReadShelf.syncShelfButtons();
    }

    function updateUrl() {
      const url = new URL(location.href);
      const q = input.value.trim();
      if (q) url.searchParams.set("q", q); else url.searchParams.delete("q");
      if (genre.value !== "All") url.searchParams.set("genre", genre.value);
      else url.searchParams.delete("genre");
      history.replaceState(null, "", `${url.pathname}${url.search}`);
    }

    async function runSearch() {
      const token = ++requestNumber;
      const q = input.value.trim();
      updateUrl();

      if (!q) {
        status.textContent = "Showing the ReadShelf starter collection. Search to load live results from Google Books.";
        renderBooks(localBooks);
        return;
      }

      if (q.length < 2) {
        status.textContent = "Type at least 2 characters to search Google Books.";
        renderBooks([]);
        return;
      }

      status.textContent = "Searching Google Books…";
      count.textContent = "Searching…";

      try {
        const results = await window.ReadShelfGoogleBooks.search(q, { maxResults: 20 });
        if (token !== requestNumber) return;
        registerBooks(results);
        status.textContent = results.length
          ? "Live results from Google Books."
          : "No Google Books results were found.";
        renderBooks(results);
      } catch (error) {
        if (token !== requestNumber) return;
        console.error(error);
        const localFallback = localBooks.filter(book => {
          const haystack = `${book.title} ${book.author} ${book.genre} ${(book.tags || []).join(" ")}`.toLowerCase();
          return haystack.includes(q.toLowerCase());
        });
        status.textContent = `Google Books search is unavailable: ${error.message} Showing matching starter books instead.`;
        renderBooks(localFallback);
      }
    }

    function scheduleSearch() {
      clearTimeout(timer);
      timer = setTimeout(runSearch, 350);
    }

    input.addEventListener("input", scheduleSearch);
    genre.addEventListener("change", runSearch);
    runSearch();
  }

  if (window.ReadShelf?.isReady()) init();
  else window.addEventListener("readshelf:ready", init, { once: true });
})();
