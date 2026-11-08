# ReadShelf

## Online Library & Reading Platform

ReadShelf is an online library and reading platform designed to make it easy for users to discover, save, and read books online.

The goal of the project is to create a simple and user-friendly website where readers can search for books, view detailed book information, save books to a personal shelf, read supported books directly inside ReadShelf, and keep their reading progress synchronized with their account.

ReadShelf is designed to reduce the number of steps between discovering a book and beginning to read it.

## Live Website

https://myreadshelf.vercel.app

---

# Project Goals

- Create an easy-to-use online library
- Help users quickly search and discover books
- Allow users to view detailed book information
- Allow users to read complete supported books directly inside ReadShelf
- Allow users to explore additional books using the Google Books API
- Provide public-domain books that can be read without leaving the website
- Allow users to save books to a personal shelf
- Keep track of reading progress
- Allow users to continue reading from their saved position
- Support user accounts and personal profiles
- Synchronize personal reading data
- Support bookmarks, highlights, and notes
- Provide customizable reading settings
- Create a responsive and accessible user experience
- Eventually provide personalized book recommendations

---

# Target Users

ReadShelf is designed for:

- Students
- Casual readers
- Readers interested in classic literature
- Readers looking for public-domain books
- Users who want to organize books they are interested in
- Readers who want to track reading progress
- Users who want a personal online reading library
- Readers who want to discover additional books through live search

---

# User Requirements

## UR-01: Search for Books

Users should be able to search for books by title, author, or keyword.

## UR-02: Browse Books

Users should be able to browse the locally available ReadShelf collection and search additional books through Google Books.

## UR-03: View Book Information

Users should be able to select a book and view detailed information about it.

## UR-04: Read Complete Books

Users should be able to read supported public-domain EPUB books directly inside ReadShelf.

## UR-05: View External Reading Availability

For books discovered through Google Books, users should be able to see whether full reading access, preview access, or no public reading access is available.

## UR-06: Save Books

Users should be able to save books to a personal shelf.

## UR-07: Track Reading Progress

Users should be able to track their reading progress.

## UR-08: Continue Reading

Returning users should be able to continue from their saved reading position.

## UR-09: User Accounts

Users should be able to create an account and sign in to access their personal data.

## UR-10: Third-Party Sign-In

Users should be able to sign in using Google.

## UR-11: User Profile

Users should be able to access and update a personal profile.

## UR-12: Reader Customization

Users should be able to customize text size, font, line spacing, and reading theme.

## UR-13: Reading Annotations

Users should be able to create bookmarks, highlights, and notes.

## UR-14: Responsive Access

Users should be able to use ReadShelf on different screen sizes and devices.

## UR-15: Recommendations

Users should eventually be able to receive recommendations based on their interests and reading activity.

---

# Functional Requirements

- The system shall provide live book search through the Google Books API.
- The system shall display a locally hosted ReadShelf book collection.
- The system shall provide a Book Details page.
- The system shall provide an in-site EPUB reader.
- The system shall display accurate book reading availability.
- The system shall allow users to add and remove books from My Shelf.
- The system shall synchronize My Shelf using Cloud Firestore.
- The system shall save reading progress.
- The system shall save reading position.
- The system shall support bookmarks.
- The system shall support text highlights.
- The system shall support reading notes.
- The system shall support reader customization.
- The system shall provide secure account registration and login.
- The system shall support Email/Password authentication.
- The system shall support Google Sign-In.
- The system shall provide user profiles.
- The system shall restrict users to their own private data.
- The system shall provide complete metadata for installed books.
- The system shall support responsive layouts.

---

# Use Cases

## Use Case 1: Search for a Book

**User:** Reader

**Goal:** Find a book using live search.

### Steps

1. The user opens the Browse Books page.
2. The user enters a title, author, or keyword.
3. ReadShelf sends the query to the Google Books API.
4. Matching books are displayed.
5. The user selects a result.
6. ReadShelf displays the Book Details page.
7. ReadShelf shows the available reading access.

**Expected Result:**  
The user can discover books beyond the locally hosted ReadShelf collection.

---

## Use Case 2: Read a Complete Book

**User:** Reader

**Goal:** Read a public-domain book directly inside ReadShelf.

### Steps

