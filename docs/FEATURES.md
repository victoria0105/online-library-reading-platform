# ReadShelf prototype features

## User flow

1. User lands on Home.
2. User searches or browses categories.
3. User opens a Book Details page.
4. User can save the title to My Shelf.
5. User opens Reader and adjusts reading progress.
6. Progress is visible when the title is opened again.

## Prototype storage

The frontend uses browser `localStorage` for two demo values:

- `readshelf:shelf`
- `readshelf:progress`

These should later be replaced by authenticated database records.
