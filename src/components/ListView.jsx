import { colors, fonts } from "../theme";
import { getGenre } from "../lib/business";
import HoverButton from "./HoverButton";
import AddBookForm from "./AddBookForm";
import BookRow from "./BookRow";
import Pagination from "./Pagination";
import Footer from "./Footer";

const PER_PAGE = 7;

export default function ListView({
  allBooks,
  page,
  onGoPage,
  filterGenre,
  onSetFilterGenre,
  liked,
  sellerMode,
  showAdd,
  onToggleAdd,
  draft,
  onDraftChange,
  onDraftCoverFile,
  onAddBook,
  onOpenDetail,
  onAddToCart,
  onToggleLike,
  onToggleSold,
  editingSlot,
  editDraft,
  onStartEdit,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
  onRemoveCustom,
}) {
  const genres = Array.from(new Set(allBooks.map((b) => getGenre(b.tag)))).sort((a, b) =>
    a.localeCompare(b, "sv")
  );
  const filteredBooks =
    filterGenre === "Alla" ? allBooks : allBooks.filter((b) => getGenre(b.tag) === filterGenre);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * PER_PAGE;
  const pageBooks = filteredBooks.slice(start, start + PER_PAGE);

  return (
    <div>
      <header style={{ marginBottom: 56 }}>
        <h1
          style={{
            margin: 0,
            fontFamily: fonts.heading,
            fontWeight: 600,
            fontSize: "clamp(44px, 11vw, 92px)",
            lineHeight: 0.95,
            color: colors.textDark,
          }}
        >
          Bokrummet
        </h1>
        <p
          style={{
            margin: "22px 0 0",
            maxWidth: "min(580px, 100%)",
            fontSize: "clamp(16px, 3.2vw, 21px)",
            fontStyle: "italic",
            lineHeight: 1.55,
            color: colors.textSoft,
          }}
        >
          Begagnade barnböcker i gott skick, redo för nya läsare.
        </p>
      </header>

      {sellerMode && (
        <div
          style={{
            background: colors.card,
            border: `1px solid ${colors.border2}`,
            borderRadius: 12,
            padding: "clamp(16px, 4vw, 24px) clamp(16px, 4vw, 26px)",
            marginBottom: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 26, color: colors.textDark }}>
              Lägg till en bok
            </span>
            {!showAdd ? (
              <HoverButton
                onClick={onToggleAdd}
                style={{
                  background: colors.textDark,
                  color: colors.paper,
                  border: "none",
                  padding: "11px 20px",
                  borderRadius: 999,
                  fontSize: 14,
                  letterSpacing: ".5px",
                  cursor: "pointer",
                  fontFamily: fonts.body,
                }}
                hoverStyle={{ background: colors.accent }}
              >
                + Ny bok
              </HoverButton>
            ) : (
              <HoverButton
                onClick={onToggleAdd}
                style={{
                  background: "transparent",
                  color: colors.textSoft2,
                  border: `1px solid ${colors.border3}`,
                  padding: "11px 20px",
                  borderRadius: 999,
                  fontSize: 14,
                  letterSpacing: ".5px",
                  cursor: "pointer",
                  fontFamily: fonts.body,
                }}
                hoverStyle={{ color: colors.accent }}
              >
                Stäng
              </HoverButton>
            )}
          </div>

          {showAdd && (
            <AddBookForm draft={draft} onChange={onDraftChange} onCoverFile={onDraftCoverFile} onSubmit={onAddBook} />
          )}
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
        {["Alla", ...genres].map((g) => (
          <HoverButton
            key={g}
            onClick={() => onSetFilterGenre(g)}
            style={{
              background: filterGenre === g ? colors.textDark : "transparent",
              color: filterGenre === g ? colors.paper : colors.textSoft2,
              border: `1px solid ${filterGenre === g ? colors.textDark : colors.border3}`,
              padding: "7px 16px",
              borderRadius: 999,
              fontSize: 13,
              letterSpacing: ".3px",
              cursor: "pointer",
              fontFamily: fonts.body,
            }}
            hoverStyle={{ borderColor: colors.accent, color: filterGenre === g ? colors.paper : colors.accent }}
          >
            {g}
          </HoverButton>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <p style={{ margin: "24px 0", fontStyle: "italic", color: colors.textSoft2, fontSize: 16 }}>
          Inga böcker hittades i den här kategorin.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column" }}>
        {pageBooks.map((book, k) => {
          const i = book.idx;
          return (
            <BookRow
              key={book.slotB}
              variant="list"
              book={book}
              rowDir={k % 2 === 1 ? "row-reverse" : "row"}
              sellerMode={sellerMode}
              liked={liked.includes(i)}
              onOpen={() => onOpenDetail(i)}
              onAdd={() => onAddToCart(i)}
              onLike={() => onToggleLike(i)}
              onStartEdit={() => onStartEdit(book.slotB)}
              onToggleSold={() => onToggleSold(i)}
              onRemoveCustom={() => onRemoveCustom(book.slotB)}
              editing={sellerMode && editingSlot === book.slotB}
              editDraft={editDraft}
              onEditChange={onEditChange}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
            />
          );
        })}
      </div>

      <Pagination totalPages={totalPages} page={safePage} onGoPage={onGoPage} />

      <Footer />
    </div>
  );
}
