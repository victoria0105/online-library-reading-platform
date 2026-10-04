(function () {
  const config = window.READSHELF_SUPABASE_CONFIG || {};
  const hasRealConfig =
    typeof config.url === "string" &&
    /^https:\/\/[^/]+\.supabase\.co\/?$/.test(config.url) &&
    typeof config.publishableKey === "string" &&
    config.publishableKey.length > 20 &&
    !config.publishableKey.includes("YOUR_SUPABASE");

  const client = hasRealConfig && window.supabase?.createClient
    ? window.supabase.createClient(config.url.replace(/\/$/, ""), config.publishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
    : null;

  async function getSession() {
    if (!client) return null;
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session || null;
  }

  async function signUp(email, password, displayName) {
    if (!client) throw new Error("Supabase is not configured yet.");
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: displayName ? { data: { display_name: displayName } } : undefined
    });
    if (error) throw error;
    return data;
  }

  async function signIn(email, password) {
    if (!client) throw new Error("Supabase is not configured yet.");
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) throw error;
  }

  async function fetchBooks() {
    if (!client) return [];
    const { data, error } = await client
      .from("books")
      .select("id,title,author,published_year,genre,tags,initials,cover_class,description,pages,rating,featured,sample_paragraphs")
      .order("title", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function fetchShelf(userId) {
    if (!client || !userId) return [];
    const { data, error } = await client
      .from("user_shelf")
      .select("book_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(row => row.book_id);
  }

  async function addToShelf(userId, bookId) {
    if (!client) throw new Error("Supabase is not configured yet.");
    const { error } = await client
      .from("user_shelf")
      .upsert({ user_id: userId, book_id: bookId }, { onConflict: "user_id,book_id" });
    if (error) throw error;
  }

  async function removeFromShelf(userId, bookId) {
    if (!client) throw new Error("Supabase is not configured yet.");
    const { error } = await client
      .from("user_shelf")
      .delete()
      .eq("user_id", userId)
      .eq("book_id", bookId);
    if (error) throw error;
  }

  async function fetchProgress(userId) {
    if (!client || !userId) return {};
    const { data, error } = await client
      .from("reading_progress")
      .select("book_id,progress")
      .eq("user_id", userId);
    if (error) throw error;
    return Object.fromEntries((data || []).map(row => [row.book_id, row.progress]));
  }

  async function saveProgress(userId, bookId, progress) {
    if (!client) throw new Error("Supabase is not configured yet.");
    const value = Math.max(0, Math.min(100, Math.round(Number(progress) || 0)));
    const { error } = await client
      .from("reading_progress")
      .upsert(
        {
          user_id: userId,
          book_id: bookId,
          progress: value,
          updated_at: new Date().toISOString()
        },
        { onConflict: "user_id,book_id" }
      );
    if (error) throw error;
  }

  function onAuthStateChange(callback) {
    if (!client) return { unsubscribe() {} };
    const { data } = client.auth.onAuthStateChange((event, session) => callback(event, session));
    return data.subscription;
  }

  window.ReadShelfBackend = {
    client,
    isConfigured: () => Boolean(client),
    getSession,
    signUp,
    signIn,
    signOut,
    fetchBooks,
    fetchShelf,
    addToShelf,
    removeFromShelf,
    fetchProgress,
    saveProgress,
    onAuthStateChange
  };
})();
