# ReadShelf Firebase Database Design

## Goal

ReadShelf should use **Firebase Authentication + Cloud Firestore** for user-specific application data while using an external books API for the public book catalog.

The external API should remain the source of truth for general book metadata. Firestore should not copy an entire public book database.

## Recommended external book source

### Primary: Google Books API

Useful data returned for the ReadShelf UI includes:

- Google Books volume ID
- title
- authors
- description
- categories
- page count
- published date
- language
- cover/image links
- ISBN / industry identifiers
- viewability
- whether the book is embeddable
- whether Google marks it as public domain for the current country
- web reader link

This makes it useful for both the **Book Details** page and deciding what the **Reading** page is allowed to show.

## Firestore structure

```text
users
└── {uid}
    ├── displayName
    ├── email
    ├── photoURL
    ├── authProviders[]
    ├── createdAt
    ├── updatedAt
    │
    ├── library
    │   └── {googleBooksVolumeId}
    │       ├── bookId
    │       ├── titleSnapshot
    │       ├── authorSnapshot
    │       ├── thumbnailSnapshot
    │       ├── status
    │       ├── favorite
    │       ├── savedAt
    │       ├── updatedAt
    │       ├── progressPercent
    │       ├── currentLocation
    │       │   ├── chapter
    │       │   └── page
    │       ├── lastReadAt
    │       └── completedAt
    │
    └── readingSessions
        └── {sessionId}
            ├── bookId
            ├── startedAt
            ├── endedAt
            ├── progressStart
            └── progressEnd

featuredBooks
└── {itemId}
    ├── bookId
    ├── section
    ├── displayOrder
    └── enabled

bookCache                (optional later)
└── {googleBooksVolumeId}
    ├── selectedMetadata
    ├── fetchedAt
    └── expiresAt
```

## Collection details

### `users/{uid}`

One profile document for each Firebase Authentication user.

Example:

```json
{
  "displayName": "Victoria",
  "email": "user@example.com",
  "photoURL": "https://...",
  "authProviders": ["google.com"],
  "createdAt": "server timestamp",
  "updatedAt": "server timestamp"
}
```

Do not store passwords in Firestore. Passwords and third-party credentials are handled by Firebase Authentication.

### `users/{uid}/library/{bookId}`

This should be the most important ReadShelf collection. One document represents one user's relationship with one book.

Recommended fields:

```json
{
  "bookId": "google-books-volume-id",
  "titleSnapshot": "Pride and Prejudice",
  "authorSnapshot": "Jane Austen",
  "thumbnailSnapshot": "https://...",
  "status": "reading",
  "favorite": true,
  "progressPercent": 35,
  "currentLocation": {
    "chapter": "Chapter 6",
    "page": 142
  },
  "savedAt": "server timestamp",
  "updatedAt": "server timestamp",
  "lastReadAt": "server timestamp",
  "completedAt": null
}
```

Suggested `status` values:

- `want_to_read`
- `reading`
- `finished`

Keeping progress and shelf status in the same document makes the first Firebase version simpler than maintaining separate shelf and progress tables.

### `users/{uid}/readingSessions/{sessionId}`

Optional for later. This can support reading history and recommendation logic.

Example:

```json
{
  "bookId": "google-books-volume-id",
  "startedAt": "server timestamp",
  "endedAt": "server timestamp",
  "progressStart": 30,
  "progressEnd": 35
}
```

This is not necessary for the first Firebase milestone.

### `featuredBooks`

Optional small collection for books that ReadShelf wants to feature on the homepage.

Instead of copying complete book metadata, store the external book ID and presentation settings.

```json
{
  "bookId": "google-books-volume-id",
  "section": "popular",
  "displayOrder": 1,
  "enabled": true
}
```

The website can retrieve the actual metadata from the books API.

### `bookCache`

Optional future optimization. Only add this if API calls become slow or repetitive.

Do not build this in the first Firebase version unless it is actually needed.

## Relationships

```text
Firebase Authentication user
          │
          ▼
      users/{uid}
          │
          ├───────────────┐
          ▼               ▼
  library/{bookId}   readingSessions/{sessionId}
          │
          ▼
 Google Books volume ID
          │
          ▼
     Google Books API
```

## Security model

The important rule is:

> A signed-in user can only read and modify documents under their own Firebase user ID.

Example rule pattern:

```text
request.auth != null && request.auth.uid == userId
```

A draft rules file is included at:

`firebase/firestore.rules`

## Authentication design

Recommended order:

1. Email/password authentication
2. Google Sign-In
3. Apple Sign-In if needed

Firebase Authentication supports federated providers such as Google. Apple Sign-In can also be used, but Apple configuration requires additional Apple developer setup.

The user profile should use the Firebase Authentication UID as the Firestore document ID.

## Book API data flow

### Search / Browse

```text
Search text
   ↓
Google Books API
   ↓
Book cards on Browse page
```

### Book Details

```text
Google Books volume ID
   ↓
Google Books API
   ↓
Book metadata + accessInfo
   ↓
Book Details page
```

### Save to My Shelf

```text
User presses Save
   ↓
Firebase Authentication UID
   ↓
users/{uid}/library/{bookId}
```

### Reading

```text
Book Details
   ↓
Check API accessInfo
   ├── embeddable / readable → Reader
   ├── webReaderLink only    → external reading link
   └── not viewable          → show unavailable message
```

ReadShelf should never assume a book is legally readable just because metadata exists. The reading page should respect the access information returned by the external API.

## First implementation milestone

For the first Firebase version, only build:

- Firebase project
- Firebase Authentication
- email/password sign-in
- Google Sign-In
- `users/{uid}`
- `users/{uid}/library/{bookId}`
- My Shelf synchronization
- progress synchronization
- Google Books API search and Book Details data

Add reading sessions, caching, recommendations, and Apple Sign-In afterward.
