import { colors } from "../theme";
import HoverButton from "./HoverButton";

export default function TopBar({ isSeller, sellerMode, onToggleSeller, likedCount, onOpenSaved, cartCount, onOpenCart, displayName, onLogout }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 8 }}>
      {displayName && (
        <span style={{ fontSize: 13, color: colors.textMuted3, letterSpacing: ".3px" }}>Inloggad som {displayName}</span>
      )}

      {isSeller && (
        <HoverButton
          onClick={onToggleSeller}
          title="Endast för dig som säljer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: "none",
            color: sellerMode ? colors.accent : colors.textMuted3,
            fontSize: 13,
            letterSpacing: ".5px",
            cursor: "pointer",
          }}
          hoverStyle={{ color: colors.accent }}
        >
          ⚙ {sellerMode ? "Säljarläge: på" : "Säljarläge"}
        </HoverButton>
      )}

      <HoverButton
        onClick={onLogout}
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: "transparent",
          border: "none",
          color: colors.textMuted3,
          fontSize: 13,
          letterSpacing: ".5px",
          cursor: "pointer",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        }}
        hoverStyle={{ color: colors.accent }}
      >
        Logga ut
      </HoverButton>

      <HoverButton
        onClick={onOpenSaved}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          background: "transparent",
          border: "none",
          color: colors.textSoft2,
          fontSize: 14,
          letterSpacing: ".5px",
          cursor: "pointer",
        }}
        hoverStyle={{ color: colors.accent }}
      >
        <span style={{ color: colors.accent, fontSize: 16 }}>♥</span> Sparade {likedCount}
      </HoverButton>

      <HoverButton
        onClick={onOpenCart}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "transparent",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: colors.border3,
          color: colors.textDark,
          padding: "10px 18px",
          borderRadius: 999,
          fontSize: 14,
          letterSpacing: ".5px",
          cursor: "pointer",
        }}
        hoverStyle={{ borderColor: colors.accent, color: colors.accent }}
      >
        Varukorg
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 22,
            height: 22,
            padding: "0 6px",
            background: colors.accent,
            color: colors.paper,
            borderRadius: 11,
            fontSize: 12,
          }}
        >
          {cartCount}
        </span>
      </HoverButton>
    </div>
  );
}
