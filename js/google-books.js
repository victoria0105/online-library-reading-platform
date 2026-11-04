/* ReadShelf: Google Books metadata, full-view filtering, and safe descriptions. */
(function () {
  "use strict";
  const API_ROOT = "https://www.googleapis.com/books/v1";
  const config = window.ReadShelfGoogleBooksConfig || {};
  const apiKey = String(config.apiKey || "").trim();

  function isConfigured() {
    return Boolean(apiKey && !apiKey.startsWith("YOUR_"));
  }

  function safeHttps(value) {
    if (!value) return "";
    try {
      const url = new URL(String(value).replace(/^http:/i, "https:"));
      return url.protocol === "https:" ? url.href : "";
    } catch { return ""; }
  }

  function cleanDescription(value) {
    const raw = String(value || "");
    if (!raw) return "No description is available for this book.";
    // The Google Books description often contains HTML. Convert it to *text*;
    // never inject publisher-supplied HTML into the page.
    const spaced = raw
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<\/(?:p|div|h[1-6]|li|blockquote)>/gi, "\n\n");
    const documentCopy = new DOMParser().parseFromString(spaced, "text/html");
    documentCopy.querySelectorAll("script,style,iframe,object,noscript").forEach(node => node.remove());
    return (documentCopy.body.textContent || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim() || "No description is available for this book.";
  }

  function initials(title) {
    return String(title || "Book").split(/\s+/).filter(Boolean).slice(0, 3)
      .map(part => part[0]?.toUpperCase() || "").join("");
  }

  function mapVolume(volume) {
    const info = volume?.volumeInfo || {};
    const access = volume?.accessInfo || {};
    const sale = volume?.saleInfo || {};
    const cats = Array.isArray(info.categories) ? info.categories : [];
    const authors = Array.isArray(info.authors) ? info.authors : [];
    const published = String(info.publishedDate || "");
    const yearMatch = published.match(/\d{4}/);
    const images = info.imageLinks || {};
    return {
      id: `google:${volume.id}`,
      source: "google",
      googleVolumeId: volume.id,
      title: info.title || "Untitled",
      author: authors.length ? authors.join(", ") : "Unknown author",
      year: yearMatch ? Number(yearMatch[0]) : "",
      genre: cats[0] || "Book",
      tags: cats.slice(0, 3),
      initials: initials(info.title),
      coverClass: "",
      thumbnail: safeHttps(images.large || images.medium || images.small || images.thumbnail || images.smallThumbnail || ""),
      description: cleanDescription(info.description || ""),
      pages: Number(info.pageCount || 0),
      rating: Number(info.averageRating || 0),
      ratingsCount: Number(info.ratingsCount || 0),
      language: info.language || "",
      publisher: info.publisher || "",
      publishedDate: published,
      isbn: Array.isArray(info.industryIdentifiers) ? info.industryIdentifiers : [],
      previewLink: safeHttps(info.previewLink || ""),
      infoLink: safeHttps(info.infoLink || info.canonicalVolumeLink || ""),
      webReaderLink: safeHttps(access.webReaderLink || ""),
      viewability: access.viewability || "UNKNOWN",
      publicDomain: Boolean(access.publicDomain),
      embeddable: Boolean(access.embeddable),
      epubDownloadLink: safeHttps(access.epub?.downloadLink || ""),
      pdfDownloadLink: safeHttps(access.pdf?.downloadLink || ""),
      saleability: sale.saleability || "",
      sample: []
    };
  }

  function endpoint(path, params = {}) {
    if (!isConfigured()) throw new Error("The Google Books API key is not configured.");
    const url = new URL(`${API_ROOT}${path}`);
    Object.entries({ ...params, key: apiKey }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    });
    return url;
  }

  async function request(url) {
    const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    let body = {};
    try { body = await response.json(); } catch {}
    if (!response.ok) {
      throw new Error(body?.error?.message || `Google Books request failed (HTTP ${response.status}).`);
    }
    return body;
  }

  async function search(query, options = {}) {
    const q = String(query || "").trim();
    if (!q) return [];
    const data = await request(endpoint("/volumes", {
      q,
      printType: "books",
      projection: "full",
      orderBy: options.orderBy === "newest" ? "newest" : "relevance",
      filter: ["free-ebooks", "full", "partial", "ebooks"].includes(options.filter) ? options.filter : undefined,
      langRestrict: options.langRestrict || undefined,
      maxResults: Math.min(40, Math.max(1, Number(options.maxResults || 20))),
      startIndex: Math.max(0, Number(options.startIndex || 0))
    }));
    return Array.isArray(data.items) ? data.items.filter(item => item?.id).map(mapVolume) : [];
  }

  async function getVolume(volumeId) {
    const id = String(volumeId || "").trim();
    if (!id) throw new Error("Missing Google Books volume ID.");
    return mapVolume(await request(endpoint(`/volumes/${encodeURIComponent(id)}`)));
  }

  window.ReadShelfGoogleBooks = { isConfigured, search, getVolume, mapVolume, cleanDescription };
})();
