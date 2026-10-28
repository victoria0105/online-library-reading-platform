# ReadShelf Google Books + Firestore Setup

This update adds:

- Google Books API search on Browse
- Google Books metadata + cover images
- Book Details loading from Google Books
- Google Books access/viewability handling
- Firestore-backed My Shelf for both starter and Google Books titles
- Firestore-backed reading progress metadata
- Owner-only Firestore security rules

## 1. Enable Google Books API

The code uses the same Google Cloud project/API key already used by the ReadShelf Firebase project.

In Google Cloud Console for project `readshelf-library`:

1. Open **APIs & Services → Library**.
2. Search for **Books API**.
3. Open **Books API** and click **Enable**.
4. Test `browse.html` by searching for a title.

Recommended for production:
- Restrict the browser API key to your website referrers, including `https://myreadshelf.vercel.app/*`.
- Restrict the key to the APIs ReadShelf needs. If you prefer, create a separate Books API key and replace the value in `js/google-books-config.js`.

## 2. Create/verify Cloud Firestore

In Firebase Console:

1. Open the `readshelf-library` project.
2. Go to **Firestore Database**.
3. If no database exists, click **Create database**.
4. Choose **Production mode**.
5. Choose the US region/multi-region appropriate for the project.
6. Create the database.

Do not manually create the `users` collection. ReadShelf creates documents after a user signs in and saves data.

## 3. Publish Firestore rules

Firebase Console → Firestore Database → **Rules**.

Replace the rules with `firebase/firestore.rules` from this update and click **Publish**.

The rules allow:
- a signed-in user to read/write only their own `/users/{uid}` profile;
- the same user to read/write only their own `/users/{uid}/library/{bookId}` documents;
- valid progress values from 0 to 100;
- public reads but no browser writes for optional `featuredBooks` and `bookCache`.

## 4. Upload files to GitHub

Replace:
- `browse.html`
- `book.html`
- `js/app.js`
- `js/browse.js`
- `js/book.js`
- `js/firebase-client.js`
- `firebase/firestore.rules`
- `firebase.json`

Add:
- `js/google-books-config.js`
- `js/google-books.js`

Vercel should redeploy automatically.

## 5. Test

### Google Books
1. Open `/browse.html`.
2. Search `Harry Potter`, `Jane Austen`, or another title/author.
3. Confirm real Google Books covers/results appear.
4. Open a result and confirm Book Details loads.
5. If Google provides a view/preview link, the page shows Read/Preview on Google Books.

### My Shelf + Firestore
1. Sign in.
2. Search Google Books.
3. Press `+` on one Google Books result.
4. Open My Shelf and confirm it appears.
5. Refresh the page and confirm it remains.
6. Firebase Console → Firestore → `users/{yourUid}/library`.
7. Confirm the saved book document contains title/author/thumbnail/access metadata.
8. Remove it from My Shelf and confirm the Firestore document is deleted.

### Security
Test with two different accounts if possible. Each account should see only its own shelf.