1. The user selects a locally installed book.
2. The Book Details page shows that the full book is available on ReadShelf.
3. The user selects **Read full book on ReadShelf**.
4. ReadShelf opens the EPUB Reader.
5. The user moves through the book using Previous, Next, or the Table of Contents.

**Expected Result:**  
The user can read the complete book without being redirected to another website.

---

## Use Case 3: Save a Book

**User:** Signed-In Reader

**Goal:** Save a book for later.

### Steps

1. The user opens a book.
2. The user selects **Add to My Shelf**.
3. ReadShelf saves the book to the user's Firestore library.
4. My Shelf updates.

**Expected Result:**  
The saved book remains available after the user refreshes or signs in again.

---

## Use Case 4: Continue Reading

**User:** Returning Reader

**Goal:** Continue reading from a previously saved location.

### Steps

1. The user signs in.
2. The user opens a previously started book.
3. ReadShelf loads the saved reading information.
4. The user opens the EPUB Reader.
5. The Reader resumes from the saved location.

**Expected Result:**  
The user continues from where they previously stopped.

---

## Use Case 5: Create an Account

**User:** New Reader

**Goal:** Create a ReadShelf account.

### Steps

1. The user opens the Create Account page.
2. The user enters their account information.
3. Firebase Authentication creates the account.
4. ReadShelf creates the associated user profile.
5. The user is signed in.

**Expected Result:**  
The user receives a personal ReadShelf account.

---

## Use Case 6: Sign In with Google

**User:** Reader

**Goal:** Access ReadShelf using an existing Google account.

### Steps

1. The user opens the Sign In page.
2. The user selects **Continue with Google**.
3. Firebase Authentication opens the Google authentication flow.
4. The user chooses a Google account.
5. ReadShelf signs the user in.

**Expected Result:**  
The user can access ReadShelf without creating a separate password.

---

## Use Case 7: Highlight and Save a Note

**User:** Reader

**Goal:** Save an annotation while reading.

### Steps

1. The user selects text in the EPUB Reader.
2. ReadShelf displays annotation controls.
3. The user selects a highlight color.
4. The user optionally adds a note.
5. The annotation is saved.

**Expected Result:**  
The highlight and note are available when the user returns to the book.

---

# Current Features

The current ReadShelf website includes:

- Homepage with book discovery
- Browse Books page
- Live Google Books API search
- Local public-domain EPUB collection
- Book Details page
- My Shelf page
- Full in-site EPUB Reader
- Sign In page
- Create Account page
- User Profile page
- Email/Password authentication
- Google Sign-In
- Forgot-password functionality
- Firebase Authentication
- Cloud Firestore
- Firestore-backed My Shelf
- Saved reading progress
- Saved reading position
- Real book cover images
- AI-generated custom covers for the local collection
- Complete metadata for installed books
- Google Books reading-access handling
- Responsive layouts
- Live Vercel deployment

---

# Book Sources

ReadShelf uses **two different book sources** because they serve different purposes.

## Google Books API

The **Google Books API** is used for:

- Live book search
- Book discovery
- Titles
- Authors
- Descriptions
- Categories
- Publication dates
- Page counts
- Languages
- Cover images
- ISBN information
- Ratings
- Preview availability
- Reading availability
- Google Books links

Google Books allows ReadShelf users to discover a much larger selection of books.

However, not every Google Books result can be read completely online. Many books only provide a preview or no public reading access.

For this reason, Google Books is primarily used for **discovery and metadata**.

---

# Project Gutenberg and the Local ReadShelf Collection

In addition to the Google Books API, ReadShelf includes a locally hosted collection of public-domain EPUB books obtained from **Project Gutenberg**.

This was an important design decision for the project.

During development, Google Books was successfully connected for live search and metadata. However, many Google Books results redirect users to Google's reading website or only provide limited preview access.

That created a problem for the original ReadShelf concept: the goal of the project is to provide an integrated library where users can discover and read books without constantly leaving the ReadShelf website.

To solve this, ReadShelf uses public-domain EPUB books from **Project Gutenberg** for its complete in-site reading collection.

This creates two complementary systems:

- **Google Books API** → book discovery, live search, covers, metadata, and external preview information
- **Project Gutenberg** → public-domain EPUB books that can be hosted and read completely inside ReadShelf

