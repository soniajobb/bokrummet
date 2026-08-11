import { useState } from "react";
import { colors, fonts } from "../theme";
import { supabase } from "../lib/supabaseClient";
import HoverButton from "./HoverButton";

const fieldStyle = {
  background: colors.paper,
  border: `1px solid ${colors.border2}`,
  borderRadius: 6,
  padding: "12px 14px",
  fontSize: 15,
  color: colors.textDark,
  width: "100%",
  boxSizing: "border-box",
};

export default function AuthScreen({ onAuthed }) {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [forgotForm, setForgotForm] = useState({ email: "" });

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setNotice("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!loginForm.email.trim() || !loginForm.password) {
      setError("Fyll i e-post och lösenord.");
      return;
    }
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: loginForm.email.trim(),
        password: loginForm.password,
      });
      if (signInError) {
        if (/confirm/i.test(signInError.message)) {
          setError("Du måste bekräfta din e-postadress innan du kan logga in. Kolla din inkorg (och skräppost) efter mejlet med bekräftelselänken.");
        } else {
          setError("Fel e-post eller lösenord.");
        }
        return;
      }
      onAuthed?.();
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    const { fullName, email, phone, password } = signupForm;
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      setError("Fyll i alla fält.");
      return;
    }
    if (password.length < 6) {
      setError("Lösenordet måste vara minst 6 tecken.");
      return;
    }
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { phone: phone.trim(), full_name: fullName.trim() } },
      });
      if (signUpError) {
        if (/registered/i.test(signUpError.message)) {
          setError("Den e-postadressen är redan registrerad.");
        } else if (/rate limit/i.test(signUpError.message)) {
          setError("För många mejl har skickats på kort tid. Vänta en liten stund och försök igen.");
        } else {
          setError(signUpError.message);
        }
        return;
      }
      if (data.session) {
        onAuthed?.();
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        // Supabase svarar utan fel även när e-posten redan har ett bekräftat konto
        // (för att inte avslöja registrerade adresser) - en tom identities-lista
        // är tecknet på att inget nytt konto/mejl faktiskt skickades.
        setError("Den här e-postadressen har redan ett konto. Logga in istället, eller använd \"Glömt lösenord?\" om du inte kommer ihåg lösenordet.");
        setMode("login");
      } else {
        setNotice("Konto skapat! Kolla din e-post och bekräfta innan du loggar in.");
        setMode("login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!forgotForm.email.trim()) {
      setError("Fyll i din e-postadress.");
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotForm.email.trim(), {
        redirectTo: window.location.origin,
      });
      if (resetError && /rate limit/i.test(resetError.message)) {
        setError("För många mejl har skickats på kort tid. Vänta en liten stund och försök igen.");
        return;
      }
      setNotice("Om kontot finns skickar vi en återställningslänk till din e-post.");
      setMode("login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.paper,
        fontFamily: fonts.body,
        padding: 20,
      }}
    >
      <div
        style={{
          width: "min(420px, 100%)",
          background: colors.card,
          border: `1px solid ${colors.border2}`,
          borderRadius: 14,
          padding: "clamp(28px, 6vw, 40px)",
        }}
      >
        <h1
          style={{
            margin: "0 0 6px",
            fontFamily: fonts.heading,
            fontWeight: 600,
            fontSize: 44,
            color: colors.textDark,
            textAlign: "center",
          }}
        >
          Bokrummet
        </h1>
        <p style={{ margin: "0 0 28px", textAlign: "center", fontStyle: "italic", color: colors.textSoft }}>
          Logga in eller skapa ett konto för att fortsätta.
        </p>

        {mode !== "forgot" && (
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            <HoverButton
              onClick={() => switchMode("login")}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontFamily: fonts.body,
                fontSize: 14,
                letterSpacing: ".5px",
                background: mode === "login" ? colors.textDark : "transparent",
                color: mode === "login" ? colors.paper : colors.textSoft2,
              }}
            >
              Logga in
            </HoverButton>
            <HoverButton
              onClick={() => switchMode("signup")}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontFamily: fonts.body,
                fontSize: 14,
                letterSpacing: ".5px",
                background: mode === "signup" ? colors.textDark : "transparent",
                color: mode === "signup" ? colors.paper : colors.textSoft2,
              }}
            >
              Skapa konto
            </HoverButton>
          </div>
        )}

        {error && (
          <div style={{ marginBottom: 16, color: colors.soldBadge, fontSize: 14 }}>{error}</div>
        )}
        {notice && (
          <div style={{ marginBottom: 16, color: colors.green, fontSize: 14 }}>{notice}</div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="E-post"
              style={fieldStyle}
            />
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Lösenord"
              style={fieldStyle}
            />
            <HoverButton
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                background: colors.accent,
                color: colors.paper,
                border: "none",
                padding: "13px 26px",
                borderRadius: 999,
                fontSize: 15,
                letterSpacing: ".5px",
                cursor: loading ? "default" : "pointer",
                fontFamily: fonts.body,
                opacity: loading ? 0.7 : 1,
              }}
              hoverStyle={{ background: colors.accentHover }}
            >
              {loading ? "Loggar in…" : "Logga in"}
            </HoverButton>
            <HoverButton
              type="button"
              onClick={() => switchMode("forgot")}
              style={{
                marginTop: 2,
                alignSelf: "center",
                background: "transparent",
                border: "none",
                color: colors.textMuted3,
                fontSize: 13,
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                fontFamily: fonts.body,
              }}
              hoverStyle={{ color: colors.accent }}
            >
              Glömt lösenord?
            </HoverButton>
          </form>
        ) : mode === "signup" ? (
          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              value={signupForm.fullName}
              onChange={(e) => setSignupForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="Fullständigt namn"
              style={fieldStyle}
            />
            <input
              type="email"
              value={signupForm.email}
              onChange={(e) => setSignupForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="E-post"
              style={fieldStyle}
            />
            <input
              type="tel"
              value={signupForm.phone}
              onChange={(e) => setSignupForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="Telefonnummer"
              style={fieldStyle}
            />
            <input
              type="password"
              value={signupForm.password}
              onChange={(e) => setSignupForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Lösenord (minst 6 tecken)"
              style={fieldStyle}
            />
            <HoverButton
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                background: colors.accent,
                color: colors.paper,
                border: "none",
                padding: "13px 26px",
                borderRadius: 999,
                fontSize: 15,
                letterSpacing: ".5px",
                cursor: loading ? "default" : "pointer",
                fontFamily: fonts.body,
                opacity: loading ? 0.7 : 1,
              }}
              hoverStyle={{ background: colors.accentHover }}
            >
              {loading ? "Skapar konto…" : "Skapa konto"}
            </HoverButton>
          </form>
        ) : (
          <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: "0 0 4px", fontSize: 14, lineHeight: 1.6, color: colors.textSoft }}>
              Skriv din e-postadress så skickar vi en återställningslänk dit.
            </p>
            <input
              type="email"
              value={forgotForm.email}
              onChange={(e) => setForgotForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="E-post"
              style={fieldStyle}
            />
            <HoverButton
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                background: colors.accent,
                color: colors.paper,
                border: "none",
                padding: "13px 26px",
                borderRadius: 999,
                fontSize: 15,
                letterSpacing: ".5px",
                cursor: loading ? "default" : "pointer",
                fontFamily: fonts.body,
                opacity: loading ? 0.7 : 1,
              }}
              hoverStyle={{ background: colors.accentHover }}
            >
              {loading ? "Skickar…" : "Skicka återställningslänk"}
            </HoverButton>
            <HoverButton
              type="button"
              onClick={() => switchMode("login")}
              style={{
                alignSelf: "center",
                background: "transparent",
                border: "none",
                color: colors.textMuted3,
                fontSize: 13,
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                fontFamily: fonts.body,
              }}
              hoverStyle={{ color: colors.accent }}
            >
              ← Tillbaka till inloggning
            </HoverButton>
          </form>
        )}
      </div>
    </div>
  );
}
