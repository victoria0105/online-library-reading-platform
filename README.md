# ReadShelf

## Online Library & Reading Platform

ReadShelf is an online library and reading platform designed to make it easy for users to discover, save, and read books online.

The goal of the project is to create a simple and user-friendly website where readers can search for books, view book information, save books to their personal shelf, read available books online, and track their reading progress.

ReadShelf is designed to reduce the number of steps between finding a book and starting to read it.

## Live Website

https://myreadshelf.vercel.app

## Project Goals

- Create an easy-to-use online library
- Help users quickly search and discover books
- Allow users to view detailed book information
- Allow users to read available books online
- Allow users to save books to a personal shelf
- Keep track of reading activity and progress
- Allow users to continue reading from saved progress
- Support user accounts and personal profiles
- Sync personal reading data across devices
- Provide book recommendations based on user interests and reading activity
- Create a simple and responsive user experience
- Make it easy for users to move from finding a book to reading it

## Target Users

ReadShelf is designed for:

- Students
- Casual readers
- Readers looking for legally available online books
- Users who want a simple way to organize books they are interested in
- Readers who want to track their reading progress
- Users who want a personal online reading library

## User Requirements

### UR-01: Search for Books

Users should be able to search for books by title or author.

### UR-02: Browse Books

Users should be able to browse available books and categories.

### UR-03: View Book Information

Users should be able to select a book and view detailed information about it.

### UR-04: Read Books Online

Users should be able to open supported books in an online reader or access an available preview.

### UR-05: Save Books

Users should be able to save books they are interested in to a personal shelf.

### UR-06: Track Reading Progress

Users should be able to keep track of their reading progress.

### UR-07: Continue Reading

Returning users should be able to continue reading from their saved progress.

### UR-08: User Accounts

Users should be able to create an account and sign in to access their profile, saved books, and reading activity.

### UR-09: Third-Party Sign-In

Users should be able to sign in using supported third-party authentication providers such as Google.

### UR-10: User Profile

Users should be able to access and update a personal ReadShelf profile.

### UR-11: Book Recommendations

Users should eventually be able to receive book recommendations based on their interests and reading activity.

### UR-12: Responsive Access

Users should be able to use ReadShelf on different screen sizes and devices.

## Functional Requirements

- The system shall provide a search feature for finding books by title or author.
- The system shall display available books in a browsable catalog.
- The system shall provide a details page for selected books.
- The system shall provide an online reader for supported books.
- The system shall allow users to add and remove books from their personal shelf.
- The system shall support tracking reading progress.
- The system shall provide secure user registration and login.
- The system shall support Email/Password authentication.
- The system shall support Google Sign-In.
- The system shall provide a personal user profile.
- The system shall store user profiles and personal reading data using Firebase and Cloud Firestore.
- The system shall restrict users to their own private account data.
- The system shall eventually use an external books API for live book information.
- The system shall eventually provide personalized book recommendations.
- The system shall provide a responsive interface for different screen sizes.

## Use Cases

### Use Case 1: Search and Read a Book

**User:** Reader

**Goal:** Find a book and begin reading it.

**Steps:**

1. The user opens ReadShelf.
2. The user searches for a book by title or author.
3. ReadShelf displays matching books.
4. The user selects a book.
5. ReadShelf displays information about the book.
6. The user chooses to begin reading.
7. The book opens in the ReadShelf reader or through an available reading source.

**Expected Result:**  
The user can easily move from searching for a book to reading it.

### Use Case 2: Save a Book

**User:** Reader

**Goal:** Save a book to read later.

**Steps:**

1. The user searches for or browses books.
2. The user selects a book.
3. The user chooses to save the book.
4. ReadShelf adds the book to My Shelf.

**Expected Result:**  
The saved book appears on the user's personal shelf.

### Use Case 3: Continue Reading

**User:** Returning Reader

**Goal:** Continue reading a previously started book.

**Steps:**

1. The user signs in.
2. The user opens My Shelf.
3. The user selects a previously started book.
4. ReadShelf loads the saved reading progress.
5. The user continues reading.

**Expected Result:**  
The user can continue reading from their previously saved progress.

### Use Case 4: Create an Account

**User:** New Reader

**Goal:** Create a ReadShelf account.

**Steps:**

