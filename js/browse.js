(function () {
  function init() {
    const { BOOKS, bookCard } = window.ReadShelf;
    const grid = document.querySelector("#browseGrid");
    const input = document.querySelector("#browseSearch");
    const genre = document.querySelector("#genreFilter");
    const count = document.querySelector("#resultCount");
    const params = new URLSearchParams(location.search);

    input.value = params.get("q") || "";
    genre.value = params.get("genre") || "All";

    function render() {
      const q = input.value.trim().toLowerCase();
      const selected = genre.value;
      const filtered = BOOKS.filter(book => {
        const haystack = `${book.title} ${book.author} ${book.genre} ${book.tags.join(" ")}`.toLowerCase();
        return (!q || haystack.includes(q)) && (selected === "All" || book.genre === selected || book.tags.includes(selected));
      });
      grid.innerHTML = filtered.map(bookCard).join("");
      count.textContent = `${filtered.length} ${filtered.length === 1 ? "book" : "books"}`;
      document.querySelector("#browseEmpty").hidden = filtered.length !== 0;
      window.ReadShelf.syncShelfButtons();
    }

    input.addEventListener("input", render);
    genre.addEventListener("change", render);
    render();
  }

  if (window.ReadShelf?.isReady()) init();
  else window.addEventListener("readshelf:ready", init, { once: true });
})();
