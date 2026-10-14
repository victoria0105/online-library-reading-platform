(function () {
  const READER_PREFS_KEY = "readshelf:reader-prefs";
  const BOOKMARKS_KEY = "readshelf:bookmarks";

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function init() {
    const { findBook, getProgress, setProgress, showToast, getUser, isConfigured } = window.ReadShelf;
    const id = new URLSearchParams(location.search).get("id") || "pride-and-prejudice";
    const book = findBook(id);
    if (!book) return location.replace("browse.html");

    const readerText = document.querySelector("#readerText");
    const backUrl = `book.html?id=${encodeURIComponent(book.id)}`;
    document.title = `Reading ${book.title} — ReadShelf`;
    document.querySelector("#readerBookTitle").textContent = book.title;
    document.querySelector("#readerAuthor").textContent = book.author;
    document.querySelector("#readerBackLink").href = backUrl;
    document.querySelector("#backToDetails").href = backUrl;

    readerText.innerHTML = `
      <p class="chapter-label">Chapter One</p>
      <h1>${escapeHtml(book.title)}</h1>
      <p class="reader-opening-line">${escapeHtml(book.author)}</p>
      ${(book.sample || []).map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      <p>This ReadShelf prototype displays a short sample to demonstrate the reading experience. In the next development phase, readable content will come from an approved external books API when that title's access permissions allow it.</p>`;

    const slider = document.querySelector("#progressSlider");
    const label = document.querySelector("#progressValue");
    const progressLine = document.querySelector("#readerProgressLine");
    const locationLabel = document.querySelector("#readerLocation");
    const note = document.querySelector("#progressNote");

    function updateProgressDisplay(value) {
      const percent = Math.max(0, Math.min(100, Number(value) || 0));
      label.textContent = `${percent}%`;
      progressLine.style.width = `${percent}%`;
      locationLabel.textContent = percent >= 100 ? "Completed" : percent > 0 ? `${percent}% complete` : "Beginning";
    }

    slider.value = getProgress()[book.id] || 0;
    updateProgressDisplay(slider.value);

    if (note) {
      note.textContent = isConfigured()
        ? (getUser() ? "Progress is currently synced to your ReadShelf account." : "Sign in to sync progress across devices.")
        : "For the current prototype, progress is saved in this browser. Firebase will replace this storage next.";
    }

    slider.addEventListener("input", () => updateProgressDisplay(slider.value));
    slider.addEventListener("change", async () => {
      const saved = await setProgress(book.id, Number(slider.value));
      if (saved) showToast("Reading progress saved");
    });

    document.querySelector("#markComplete").addEventListener("click", async () => {
      const saved = await setProgress(book.id, 100);
      if (saved) {
        slider.value = 100;
        updateProgressDisplay(100);
        showToast("Marked as completed");
      }
    });

    const prefs = readJson(READER_PREFS_KEY, { fontSize: 20, lineHeight: 1.9, font: "serif", theme: "paper" });
    const fontSlider = document.querySelector("#fontSlider");
    const fontSizeValue = document.querySelector("#fontSizeValue");
    const lineSlider = document.querySelector("#lineHeightSlider");
    const lineValue = document.querySelector("#lineHeightValue");

    function savePrefs() { localStorage.setItem(READER_PREFS_KEY, JSON.stringify(prefs)); }
    function applyPrefs() {
      readerText.style.fontSize = `${prefs.fontSize}px`;
      readerText.style.lineHeight = String(prefs.lineHeight);
      readerText.classList.toggle("reader-font-sans", prefs.font === "sans");
      document.body.classList.remove("reader-theme-paper", "reader-theme-sepia", "reader-theme-night");
      document.body.classList.add(`reader-theme-${prefs.theme}`);
      fontSlider.value = prefs.fontSize;
      fontSizeValue.textContent = `${prefs.fontSize}px`;
      lineSlider.value = prefs.lineHeight;
      lineValue.textContent = Number(prefs.lineHeight).toFixed(1);
      document.querySelectorAll("[data-font]").forEach(button => button.classList.toggle("is-active", button.dataset.font === prefs.font));
      document.querySelectorAll("[data-theme]").forEach(button => button.classList.toggle("is-active", button.dataset.theme === prefs.theme));
    }

    fontSlider.addEventListener("input", () => {
      prefs.fontSize = Number(fontSlider.value);
      applyPrefs(); savePrefs();
    });
    lineSlider.addEventListener("input", () => {
      prefs.lineHeight = Number(lineSlider.value);
      applyPrefs(); savePrefs();
    });
    document.querySelectorAll("[data-font]").forEach(button => button.addEventListener("click", () => {
      prefs.font = button.dataset.font; applyPrefs(); savePrefs();
    }));
    document.querySelectorAll("[data-theme]").forEach(button => button.addEventListener("click", () => {
      prefs.theme = button.dataset.theme; applyPrefs(); savePrefs();
    }));
    applyPrefs();

    const bookmarkButton = document.querySelector("#bookmarkButton");
    const bookmarks = readJson(BOOKMARKS_KEY, {});
    function updateBookmarkButton() {
      const active = Boolean(bookmarks[book.id]);
      bookmarkButton.setAttribute("aria-pressed", String(active));
      bookmarkButton.classList.toggle("is-active", active);
      bookmarkButton.textContent = active ? "♥" : "♡";
    }
    bookmarkButton.addEventListener("click", () => {
      if (bookmarks[book.id]) delete bookmarks[book.id];
      else bookmarks[book.id] = { savedAt: new Date().toISOString(), progress: Number(slider.value) || 0 };
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
      updateBookmarkButton();
      showToast(bookmarks[book.id] ? "Reading position bookmarked" : "Bookmark removed");
    });
    updateBookmarkButton();
  }

  if (window.ReadShelf?.isReady()) init();
  else window.addEventListener("readshelf:ready", init, { once: true });
})();