This allows ReadShelf to provide both a large searchable book database and a smaller curated collection of books that can be fully read inside the website.

---

# Local ReadShelf Book Collection

ReadShelf currently contains **25 installed EPUB entries**, including a ReadShelf demonstration ebook and classic public-domain books.

The collection includes:

- Pride and Prejudice — Jane Austen
- Sense and Sensibility — Jane Austen
- Emma — Jane Austen
- Persuasion — Jane Austen
- Frankenstein — Mary Shelley
- Dracula — Bram Stoker
- The Great Gatsby — F. Scott Fitzgerald
- The Picture of Dorian Gray — Oscar Wilde
- The Adventures of Sherlock Holmes — Arthur Conan Doyle
- Alice's Adventures in Wonderland — Lewis Carroll
- Little Women — Louisa May Alcott
- Moby-Dick — Herman Melville
- Jane Eyre — Charlotte Brontë
- Wuthering Heights — Emily Brontë
- The Strange Case of Dr. Jekyll and Mr. Hyde — Robert Louis Stevenson
- The Time Machine — H. G. Wells
- The War of the Worlds — H. G. Wells
- The Wonderful Wizard of Oz — L. Frank Baum
- A Christmas Carol — Charles Dickens
- Great Expectations — Charles Dickens
- Adventures of Huckleberry Finn — Mark Twain
- The Secret Garden — Frances Hodgson Burnett
- The Call of the Wild — Jack London
- Anne of Green Gables — L. M. Montgomery
- The ReadShelf Reader: An Original Demonstration — ReadShelf

The public-domain classic EPUB editions are part of the locally hosted reading collection based on Project Gutenberg sources, while the ReadShelf demonstration ebook was created specifically for this project.

The EPUB files are stored under:

```text
assets/ebooks/
```

The cover images are stored under:

```text
assets/covers/
```

The installed-book manifest is stored in:

```text
js/installed-books.js
```

---

# Book Metadata

Every locally installed book includes:

- Title
- Author
- Publication year
- Genre
- Length
- Language
- About this book description
- Cover image
- EPUB location
- Reading availability

The Book Details page displays four main metadata fields:

- **Published**
- **Genre**
- **Length**
- **Language**

Each installed book also has an individual **About this book** description.

For EPUB books, the displayed page count is used as catalog/reference metadata. EPUB pagination itself can change depending on screen size, font size, and reading settings.

---

# Book Covers

ReadShelf uses custom illustrated covers for the locally installed books.

The covers were created specifically for this project using **AI-assisted image generation** and then integrated into the ReadShelf interface.

This gives the local collection a consistent visual style instead of relying only on generic text covers.

Cover files are stored under:

```text
assets/covers/
```

---

# Google Books Reading Availability

ReadShelf does not assume that every Google Books result can be read.

Google Books access information is checked before a reading action is displayed.

The interface handles:

- `ALL_PAGES` → full public viewing is available
- `PARTIAL` → a limited preview is available
- `NO_PAGES` → no publicly viewable pages are available

A Google Books result can still be saved to My Shelf even when it cannot be read online.

This keeps **book discovery** separate from **full-text reading permission**.

---

# EPUB Reader

ReadShelf includes a complete in-site EPUB Reader powered by EPUB.js.

The Reader supports:

- Complete locally hosted EPUB books
- Previous page
- Next page
- Table of Contents navigation
- Saved reading position
- Reading progress percentage
- Automatic progress saving
- Bookmarks
- Text highlights
- Notes
- Adjustable text size
- Adjustable line spacing
- Serif font
- Sans-serif font
- Paper theme
- Sepia theme
- Night theme
- Keyboard navigation
- Return to Book Details
- My Shelf shortcut

The Reader also handles EPUB front matter.

When a user opens a book for the first time, ReadShelf can show the book's cover or title page.

If the first page is actually blank, the Reader automatically moves forward to readable content.

Returning users resume from their saved location.

---

# Authentication

ReadShelf uses **Firebase Authentication**.

Current authentication methods include:

- Email and Password
- Google Sign-In

Authentication features include:

- Account registration
- Sign in
- Google authentication
- Password reset
- Persistent sessions
- Sign out

