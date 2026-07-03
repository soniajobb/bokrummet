import { colors } from "../theme";
import HoverButton from "./HoverButton";

export default function Pagination({ totalPages, page, onGoPage }) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 56 }}>
      {Array.from({ length: totalPages }, (_, n) =>
        n === page ? (
          <span
            key={n}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 46,
              height: 46,
              padding: "0 8px",
              borderRadius: 999,
              background: colors.textDark,
              color: colors.paper,
              fontSize: 17,
            }}
          >
            {n + 1}
          </span>
        ) : (
          <HoverButton
            key={n}
            onClick={() => onGoPage(n)}
            style={{
              minWidth: 46,
              height: 46,
              padding: "0 8px",
              borderRadius: 999,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: colors.border3,
              background: "transparent",
              color: colors.textDark,
              fontSize: 17,
              cursor: "pointer",
            }}
            hoverStyle={{ borderColor: colors.accent, color: colors.accent }}
          >
            {n + 1}
          </HoverButton>
        )
      )}
    </div>
  );
}
