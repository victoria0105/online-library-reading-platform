# ReadShelf prototype features

## Current user flow

1. User lands on Home.
2. User searches or browses books.
3. User opens the redesigned Book Details page.
4. User sees description, metadata, reading availability, progress, and related titles.
5. User can save the title to My Shelf.
6. User opens the redesigned Reader.
7. User can change text size, line spacing, font, and reading theme.
8. User can save reading progress and a local reading-position bookmark.

## Current prototype storage

The frontend currently uses browser `localStorage` for demo behavior such as shelf items, reading progress, reader preferences, and bookmarks.

This is temporary. The next backend milestone will move user-specific data to Firebase Authentication and Cloud Firestore.

## Planned production data flow

- **Public book catalog:** Google Books API
- **Account authentication:** Firebase Authentication
- **User database:** Cloud Firestore
- **Third-party login:** Google Sign-In first, Apple Sign-In afterward if needed
- **Saved books / reading progress:** `users/{uid}/library/{bookId}` in Firestore

See:

- `docs/FIREBASE_DATABASE_DESIGN.md`
- `docs/NEXT_TECH_PLAN.md`
- `firebase/firestore.rules`