1. The user opens the Create Account page.
2. The user enters a name, email address, and password.
3. Firebase Authentication creates the account.
4. ReadShelf creates the user's profile information.
5. The user is signed in.

**Expected Result:**  
The user receives a personal ReadShelf account that can be used to store reading information.

### Use Case 5: Sign In with Google

**User:** Reader

**Goal:** Access ReadShelf without creating a separate password.

**Steps:**

1. The user opens the Sign In page.
2. The user selects Continue with Google.
3. Firebase Authentication opens the Google sign-in process.
4. The user selects a Google account.
5. ReadShelf signs the user in.

**Expected Result:**  
The user can access ReadShelf through their Google account.

### Use Case 6: Manage Profile

**User:** Signed-In Reader

**Goal:** Update personal ReadShelf information.

**Steps:**

1. The user signs in.
2. The user opens the Profile page.
3. The user updates profile information such as display name, bio, or favorite genres.
4. ReadShelf saves the information to Firestore.

**Expected Result:**  
The user's updated profile information is available when they return.

### Use Case 7: No Search Results

**User:** Reader

**Goal:** Search for a book that is not currently available.

**Steps:**

1. The user enters a search term.
2. ReadShelf searches the available books.
3. No matching books are found.
4. ReadShelf displays a clear message to the user.

**Expected Result:**  
The user understands that no matching book was found and can try another search.

## Current Features

The current ReadShelf prototype includes:

- Homepage with book discovery and search
- Browse Books page
- Book Details page
- My Shelf page
- Online Reader page
- Sign In page
- Create Account / Registration page
- User Profile page
- Email and password authentication
- Google Sign-In
- Forgot password functionality
- Book search and filtering
- Save / remove book functionality
- Reading progress interface
- Responsive website layout
- Live deployment using Vercel

### Reader Features

The ReadShelf Reader currently includes:

- Reading progress control
- Reading bookmarks
- Adjustable text size
- Adjustable line spacing
- Serif font option
- Sans-serif font option
- Paper theme
- Sepia theme
- Night theme
- Mark as completed
- Return to Book Details

### User Profile Features

The User Profile interface includes:

- Display name
- Email address
- User bio
- Favorite genres
- Account information
- Saved-book statistics
- Reading statistics
- Reading progress information
- Sign out

## Authentication

ReadShelf uses **Firebase Authentication**.

Current authentication methods include:

- Email and password
- Google Sign-In

The authentication system also includes password reset functionality.

Firebase Authentication handles user passwords and third-party authentication. ReadShelf does not store plain-text passwords in Cloud Firestore.

Apple Sign-In may be added later as an additional authentication option.

## Database

ReadShelf uses **Cloud Firestore** for user-specific application data.

Firestore is designed to store:

- User profiles
- Saved books
- Reading status
- Reading progress
- Favorite books
- User preferences
- Reading activity

### Firestore Structure

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
    │       ├── titleSnapshot
    │       ├── authorSnapshot
    │       ├── thumbnailSnapshot
    │       ├── genreSnapshot
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

The authenticated Firebase UID is used as the Firestore user document ID.

Firestore security rules are included in:

```text
firebase/firestore.rules
```

The rules are designed so that authenticated users can only access and modify their own personal data.

## Book Data

The current prototype uses a small built-in collection of books while the live external book API integration is being developed.

The planned external source for the next phase is the **Google Books API**.

The Google Books API can provide information such as:

- Book title
- Authors
- Description
- Categories
- Published date
- Page count
- Language
- Book cover images
- ISBN and other identifiers
- Preview availability
- Reading availability
- Embeddable status
- Public-domain information when available
- Web reader links

Google Books will be used as the primary source of general book metadata instead of copying an entire book catalog into Firestore.

Firestore will primarily store each user's relationship with books.

## Book Details Page

The Book Details page currently includes:

- Book cover
- Book title
- Author
- Genre
- Publication information
- Page count
- Rating information
- Book description
- Reading availability section
- Save to My Shelf
- Reading progress
- Related books

The Book Details page will later receive live book metadata from the Google Books API.

## Reading Page

The ReadShelf Reader is designed to provide a simple and distraction-free reading experience.

The Reader will eventually use book-access information from the external API to determine whether:

