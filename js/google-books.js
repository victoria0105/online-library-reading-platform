(function () {
  const API_ROOT = "https://www.googleapis.com/books/v1";
  const config = window.ReadShelfGoogleBooksConfig || {};
  const apiKey = String(config.apiKey || "").trim();

  function isConfigured() {
    return Boolean(apiKey && !apiKey.startsWith("YOUR_"));
  }

  function safeHttps(url) {
    if (!url) return "";
    return String(url).replace(/^http:/i, "https:");
  }

  function initials(title) {
    return String(title || "Book")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .map(part => part[0]?.toUpperCase() || "")
      .join("");
  }

  function mapVolume(volume) {
    const info = volume?.volumeInfo || {};
    const access = volume?.accessInfo || {};
    const sale = volume?.saleInfo || {};
    const categories = Array.isArray(info.categories) ? info.categories : [];
    const authors = Array.isArray(info.authors) ? info.authors : [];
    const published = String(info.publishedDate || "");
    const yearMatch = published.match(/\d{4}/);
    const imageLinks = info.imageLinks || {};

    return {
      id: `google:${volume.id}`,
      source: "google",
      googleVolumeId: volume.id,
      title: info.title || "Untitled",
      author: authors.length ? authors.join(", ") : "Unknown author",
      year: yearMatch ? Number(yearMatch[0]) : "",
      genre: categories[0] || "Book",
      tags: categories.slice(0, 3),
      initials: initials(info.title),
      coverClass: "",
      thumbnail: safeHttps(
        imageLinks.thumbnail ||
        imageLinks.smallThumbnail ||
        imageLinks.small ||
        imageLinks.medium ||
        ""
      ),
      description: info.description || "No description is available for this book.",
      pages: Number(info.pageCount || 0),
      rating: Number(info.averageRating || 0),
      ratingsCount: Number(info.ratingsCount || 0),
      language: info.language || "",
      publisher: info.publisher || "",
      publishedDate: published,
      isbn: Array.isArray(info.industryIdentifiers) ? info.industryIdentifiers : [],
      previewLink: safeHttps(info.previewLink || ""),
      infoLink: safeHttps(info.infoLink || ""),
      webReaderLink: safeHttps(access.webReaderLink || ""),
      viewability: access.viewability || "UNKNOWN",
      publicDomain: Boolean(access.publicDomain),
      embeddable: Boolean(access.embeddable),
      saleability: sale.saleability || "",
      sample: []
    };
  }

  function endpoint(path, params = {}) {
    if (!isConfigured()) {
      throw new Error("Google Books API key is not configured.");
    }
    const url = new URL(`${API_ROOT}${path}`);
    Object.entries({ ...params, key: apiKey }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
    return url;
  }

  async function request(url) {
    const response = await fetch(url.toString(), {
      headers: { Accept: "application/json" }
    });

    let data = null;
    try { data = await response.json(); } catch {}

    if (!response.ok) {
      const message =
        data?.error?.message ||
        `Google Books request failed with status ${response.status}.`;
      throw new Error(message);
    }
    return data || {};
  }

  async function search(query, options = {}) {
    const q = String(query || "").trim();
    if (!q) return [];

    const data = await request(endpoint("/volumes", {
      q,
      printType: "books",
      projection: "full",
      orderBy: options.orderBy || "relevance",
      maxResults: Math.min(40, Math.max(1, Number(options.maxResults || 20))),
      startIndex: Math.max(0, Number(options.startIndex || 0))
    }));

    return Array.isArray(data.items) ? data.items.map(mapVolume) : [];
  }

  async function getVolume(volumeId) {
    const id = String(volumeId || "").trim();
    if (!id) throw new Error("Missing Google Books volume ID.");
    const data = await request(endpoint(`/volumes/${encodeURIComponent(id)}`));
    return mapVolume(data);
  }

  window.ReadShelfGoogleBooks = {
    isConfigured,
    search,
    getVolume,
    mapVolume
  };
})();
