import { colors } from "../theme";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 64,
        paddingTop: 28,
        borderTop: `1px solid ${colors.textDark}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 8,
        fontSize: 13,
        color: colors.textMuted,
      }}
    >
      <span>© 2026 Bokrummet · Skapad av Sonia Esmaeili</span>
      <span style={{ letterSpacing: ".5px" }}>Begagnade barnböcker i gott skick</span>
    </footer>
  );
}