Firebase Authentication handles passwords securely.

ReadShelf does not store plain-text passwords in Firestore.

Apple Sign-In may be considered as a future feature.

---

# Cloud Firestore

ReadShelf uses **Cloud Firestore** for user-specific data.

Firestore stores information such as:

- User profiles
- Saved books
- My Shelf
- Reading status
- Reading progress
- Book metadata snapshots
- User preferences
- Reading-state information

## Firestore Structure

```text
users
└── {uid}
    ├── displayName
    ├── email
    ├── photoURL
    ├── bio
    ├── favoriteGenres
    ├── authProviders
    ├── createdAt
    ├── updatedAt
    │
    ├── library
    │   └── {bookId}
    │       ├── bookId
    │       ├── source
    │       ├── googleVolumeId
    │       ├── titleSnapshot
    │       ├── authorSnapshot
    │       ├── thumbnailSnapshot
    │       ├── genreSnapshot
    │       ├── publishedYearSnapshot
    │       ├── pagesSnapshot
    │       ├── languageSnapshot
    │       ├── descriptionSnapshot
    │       ├── status
    │       ├── favorite
    │       ├── progressPercent
    │       ├── savedAt
    │       ├── updatedAt
    │       ├── lastReadAt
    │       └── completedAt
    │
    └── readingSessions
        └── {sessionId}
```

The authenticated Firebase UID is used as the user's Firestore document ID.

---

# Firestore Security

Firestore security rules are located in:

```text
firebase/firestore.rules
```

The rules are designed so authenticated users can access only their own private data.

Security goals include:

- Users cannot access another user's library
- Users can only modify their own profile
- Users can only modify their own saved books
- Reading progress is restricted to valid values
- Private user information is separated from public book information

---

# My Shelf

My Shelf is synchronized with Firestore for authenticated users.

When a user saves a book, ReadShelf stores information such as:

- Book ID
- Title
- Author
- Cover
- Genre
- Publication year
- Length
- Language
- Description
- Source
- Google Books volume ID when applicable
- Reading availability
- Reading progress

ReadShelf also protects current local book metadata from older Firestore snapshots.

This prevents older saved books from incorrectly displaying fields such as:

- Published: Unknown
- Length: Unknown
- Language: Unknown

The current locally installed book catalog remains the source of truth for the local EPUB collection.

---

# User Profile

The ReadShelf Profile page includes:

- Display name
- Email address
- User bio
- Favorite genres
- Account information
- Saved-book statistics
- Reading statistics
- Reading progress information
- Sign out

Profile information is associated with the authenticated Firebase user.

---

# Technologies

## Frontend

- HTML
- CSS
- JavaScript

## EPUB Reading

- EPUB.js
- JSZip

## Backend / Database

- Firebase
- Cloud Firestore

## Authentication

- Firebase Authentication
- Email / Password
- Google Sign-In

## Book Discovery

- Google Books API

## Full-Book Sources

- Project Gutenberg public-domain EPUB books
- Original ReadShelf demonstration EPUB

## Development and Version Control

- GitHub
- GitHub Projects

## Deployment

- Vercel

## Visual Assets

- AI-assisted custom book-cover generation

---

# Why These Technologies Were Chosen

**HTML, CSS, and JavaScript** provide direct control over the website interface without requiring a large frontend framework.

**Firebase Authentication** provides secure account registration and authentication without requiring ReadShelf to directly manage passwords.

**Cloud Firestore** provides flexible storage for profiles, saved books, and reading progress.

**Google Books API** provides live book discovery and metadata without requiring ReadShelf to maintain a worldwide book database.

**Project Gutenberg** provides public-domain books that can be used for the locally hosted complete-book collection.

**EPUB.js** allows complete EPUB books to be rendered directly inside ReadShelf.

**GitHub** provides source control, project history, documentation, and issue tracking.

**GitHub Projects** is used to organize tasks and development progress.

**Vercel** automatically deploys updated versions of the website from GitHub.

---

# Book Sources and Copyright

ReadShelf separates **book discovery** from **full-text reading access**.

The project uses:

### Google Books API

Used for:

- Discovery
- Live search
- Metadata
- Covers
- External preview information
- Reading availability

### Project Gutenberg

