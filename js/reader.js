/* ReadShelf in-site full EPUB reader. Uses EPUB.js for pagination, CFIs and annotations. */
(function () {
  'use strict';

  const $ = selector => document.querySelector(selector);

  const COLORS = {
    yellow: '#f3d348',
    green: '#91ca89',
    pink: '#e9a2b8'
  };

  const PREFS_KEY = 'readshelf:epub-prefs';

  let epub;
  let rendition;
  let book;
  let state;
  let pendingSelection;
  let currentCfi = '';

  let locationsReady = false;
  let saveTimer;
  let saveQueue = Promise.resolve();
  let restorePending = false;

  let prefs = {
    fontSize: 20,
    lineHeight: 1.7,
    font: 'serif',
    theme: 'paper'
  };

  const defaultState = () => ({
    cfi: '',
    progress: 0,
    highlights: [],
    bookmarks: []
  });

  function text(el, value) {
    const node = $(el);

    if (node) {
      node.textContent = String(value);
    }
  }

  function safePrefs() {
    try {
      const raw = JSON.parse(
        localStorage.getItem(PREFS_KEY) || '{}'
      );

      return {
        ...prefs,
        ...raw
      };
    } catch {
      return prefs;
    }
  }

  function showError(message) {
    const el = $('#readerStatus');

    if (!el) return;

    el.hidden = false;
    el.classList.add('error');
    el.replaceChildren();

    const paragraph = document.createElement('p');
    paragraph.textContent = message;

    const link = document.createElement('a');
    link.href = 'browse.html';
    link.textContent = 'Browse other books';

    el.append(paragraph, link);
  }

  function syncing(label) {
    text('#syncStatus', label);
  }

  function dateId() {
    return `r${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
  }

  function snapshot() {
    return JSON.parse(
      JSON.stringify(state)
    );
  }

  function queueSave(immediate = false) {
    if (!state || !book) return;

    clearTimeout(saveTimer);

    const run = () => {
      const current = snapshot();

      syncing(
        window.ReadShelf.getUser()
          ? 'Saving to your ReadShelf account…'
          : 'Saving in this browser…'
      );

      saveQueue = saveQueue
        .catch(() => {})
        .then(async () => {
          const mode =
            await window.ReadShelfReadingStore.save(
              book.id,
              current
            );

          syncing(
            mode === 'cloud'
              ? '✓ Synced to your account'
              : mode === 'offline'
                ? 'Cloud unavailable — saved in this browser'
                : 'Saved in this browser · sign in to sync'
          );
        });
    };

    if (immediate) {
      run();
    } else {
      saveTimer = setTimeout(
        run,
        650
      );
    }
  }

  function percentage(cfi) {
    if (
      !locationsReady ||
      !cfi
    ) {
      return state.progress || 0;
    }

    try {
      const value =
        epub.locations.percentageFromCfi(
          cfi
        );

      return Number.isFinite(value)
        ? Math.max(
            0,
            Math.min(
              100,
              Math.round(
                value * 100
              )
            )
          )
        : state.progress || 0;
    } catch {
      return state.progress || 0;
    }
  }

  function drawProgress() {
    const number =
      Math.round(
        Number(state.progress) || 0
      );

    text(
      '#progressValue',
      `${number}%`
    );

    text(
      '#readerLocation',
      `${number}% complete`
    );

    $('#bookProgressFill').style.width =
      `${number}%`;

    $('#readerProgressLine').style.width =
      `${number}%`;
  }

  function applyPreferences() {
    if (!rendition) return;

    const size =
      Math.max(
        16,
        Math.min(
          30,
          Number(prefs.fontSize) || 20
        )
      );

    const spacing =
      Math.max(
        1.4,
        Math.min(
          2.2,
          Number(prefs.lineHeight) || 1.7
        )
      );

    const themes = {
      paper: {
        background: '#fffdf8',
        color: '#18211c'
      },

      sepia: {
        background: '#f4ead7',
        color: '#3e3023'
      },

      night: {
        background: '#1f2421',
        color: '#eaf0ea'
      }
    };

    const selectedTheme =
      themes[prefs.theme] ||
      themes.paper;

    rendition.themes.fontSize(
      `${size}px`
    );

    rendition.themes.override(
      'font-family',
      prefs.font === 'sans'
        ? 'Arial, sans-serif'
        : 'Georgia, serif'
    );

    rendition.themes.override(
      'line-height',
      String(spacing)
    );

    rendition.themes.override(
      'color',
      selectedTheme.color
    );

    rendition.themes.override(
      'background-color',
      selectedTheme.background
    );

    document.body.classList.remove(
      'reader-theme-paper',
      'reader-theme-sepia',
      'reader-theme-night'
    );

    document.body.classList.add(
      `reader-theme-${prefs.theme}`
    );

    $('#fontSlider').value =
      String(size);

    $('#lineHeightSlider').value =
      String(spacing);

    text(
      '#fontSizeValue',
      `${size}px`
    );

    text(
      '#lineHeightValue',
      spacing.toFixed(1)
    );

    document
      .querySelectorAll(
        '[data-theme]'
      )
      .forEach(button => {
        button.classList.toggle(
          'is-active',
          button.dataset.theme ===
            prefs.theme
        );
      });

    document
      .querySelectorAll(
        '[data-font]'
      )
      .forEach(button => {
        button.classList.toggle(
          'is-active',
          button.dataset.font ===
            prefs.font
        );
      });

    localStorage.setItem(
      PREFS_KEY,
      JSON.stringify(prefs)
    );
  }

  function applyHighlight(hl) {
    try {
      rendition.annotations.highlight(
        hl.cfi,
        {
          id: hl.id
        },
        () => {
          rendition.display(
            hl.cfi
          );
        },
        'readshelf-highlight',
        {
          fill:
            COLORS[hl.color] ||
            COLORS.yellow,
          'fill-opacity': '0.38',
          'mix-blend-mode':
            'multiply'
        }
      );
    } catch (error) {
      console.warn(
        'Unable to draw a saved highlight',
        error
      );
    }
  }

  function listItem(
    item,
    isHighlight
  ) {
    const wrap =
      document.createElement('div');

    wrap.className =
      `ebook-annotation ${
        isHighlight
          ? item.color
          : ''
      }`;

    const quote =
      document.createElement('p');

    quote.textContent =
      isHighlight
        ? item.text ||
          'Saved passage'
        : item.label ||
          'Saved page';

    wrap.appendChild(
      quote
    );

    if (
      isHighlight &&
      item.note
    ) {
      const note =
        document.createElement(
          'small'
        );

      note.textContent =
        `Note: ${item.note}`;

      wrap.appendChild(
        note
      );
    }

    const actions =
      document.createElement(
        'div'
      );

    actions.className =
      'ebook-annotation-actions';

    const jump =
      document.createElement(
        'button'
      );

    jump.type = 'button';
    jump.textContent = 'Go to';

    jump.addEventListener(
      'click',
      () => {
        rendition
          .display(item.cfi)
          .catch(console.error);
      }
    );

    const remove =
      document.createElement(
        'button'
      );

    remove.type = 'button';
    remove.textContent =
      'Delete';

    remove.addEventListener(
      'click',
      () => {
        if (isHighlight) {
          state.highlights =
            state.highlights.filter(
              a =>
                a.id !== item.id
            );

          try {
            rendition.annotations.remove(
              item.cfi,
              'highlight'
            );
          } catch (error) {
            console.warn(
              error
            );
          }
        } else {
          state.bookmarks =
            state.bookmarks.filter(
              a =>
                a.id !== item.id
            );
        }

        drawLists();
        queueSave(true);
      }
    );

    actions.append(
      jump,
      remove
    );

    wrap.appendChild(
      actions
    );

    return wrap;
  }

  function drawLists() {
    const hList =
      $('#highlightsList');

    const bList =
      $('#bookmarksList');

    hList.replaceChildren();
    bList.replaceChildren();

    if (
      !state.highlights.length
    ) {
      const p =
        document.createElement(
          'p'
        );

      p.className =
        'control-helper';

      p.textContent =
        'Select text to highlight and add a note.';

      hList.append(p);
    }

    if (
      !state.bookmarks.length
    ) {
      const p =
        document.createElement(
          'p'
        );

      p.className =
        'control-helper';

      p.textContent =
        'Press ♡ in the header to bookmark a page.';

      bList.append(p);
    }

    state.highlights.forEach(
      item =>
        hList.append(
          listItem(
            item,
            true
          )
        )
    );

    state.bookmarks.forEach(
      item =>
        bList.append(
          listItem(
            item,
            false
          )
        )
    );

    text(
      '#highlightCount',
      state.highlights.length
    );

    text(
      '#bookmarkCount',
      state.bookmarks.length
    );
  }

  function selected(
    cfiRange,
    contents
  ) {
    const quote =
      contents?.window
        ?.getSelection?.()
        ?.toString()
        .trim() || '';

    if (
      !quote ||
      !cfiRange
    ) {
      return;
    }

    pendingSelection = {
      cfi: cfiRange,
      text: quote.slice(
        0,
        1500
      )
    };

    text(
      '#selectedTextPreview',
      quote.length > 180
        ? `${quote.slice(
            0,
            180
          )}…`
        : quote
    );

    $('#selectionNote').value =
      '';

    $('#selectionBar').hidden =
      false;

    contents.window
      .getSelection()
      ?.removeAllRanges();
  }

  function hookControls() {
    $('#prevPage')
      .addEventListener(
        'click',
        () =>
          rendition?.prev()
      );

    $('#nextPage')
      .addEventListener(
        'click',
        () =>
          rendition?.next()
      );

    $('#bookmarkButton')
      .addEventListener(
        'click',
        () => {
          const cfi =
            currentCfi ||
            state.cfi;

          if (!cfi) return;

          const exists =
            state.bookmarks.some(
              b =>
                b.cfi === cfi
            );

          if (exists) {
            state.bookmarks =
              state.bookmarks.filter(
                b =>
                  b.cfi !== cfi
              );
          } else {
            state.bookmarks.push({
              id: dateId(),
              cfi,
              label:
                `At approximately ${
                  Math.round(
                    state.progress
                  )
                }%`
            });
          }

          $('#bookmarkButton')
            .textContent =
              exists
                ? '♡'
                : '♥';

          drawLists();
          queueSave(true);
        }
      );

    $('#cancelSelection')
      .addEventListener(
        'click',
        () => {
          pendingSelection =
            null;

          $('#selectionBar')
            .hidden = true;
        }
      );

    $('#highlightButton')
      .addEventListener(
        'click',
        () => {
          if (
            !pendingSelection
          ) {
            return;
          }

          const item = {
            id: dateId(),
            ...pendingSelection,
            color:
              $('#highlightColor')
                .value,
            note:
              $('#selectionNote')
                .value
                .trim()
                .slice(
                  0,
                  1500
                )
          };

          if (
            state.highlights.some(
              h =>
                h.cfi ===
                item.cfi
            )
          ) {
            syncing(
              'This passage is already highlighted.'
            );

            return;
          }

          state.highlights.push(
            item
          );

          applyHighlight(
            item
          );

          drawLists();
          queueSave(true);

          $('#selectionBar')
            .hidden = true;

          pendingSelection =
            null;
        }
      );

    $('#tocSelect')
      .addEventListener(
        'change',
        event => {
          if (
            event.target.value
          ) {
            rendition
              .display(
                event.target.value
              )
              .catch(
                console.error
              );
          }
        }
      );

    $('#fontSlider')
      .addEventListener(
        'input',
        event => {
          prefs.fontSize =
            Number(
              event.target.value
            );

          applyPreferences();
        }
      );

    $('#lineHeightSlider')
      .addEventListener(
        'input',
        event => {
          prefs.lineHeight =
            Number(
              event.target.value
            );

          applyPreferences();
        }
      );

    document
      .querySelectorAll(
        '[data-font]'
      )
      .forEach(button => {
        button.addEventListener(
          'click',
          () => {
            prefs.font =
              button.dataset.font;

            applyPreferences();
          }
        );
      });

    document
      .querySelectorAll(
        '[data-theme]'
      )
      .forEach(button => {
        button.addEventListener(
          'click',
          () => {
            prefs.theme =
              button.dataset.theme;

            applyPreferences();
          }
        );
      });

    document.addEventListener(
      'keydown',
      event => {
        if (
          event.target.closest(
            'input, textarea, select, button'
          ) ||
          !rendition
        ) {
          return;
        }

        if (
          event.key ===
          'ArrowRight'
        ) {
          rendition.next();
        }

        if (
          event.key ===
          'ArrowLeft'
        ) {
          rendition.prev();
        }
      }
    );

    document.addEventListener(
      'visibilitychange',
      () => {
        if (
          document.hidden &&
          state
        ) {
          queueSave(true);
        }
      }
    );
  }

  function fillToc(
    nodes,
    level = 0
  ) {
    for (
      const item of
      nodes || []
    ) {
      const option =
        document.createElement(
          'option'
        );

      option.value =
        item.href || '';

      option.textContent =
        `${'  '.repeat(level)}${
          item.label ||
          'Chapter'
        }`;

      $('#tocSelect')
        .appendChild(
          option
        );

      if (
        item.subitems?.length
      ) {
        fillToc(
          item.subitems,
          level + 1
        );
      }
    }
  }

  function findFirstReadableChapter(
    nodes
  ) {
    const skipFrontMatter =
      /cover|titlepage|title-page|imprint|copyright|uncopyright|colophon|toc|contents/i;

    for (
      const item of
      nodes || []
    ) {
      const href =
        String(
          item.href || ''
        );

      if (
        href &&
        !skipFrontMatter.test(
          href
        )
      ) {
        return href;
      }

      if (
        item.subitems?.length
      ) {
        const nested =
          findFirstReadableChapter(
            item.subitems
          );

        if (nested) {
          return nested;
        }
      }
    }

    return '';
  }

  async function init() {
    const id =
      new URLSearchParams(
        location.search
      ).get('id') || '';

    book =
      window.ReadShelfEbooks
        ?.findById(id);

    if (!book) {
      showError(
        'A complete EPUB for this title is not installed on ReadShelf yet. Browse the available collection instead.'
      );

      syncing(
        'No locally hosted EPUB found'
      );

      return;
    }

    document.title =
      `Reading ${book.title} — ReadShelf`;

    text(
      '#readerBookTitle',
      book.title
    );

    text(
      '#readerAuthor',
      book.author
    );

    const detailUrl =
      `book.html?id=${
        encodeURIComponent(
          book.id
        )
      }`;

    $('#readerBackLink').href =
      detailUrl;

    $('#backToDetails').href =
      detailUrl;

    text(
      '#readerSourceNote',
      `Complete, self-hosted public-domain edition. Source: ${
        book.sourcePage ||
        'curated ReadShelf library'
      }. Your highlights and reading position sync when signed in.`
    );

    try {
      const result =
        await window
          .ReadShelfReadingStore
          .load(book.id);

      state = {
        ...defaultState(),
        ...result.state
      };

      if (
        !Array.isArray(
          state.highlights
        )
      ) {
        state.highlights = [];
      }

      if (
        !Array.isArray(
          state.bookmarks
        )
      ) {
        state.bookmarks = [];
      }

      syncing(
        result.mode === 'cloud'
          ? 'Connected to your ReadShelf account'
          : result.mode === 'offline'
            ? 'Cloud unavailable — using browser copy'
            : 'Saved in this browser · sign in to sync'
      );

      drawProgress();
      drawLists();

      if (
        typeof window.ePub !==
          'function' ||
        typeof window.JSZip ===
          'undefined'
      ) {
        throw new Error(
          'The EPUB reader scripts could not load. Check your internet connection and content blockers.'
        );
      }

      const check =
        await fetch(
          book.epubPath,
          {
            method: 'HEAD'
          }
        );

      if (!check.ok) {
        throw new Error(
          'The complete EPUB file is missing from this deployment.'
        );
      }

      $('#epubViewer').hidden =
        false;

      epub =
        window.ePub(
          book.epubPath
        );

      rendition =
        epub.renderTo(
          'epubViewer',
          {
            width: '100%',
            height: '100%',
            flow: 'paginated',
            spread: 'none'
          }
        );

      prefs =
        safePrefs();

      applyPreferences();

      rendition.on(
        'selected',
        selected
      );

      rendition.on(
        'relocated',
        location => {
          currentCfi =
            location?.start
              ?.cfi || '';

          if (
            !currentCfi ||
            restorePending
          ) {
            return;
          }

          state.cfi =
            currentCfi;

          state.progress =
            percentage(
              currentCfi
            );

          drawProgress();

          $('#bookmarkButton')
            .textContent =
              state.bookmarks.some(
                b =>
                  b.cfi ===
                  currentCfi
              )
                ? '♥'
                : '♡';

          queueSave();

          if (
            locationsReady
          ) {
            window.ReadShelf
              .setProgress(
                book.id,
                Math.round(
                  state.progress
                )
              )
              .catch(
                console.error
              );
          }
        }
      );

      const nav =
        await epub.loaded
          .navigation;

      $('#tocSelect')
        .replaceChildren();

      const placeholder =
        document.createElement(
          'option'
        );

      placeholder.value = '';
      placeholder.textContent =
        'Select a chapter…';

      $('#tocSelect')
        .append(
          placeholder
        );

      fillToc(
        nav.toc
      );

      /*
        If the user has a saved reading location,
        resume from that location.

        Otherwise open the actual first EPUB page
        so the cover/title/front matter can appear.
      */
      let startTarget =
        state.cfi || '';

      if (!startTarget) {
        const firstSpineItem =
          epub.spine
            ?.spineItems?.[0];

        startTarget =
          firstSpineItem
            ?.href || '';
      }

      /*
        Fallback if the EPUB does not expose
        the first spine item correctly.
      */
      if (!startTarget) {
        startTarget =
          findFirstReadableChapter(
            nav.toc
          );
      }

      restorePending = true;

      try {
        await rendition.display(
          startTarget ||
          undefined
        );
      } finally {
        restorePending = false;
      }

      /*
        Some EPUB files contain a genuinely blank
        front page.

        Keep image-only cover pages, SVG covers,
        title artwork, and picture elements.

        Only skip forward if the page contains
        practically no text AND no visual content.
      */
      try {
        const contents =
          rendition.getContents();

        const visibleText =
          contents
            .map(
              content =>
                content.document
                  ?.body
                  ?.innerText ||
                ''
            )
            .join(' ')
            .replace(
              /\s+/g,
              ' '
            )
            .trim();

        const hasVisualContent =
          contents.some(
            content =>
              Boolean(
                content.document
                  ?.querySelector(
                    'img, svg, image, picture'
                  )
              )
          );

        if (
          visibleText.length <
            20 &&
          !hasVisualContent
        ) {
          const firstChapter =
            findFirstReadableChapter(
              nav.toc
            );

          if (firstChapter) {
            await rendition.display(
              firstChapter
            );
          }
        }
      } catch (error) {
        console.warn(
          'Unable to check initial EPUB page:',
          error
        );
      }

      if (currentCfi) {
        state.cfi =
          currentCfi;
      }

      $('#readerStatus').hidden =
        true;

      hookControls();

      for (
        const hl of
        state.highlights
      ) {
        applyHighlight(hl);
      }

      try {
        await epub.locations
          .generate(1200);

        locationsReady =
          true;

        if (
          currentCfi ||
          state.cfi
        ) {
          state.cfi =
            currentCfi ||
            state.cfi;

          state.progress =
            percentage(
              state.cfi
            );

          drawProgress();
          queueSave();

          window.ReadShelf
            .setProgress(
              book.id,
              Math.round(
                state.progress
              )
            )
            .catch(
              console.error
            );
        }
      } catch (error) {
        console.warn(
          'Text-relative progress calculation unavailable:',
          error
        );
      }
    } catch (error) {
      console.error(
        'ReadShelf reader error:',
        error
      );

      showError(
        error?.message ||
        'Unable to open this book.'
      );

      syncing(
        'Reader unavailable'
      );
    }
  }

  if (
    window.ReadShelf?.isReady()
  ) {
    init();
  } else {
    window.addEventListener(
      'readshelf:ready',
      init,
      {
        once: true
      }
    );
  }
})();
