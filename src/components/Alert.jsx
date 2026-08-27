import { colors, fonts } from "../theme";

const VARIANTS = {
  error: {
    bg: colors.errorBg,
    border: colors.errorBorder,
    text: colors.errorText,
    icon: "!",
  },
  success: {
    bg: colors.successBg,
    border: colors.successBorder,
    text: colors.successText,
    icon: "✓",
  },
  info: {
    bg: colors.infoBg,
    border: colors.infoBorder,
    text: colors.infoText,
    icon: "i",
  },
};

// Shared banner for showing errors and success messages clearly (background,
// border and icon) instead of plain colored text that's easy to miss.
export default function Alert({ type = "error", children, style }) {
  if (!children) return null;
  const v = VARIANTS[type] || VARIANTS.error;
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        marginBottom: 16,
        padding: "12px 14px",
        borderRadius: 8,
        background: v.bg,
        border: `1px solid ${v.border}`,
        fontFamily: fonts.body,
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 18,
          height: 18,
          marginTop: 1,
          borderRadius: "50%",
          background: v.border,
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        {v.icon}
      </span>
      <span style={{ color: v.text, fontSize: 14, lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}
