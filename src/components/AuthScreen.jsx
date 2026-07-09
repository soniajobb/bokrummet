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

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({ email: "", phone: "", username: "", password: "" });

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setNotice("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!loginForm.username.trim() || !loginForm.password) {
      setError("Fyll i användarnamn och lösenord.");
      return;
    }
    setLoading(true);
    try {
      const { data: email, error: lookupError } = await supabase.rpc("get_email_by_username", {
        uname: loginForm.username.trim(),
      });
      if (lookupError || !email) {
        setError("Fel användarnamn eller lösenord.");
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: loginForm.password,
      });
      if (signInError) {
        setError("Fel användarnamn eller lösenord.");
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
    const { email, phone, username, password } = signupForm;
    if (!email.trim() || !phone.trim() || !username.trim() || !password) {
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
        options: { data: { username: username.trim(), phone: phone.trim() } },
      });
      if (signUpError) {
        if (/registered/i.test(signUpError.message)) {
          setError("Den e-postadressen är redan registrerad.");
        } else if (/duplicate|unique/i.test(signUpError.message)) {
          setError("Det användarnamnet är redan taget.");
        } else {
          setError(signUpError.message);
        }
        return;
      }
      if (data.session) {
        onAuthed?.();
      } else {
        setNotice("Konto skapat! Kolla din e-post och bekräfta innan du loggar in.");
        setMode("login");
      }
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

        {error && (
          <div style={{ marginBottom: 16, color: colors.soldBadge, fontSize: 14 }}>{error}</div>
        )}
        {notice && (
          <div style={{ marginBottom: 16, color: colors.green, fontSize: 14 }}>{notice}</div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              value={loginForm.username}
              onChange={(e) => setLoginForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="Användarnamn"
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
          </form>
        ) : (
          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
              value={signupForm.username}
              onChange={(e) => setSignupForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="Användarnamn"
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
        )}
      </div>
    </div>
  );
}
