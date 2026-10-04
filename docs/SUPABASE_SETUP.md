# ReadShelf Supabase Setup

The website is already wired for Supabase. The only values that must be filled in after a ReadShelf Supabase project exists are the project URL and the project's **publishable** browser key.

## 1. Create or select a ReadShelf Supabase project

Use a dedicated project for ReadShelf rather than reusing an unrelated application database.

## 2. Create the database tables

Open the Supabase SQL editor for the ReadShelf project and run:

```text
supabase/schema.sql
```

That script creates:

- `books` — public book catalog
- `user_shelf` — each user's saved books
- `reading_progress` — each user's saved progress
- Row Level Security policies
- least-privilege Data API grants
- the starter public-domain book catalog

## 3. Add the frontend project values

Open:

```text
js/supabase-config.js
```

Replace:

```js
url: "YOUR_SUPABASE_PROJECT_URL",
publishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY"
```

with the URL and publishable key from the Supabase project.

A publishable key is intended for browser applications. **Never** put a `service_role` or secret key in this file, GitHub, or any browser code.

## 4. Configure authentication

ReadShelf uses email + password authentication.

For a classroom/local demo, you can keep email confirmation enabled or disable it depending on your presentation needs. If confirmation is enabled, new users will be asked to verify their email before signing in.

For deployed versions, add your production site URL and allowed redirect URLs in Supabase Auth settings.

## 5. Run the website

From the ReadShelf folder:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

Do not use `file://` for the final authentication test; serve the site over HTTP locally or deploy it.

## Expected behavior

### Signed out

- Browse and search the book catalog
- Open book details
- Read sample book content
- Sign in / create an account
- Saving to My Shelf prompts the user to sign in
- Progress requires an account to sync

### Signed in

- Session stays active across page loads
- My Shelf is loaded from `user_shelf`
- Adding/removing books updates Supabase
- Reading progress is loaded from `reading_progress`
- Progress changes are upserted to Supabase
- Sign out clears the active session

## Security design

The frontend only uses the Supabase project URL and publishable key. Database authorization is enforced with Row Level Security:

- Everyone can read `books`
- Authenticated users can only read/write shelf rows where `user_id = auth.uid()`
- Authenticated users can only read/write progress rows where `user_id = auth.uid()`

This means one user cannot fetch or edit another user's shelf or reading progress through the browser client.
