window.ReadShelfGoogleBooksConfig = {
  // ReadShelf uses the same Google Cloud project as Firebase.
  // Enable the Books API for the readshelf-library project.
  // If you later create a separate restricted Books API key, put it here instead.
  apiKey: window.ReadShelfFirebaseConfig?.apiKey || ""
};
