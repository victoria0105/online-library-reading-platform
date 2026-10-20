(function () {
  function safeNext() {
    const next = new URLSearchParams(location.search).get("next");
    if (!next || /^https?:/i.test(next) || next.startsWith("//")) return "profile.html";
    return next;
  }

  function setStatus(message, type = "info") {
    const status = document.querySelector("#authStatus");
    if (!status) return;
    status.textContent = message;
    status.className = `auth-status ${type}`;
    status.hidden = !message;
  }

  function setBusy(isBusy) {
    document.querySelectorAll("#signInForm button, #signUpForm button, #googleSignIn, .auth-tab, #forgotPassword").forEach(el => { el.disabled = isBusy; });
  }

  function showMode(mode) {
    const signup = mode === "signup";
    document.querySelector("#signInForm").hidden = signup;
    document.querySelector("#signUpForm").hidden = !signup;
    document.querySelectorAll(".auth-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.authMode === mode));
    document.querySelector("#authTitle").textContent = signup ? "Create your account" : "Welcome back";
    document.querySelector("#authIntro").textContent = signup
      ? "Create a free account to sync your shelf, reading progress, and profile."
      : "Sign in to continue to your shelf and saved reading progress.";
    const params = new URLSearchParams(location.search);
    if (signup) params.set("mode", "signup"); else params.delete("mode");
    history.replaceState(null, "", `${location.pathname}${params.toString() ? `?${params}` : ""}`);
    setStatus("");
  }

  function friendlyError(error) {
    const code = error?.code || "";
    if (code.includes("invalid-credential")) return "The email or password is incorrect.";
    if (code.includes("email-already-in-use")) return "An account with this email already exists.";
    if (code.includes("weak-password")) return "Please choose a stronger password.";
    if (code.includes("popup-closed-by-user")) return "Google sign-in was closed before it finished.";
    if (code.includes("popup-blocked")) return "Your browser blocked the Google sign-in window. Please allow pop-ups and try again.";
    if (code.includes("network-request-failed")) return "A network error occurred. Please try again.";
    return error?.message || "Something went wrong. Please try again.";
  }

  function init() {
    const backend = window.ReadShelfBackend;
    const { getUser, isConfigured } = window.ReadShelf;
    const user = getUser();

    if (!isConfigured()) {
      document.querySelector("#configNotice").hidden = false;
      document.querySelectorAll("#signInForm input, #signInForm button, #signUpForm input, #signUpForm button, #googleSignIn").forEach(el => { el.disabled = true; });
    }

    if (user) {
      const label = user.displayName || user.email || "Your account";
      document.querySelector("#authForms").innerHTML = `
        <div class="signed-in-panel">
          <p class="eyebrow">Signed in</p>
          <h1>Welcome, ${label}</h1>
          <p>${user.email || "Your ReadShelf account is active."}</p>
          <div class="auth-account-actions"><a class="btn btn-primary" href="${safeNext()}">Continue</a><a class="btn btn-secondary" href="profile.html">View profile</a><button class="btn btn-secondary" type="button" data-signout>Sign out</button></div>
        </div>`;
      return;
    }

    showMode(new URLSearchParams(location.search).get("mode") === "signup" ? "signup" : "signin");

    document.querySelectorAll(".auth-tab").forEach(button => {
      button.addEventListener("click", () => showMode(button.dataset.authMode));
    });

    document.querySelector("#googleSignIn").addEventListener("click", async () => {
      setBusy(true); setStatus("Opening Google sign-in…");
      try {
        await backend.signInWithGoogle();
        setStatus("Signed in with Google. Redirecting…", "success");
        location.href = safeNext();
      } catch (error) {
        setStatus(friendlyError(error), "error");
      } finally { setBusy(false); }
    });

    document.querySelector("#signInForm").addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      setBusy(true); setStatus("Signing you in…");
      try {
        await backend.signIn(form.email.value.trim(), form.password.value);
        setStatus("Signed in successfully. Redirecting…", "success");
        location.href = safeNext();
      } catch (error) {
        setStatus(friendlyError(error), "error");
      } finally { setBusy(false); }
    });

    document.querySelector("#signUpForm").addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      if (form.password.value !== form.confirmPassword.value) return setStatus("Passwords do not match.", "error");
      if (form.password.value.length < 8) return setStatus("Use at least 8 characters for your password.", "error");

      setBusy(true); setStatus("Creating your account…");
      try {
        await backend.signUp(form.email.value.trim(), form.password.value, form.displayName.value.trim());
        setStatus("Account created. Redirecting to your profile…", "success");
        location.href = safeNext();
      } catch (error) {
        setStatus(friendlyError(error), "error");
      } finally { setBusy(false); }
    });

    document.querySelector("#forgotPassword").addEventListener("click", async () => {
      const email = document.querySelector("#signInForm input[name=email]").value.trim();
      if (!email) return setStatus("Enter your email address above first.", "info");
      setBusy(true); setStatus("Sending password reset email…");
      try {
        await backend.sendPasswordReset(email);
        setStatus("Password reset email sent. Check your inbox.", "success");
      } catch (error) {
        setStatus(friendlyError(error), "error");
      } finally { setBusy(false); }
    });
  }

  if (window.ReadShelf?.isReady()) init();
  else window.addEventListener("readshelf:ready", init, { once: true });
})();
