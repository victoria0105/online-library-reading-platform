# ReadShelf

## Online Library & Reading Platform

ReadShelf is an online library and reading platform designed to make it easy for users to discover, save, and read books online. Users can search for books, view detailed information, save books to a personal shelf, read supported public-domain books directly on the website, and synchronize their reading activity with their account.

ReadShelf is being developed as a solo senior project for **CISC 4900 — Supervised Project, Fall 2026, Brooklyn College (CUNY)**.

**Live website:** [ReadShelf](https://myreadshelf.vercel.app)  
**Repository:** [GitHub](https://github.com/victoria0105/online-library-reading-platform)  
**Project board:** [ReadShelf Project Board](https://github.com/users/victoria0105/projects/1)  
**Last documentation update:** November 26, 2026

---

## Latest Development Update — November 26, 2026

The local catalog was expanded from 25 entries to 30. Five classic books from Project Gutenberg were added, and the original ReadShelf demonstration ebook was removed from the catalog and replaced with *A Tale of Two Cities* by Charles Dickens. The collection is now defined as 30 classic titles, with no demonstration entry.

Today's work also focused on visual quality and consistency:

- Added five new classic book entries, individual descriptions, publication years, genres, reference page counts, English-language metadata, and EPUB and cover paths.
- Created custom illustrated covers for the five new books.
- Upgraded older cover illustrations using AI-assisted reconstruction and image processing to improve clarity, lettering, and visual detail while retaining the original visual concepts.
- Standardized the cover presentation, including portrait proportions, decorative gold borders, serif typography, and consistent ReadShelf Edition branding.
- Adjusted cover fitting to display complete titles and author names without cutting off the top or bottom of the artwork.
- Corrected the specific cropping and unwanted bottom margin on *The Call of the Wild* cover.
- Added the **READSHELF EDITION** header to the five recently added covers.
- Replaced the demonstration catalog entry with *A Tale of Two Cities*, including its own matching cover and complete metadata.
- Preserved the existing IDs of the other 29 books so their saved shelf records and reading progress do not need to be migrated.

**Repository verification:** The current catalog on the `main` branch contains 30 entries, including *A Tale of Two Cities*, and no longer contains `readshelf-demo`. All 30 current catalog titles have corresponding JPG cover files in the repository. The EPUB folder still needs to be reconciled with the manifest before claiming that all 30 titles are fully readable. See [Catalog and EPUB verification](#catalog-and-epub-verification).

---

## Project Goals

- Create an easy-to-use online library with live book discovery.
- Display detailed and consistent book information.
- Provide complete in-site reading for supported public-domain books.
- Allow users to save books to a personal shelf and track reading progress.
- Restore the user's saved reading position across sessions.
- Support personal accounts, profiles, and synchronized reading data.
- Provide bookmarks, highlights, notes, and customizable reader settings.
- Create a responsive and accessible user experience.
- Eventually provide personalized recommendations and expanded reading statistics.

## Target Users

- Students and casual readers.
- Readers interested in classic literature and public-domain books.
- Users who want to organize a personal reading collection.
- Readers who want to save their progress, annotations, and reading preferences.
- Users who want to discover additional books through live search.

---

## User Requirements

| ID | Requirement |
| --- | --- |
| UR-01 | Search for books by title, author, or keyword. |
| UR-02 | Browse the local collection and discover additional books through Google Books. |
| UR-03 | View detailed book information. |
| UR-04 | Read supported complete EPUB books directly inside ReadShelf. |
| UR-05 | See whether Google Books results offer full viewing, partial previews, or no public reading access. |
| UR-06 | Add and remove books from My Shelf. |
| UR-07 | Track reading progress. |
| UR-08 | Continue from a previously saved reading position. |
| UR-09 | Register and sign in to a personal account. |
| UR-10 | Sign in using Google. |
| UR-11 | View and update a personal profile. |
| UR-12 | Customize text size, font, line spacing, and theme. |
| UR-13 | Create bookmarks, highlights, and notes. |
| UR-14 | Access the website on different screen sizes. |
| UR-15 | Receive personalized book recommendations (planned). |

## Functional Requirements

The system shall:

- Provide live search through the Google Books API and a browsable local catalog.
- Provide a Book Details page with complete local metadata and accurate reading availability.
- Render supported local EPUB files in an integrated reader.
- Allow authenticated users to save and remove books and synchronize My Shelf through Cloud Firestore.
- Save reading progress and restore it after reload or future sign-in.
- Mark a book as finished when progress reaches 100% and save its exact EPUB reading position.
- Support bookmarks, highlights, notes, and reading preferences.
- Provide secure registration, Email/Password authentication, Google Sign-In, password reset, and sign-out.
- Save and retrieve user profile information in Firestore.
- Restrict private account data to its authenticated owner.
- Support responsive layouts and consistent book-cover presentation.

---

## Use Cases

### 1. Search for a Book

**User:** Reader  
**Goal:** Find a book using live search.

1. Open Browse Books and enter a title, author, or keyword.
2. ReadShelf requests matching results from Google Books and displays available matches.
3. Select a result to view its Book Details and available reading access.

**Expected result:** The user can discover books beyond the local collection.

### 2. Read a Complete Book

**User:** Reader  
**Goal:** Read a public-domain book directly inside ReadShelf.

1. Select a locally installed book with an available EPUB file.
2. Select **Read full book on ReadShelf** from the Book Details page.
3. Navigate using Previous, Next, or the Table of Contents.

**Expected result:** The complete supported book opens without redirecting the user to another website.

### 3. Save a Book

**User:** Signed-in reader  
**Goal:** Save a book for later.

1. Open a book and select **Add to My Shelf**.
2. ReadShelf stores its shelf record in the user's Firestore library.
3. Open My Shelf to view the saved book.

**Expected result:** The book remains available after refresh or future sign-in.

### 4. Continue Reading

**User:** Returning reader  
**Goal:** Continue from a previously saved location.

1. Sign in and open a previously started book.
2. ReadShelf retrieves the saved reading state and progress.
3. Open the reader at the stored EPUB location.

**Expected result:** The reader resumes from the previously saved location.

### 5. Create an Account

**User:** New reader  
**Goal:** Create a ReadShelf account.

1. Open the registration page and enter account information.
2. Firebase Authentication creates the account.
3. ReadShelf creates the associated user profile.

**Expected result:** The user receives a personal account.

### 6. Sign In with Google

**User:** Reader  
**Goal:** Use an existing Google account.

1. Select **Continue with Google**.
2. Complete the Firebase/Google authentication flow.
3. ReadShelf creates or retrieves the associated profile.

**Expected result:** The user accesses personal features without creating a separate password.

### 7. Update Profile

**User:** Signed-in reader  
**Goal:** Save personal profile information.

1. Open Profile and edit the display name, bio, or favorite genres.
2. Save the changes to Firestore.
3. Return to the profile after reload or future sign-in.

**Expected result:** Saved profile information is retrieved.

### 8. Highlight and Save a Note

**User:** Reader  
**Goal:** Save an annotation while reading.

1. Select text inside the EPUB reader.
2. Choose a highlight color and optionally add a note.
3. Save the annotation.

**Expected result:** The highlight and note are available in future reading sessions.

---

## Current Features

| Area | Features |
| --- | --- |
| Discovery | Homepage, Browse Books, live Google Books search, local classic catalog, book details, metadata and cover images. |
| Local reading | EPUB.js reader, page navigation, Table of Contents, bookmarks, highlights, notes, reader customization. |
| Accounts | Registration, email/password login, Google Sign-In, password reset, sign-out, profile editing. |
| Cloud data | Firestore-backed shelf, profile, reading progress, reading locations, and annotations. |
| Visual design | Custom illustrated covers, ReadShelf Edition branding, responsive pages, improved cover fitting. |
| Deployment | GitHub version control, GitHub Projects task management, Vercel hosting. |

---

## Book Sources

ReadShelf uses two complementary sources because book discovery and full-text access are different requirements.

### Google Books API

Google Books is used for live search and metadata, including titles, authors, descriptions, categories, publication dates, page counts, languages, cover images, ISBN identifiers, ratings, and available preview or reading links.

Many Google Books results provide only partial previews, no public pages, or links to an external Google reader. Therefore, Google Books is primarily used for discovery and metadata rather than as the source of every complete in-site book.

### Project Gutenberg and the Local ReadShelf Collection

[Project Gutenberg](https://www.gutenberg.org/) provides public-domain ebook editions that ReadShelf can use for its locally hosted collection, subject to the applicable rights and license notices.

During development, relying only on Google Books did not support the original goal of allowing users to read complete books without leaving ReadShelf. The architecture was therefore expanded to combine Google Books discovery with manually installed EPUB files from Project Gutenberg.

- **Google Books API:** broad book discovery, metadata, covers, and external reading availability.
- **Project Gutenberg:** complete public-domain EPUB editions for the local reader.

This approach supports both a broad searchable catalog and a curated full-book collection.

---

## Local ReadShelf Book Collection

The catalog contains **30 classic titles**. The original demonstration ebook is no longer a catalog entry. The five new titles and the replacement title are marked below with links to their Gutenberg source pages.

| # | Title | Author |
| ---: | --- | --- |
| 1 | Pride and Prejudice | Jane Austen |
| 2 | Sense and Sensibility | Jane Austen |
| 3 | Emma | Jane Austen |
| 4 | Persuasion | Jane Austen |
| 5 | Frankenstein | Mary Shelley |
| 6 | Dracula | Bram Stoker |
| 7 | The Great Gatsby | F. Scott Fitzgerald |
| 8 | The Picture of Dorian Gray | Oscar Wilde |
| 9 | The Adventures of Sherlock Holmes | Arthur Conan Doyle |
| 10 | Alice's Adventures in Wonderland | Lewis Carroll |
| 11 | Little Women | Louisa May Alcott |
| 12 | Moby-Dick | Herman Melville |
| 13 | Jane Eyre | Charlotte Brontë |
| 14 | Wuthering Heights | Emily Brontë |
| 15 | The Strange Case of Dr. Jekyll and Mr. Hyde | Robert Louis Stevenson |
| 16 | The Time Machine | H. G. Wells |
| 17 | The War of the Worlds | H. G. Wells |
| 18 | The Wonderful Wizard of Oz | L. Frank Baum |
| 19 | A Christmas Carol | Charles Dickens |
| 20 | Great Expectations | Charles Dickens |
| 21 | Adventures of Huckleberry Finn | Mark Twain |
| 22 | The Secret Garden | Frances Hodgson Burnett |
| 23 | The Call of the Wild | Jack London |
| 24 | Anne of Green Gables | L. M. Montgomery |
| 25 | [Treasure Island](https://www.gutenberg.org/ebooks/120) | Robert Louis Stevenson |
| 26 | [The Count of Monte Cristo](https://www.gutenberg.org/ebooks/1184) | Alexandre Dumas |
| 27 | [The Adventures of Tom Sawyer](https://www.gutenberg.org/ebooks/74) | Mark Twain |
| 28 | [The Hound of the Baskervilles](https://www.gutenberg.org/ebooks/2852) | Arthur Conan Doyle |
| 29 | [The Jungle Book](https://www.gutenberg.org/ebooks/236) | Rudyard Kipling |
| 30 | [A Tale of Two Cities](https://www.gutenberg.org/ebooks/98) | Charles Dickens |

The catalog is maintained in [`js/installed-books.js`](js/installed-books.js) and integrated into the website through [`js/readable-catalog.js`](js/readable-catalog.js). EPUB assets are stored in [`assets/ebooks/`](assets/ebooks/) and cover images in [`assets/covers/`](assets/covers/).

### Newly Added Book Metadata

| Title | Published | Genre | Reference length | Language |
| --- | ---: | --- | ---: | --- |
| Treasure Island | 1883 | Adventure | 240 pages | English |
| The Count of Monte Cristo | 1844 | Adventure | 1,240 pages | English |
| The Adventures of Tom Sawyer | 1876 | Adventure | 224 pages | English |
| The Hound of the Baskervilles | 1902 | Mystery | 176 pages | English |
| The Jungle Book | 1894 | Adventure | 192 pages | English |
| A Tale of Two Cities | 1859 | Historical Fiction | 489 pages | English |

Page counts are approximate reference values taken from the current catalog, not measured EPUB pagination. The Count of Monte Cristo uses the first year of its original serialization.

### Catalog and EPUB Verification

On November 26, 2026, the `main` branch was checked against the EPUB manifest. The manifest has 30 classic entries and the corresponding cover artwork is present. However, eight referenced EPUB paths were not present in the repository's `assets/ebooks/` directory listing:

- [ ] `alice-wonderland.epub`
- [ ] `huckleberry-finn.epub`
- [ ] `treasure-island.epub`
- [ ] `count-of-monte-cristo.epub`
- [ ] `tom-sawyer.epub`
- [ ] `hound-of-baskervilles.epub`
- [ ] `jungle-book.epub`
- [ ] `tale-of-two-cities.epub`

Upload or restore these EPUB files and test them in the live reader before marking all 30 titles as fully readable. The retired demonstration EPUB and its old cover assets can be removed as repository cleanup after confirming that no remaining functionality references them. No user account data needs to be deleted for this catalog change.

---

## Book Metadata

Every catalog entry includes a stable book ID, title, author, publication year, genre, reference length, language, individual About this book description, cover path, EPUB path, and source information.

The Book Details page displays **Published**, **Genre**, **Length**, and **Language**, together with the individual book description. EPUB pagination changes with the device, font size, and reader settings, so the reference length is not a fixed page total for every reader.

## Book Covers and ReadShelf Edition Design

The local collection uses custom AI-assisted illustrated cover artwork. The design uses classic literary scenes, detailed illustrations, readable serif titles, author names, decorative gold borders, and the **READSHELF EDITION** header.

The November 26 update improved the older illustrations and standardized the newer covers. Some images were regenerated individually; others were adapted from generated preview sheets and resized or refined. These methods improve the visual presentation but do not guarantee identical original details or uniform native image resolution.

Cover presentation was adjusted to show the full artwork rather than crop the title or author's name. A separate correction was made for *The Call of the Wild* to remove an unwanted margin and restore the complete border. The five new covers were revised to include the same ReadShelf Edition branding as the existing collection. *A Tale of Two Cities* received its own matching cover.

The cover files are stored in `assets/covers/`. The catalog references the corresponding JPG filename for each title. Existing filenames and IDs were retained where possible to avoid breaking book cards or saved shelf references.

---

## Google Books Reading Availability

ReadShelf checks Google Books access information instead of assuming every result can be read in full:

- `ALL_PAGES`: full viewing reported available by the API.
- `PARTIAL`: limited preview reported available.
- `NO_PAGES`: no publicly viewable pages reported; an unavailable reading action should not produce a broken preview link.

Books without reading access can still be saved to My Shelf. Locally installed titles use the internal EPUB reader; Google-only results may use an external viewing link when available.

## EPUB Reader

ReadShelf uses EPUB.js and JSZip to render supported locally hosted EPUB files. Reader features include:

- Previous/Next navigation and Table of Contents.
- Reading percentage and automatic progress saving.
- Exact reading-position restoration using EPUB CFI (Canonical Fragment Identifier).
- Bookmarks, text highlights, highlight colors, and personal notes.
- Adjustable text size and line spacing.
- Serif and sans-serif fonts; paper, sepia, and night themes.
- Keyboard navigation and links to Book Details and My Shelf.

The reader handles EPUB opening pages so that legitimate cover/title pages can be displayed while genuinely empty opening pages can be skipped. Returning readers can resume at their saved location.

## Reading Progress Synchronization

For authenticated users, ReadShelf stores book progress under `users/{uid}/library/{bookId}`. The implementation records `progressPercent`, `status`, `lastReadAt`, `updatedAt`, and `completedAt` as applicable.

Progress is designed to be saved during reading, restored after reload or future sign-in, and restricted to the authenticated account. Books with progress between 0% and 100% are marked as reading; reaching 100% marks a book as finished. The EPUB reader also stores the precise CFI location.

## Reader State and Annotations

Detailed EPUB reading state is stored under `users/{uid}/readingSessions/{bookId}`. It can include the book ID, CFI, progress, highlights, notes, bookmarks, and updated timestamp. Guest reading data may be stored locally in the browser; cloud synchronization requires authentication.

---

## Authentication

ReadShelf uses Firebase Authentication for registration, Email/Password sign-in, Google Sign-In, password reset, persistent sessions, and sign-out. Password handling is delegated to Firebase; plaintext passwords are not stored in Firestore. Apple Sign-In remains a possible future feature.

## Cloud Firestore

Cloud Firestore stores user profiles, saved books, reading progress, book metadata snapshots, reader locations, and annotations. Each user document is identified by the Firebase Authentication UID.

### Firestore Structure

```text
users/{uid}
├── displayName
├── email
├── photoURL
├── bio
├── favoriteGenres
├── authProviders
├── createdAt
├── updatedAt
├── library/{bookId}
│   ├── bookId
│   ├── source
│   ├── googleVolumeId
│   ├── titleSnapshot
│   ├── authorSnapshot
│   ├── thumbnailSnapshot
│   ├── genreSnapshot
│   ├── publishedYearSnapshot
│   ├── pagesSnapshot
│   ├── languageSnapshot
│   ├── descriptionSnapshot
│   ├── status
│   ├── favorite
│   ├── progressPercent
│   ├── savedAt
│   ├── updatedAt
│   ├── lastReadAt
│   └── completedAt
└── readingSessions/{bookId}
    ├── bookId
    ├── cfi
    ├── progress
    ├── highlights
    ├── bookmarks
    └── updatedAt
```

The schema above describes the intended user-specific records. See [`docs/FIREBASE_DATABASE_DESIGN.md`](docs/FIREBASE_DATABASE_DESIGN.md) for further design context.

## Firestore Security

Security rules are maintained in [`firebase/firestore.rules`](firebase/firestore.rules). Their intended purpose is to restrict user profiles, library records, progress, reading sessions, and annotations to their authenticated owner. Progress validation and cross-account isolation should be tested against the deployed rules. Public book metadata is separate from private account information.

## My Shelf

Authenticated users can save and remove books and retrieve shelf data across sessions. Firestore stores metadata snapshots together with user-specific status, favorite and reading-progress information. For local titles, the current installed catalog remains the source of truth for book metadata so older saved snapshots do not overwrite updated descriptions, publication years, lengths, languages, or cover information.

## User Profile and Firestore

A user's profile is stored under `users/{uid}`. Profile information can include display name, email, photo URL, bio, favorite genres, authentication providers, and timestamps. Users can edit their display name, bio, and favorite genres. The Profile page also presents account and reading statistics, including saved books, reading and finished counts, and average progress. Profile access is intended to be restricted to its authenticated owner.

---

## Technologies

| Technology | Purpose |
| --- | --- |
| HTML, CSS, JavaScript | Frontend implementation and responsive interface. |
| Firebase Authentication | Account registration and secure sign-in. |
| Cloud Firestore | Cloud storage for profiles, shelf data, and reading state. |
| Google Books API | Live book discovery, metadata, and available previews. |
| Project Gutenberg | Public-domain EPUB editions for the local collection. |
| EPUB.js | In-site rendering of EPUB books. |
| JSZip | Processing EPUB archives. |
| GitHub and GitHub Projects | Source control, documentation, issues, and development planning. |
| Vercel | Website deployment and hosting. |
| AI-assisted image generation | Custom ReadShelf Edition book-cover artwork. |

## Why These Technologies Were Chosen

HTML, CSS, and JavaScript provide direct control over the interface without a large frontend framework. Firebase Authentication avoids the need to directly manage user passwords, while Firestore provides flexible cloud storage for account-specific records. Google Books provides discovery at a much larger scale than a manually maintained catalog, and Project Gutenberg supports complete local reading. EPUB.js and JSZip allow books to open inside the browser. GitHub supports version control and project tracking, and Vercel deploys updates from the repository.

## Architecture

```text
ReadShelf frontend (HTML / CSS / JavaScript)
├── Google Books API → search, metadata, external reading availability
├── Local EPUB catalog → assets/ebooks/ → EPUB.js reader
├── Local cover artwork → assets/covers/
├── Firebase Authentication → account identity (UID)
└── Cloud Firestore → profiles, library, progress, reading sessions

GitHub repository → Vercel deployment → live website
```

The November 26 update expands the existing local EPUB catalog and improves its visual presentation. It does not introduce a new database or change the two-source architecture.

---

## Project Structure

```text
online-library-reading-platform/
├── index.html
├── browse.html
├── book.html
├── reader.html
├── shelf.html
├── signin.html
├── profile.html
├── assets/
│   ├── covers/
│   ├── ebooks/
│   └── logo.svg
├── css/
│   ├── styles.css
│   ├── readshelf-updates.css
│   └── epub-reader.css
├── js/
│   ├── app.js
│   ├── data.js
│   ├── home.js
│   ├── browse.js
│   ├── book.js
│   ├── reader.js
│   ├── shelf.js
│   ├── signin.js
│   ├── profile.js
│   ├── installed-books.js
│   ├── readable-catalog.js
│   ├── reading-store.js
│   ├── reader-links.js
│   ├── book-enhancements.js
│   ├── book-reader-buttons.js
│   ├── cover-fallback.js
│   ├── firebase-config.js
│   ├── firebase-client.js
│   ├── google-books-config.js
│   └── google-books.js
├── firebase/
│   └── firestore.rules
├── docs/
│   ├── BACKEND_ARCHITECTURE.md
│   ├── FEATURES.md
│   ├── FIREBASE_DATABASE_DESIGN.md
│   ├── NEXT_TECH_PLAN.md
│   └── GOOGLE_BOOKS_FIRESTORE_SETUP.md
├── firebase.json
└── README.md
```

This tree highlights the principal application files and documentation, rather than listing every asset.

## Adding More Books

1. Select a suitable public-domain edition from Project Gutenberg and review its rights and license notices.
2. Download the EPUB and place it in `assets/ebooks/` using a unique filename.
3. Create or select matching cover artwork and save it in `assets/covers/`.
4. Add a unique entry to `js/installed-books.js` with complete metadata, the source page, and the correct EPUB and image paths.
5. Preserve existing book IDs when making visual or metadata changes.
6. Commit the files to GitHub and allow Vercel to deploy.
7. Test Browse, Book Details, reader navigation, My Shelf, and saved reading state.

Do not add a catalog entry that claims complete reading access until the actual EPUB is present and can be opened.

---

## Book Sources and Copyright

ReadShelf separates discovery from permission to display complete book content. Google Books provides metadata and access information, while the local reading collection uses Project Gutenberg editions. Public-domain status can vary by country. Project Gutenberg notices and any applicable redistribution or trademark terms should be retained and followed. ReadShelf should not distribute copyrighted full-text material without appropriate permission. Cover artwork, metadata, previews, and external APIs may have separate terms.

## Privacy and Security

ReadShelf collects account and reading information needed for its functionality, including display name, email, profile fields, saved books, reading progress, locations, bookmarks, highlights, notes, and preferences. Private account data is stored under the authenticated user's UID. Passwords are handled by Firebase Authentication.

Security practices include Firestore access rules, authentication domains, input and progress validation, separation of public and private data, and keeping service-account credentials and private keys out of GitHub. Firebase browser configuration values are required by the frontend; private administrator credentials must not be committed.

## Accessibility

ReadShelf aims to support readable interfaces through clear text hierarchy, contrast, responsive layouts, labeled controls, keyboard navigation, error/status messages, adjustable text size and spacing, font choices, and reader themes. Accessibility and cross-device testing remain ongoing.

## AI-Assisted Development

AI-assisted tools have supported research, brainstorming, debugging, code review, documentation, interface design, and custom cover illustration. The November 26 work used these tools to improve earlier cover artwork, create matching designs for six newly introduced titles, and unify branding. AI-generated material is reviewed before integration; generated images are not necessarily exact restorations of the previous artwork.

---

## Current Progress

ReadShelf has developed from an early frontend prototype into a deployed reading platform with cloud-backed features.

### Foundation and project management

- Defined the project goals, user requirements, functional requirements, and use cases.
- Researched library platforms, APIs, public-domain books, authentication, and database technologies.
- Created the GitHub repository, project board, time log, wireframes, and project presentations.
- Built the homepage, Browse, Book Details, My Shelf, Reader, authentication, and profile pages.
- Connected GitHub and Vercel and deployed the website.

### Authentication and cloud data

- Integrated Firebase Authentication, Email/Password, Google Sign-In, and password-reset functionality.
- Added Firestore and user-specific security rules.
- Implemented shelf and profile storage, display-name and bio editing, favorite genres, progress synchronization, completion status, exact reading positions, and reader-state synchronization.
- Added restoration logic for reading and profile information after reload or sign-in.
- Corrected older Firestore metadata overriding the current local catalog.

### Book discovery and reading

- Connected Google Books API search, metadata, covers, and reading-availability handling.
- Established the two-source approach with Project Gutenberg for complete local reading.
- Implemented EPUB reading, Table of Contents, bookmarks, highlights, notes, themes, fonts, and text settings.
- Corrected blank opening-page behavior and restored valid cover/title pages.
- Added individual About this book descriptions, publication years, genres, reference lengths, and languages.

### November 26 — Collection expansion and cover improvements

- Expanded the manifest from 25 to 30 entries with five additional Project Gutenberg classics.
- Replaced the original demonstration ebook in the manifest with *A Tale of Two Cities*.
- Added six new title descriptions and complete catalog metadata.
- Created matching illustrations for the new titles and improved earlier cover artwork.
- Updated cover fitting and corrected the cropping of *The Call of the Wild*.
- Added ReadShelf Edition branding to all five recently added covers.
- Verified 30 catalog entries and corresponding cover assets; identified outstanding EPUB uploads.

## Testing and Verification

Completed implementation and successful manual demonstrations are distinct from full regression testing. The following checks are priorities for final validation:

- Confirm the EPUB path for each of the 30 catalog entries exists and loads.
- Confirm the retired demo does not appear in Browse, search, or newly generated recommendations; check existing saved demo records separately if needed.
- Check the new titles' metadata and cover rendering on Browse and Book Details.
- Check that titles, authors, borders, and branding remain visible on desktop and mobile.
- Test reader navigation, bookmarks, highlights, notes, and exact position restoration.
- Test progress persistence after reload, sign-out/sign-in, and completion at 100%.
- Test profile saving and retrieval, Google Sign-In, password reset, and cross-account Firestore isolation.
- Verify responsive behavior, loading states, error messages, and accessibility.

## Next Steps

- Upload or restore the eight missing EPUB files and test all 30 catalog titles in the live reader.
- Continue expanding the Project Gutenberg collection with suitable public-domain editions.
- Continue testing across browsers, mobile devices, and multiple accounts.
- Improve loading states, error handling, and accessibility.
- Develop reading history, recently viewed books, and personalized recommendations.
- Expand reading statistics and review favorite-book and author features.
- Keep the GitHub Project Board and time log updated.
- Prepare the final project presentation, demonstration, and CISC 4900 documentation.

## Future Features

Possible additions include Apple Sign-In, personalized recommendations, reading history, recently viewed books, favorite authors, reading goals, user ratings, more detailed reading statistics, additional accessibility options, and continued expansion of book discovery and the local collection.

## Professional and Ethical Considerations

ReadShelf is developed with consideration for privacy, security, accessibility, copyright, responsible API usage, appropriate handling of user data, and responsible AI-assisted development. The project aims to provide useful functionality while respecting the rights of content creators and protecting private reading information.

## Project Status

**In active development.** ReadShelf is deployed on Vercel and includes live book discovery, authentication, cloud-backed shelf and profile features, and an integrated EPUB reader for available local books. The catalog now defines 30 classics. Final EPUB reconciliation, regression testing, refinements, and project deliverables remain in progress.

## License

ReadShelf is developed for educational purposes as part of CISC 4900. A final software license may be selected as the project develops. EPUB books, Project Gutenberg notices, Google Books data, cover artwork, libraries, and external resources may have separate copyright, license, and attribution requirements.

## Author

Victoria Palubiatka