- A book can be read directly
- A book preview can be displayed
- A Google Books viewer can be embedded
- An external reader link should be used
- Reading access is unavailable

ReadShelf should not assume that every book returned by an API can legally be displayed in full.

## Technologies

### Frontend

- HTML
- CSS
- JavaScript

### Backend / Database

- Firebase
- Cloud Firestore

### Authentication

- Firebase Authentication
- Email / Password
- Google Sign-In

### Book Data

- Current: Local prototype book catalog
- Planned: Google Books API

### Development and Deployment

- GitHub
- GitHub Projects
- Vercel

## Why These Technologies Were Chosen

**HTML, CSS, and JavaScript** are used to create the ReadShelf frontend and provide direct control over the website interface.

**GitHub** is used for version control, source-code storage, documentation, and project history.

**GitHub Projects** is used to organize tasks and track development progress throughout the semester.

**Vercel** is used to deploy ReadShelf and automatically publish updates when changes are committed to GitHub.

**Firebase Authentication** provides secure account registration and login without requiring ReadShelf to store passwords directly.

**Cloud Firestore** provides a flexible document database that can store user profiles, personal libraries, and reading progress without maintaining a separate backend server.

**Google Books API** is planned as the main external source for book metadata so ReadShelf does not need to manually maintain a complete book database.

## Book Sources and Licensing

ReadShelf is designed to use books that are legally available for online reading.

The project initially researched public-domain sources such as Project Gutenberg. The current development direction is to use the **Google Books API** as the primary external source for book metadata and reading availability information.

Before displaying full book content, ReadShelf should check the access information provided by the source.

ReadShelf will not intentionally provide copyrighted book content without permission.

Book metadata, images, previews, and external resources may have their own usage requirements and should be handled according to the source's terms.

## Privacy

ReadShelf is designed to collect only the information necessary to provide its features.

User information may include:

- Email address
- Display name
- Profile information
- Favorite genres
- Saved books
- Reading progress
- Reading history
- User preferences

This information is used to provide ReadShelf features and should not be publicly displayed without the user's permission.

Passwords are managed by Firebase Authentication and are not stored in the ReadShelf Firestore database.

More detailed privacy practices can be developed as additional account and recommendation features are implemented.

## Security

Security is an important part of ReadShelf because the application includes user accounts and personal reading information.

Current and planned security practices include:

- Using Firebase Authentication instead of storing passwords directly
- Restricting Firestore data to authenticated users
- Restricting users to their own Firestore documents
- Using Firestore Security Rules
- Using authorized domains for authentication
- Avoiding unnecessary storage of sensitive information
- Validating user input
- Keeping administrator credentials and private keys out of the public repository
- Reviewing third-party API access and permissions

Firebase client configuration values required by the browser may appear in the frontend configuration file.

Private credentials such as service-account files, administrator credentials, private keys, and passwords must never be committed to the public repository.

## Accessibility

ReadShelf aims to provide a simple and accessible reading experience.

Accessibility goals include:

- Clear and readable text
- Good contrast between text and backgrounds
- Clear buttons and labels
- Keyboard-friendly navigation
- Responsive layouts
- Adjustable reader text size
- Adjustable line spacing
- Multiple reading themes
- Simple page organization
- Clear messages when errors occur
- Proper labels for form controls
- Continued usability testing

Accessibility will continue to be tested and improved as development continues.

## AI and Recommendation Features

Personalized book recommendations are planned as a future ReadShelf feature.

Future recommendations may consider:

- Books a user saves
- Books a user reads
- Reading activity
- Favorite genres
- Reading completion
- Book categories
- Similar books

The recommendation system has not been fully implemented yet.

AI-assisted tools may also be used during project development for:

- Research
- Brainstorming
- Debugging
- Documentation
- Code review
- UI/UX ideas

AI-generated code or content should be reviewed before being added to the project.

If automated or AI-based recommendation features are added directly to ReadShelf, their use will be documented.

