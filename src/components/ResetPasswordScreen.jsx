import { useState } from "react";
import { colors, fonts } from "../theme";
import { supabase } from "../lib/supabaseClient";
import HoverButton from "./HoverButton";
import Alert from "./Alert";
import { safeErrorMessage } from "../lib/errors";

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

export default function ResetPasswordScreen({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Lösenordet måste vara minst 6 tecken.");
      return;
    }
    if (password !== confirm) {
      setError("Lösenorden matchar inte.");
      return;
    }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(safeErrorMessage(updateError, "Kunde inte spara det nya lösenordet just nu. Testa igen om en liten stund."));
        return;
      }
      onDone();
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
            fontSize: 36,
            color: colors.textDark,
            textAlign: "center",
          }}
        >
          Nytt lösenord
        </h1>
        <p style={{ margin: "0 0 24px", textAlign: "center", fontStyle: "italic", color: colors.textSoft }}>
          Välj ett nytt lösenord för ditt konto.
        </p>

        <Alert type="error">{error}</Alert>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nytt lösenord (minst 6 tecken)"
            style={fieldStyle}
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Upprepa lösenord"
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
            {loading ? "Sparar…" : "Spara nytt lösenord"}
          </HoverButton>
        </form>
      </div>
    </div>
  );
}
