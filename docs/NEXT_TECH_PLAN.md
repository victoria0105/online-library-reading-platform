# ReadShelf Next Technology Plan

## Supervisor direction

The next development phase will follow these choices:

- **Database / backend:** Firebase
- **Database product:** Cloud Firestore
- **Authentication:** Firebase Authentication
- **Third-party sign-in:** Google Sign-In first; Apple Sign-In as an additional option
- **Public book data:** external public books API rather than Project Gutenberg
- **Recommended API for the first implementation:** Google Books API

## Why this direction fits ReadShelf

### Firebase

Firebase is suitable for this student project because authentication and database storage can be connected without maintaining a separate backend server.

### Google Books API

The API can supply the public catalog instead of manually adding every book to ReadShelf. The application only needs to store each user's relationship to a book in Firestore.

### Google Sign-In

Google Sign-In is the first third-party provider to implement because it is directly supported through Firebase Authentication and is appropriate for a web application.

### Apple Sign-In

Apple Sign-In can be added after Google Sign-In. Its configuration requires Apple developer setup, so it should not block the first authentication milestone.

## Planned implementation order

1. Finalize Book Details and Reader page design.
2. Create a new Firebase project specifically for ReadShelf.
3. Configure Cloud Firestore.
4. Configure Firebase Authentication.
5. Add email/password authentication.
6. Add Google Sign-In.
7. Connect Browse search to Google Books API.
8. Load real API metadata into Book Details.
9. Save My Shelf records to Firestore.
10. Save reading progress to Firestore.
11. Use Google Books access information to decide whether the Reader, preview, or external reading link is available.
12. Add Apple Sign-In if desired.
13. Add recommendation logic after enough reading/shelf data exists.
