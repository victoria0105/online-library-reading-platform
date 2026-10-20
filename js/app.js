(function () {
  const backend = window.ReadShelfBackend;
  const fallbackBooks = window.READSHELF_BOOKS || [];
  const STORAGE_SHELF = "readshelf:shelf";
  const STORAGE_PROGRESS = "readshelf:progress";

  const state = {
    books: fallbackBooks,
    shelf: [],
    progress: {},
    session: null,
    user: null,
    ready: false,
    configured: Boolean(backend?.isConfigured?.())
  };

  function readGuestShelf() {
    try { return JSON.parse(localStorage.getItem(STORAGE_SHELF) || "[]"); }
    catch { return []; }
  }

  function readGuestProgress() {
    try { return JSON.parse(localStorage.getItem(STORAGE_PROGRESS) || "{}"); }
    catch { return {}; }
  }

  function saveGuestShelf(ids) {
    localStorage.setItem(STORAGE_SHELF, JSON.stringify([...new Set(ids)]));
  }

  function saveGuestProgress(progress) {
    localStorage.setItem(STORAGE_PROGRESS, JSON.stringify(progress));
  }

  function mapDatabaseBook(book) {
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      year: book.published_year,
      genre: book.genre,
      tags: book.tags || [],
      initials: book.initials,
      coverClass: book.cover_class,
      description: book.description,
      pages: book.pages,
      rating: Number(book.rating || 0),
      featured: Boolean(book.featured),
      sample: book.sample_paragraphs || []
    };
  }

  function getShelf() { return [...state.shelf]; }
  function getProgress() { return { ...state.progress }; }
  function getUser() { return state.user; }
  function getSession() { return state.session; }
  function isConfigured() { return state.configured; }
  function isReady() { return state.ready; }
  function findBook(id) { return state.books.find(book => book.id === id); }

  function currentReturnTarget() {
    const file = location.pathname.split("/").pop() || "index.html";
    return `${file}${location.search}${location.hash}`;
  }

  function goToSignIn() {
    location.href = `signin.html?next=${encodeURIComponent(currentReturnTarget())}`;
  }

  async function toggleShelf(id) {
    const exists = state.shelf.includes(id);

    if (state.configured) {
      if (!state.user) {
        showToast("Sign in to save books to your shelf");
        setTimeout(goToSignIn, 650);
        return false;
      }

      try {
        if (exists) {
          await backend.removeFromShelf(state.user.id, id);
          state.shelf = state.shelf.filter(bookId => bookId !== id);
        } else {
          await backend.addToShelf(state.user.id, id);
          state.shelf = [...state.shelf, id];
        }
      } catch (error) {
        console.error(error);
        showToast("Could not update your shelf");
        return false;
      }
    } else {
      state.shelf = exists ? state.shelf.filter(bookId => bookId !== id) : [...state.shelf, id];
      saveGuestShelf(state.shelf);
    }

    updateShelfCount();
    syncShelfButtons();
    showToast(exists ? "Removed from My Shelf" : "Added to My Shelf");
    window.dispatchEvent(new CustomEvent("readshelf:shelfchange", { detail: { shelf: getShelf() } }));
    return true;
  }

  async function setProgress(id, percent) {
    const value = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));

    if (state.configured) {
      if (!state.user) {
        showToast("Sign in to sync your reading progress");
        return false;
      }
      try {
        await backend.saveProgress(state.user.id, id, value);
      } catch (error) {
        console.error(error);
        showToast("Could not save reading progress");
        return false;
      }
    } else {
      const guest = readGuestProgress();
      guest[id] = value;
      saveGuestProgress(guest);
    }

    state.progress[id] = value;
    window.dispatchEvent(new CustomEvent("readshelf:progresschange", { detail: { bookId: id, progress: value } }));
    return true;
  }

  function bookCard(book) {
    const saved = state.shelf.includes(book.id);
    return `
      <article class="book-card" data-book-id="${book.id}">
        <a class="book-cover ${book.coverClass}" href="book.html?id=${encodeURIComponent(book.id)}" aria-label="View ${book.title}">
          <span>${book.initials}</span>
        </a>
        <div class="book-card-body">
          <p class="book-kicker">${book.tags.join(" · ")}</p>
          <h3><a href="book.html?id=${encodeURIComponent(book.id)}">${book.title}</a></h3>
          <p class="book-author">${book.author}</p>
          <div class="book-card-actions">
            <a class="btn btn-primary btn-small" href="reader.html?id=${encodeURIComponent(book.id)}">Read</a>
            <button class="icon-btn js-shelf-button ${saved ? "is-saved" : ""}" type="button" data-book-id="${book.id}" aria-label="${saved ? "Remove" : "Add"} ${book.title} ${saved ? "from" : "to"} My Shelf" aria-pressed="${saved}">${saved ? "✓" : "+"}</button>
          </div>
        </div>
      </article>`;
  }

  function updateShelfCount() {
    document.querySelectorAll("[data-shelf-count]").forEach(el => {
      el.textContent = state.shelf.length;
    });
  }

  function syncShelfButtons() {
    document.querySelectorAll(".js-shelf-button").forEach(button => {
      const saved = state.shelf.includes(button.dataset.bookId);
      button.classList.toggle("is-saved", saved);
      button.setAttribute("aria-pressed", String(saved));
      if (button.classList.contains("btn")) {
        button.textContent = saved ? "✓ Saved to shelf" : "+ Add to My Shelf";
      } else {
        button.textContent = saved ? "✓" : "+";
      }
    });
  }

  function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__readShelfToast);
    window.__readShelfToast = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function renderAuthControls() {
    document.querySelectorAll(".nav-actions").forEach(container => {
      const menu = '<button class="mobile-menu" data-menu-toggle aria-expanded="false" aria-label="Open menu">☰</button>';
      if (state.user) {
        const email = state.user.email || "Account";
        const label = state.user.displayName || email;
        container.innerHTML = `<a class="user-chip" href="profile.html" title="${email}">${label}</a><button class="btn btn-secondary" type="button" data-signout>Sign out</button>${menu}`;
      } else {
        container.innerHTML = `<a class="btn btn-secondary" href="signin.html">Sign in</a><a class="btn btn-primary" href="signin.html?mode=signup">Create account</a>${menu}`;
      }
    });

    document.querySelectorAll(".mobile-nav").forEach(nav => {
      nav.querySelectorAll("[data-mobile-auth], a[href^=\"signin.html\"]").forEach(el => el.remove());
      if (state.user) {
        const profileItem = document.createElement("a");
        profileItem.dataset.mobileAuth = "true";
        profileItem.className = "mobile-auth-link";
        profileItem.href = "profile.html";
        profileItem.textContent = "Profile";
        nav.appendChild(profileItem);

        const signoutItem = document.createElement("button");
        signoutItem.dataset.mobileAuth = "true";
        signoutItem.className = "mobile-auth-link";
        signoutItem.type = "button";
        signoutItem.dataset.signout = "true";
        signoutItem.textContent = "Sign out";
        nav.appendChild(signoutItem);
      } else {
        const authItem = document.createElement("a");
        authItem.dataset.mobileAuth = "true";
        authItem.className = "mobile-auth-link";
        authItem.href = "signin.html";
        authItem.textContent = "Sign in";
        nav.appendChild(authItem);
      }
    });
  }

  async function hydrate() {
    try {
      if (state.configured) {
        state.session = await backend.getSession();
        state.user = state.session?.user || null;

        try {
          const dbBooks = await backend.fetchBooks();
          if (dbBooks.length) state.books = dbBooks.map(mapDatabaseBook);
        } catch (bookError) {
          console.warn("ReadShelf: using bundled book data because the database catalog could not be loaded.", bookError);
        }

        if (state.user) {
          const [shelf, progress] = await Promise.all([
            backend.fetchShelf(state.user.id),
            backend.fetchProgress(state.user.id)
          ]);
          state.shelf = shelf;
          state.progress = progress;
        } else {
          state.shelf = [];
          state.progress = {};
        }
      } else {
        state.shelf = readGuestShelf();
        state.progress = readGuestProgress();
      }
    } catch (error) {
      console.error("ReadShelf initialization failed:", error);
      state.shelf = readGuestShelf();
      state.progress = readGuestProgress();
      state.configured = false;
    }

    state.ready = true;
    renderAuthControls();
    updateShelfCount();
    syncShelfButtons();
    const year = document.querySelector("[data-current-year]");
    if (year) year.textContent = new Date().getFullYear();
    window.dispatchEvent(new CustomEvent("readshelf:ready", { detail: { configured: state.configured, user: state.user } }));
  }

  async function signOut() {
    try {
      await backend?.signOut?.();
      state.session = null;
      state.user = null;
      state.shelf = [];
      state.progress = {};
      showToast("Signed out");
      setTimeout(() => { location.href = "index.html"; }, 300);
    } catch (error) {
      console.error(error);
      showToast("Could not sign out");
    }
  }

  function initGlobalEvents() {
    document.addEventListener("click", async event => {
      const shelfButton = event.target.closest(".js-shelf-button");
      if (shelfButton) await toggleShelf(shelfButton.dataset.bookId);

      const signout = event.target.closest("[data-signout]");
      if (signout) await signOut();

      const menuButton = event.target.closest("[data-menu-toggle]");
      if (menuButton) {
        const nav = document.querySelector(".mobile-nav");
        if (nav) {
          const open = nav.classList.toggle("open");
          menuButton.setAttribute("aria-expanded", String(open));
        }
      }
    });
  }

  window.ReadShelf = {
    get BOOKS() { return state.books; },
    getShelf,
    getProgress,
    getUser,
    getSession,
    isConfigured,
    isReady,
    toggleShelf,
    setProgress,
    findBook,
    bookCard,
    showToast,
    syncShelfButtons,
    updateShelfCount,
    goToSignIn
  };

  initGlobalEvents();
  document.addEventListener("DOMContentLoaded", hydrate, { once: true });
})();
