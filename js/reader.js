(function () {
  function init() {
    const { findBook, getProgress, setProgress, showToast, getUser, isConfigured } = window.ReadShelf;
    const id = new URLSearchParams(location.search).get("id") || "pride-and-prejudice";
    const book = findBook(id);
    if (!book) return location.replace("browse.html");

    document.title = `Reading ${book.title} — ReadShelf`;
    document.querySelector("#readerBookTitle").textContent = book.title;
    document.querySelector("#readerAuthor").textContent = book.author;
    document.querySelector("#readerText").innerHTML = `
      <p class="chapter-label">Chapter One</p>
      <h1>${book.title}</h1>
      ${book.sample.map(paragraph => `<p>${paragraph}</p>`).join("")}
      <p>This prototype contains a short public-domain sample. The completed ReadShelf application can load full public-domain books from an approved source.</p>
      <p>The reading view is intentionally distraction-free, with progress controls separated from the text so users can focus on reading.</p>`;

    const slider = document.querySelector("#progressSlider");
    const label = document.querySelector("#progressValue");
    const note = document.querySelector("#progressNote");
    slider.value = getProgress()[book.id] || 0;
    label.textContent = `${slider.value}%`;

    if (note) {
      note.textContent = isConfigured()
        ? (getUser() ? "Progress is synced to your ReadShelf account." : "Sign in to sync progress across devices.")
        : "Supabase is not configured yet, so progress is stored in this browser for the demo.";
    }

    slider.addEventListener("input", () => { label.textContent = `${slider.value}%`; });
    slider.addEventListener("change", async () => {
      const saved = await setProgress(book.id, Number(slider.value));
      if (saved) showToast("Reading progress saved");
    });

    document.querySelector("#markComplete").addEventListener("click", async () => {
      const saved = await setProgress(book.id, 100);
      if (saved) {
        slider.value = 100;
        label.textContent = "100%";
        showToast("Marked as completed");
      }
    });

    const fontSlider = document.querySelector("#fontSlider");
    fontSlider.addEventListener("input", () => {
      document.querySelector("#readerText").style.fontSize = `${fontSlider.value}px`;
    });
  }

  if (window.ReadShelf?.isReady()) init();
  else window.addEventListener("readshelf:ready", init, { once: true });
})();