Used for:

- Public-domain EPUB books
- Complete books that can be hosted locally
- Full in-site ReadShelf reading

ReadShelf does not assume that a Google Books result can legally be displayed in full.

Before displaying or linking to reading content, ReadShelf uses the access information supplied by the source.

ReadShelf will not intentionally provide copyrighted full-text content without appropriate permission.

Books, metadata, covers, previews, EPUB files, APIs, and other external resources may have different copyright, licensing, or attribution requirements.

These resources should be handled according to their applicable terms.

---

# Privacy

ReadShelf is designed to collect only information needed for its features.

User information may include:

- Email address
- Display name
- Profile information
- Favorite genres
- Saved books
- Reading progress
- Reading location
- Bookmarks
- Highlights
- Notes
- Reading preferences

This information is used to provide ReadShelf functionality.

Passwords are handled by Firebase Authentication and are not stored directly in the ReadShelf Firestore database.

---

# Security

Current security practices include:

- Firebase Authentication
- Firestore Security Rules
- User-specific Firestore document access
- Firebase authorized authentication domains
- Input validation
- Avoiding unnecessary sensitive-data storage
- Keeping private keys and administrator credentials out of GitHub
- Separating public book metadata from private user data
- Restricting external API usage when appropriate

Firebase browser configuration values may appear in frontend code because they are required by the web application.

Private administrator credentials, service-account files, and private keys must never be committed to the public repository.

---

# Accessibility

ReadShelf aims to provide a readable and accessible interface.

Current accessibility considerations include:

- Clear text hierarchy
- Good contrast
- Responsive layouts
- Clearly labeled controls
- Keyboard navigation
- Adjustable reader text size
- Adjustable line spacing
- Serif and sans-serif options
- Multiple reading themes
- Form labels
- Status messages
- Error messages
- Accessible navigation

Accessibility testing will continue as development progresses.

---

# AI-Assisted Development

AI-assisted tools have been used during ReadShelf development for:

- Research
- Brainstorming
- Debugging
- Code review
- Documentation
- UI/UX development
- Generating custom illustrated covers for the local book collection

AI-generated material is reviewed and adjusted before being integrated into the project.

Future recommendation features may also use automated or algorithmic techniques.

---

# Project Structure

```text
online-library-reading-platform/
│
├── index.html
├── browse.html
├── book.html
├── reader.html
├── shelf.html
├── signin.html
├── profile.html
│
├── assets/
│   ├── covers/
│   ├── ebooks/
│   └── logo.svg
│
├── css/
│   ├── styles.css
│   ├── readshelf-updates.css
│   └── epub-reader.css
│
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
│   │
│   ├── installed-books.js
│   ├── readable-catalog.js
│   ├── reading-store.js
│   ├── reader-links.js
│   │
│   ├── book-enhancements.js
│   ├── book-reader-buttons.js
│   ├── cover-fallback.js
│   │
│   ├── firebase-config.js
│   ├── firebase-client.js
│   │
│   ├── google-books-config.js
│   └── google-books.js
│
├── firebase/
│   └── firestore.rules
│
├── docs/
│   ├── BACKEND_ARCHITECTURE.md
│   ├── FEATURES.md
│   ├── FIREBASE_DATABASE_DESIGN.md
│   ├── NEXT_TECH_PLAN.md
│   └── GOOGLE_BOOKS_FIRESTORE_SETUP.md
│
├── firebase.json
└── README.md
```

---

# Current Progress

ReadShelf has progressed from an early frontend prototype into a working full-stack reading platform.

Completed work includes:

