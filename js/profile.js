(function () {
  const $ = selector => document.querySelector(selector);

  function initials(name, email) {
    const source = (name || email || "Read Shelf").trim();
    const parts = source.split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2)).toUpperCase();
  }

  function status(message, type = "info") {
    const el = $("#profileStatus");
    el.textContent = message;
    el.className = `auth-status ${type}`;
    el.hidden = !message;
  }

  function providerLabel(providers = []) {
    if (providers.includes("google.com")) return "Google";
    if (providers.includes("password")) return "Email & password";
    return providers.length ? providers.join(", ") : "Firebase Authentication";
  }

  async function init() {
    const backend = window.ReadShelfBackend;
    const app = window.ReadShelf;
    $("#profileLoading").hidden = true;

    if (!app.isConfigured()) {
      $("#profileSetup").hidden = false;
      return;
    }

    const user = app.getUser();
    if (!user) {
      location.href = `signin.html?next=${encodeURIComponent("profile.html")}`;
      return;
    }

    try {
      const [profile, stats] = await Promise.all([
        backend.getProfile(user.id),
        backend.getUserStats(user.id)
      ]);
      const data = profile || {};
      const displayName = data.displayName || user.displayName || "Reader";
      const providers = user.providers || data.authProviders || [];

      $("#profileContent").hidden = false;
      $("#profileName").textContent = displayName;
      $("#profileEmail").textContent = user.email || data.email || "";
      $("#profileAvatar").textContent = initials(displayName, user.email);
      $("#providerRow").innerHTML = providers.map(p => `<span>${p === "google.com" ? "Google" : p === "password" ? "Email" : p}</span>`).join("");
      $("#displayName").value = displayName;
      $("#bio").value = data.bio || "";
      $("#bioCount").textContent = $("#bio").value.length;
      const favorites = new Set(data.favoriteGenres || []);
      document.querySelectorAll("#genreChoices input").forEach(input => { input.checked = favorites.has(input.value); });

      $("#statSaved").textContent = stats.saved;
      $("#statReading").textContent = stats.reading;
      $("#statFinished").textContent = stats.finished;
      $("#statProgress").textContent = `${stats.averageProgress}%`;

      $("#accountEmail").textContent = user.email || "—";
      $("#accountProvider").textContent = providerLabel(providers);
      $("#accountVerified").textContent = user.emailVerified ? "Yes" : "Not yet";

      $("#bio").addEventListener("input", () => { $("#bioCount").textContent = $("#bio").value.length; });

      $("#profileForm").addEventListener("submit", async event => {
        event.preventDefault();
        const button = event.currentTarget.querySelector("button[type=submit]");
        button.disabled = true; status("Saving your profile…");
        try {
          const favoriteGenres = [...document.querySelectorAll("#genreChoices input:checked")].map(input => input.value);
          await backend.updateProfile(user.id, {
            displayName: $("#displayName").value,
            bio: $("#bio").value,
            favoriteGenres
          });
          $("#profileName").textContent = $("#displayName").value.trim() || "Reader";
          $("#profileAvatar").textContent = initials($("#displayName").value, user.email);
          status("Profile saved successfully.", "success");
        } catch (error) {
          console.error(error); status(error.message || "Could not save your profile.", "error");
        } finally { button.disabled = false; }
      });

      $("#resetPasswordProfile").addEventListener("click", async () => {
        if (!user.email) return status("No email address is available for this account.", "error");
        const button = $("#resetPasswordProfile");
        button.disabled = true; status("Sending password reset email…");
        try {
          await backend.sendPasswordReset(user.email);
          status("Password reset email sent. Check your inbox.", "success");
        } catch (error) {
          status(error.message || "Could not send password reset email.", "error");
        } finally { button.disabled = false; }
      });
    } catch (error) {
      console.error(error);
      $("#profileSetup").hidden = false;
      $("#profileSetup p:last-of-type").textContent = "ReadShelf could not load the Firebase profile data. Check the Firebase configuration and Firestore rules.";
    }
  }

  if (window.ReadShelf?.isReady()) init();
  else window.addEventListener("readshelf:ready", init, { once: true });
})();
