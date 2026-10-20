# ReadShelf Firebase Setup

## 1. Create a separate Firebase project

Create a new Firebase project specifically for **ReadShelf**. Do not reuse an unrelated project.

Suggested project name: `ReadShelf`

## 2. Register the ReadShelf web app

In Firebase Console:

1. Open the ReadShelf project.
2. Add a **Web** app.
3. Name it `ReadShelf Web`.
4. Copy the Firebase configuration object.
5. Paste the values into `js/firebase-config.js`.

Firebase web configuration values are client identifiers. Never put Firebase Admin SDK service-account keys in this repository.

## 3. Enable Authentication

Open **Authentication → Sign-in method** and enable:

- Email/Password
- Google

For the deployed website, make sure `myreadshelf.vercel.app` is listed as an authorized domain for Firebase Authentication.

## 4. Create Cloud Firestore

Create a Cloud Firestore database for ReadShelf. Start in a region appropriate for the project and use the security rules in:

`firebase/firestore.rules`

The rules only allow authenticated users to access documents under their own Firebase UID.

## 5. Database structure

The site creates documents automatically as users register and use ReadShelf:

```text
users/{uid}
users/{uid}/library/{bookId}
```

A separate manual seed step is not required for user accounts.

## 6. Test the account flow

Test these actions on the deployed site:

1. Create an account with email/password.
2. Sign out and sign back in.
3. Sign in with Google.
4. Open `profile.html` and save profile information.
5. Save a book to My Shelf.
6. Change reading progress.
7. Verify the user's documents appear in Firestore.

## 7. Security

- Do not store plain-text passwords in Firestore.
- Do not commit Firebase Admin service-account JSON files.
- Do not add private API credentials to frontend JavaScript.
- Keep Firestore rules deployed and restricted by `request.auth.uid`.
