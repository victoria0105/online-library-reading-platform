(function () {
  function safeNext() {
    const next = new URLSearchParams(location.search).get("next");
    if (!next || /^https?:/i.test(next) || next.startsWith("//")) return "index.html";
    return next;
  }

  function setStatus(message, type = "info") {
    const status = document.querySelector("#authStatus");
    status.textContent = message;
    status.className = `auth-status ${type}`;
    status.hidden = !message;
  }

  function setBusy(isBusy) {
    document.querySelectorAll("#signInForm button, #signUpForm button, .auth-tab").forEach(el => { el.disabled = isBusy; });
  }

  function showMode(mode) {
    const signup = mode === "signup";
    document.querySelector("#signInForm").hidden = signup;
    document.querySelector("#signUpForm").hidden = !signup;
    document.querySelectorAll(".auth-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.authMode === mode));
    document.querySelector("#authTitle").textContent = signup ? "Create your account" : "Welcome back";
    document.querySelector("#authIntro").textContent = signup
      ? "Create a free ReadShelf account to sync your shelf and reading progress."
      : "Sign in to continue to your shelf and saved reading progress.";
    history.replaceState(null, "", `${location.pathname}?${new URLSearchParams({ ...(safeNext() !== "index.html" ? { next: safeNext() } : {}), ...(signup ? { mode: "signup" } : {}) }).toString()}`.replace(/\?$/, ""));
    setStatus("");
  }

  function init() {
    const backend = window.ReadShelfBackend;
    const { getUser, isConfigured } = window.ReadShelf;
    const user = getUser();

    if (!isConfigured()) {
      document.querySelector("#configNotice").hidden = false;
      document.querySelectorAll("#signInForm input, #signInForm button[type=submit], #signUpForm input, #signUpForm button[type=submit]").forEach(el => { el.disabled = true; });
    }

    if (user) {
      document.querySelector("#authForms").innerHTML = `
        <div class="signed-in-panel">
          <p class="eyebrow">Signed in</p>
          <h1>Your ReadShelf account is active</h1>
          <p>${user.email || "Account"}</p>
          <div class="auth-account-actions"><a class="btn btn-primary" href="${safeNext()}">Continue</a><button class="btn btn-secondary" type="button" data-signout>Sign out</button></div>
        </div>`;
      return;
    }

    const initialMode = new URLSearchParams(location.search).get("mode") === "signup" ? "signup" : "signin";
    showMode(initialMode);

    document.querySelectorAll(".auth-tab").forEach(button => {
      button.addEventListener("click", () => showMode(button.dataset.authMode));
    });

    document.querySelector("#signInForm").addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      setBusy(true);
      setStatus("Signing you in…");
      try {
        await backend.signIn(form.email.value.trim(), form.password.value);
        setStatus("Signed in successfully. Redirecting…", "success");
        location.href = safeNext();
      } catch (error) {
        setStatus(error.message || "Could not sign in.", "error");
      } finally {
        setBusy(false);
      }
    });

    document.querySelector("#signUpForm").addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (form.password.value !== form.confirmPassword.value) {
        setStatus("Passwords do not match.", "error");
        return;
      }
      if (form.password.value.length < 8) {
        setStatus("Use at least 8 characters for your password.", "error");
        return;
      }

      setBusy(true);
      setStatus("Creating your account…");
      try {
        const data = await backend.signUp(form.email.value.trim(), form.password.value, form.displayName.value.trim());
        if (data.session) {
          setStatus("Account created. Redirecting…", "success");
          location.href = safeNext();
        } else {
          setStatus("Account created. Check your email to confirm your address, then sign in.", "success");
          showMode("signin");
        }
      } catch (error) {
        setStatus(error.message || "Could not create your account.", "error");
      } finally {
        setBusy(false);
      }
    });
  }

  if (window.ReadShelf?.isReady()) init();
  else window.addEventListener("readshelf:ready", init, { once: true });
})();
