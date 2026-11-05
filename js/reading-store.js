/* Per-user reading location, bookmarks, notes, and highlights.
 * Uses the already-authorized users/{uid}/readingSessions/{bookId} collection.
 * Guest use is local-only; the app must never claim that guest state is cloud synced.
 */
(function () {
  'use strict';
  const VERSION = '13.0.0';
  let sdkPromise;
  function localKey(bookId) { return `readshelf:epub-state:v1:${bookId}`; }
  function localRead(bookId) {
    try { return JSON.parse(localStorage.getItem(localKey(bookId)) || 'null') || {}; }
    catch { return {}; }
  }
  function localWrite(bookId, state) {
    localStorage.setItem(localKey(bookId), JSON.stringify(state));
  }
  function firebase() {
    if (!sdkPromise) {
      sdkPromise = Promise.all([
        import(`https://www.gstatic.com/firebasejs/${VERSION}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${VERSION}/firebase-firestore.js`)
      ]).then(([app, firestore]) => ({ firestore, db: firestore.getFirestore(app.getApp()) }))
        .catch(error => { sdkPromise = undefined; throw error; });
    }
    return sdkPromise;
  }
  function user() { return window.ReadShelf?.getUser?.() || null; }
  function keyValid(bookId) { return /^[a-z0-9-]{1,120}$/.test(bookId); }
  async function load(bookId) {
    if (!keyValid(bookId)) throw new Error('Invalid reading book ID');
    const account = user();
    if (!account || !window.ReadShelf?.isConfigured?.()) return { state: localRead(bookId), mode: 'local' };
    try {
      const { firestore: fs, db } = await firebase();
      const doc = await fs.getDoc(fs.doc(db, 'users', account.id, 'readingSessions', bookId));
      return { state: doc.exists() ? doc.data() : {}, mode: 'cloud' };
    } catch (error) {
      console.error('Could not load cloud reading state:', error);
      return { state: localRead(bookId), mode: 'offline' };
    }
  }
  async function save(bookId, state) {
    if (!keyValid(bookId)) throw new Error('Invalid reading book ID');
    const clean = {
      bookId,
      cfi: String(state.cfi || '').slice(0, 800),
      progress: Math.min(100, Math.max(0, Number(state.progress) || 0)),
      highlights: (Array.isArray(state.highlights) ? state.highlights : []).slice(-300)
        .map(h => ({ id: String(h.id || '').slice(0, 100), cfi: String(h.cfi || '').slice(0, 800),
          text: String(h.text || '').slice(0, 1500), note: String(h.note || '').slice(0, 1500),
          color: ['yellow','green','pink'].includes(h.color) ? h.color : 'yellow' })),
      bookmarks: (Array.isArray(state.bookmarks) ? state.bookmarks : []).slice(-100)
        .map(b => ({ id: String(b.id || '').slice(0, 100), cfi: String(b.cfi || '').slice(0, 800),
          label: String(b.label || '').slice(0, 150) }))
    };
    localWrite(bookId, clean);
    const account = user();
    if (!account || !window.ReadShelf?.isConfigured?.()) return 'local';
    try {
      const { firestore: fs, db } = await firebase();
      await fs.setDoc(fs.doc(db, 'users', account.id, 'readingSessions', bookId),
        { ...clean, updatedAt: fs.serverTimestamp() }, { merge: true });
      return 'cloud';
    } catch (error) {
      console.error('Could not sync cloud reading state:', error);
      return 'offline';
    }
  }
  window.ReadShelfReadingStore = { load, save };
})();
