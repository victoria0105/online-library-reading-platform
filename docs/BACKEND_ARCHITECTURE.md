# ReadShelf Backend Architecture

## Data model

```text
auth.users
    │
    ├──< user_shelf >── books
    │
    └──< reading_progress >── books
```

### books

Stores the shared catalog: title, author, genre, book metadata, and short reading samples.

### user_shelf

Composite key: `user_id + book_id`.

A row means that a signed-in user saved that book.

### reading_progress

Composite key: `user_id + book_id`.

Stores a value from 0–100 representing the user's reading progress.

## Frontend integration

- `js/supabase-config.js` — project URL and publishable key
- `js/supabase-client.js` — Auth and database calls
- `js/app.js` — shared application state and sync logic
- `js/signin.js` — account creation and login
- `supabase/schema.sql` — database schema, RLS, grants, and seed books

## Fallback mode

Until Supabase is configured, the website keeps the original bundled book catalog and local browser storage. This allows the frontend to remain demonstrable while backend setup is pending.

As soon as valid Supabase project settings are added, ReadShelf automatically switches to server-backed account data.