## Project Structure

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
│
├── css/
│   └── styles.css
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
│   ├── firebase-config.js
│   └── firebase-client.js
│
├── firebase/
│   └── firestore.rules
│
├── docs/
│   ├── BACKEND_ARCHITECTURE.md
│   ├── FEATURES.md
│   ├── FIREBASE_DATABASE_DESIGN.md
│   ├── FIREBASE_SETUP.md
│   └── NEXT_TECH_PLAN.md
│
└── README.md
```

## Current Progress

The project has moved from planning into active frontend and backend development.

Completed work includes:

- Defined the project idea and goals
- Defined user requirements
- Defined functional requirements
- Created project use cases
- Researched existing online library platforms
- Researched copyright and public-domain books
- Researched external book APIs
- Researched database and authentication technologies
- Created the ReadShelf GitHub repository
- Created and maintained the GitHub Project Board
- Created and maintained the project time log
- Created and presented the first project presentation
- Created homepage wireframes
- Designed the main website layout
- Built the ReadShelf homepage
- Built the Browse Books page
- Built the Book Details page
- Built the My Shelf page
- Built the Reader page
- Built the Sign In page
- Built the Create Account interface
- Built the User Profile page
- Added book search and filtering
- Added saved-book functionality
- Added reading progress functionality
- Added reader customization controls
- Created a responsive website layout
- Created a Firebase project specifically for ReadShelf
- Registered ReadShelf as a Firebase Web App
- Connected the ReadShelf website to Firebase
- Enabled Firebase Email/Password Authentication
- Enabled Google Sign-In
- Added the ReadShelf Vercel domain as an authorized Firebase domain
- Successfully tested Email/Password sign-in
- Designed the Cloud Firestore database structure
- Created Firestore Security Rules
- Created Firebase backend documentation
- Connected the GitHub repository to Vercel
- Deployed ReadShelf as a live website
- Improved the Book Details design
- Improved the Reader design
- Improved authentication and account interfaces
- Added project privacy and security planning
- Added accessibility considerations
- Added professional and ethical considerations

## Next Steps

The next development phase will focus on completing user-data synchronization and replacing prototype book information with live external data.

Planned next steps include:

- Complete Cloud Firestore setup and testing
- Verify user profile information is stored correctly
- Verify My Shelf synchronization with Firestore
- Verify reading progress synchronization with Firestore
- Test Google Sign-In completely
- Test password reset functionality
- Connect the Google Books API
- Replace the prototype catalog with live book search results
- Load real book covers and metadata
- Connect Google Books results to the Book Details page
- Use API access information to determine reading availability
- Improve the online reader integration
- Add reading history
- Add recently viewed books
- Develop personalized recommendations
- Improve accessibility and usability
- Improve error messages and loading states
- Continue responsive design testing
- Perform user testing
- Continue maintaining the GitHub Project Board
- Keep project documentation updated
- Prepare future project presentations
- Complete final project documentation

## Future Features

Possible future additions include:

- Apple Sign-In
- Personalized book recommendations
- Reading history
- Recently viewed books
- Favorite authors
- Reading goals
- Book ratings
- More detailed reading statistics
- Recommendation algorithms
- Improved book discovery
- Additional accessibility features

## Professional and Ethical Considerations

ReadShelf is being developed with consideration for:

- Privacy
- Security
- Accessibility
- Copyright
- Responsible use of external APIs
- Responsible storage of user data
- Responsible use of third-party authentication
- Responsible use of AI-assisted development tools

The project should collect only information required for its features and protect user-specific reading data from unauthorized access.

External books, covers, previews, and other resources must be used according to their copyright, licensing, and access requirements.

The goal is not only to create a working website but also to develop ReadShelf using responsible software-development practices.

## Project Status

🚧 **In Active Development**

The ReadShelf frontend is currently live at:

https://myreadshelf.vercel.app

Firebase Authentication is connected, and Email/Password authentication has been successfully tested.

The next major phase of development focuses on:

- Cloud Firestore synchronization
- User profile storage
- My Shelf synchronization
- Reading progress synchronization
- Google Books API integration
- Real book metadata
- Improved reading availability
- Personalized recommendations

This project is being developed as part of:

**CISC 4900 – Supervised Project, Fall 2026**

## License

ReadShelf is currently being developed for educational purposes as part of CISC 4900.

A final software license will be selected as the project develops.

Books, images, metadata, APIs, and other external resources used by ReadShelf may have their own licenses, terms, or public-domain requirements. These resources will be reviewed separately and attributed when required.

## Author

Victoria Palubiatka
