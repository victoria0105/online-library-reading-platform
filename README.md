# ReadShelf

## Online Library & Reading Platform

ReadShelf is an online library and reading platform designed to make it easy for users to discover, save, and read books online.

The goal of the project is to create a simple and user-friendly website where readers can search for books, view book information, save books to their personal shelf, read available books online, and track their reading progress.

## Live Website

https://myreadshelf.vercel.app

---

## Project Goals

- Create an easy-to-use online library
- Help users quickly search and discover books
- Allow users to read available books online
- Allow users to save books to a personal shelf
- Keep track of reading activity and progress
- Provide book recommendations based on user interests and reading activity
- Create a simple and responsive user experience
- Make it easy for users to move from finding a book to reading it

---

## Target Users

ReadShelf is designed for:

- Students
- Casual readers
- Readers looking for public-domain books
- Users who want a simple way to organize books they are interested in
- Readers who want to track their reading progress

---

## User Requirements

### UR-01: Search for Books
Users should be able to search for books by title or author.

### UR-02: Browse Books
Users should be able to browse available books and categories.

### UR-03: View Book Information
Users should be able to select a book and view information about it.

### UR-04: Read Books Online
Users should be able to open available books in an online reader.

### UR-05: Save Books
Users should be able to save books they are interested in to a personal shelf.

### UR-06: Track Reading Progress
Users should be able to keep track of their reading progress.

### UR-07: Continue Reading
Returning users should eventually be able to continue reading from their saved progress.

### UR-08: User Accounts
Users should eventually be able to create an account and sign in to access their saved books and reading activity.

### UR-09: Book Recommendations
Users should eventually be able to receive book recommendations based on their interests and reading activity.

### UR-10: Responsive Access
Users should be able to use ReadShelf on different screen sizes and devices.

---

## Functional Requirements

- The system shall provide a search feature for finding books by title or author.
- The system shall display available books in a browsable catalog.
- The system shall provide a details page for selected books.
- The system shall provide an online reader for supported books.
- The system shall allow users to add and remove books from their personal shelf.
- The system shall support tracking reading progress.
- The system shall eventually provide secure user registration and login.
- The system shall eventually store user accounts, saved books, and reading progress in a database.
- The system shall eventually provide personalized book recommendations.
- The system shall provide a responsive interface for different screen sizes.

---

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
7. The book opens in the online reader.

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
The saved book appears on the user's shelf.

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

### Use Case 4: No Search Results

**User:** Reader

**Goal:** Search for a book that is not currently available.

**Steps:**
1. The user enters a search term.
2. ReadShelf searches the available books.
3. No matching books are found.
4. ReadShelf displays a clear message to the user.

**Expected Result:**  
The user understands that no matching book was found and can try another search.

---

## Current Features

The current ReadShelf frontend prototype includes:

- Homepage with book discovery and search
- Browse Books page
- Book Details page
- My Shelf page
- Online Reader page
- Sign In / account interface
- Book search and filtering
- Prototype saved-book functionality
- Prototype reading progress functionality
- Responsive website layout
- Live deployment using Vercel

Some current features are part of the frontend prototype and are not yet connected to permanent database storage.

---

## Planned Features

- Full user registration and authentication
- Database-backed user accounts
- Database-backed saved books
- Database-backed reading progress
- Reading history
- User profile
- Personalized book recommendations
- More books and book categories
- Integration with public-domain book sources
- Improved online reading experience
- Additional accessibility improvements
- Additional UI/UX improvements

---

## Technologies

### Current Technologies

- HTML
- CSS
- JavaScript
- GitHub
- GitHub Projects
- Vercel

### Planned Backend Technologies

- Supabase
- PostgreSQL
- Supabase Authentication

---

## Why These Technologies Were Chosen

**HTML, CSS, and JavaScript** are being used to build the frontend and create the first working version of ReadShelf.

**GitHub** is used for version control, source-code storage, and project documentation.

**GitHub Projects** is used to organize development tasks and track project progress.

**Vercel** is used to deploy ReadShelf so the current version can be accessed and tested online.

**Supabase** is planned for the backend because it provides database storage and authentication features that can be connected to a web application.

**PostgreSQL** will be used through Supabase to store information such as users, saved books, and reading progress.

---

## Book Sources and Licensing

ReadShelf plans to use books that are legally available for online reading.

