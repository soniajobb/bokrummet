import { colors, fonts } from "../theme";
import HoverButton from "./HoverButton";
import BookRow from "./BookRow";

export default function SavedView({ savedBooks, onGoBack, onOpenDetail, onAddToCart, onToggleLike }) {
  return (
    <div>
      <HoverButton
        onClick={onGoBack}
        style={{
          background: "transparent",
          border: "none",
          color: colors.textSoft2,
          fontSize: 15,
          letterSpacing: ".5px",
          cursor: "pointer",
          padding: "8px 0",
          marginBottom: 20,
          fontFamily: fonts.body,
        }}
        hoverStyle={{ color: colors.accent }}
      >
        ← Tillbaka till alla böcker
      </HoverButton>

      <header style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 13, letterSpacing: 3.5, textTransform: "uppercase", color: colors.accent, marginBottom: 14 }}>
          Dina sparade
        </div>
        <h1 style={{ margin: 0, fontFamily: fonts.heading, fontWeight: 600, fontSize: "clamp(38px, 9vw, 64px)", lineHeight: 1, color: colors.textDark }}>
          Sparade böcker
        </h1>
      </header>

      {savedBooks.length === 0 ? (
        <div style={{ padding: "56px 0", borderTop: `1px solid ${colors.border1}` }}>
          <p style={{ margin: "0 0 20px", fontStyle: "italic", fontSize: 19, color: colors.textSoft2 }}>
            Du har inga sparade böcker ännu. Tryck på hjärtat ♡ vid en bok för att spara den här.
          </p>
          <HoverButton
            onClick={onGoBack}
            style={{
              background: colors.textDark,
              color: colors.paper,
              border: "none",
              padding: "14px 26px",
              borderRadius: 999,
              fontSize: 15,
              letterSpacing: ".5px",
              cursor: "pointer",
              fontFamily: fonts.body,
            }}
            hoverStyle={{ background: colors.accent }}
          >
            Bläddra bland böcker
          </HoverButton>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {savedBooks.map((book, pos) => (
            <BookRow
              key={book.slotB}
              variant="saved"
              book={book}
              rowDir={pos % 2 === 1 ? "row-reverse" : "row"}
              onOpen={() => onOpenDetail(book.idx)}
              onAdd={() => onAddToCart(book.idx)}
              onLike={() => onToggleLike(book.idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
