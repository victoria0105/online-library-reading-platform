(function () {
  const SDK_VERSION = "13.0.0";
  const config = window.ReadShelfFirebaseConfig || {};
  let servicesPromise = null;
  let libraryPromise = null;
  let libraryPromiseUid = null;

  function isConfigured() {
    return Boolean(
      config.apiKey && !String(config.apiKey).startsWith("YOUR_") &&
      config.projectId && !String(config.projectId).startsWith("YOUR_") &&
      config.appId && !String(config.appId).startsWith("YOUR_")
    );
  }

  function configurationError() {
    return new Error("Firebase is not connected yet. Add the ReadShelf Firebase web configuration in js/firebase-config.js.");
  }

  async function services() {
    if (!isConfigured()) throw configurationError();
    if (!servicesPromise) {
      servicesPromise = Promise.all([
        import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-auth.js`),
        import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-firestore.js`)
      ]).then(([appMod, authMod, fsMod]) => {
        const app = appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(config);
        const auth = authMod.getAuth(app);
        const db = fsMod.getFirestore(app);
        return { app, auth, db, authMod, fsMod };
      });
    }
    return servicesPromise;
  }

  function normalizeUser(user) {
    if (!user) return null;
    return {
      id: user.uid,
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      emailVerified: Boolean(user.emailVerified),
      providers: (user.providerData || []).map(item => item.providerId).filter(Boolean)
    };
  }

  async function authReady() {
    const { auth } = await services();
    if (typeof auth.authStateReady === "function") await auth.authStateReady();
    return auth;
  }

  function providerIds(user) {
    return [...new Set((user.providerData || []).map(item => item.providerId).filter(Boolean))];
  }

  async function ensureProfile(user) {
    const { db, fsMod } = await services();
    const ref = fsMod.doc(db, "users", user.uid);
    const snap = await fsMod.getDoc(ref);
    const base = {
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      authProviders: providerIds(user),
      updatedAt: fsMod.serverTimestamp()
    };
    if (!snap.exists()) base.createdAt = fsMod.serverTimestamp();
    await fsMod.setDoc(ref, base, { merge: true });
    return ref;
  }

  function resolveBook(bookOrId) {
    if (bookOrId && typeof bookOrId === "object") return bookOrId;
    const id = String(bookOrId || "");
    return window.ReadShelf?.findBook?.(id) ||
      (window.READSHELF_BOOKS || []).find(item => item.id === id) ||
      { id, title: "Saved book", author: "Unknown author", genre: "Book", tags: [] };
  }

  function bookSnapshot(bookOrId) {
    const book = resolveBook(bookOrId);
    const bookId = String(book.id || bookOrId || "");
    return {
      bookId,
      source: book.source || "local",
      googleVolumeId: book.googleVolumeId || "",
      titleSnapshot: String(book.title || "Saved book").slice(0, 300),
      authorSnapshot: String(book.author || "Unknown author").slice(0, 300),
      thumbnailSnapshot: String(book.thumbnail || "").slice(0, 1000),
      genreSnapshot: String(book.genre || "Book").slice(0, 120),
      tagsSnapshot: Array.isArray(book.tags) ? book.tags.slice(0, 6).map(String) : [],
      initialsSnapshot: String(book.initials || "").slice(0, 8),
      coverClassSnapshot: String(book.coverClass || "").slice(0, 80),
      publishedYearSnapshot: Number(book.year || 0),
      descriptionSnapshot: String(book.description || "").slice(0, 1800),
      pagesSnapshot: Number(book.pages || 0),
      ratingSnapshot: Number(book.rating || 0),
      languageSnapshot: String(book.language || "").slice(0, 24),
      webReaderLink: String(book.webReaderLink || "").slice(0, 1500),
      previewLink: String(book.previewLink || "").slice(0, 1500),
      infoLink: String(book.infoLink || "").slice(0, 1500),
      viewability: String(book.viewability || "").slice(0, 40),
      publicDomain: Boolean(book.publicDomain),
      embeddable: Boolean(book.embeddable)
    };
  }

  async function readLibrary(uid, force = false) {
    if (!force && libraryPromise && libraryPromiseUid === uid) return libraryPromise;
    libraryPromiseUid = uid;
    libraryPromise = services().then(async ({ db, fsMod }) => {
      const snap = await fsMod.getDocs(fsMod.collection(db, "users", uid, "library"));
      return snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    }).finally(() => {
      setTimeout(() => {
        libraryPromise = null;
        libraryPromiseUid = null;
      }, 400);
    });
    return libraryPromise;
  }

  async function getSession() {
    if (!isConfigured()) return null;
    const auth = await authReady();
    return auth.currentUser ? { user: normalizeUser(auth.currentUser) } : null;
  }

  async function signIn(email, password) {
    const { auth, authMod } = await services();
    const credential = await authMod.signInWithEmailAndPassword(auth, email, password);
    await ensureProfile(credential.user);
    return { session: { user: normalizeUser(credential.user) }, user: normalizeUser(credential.user) };
  }

  async function signUp(email, password, displayName) {
    const { auth, authMod } = await services();
    const credential = await authMod.createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await authMod.updateProfile(credential.user, { displayName });
    await ensureProfile(credential.user);
    return { session: { user: normalizeUser(credential.user) }, user: normalizeUser(credential.user) };
  }

  async function signInWithGoogle() {
    const { auth, authMod } = await services();
    const provider = new authMod.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const credential = await authMod.signInWithPopup(auth, provider);
    await ensureProfile(credential.user);
    return { session: { user: normalizeUser(credential.user) }, user: normalizeUser(credential.user) };
  }

  async function signOut() {
    if (!isConfigured()) return;
    const { auth, authMod } = await services();
    await authMod.signOut(auth);
  }

  async function sendPasswordReset(email) {
    const { auth, authMod } = await services();
    await authMod.sendPasswordResetEmail(auth, email);
  }

  async function fetchBooks() { return []; }

  async function fetchLibrary(uid) {
    return readLibrary(uid, true);
  }

  async function fetchShelf(uid) {
    const rows = await readLibrary(uid);
    return rows.map(row => row.id);
  }

  async function fetchProgress(uid) {
    const rows = await readLibrary(uid);
    return Object.fromEntries(rows.map(row => [row.id, Number(row.progressPercent || 0)]));
  }

  async function addToShelf(uid, bookOrId) {
    const book = resolveBook(bookOrId);
    const bookId = String(book.id || bookOrId || "");
    const { db, fsMod } = await services();
    const ref = fsMod.doc(db, "users", uid, "library", bookId);
    const snap = await fsMod.getDoc(ref);
    const existing = snap.exists() ? snap.data() : {};
    const data = {
      ...bookSnapshot(book),
      status: existing.status || "want_to_read",
      progressPercent: Number(existing.progressPercent || 0),
      favorite: Boolean(existing.favorite),
      updatedAt: fsMod.serverTimestamp()
    };
    if (!snap.exists()) data.savedAt = fsMod.serverTimestamp();
    await fsMod.setDoc(ref, data, { merge: true });
    libraryPromise = null;
  }

  async function removeFromShelf(uid, bookId) {
    const { db, fsMod } = await services();
    await fsMod.deleteDoc(fsMod.doc(db, "users", uid, "library", bookId));
    libraryPromise = null;
  }

  async function saveProgress(uid, bookId, value) {
    const { db, fsMod } = await services();
    const percent = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
    const ref = fsMod.doc(db, "users", uid, "library", bookId);
    const snap = await fsMod.getDoc(ref);
    const data = {
      ...bookSnapshot(bookId),
      progressPercent: percent,
      status: percent >= 100 ? "finished" : percent > 0 ? "reading" : "want_to_read",
      updatedAt: fsMod.serverTimestamp(),
      lastReadAt: fsMod.serverTimestamp()
    };
    if (!snap.exists()) data.savedAt = fsMod.serverTimestamp();
    if (percent >= 100) data.completedAt = fsMod.serverTimestamp();
    await fsMod.setDoc(ref, data, { merge: true });
    libraryPromise = null;
  }

  async function getProfile(uid) {
    const { db, fsMod } = await services();
    const snap = await fsMod.getDoc(fsMod.doc(db, "users", uid));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  }

  async function updateProfileData(uid, data) {
    const { auth, db, authMod, fsMod } = await services();
    const clean = {
      displayName: String(data.displayName || "").trim().slice(0, 80),
      bio: String(data.bio || "").trim().slice(0, 300),
      favoriteGenres: Array.isArray(data.favoriteGenres) ? data.favoriteGenres.slice(0, 12) : [],
      updatedAt: fsMod.serverTimestamp()
    };
    await fsMod.setDoc(fsMod.doc(db, "users", uid), clean, { merge: true });
    if (auth.currentUser && auth.currentUser.uid === uid && clean.displayName !== auth.currentUser.displayName) {
      await authMod.updateProfile(auth.currentUser, { displayName: clean.displayName });
    }
    return clean;
  }

  async function getUserStats(uid) {
    const rows = await readLibrary(uid, true);
    const saved = rows.length;
    const reading = rows.filter(row => row.status === "reading").length;
    const finished = rows.filter(row => row.status === "finished" || Number(row.progressPercent || 0) >= 100).length;
    const wantToRead = rows.filter(row => row.status === "want_to_read" || !row.status).length;
    const averageProgress = saved ? Math.round(rows.reduce((sum, row) => sum + Number(row.progressPercent || 0), 0) / saved) : 0;
    return { saved, reading, finished, wantToRead, averageProgress, library: rows };
  }

  window.ReadShelfBackend = {
    isConfigured,
    getSession,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    sendPasswordReset,
    fetchBooks,
    fetchLibrary,
    fetchShelf,
    fetchProgress,
    addToShelf,
    removeFromShelf,
    saveProgress,
    getProfile,
    updateProfile: updateProfileData,
    getUserStats
  };
})();
