/* Locally hosted, rights-checked EPUB titles.
   Never equate Google Books metadata with full-text permission. */
(function () {
  'use strict';

  const installed =
    Array.isArray(window.ReadShelfEbookManifest)
      ? window.ReadShelfEbookManifest
      : [];

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\b(the|a|an)\b/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  const books = installed
    .filter(entry =>
      entry &&
      /^[a-z0-9-]+$/.test(entry.id) &&
      /^assets\/ebooks\/[a-z0-9-]+\.epub$/.test(
        entry.epubPath
      )
    )
    .map(entry => ({
      ...entry,

      source: 'public-domain',

      availableOnReadShelf: true,

      sample: [],

      tags: [
        'Full book',
        entry.genre || 'Classic'
      ],

      initials:
        (entry.title || 'Book')
          .split(/\s+/)
          .slice(0, 2)
          .map(part => part[0])
          .join(''),

      /*
        Use the individual About this book
        description from installed-books.js.
      */
      description:
        entry.description ||
        `Read the complete ${entry.title} by ${entry.author}, right here on ReadShelf.`,

      /*
        All currently installed ReadShelf
        editions are English-language editions.
      */
      language:
        entry.language ||
        'English',

      sourcePage:
        entry.sourcePage || '',

      viewability:
        'ALL_PAGES',

      featured:
        true
    }));

  function findForBook(book) {
    if (!book) return null;

    const direct =
      books.find(
        candidate =>
          candidate.id ===
          book.id
      );

    if (direct) {
      return direct;
    }

    const title =
      normalize(book.title);

    const author =
      normalize(book.author);

    return (
      books.find(candidate => {
        const candidateTitle =
          normalize(
            candidate.title
          );

        const candidateAuthor =
          normalize(
            candidate.author
          );

        return (
          candidateTitle === title &&
          (
            author ===
              candidateAuthor ||
            author.includes(
              candidateAuthor
            ) ||
            candidateAuthor.includes(
              author
            )
          )
        );
      }) || null
    );
  }

  const starter =
    window.READSHELF_BOOKS || [];

  const overrides =
    new Map(
      books.map(book => [
        book.id,
        book
      ])
    );

  /*
    For titles already in data.js,
    preserve the starter metadata but override
    it with the complete installed EPUB metadata.

    This means description and language from
    installed-books.js will now appear on every
    local Book Details page.
  */
  window.READSHELF_BOOKS =
    starter
      .map(book =>
        overrides.has(book.id)
          ? {
              ...book,
              ...overrides.get(
                book.id
              )
            }
          : book
      )
      .concat(
        books.filter(
          book =>
            !starter.some(
              starterBook =>
                starterBook.id ===
                book.id
            )
        )
      );

  window.ReadShelfEbooks = {
    all: () =>
      books.slice(),

    findById: id =>
      books.find(
        book =>
          book.id === id
      ) || null,

    findForBook,

    normalize
  };
})();
