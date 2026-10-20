# ReadShelf prototype features

## Current user flow

1. User lands on Home.
2. User searches or browses books.
3. User opens a Book Details page.
4. User creates an account or signs in with email/password or Google.
5. User can edit a personal profile.
6. User saves books to My Shelf.
7. User updates reading progress in the Reader.
8. Firebase stores signed-in user profile, shelf, and progress data.

## Current account features

- Email/password registration
- Email/password sign-in
- Google Sign-In
- Password reset email
- Sign out
- User profile page
- Display name, bio, and favorite genres
- Reading statistics based on My Shelf
- Firestore-backed shelf and reading progress when Firebase is connected

## Fallback behavior

Before Firebase is connected, the public frontend can still demonstrate the catalog, shelf, and progress locally in the browser. Account forms are intentionally disabled until a valid Firebase project configuration is present.