- Defined the project idea and goals
- Defined user requirements
- Defined functional requirements
- Created project use cases
- Researched online library platforms
- Researched copyright and public-domain books
- Researched Project Gutenberg
- Researched external book APIs
- Researched database and authentication technologies
- Created the ReadShelf GitHub repository
- Created the GitHub Project Board
- Created and maintained the project time log
- Created and presented project presentations
- Created homepage wireframes
- Designed the main website layout
- Built the homepage
- Built Browse Books
- Built Book Details
- Built My Shelf
- Built the EPUB Reader
- Built Sign In and Create Account
- Built User Profile
- Added responsive layouts
- Created the ReadShelf Firebase project
- Connected Firebase Authentication
- Enabled Email/Password authentication
- Enabled Google Sign-In
- Added password reset
- Added the ReadShelf Vercel domain to Firebase
- Connected Cloud Firestore
- Added Firestore Security Rules
- Added Firestore-backed My Shelf
- Added reading-progress synchronization
- Added reading-position synchronization
- Connected the Google Books API
- Added live Google Books search
- Added real Google Books metadata
- Added real Google Books covers
- Added Google Books reading-access handling
- Added a locally hosted public-domain EPUB collection
- Integrated Project Gutenberg books for complete in-site reading
- Added the ReadShelf demonstration EPUB
- Added full in-site EPUB reading
- Added Table of Contents navigation
- Added bookmarks
- Added highlights
- Added notes
- Added saved reading positions
- Added adjustable text size
- Added adjustable line spacing
- Added serif and sans-serif fonts
- Added paper, sepia, and night themes
- Fixed blank EPUB opening pages
- Restored EPUB front/title pages
- Added custom AI-generated illustrated covers
- Added custom About this book descriptions
- Added publication year for installed books
- Added genre information
- Added reference length/page information
- Added language information
- Fixed older Firestore metadata overriding new catalog information
- Connected GitHub to Vercel
- Deployed the live website
- Improved responsive behavior
- Added privacy planning
- Added security planning
- Added accessibility considerations
- Added professional and ethical considerations

---

# Next Steps

The next development phase will focus primarily on testing, refinement, recommendation features, and final project preparation.

Planned next steps include:

- Test all locally installed EPUB books
- Test My Shelf with multiple accounts
- Test Firestore security between different users
- Test Google Sign-In across multiple browsers
- Test password reset
- Test reading progress across multiple sessions
- Test bookmarks, highlights, and notes
- Improve mobile and tablet Reader layouts
- Improve error handling
- Improve loading states
- Continue accessibility testing
- Add reading history
- Add recently viewed books
- Add favorite authors/books
- Develop personalized book recommendations
- Add additional reading statistics
- Continue maintaining the GitHub Project Board
- Continue weekly time-log updates
- Prepare the final project presentation
- Record the final project demonstration
- Complete final CISC 4900 documentation

---

# Future Features

Possible future additions include:

- Apple Sign-In
- Personalized book recommendations
- Reading history
- Recently viewed books
- Favorite authors
- Favorite-book controls
- Reading goals
- User ratings
- More detailed reading statistics
- Recommendation algorithms
- Additional accessibility features
- Additional book-discovery features

---

# Professional and Ethical Considerations

ReadShelf is being developed with consideration for:

- Privacy
- Security
- Accessibility
- Copyright
- Responsible use of APIs
- Responsible storage of user data
- Responsible authentication practices
- Responsible use of AI-assisted development tools

The project should collect only information necessary for its features and protect user-specific reading data.

External books, metadata, covers, EPUBs, previews, and other resources must be used according to applicable copyright and licensing requirements.

The goal is not only to create a functional website but also to develop ReadShelf using responsible software-engineering practices.

---

# Project Status

🚧 **In Active Development**

The current ReadShelf website is live at:

https://myreadshelf.vercel.app

Major working components include:

- Firebase Authentication
- Email/Password login
- Google Sign-In
- Cloud Firestore
- Firestore-backed My Shelf
- Saved reading progress
- Saved reading positions
- Google Books API search
- Project Gutenberg public-domain books
- Complete locally hosted EPUB reading
- In-site EPUB Reader
- Bookmarks
- Highlights
- Notes
- Reader customization
- Custom illustrated book covers
- Complete local-book metadata
- Responsive Book Details and Reader interfaces

The remaining development work is focused mainly on testing, recommendations, additional reading-history features, refinement, and final project deliverables.

This project is being developed as part of:

**CISC 4900 – Supervised Project, Fall 2026**

---

# License

ReadShelf is currently being developed for educational purposes as part of CISC 4900.

A final software license may be selected as the project develops.

Project Gutenberg books, EPUB files, metadata, Google Books information, cover artwork, APIs, and other external resources may have their own public-domain, copyright, license, attribution, or usage requirements.

These resources should be reviewed and attributed when required.

---

# Author

Victoria Palubiatka
