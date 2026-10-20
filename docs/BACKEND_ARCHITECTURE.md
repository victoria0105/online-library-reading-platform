# ReadShelf Backend Architecture

## Current direction

ReadShelf uses **Firebase Authentication** for accounts and **Cloud Firestore** for user data. The public book catalog will be supplied by the Google Books API in the next integration phase.

## Data model

```text
Firebase Authentication
        │
        ▼
   users/{uid}
        │
        ├── library/{bookId}
        │      ├── status
        │      ├── progressPercent
        │      └── book metadata snapshot
        │
        └── readingSessions/{sessionId}   (future)
```

### `users/{uid}`

Stores profile information such as display name, email, profile photo URL, authentication providers, bio, and favorite genres.

### `users/{uid}/library/{bookId}`

Stores one user's relationship with one book: saved status, reading status, progress, and lightweight book metadata needed to render My Shelf.

### Public book catalog

ReadShelf should not copy an entire public book database into Firestore. Search and book metadata will come from the Google Books API. Firestore stores user-specific data.

## Frontend integration

- `js/firebase-config.js` — Firebase Web App configuration
- `js/firebase-client.js` — Firebase Auth + Firestore data functions
- `js/app.js` — shared application state, navigation, My Shelf and progress synchronization
- `js/signin.js` — email/password registration, login, Google Sign-In, password reset
- `profile.html` + `js/profile.js` — user profile and reading statistics
- `firebase/firestore.rules` — Firestore security rules

## Fallback mode

If Firebase has not yet been configured, the public frontend still works with the bundled starter books and browser `localStorage`. Account actions remain disabled until the Firebase project configuration is added.
