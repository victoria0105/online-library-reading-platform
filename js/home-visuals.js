/* ReadShelf mini cover enhancement: preserve the original home.js logic. */
(function () {
  "use strict";
  const panel = document.getElementById("continuePanel");
  if (!panel) return;

  function imageForTitle(title, author) {
    const manifest = Array.isArray(window.ReadShelfEbookManifest) ? window.ReadShelfEbookManifest : [];
    const normalized = value => String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
    return manifest.find(item => normalized(item.title) === normalized(title)
      && (!author || normalized(item.author) === normalized(author)))?.thumbnail || "";
  }
  function updateCover() {
    const box = panel.querySelector(".mini-cover");
    const name = panel.querySelector(".continue-book h3")?.textContent?.trim();
    const author = panel.querySelector(".continue-book p")?.textContent?.trim();
    if (!box || !name) return;
    const src = imageForTitle(name, author);
    if (!src || box.querySelector("img")) return;
    const original = box.textContent;
    const image = document.createElement("img");
    image.src = src;
    image.alt = name + " cover";
    image.width = 76;
    image.height = 114;
    image.onerror = () => { image.replaceWith(document.createTextNode(original)); };
    box.replaceChildren(image);
  }

  // home.js fills this panel after Firebase has hydrated the user's state.
  // Observing the direct childList allows it to work for both fresh and returning readers.
  const observer = new MutationObserver(updateCover);
  observer.observe(panel, { childList: true });
  if (window.ReadShelf?.isReady()) updateCover();
  else window.addEventListener("readshelf:ready", updateCover, { once: true });
})();