The project is exploring public-domain book sources such as Project Gutenberg.

Before book content is added to ReadShelf, its copyright or public-domain status should be checked to make sure it can legally be used. Attribution will be included when required by the source.

ReadShelf will not intentionally provide copyrighted book content without permission.

---

## Privacy

ReadShelf is designed to collect only information that is necessary for its features.

Future user information may include:

- Account information
- Saved books
- Reading progress
- Reading history
- User preferences

This information will be used to provide ReadShelf features and should not be publicly displayed without the user's permission.

More detailed privacy practices will be developed as the database and user account features are implemented.

---

## Security

Security will become especially important as user accounts and database features are added.

Planned security practices include:

- Using Supabase Authentication instead of storing user passwords directly
- Keeping private API keys and credentials outside of the public GitHub repository
- Using environment variables for private credentials
- Restricting database access to authorized users
- Validating user input
- Avoiding unnecessary storage of sensitive information

Private passwords, secret keys, and other sensitive credentials should not be committed to the public repository.

---

## Accessibility

ReadShelf aims to provide a simple and accessible reading experience.

Accessibility goals include:

- Clear and readable text
- Good contrast between text and backgrounds
- Clear buttons and labels
- Keyboard-friendly navigation
- Responsive layouts for different screen sizes
- Simple page organization
- Clear messages when errors occur

Accessibility and usability will continue to be tested and improved as the project develops.

---

## AI and Recommendation Features

Personalized book recommendations are planned as a future ReadShelf feature.

Future recommendations may consider information such as:

- Books a user saves
- Books a user reads
- Reading activity
- Book categories or genres

The recommendation system has not been fully implemented yet.

AI-assisted tools may also be used during project development for research, brainstorming, debugging, and documentation. Any AI-generated code or content should be reviewed before being added to the project.

If AI or other automated recommendation tools are added directly to ReadShelf in the future, their use will be documented.

---

## Project Structure

The current repository contains the main frontend pages and supporting folders.

```text
online-library-reading-platform/
│
├── index.html
├── browse.html
├── book.html
├── reader.html
├── shelf.html
├── signin.html
│
├── assets/
├── css/
├── docs/
├── js/
├── supabase/
│
└── README.md
```

---

## Current Progress

The project has moved from planning into active development.

Completed work includes:

- Defined the project idea and goals
- Researched existing online library platforms
- Researched copyright and public-domain books
- Researched possible technologies and databases
- Created the ReadShelf GitHub repository
- Created and maintained the project board
- Created the project time log
- Created and presented the first project presentation
- Created the homepage wireframe
- Designed the main website layout
- Built the ReadShelf homepage
- Built the Browse Books page
- Built the Book Details page
- Built the My Shelf page
- Built the Reader page
- Built the Sign In page
- Added book search and filtering
- Added prototype saved-book functionality
- Added prototype reading progress functionality
- Created a responsive website layout
- Connected the GitHub repository to Vercel
- Deployed ReadShelf as a live website

---

## Next Steps

- Create and finalize the ReadShelf database structure
- Connect the website to Supabase
- Add real user registration and login
- Store saved books in the database
- Store reading progress in the database
- Add reading history
- Add more books and categories
- Connect the website to a public-domain book data source
- Improve the online reading experience
- Develop personalized book recommendations
- Test the website on different screen sizes
- Improve accessibility and usability
- Continue testing and improving the website
- Keep project documentation updated
- Prepare future project presentations

---

## Professional and Ethical Considerations

ReadShelf is being developed with consideration for privacy, security, accessibility, copyright, and responsible use of third-party resources.

As the project grows, these considerations will be reviewed and updated, especially when user accounts, database storage, external book sources, and recommendation features are implemented.

The goal is not only to create a working website but also to develop ReadShelf using responsible software-development practices.

---

## Project Status

🚧 **In Development**

The frontend prototype is currently live at:

https://myreadshelf.vercel.app

The next major phase of development focuses on the database, authentication, permanent user data storage, and real book data.

This project is being developed as part of **CISC 4900 – Supervised Project, Fall 2026**.

---

## License

ReadShelf is currently being developed for educational purposes as part of CISC 4900.

A final software license will be selected as the project develops.

Books, images, data, and other external resources used by ReadShelf may have their own licenses or public-domain requirements. These resources will be reviewed separately and attributed when required.

---

## Author

Victoria Palubiatka
