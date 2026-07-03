import { colors, fonts } from "../theme";
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
  const totalPages = Math.max(1, Math.ceil(allBooks.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * PER_PAGE;
  const pageBooks = allBooks.slice(start, start + PER_PAGE);

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

      <div style={{ display: "flex", flexDirection: "column" }}>
        {pageBooks.map((book, k) => {
          const i = start + k;
          return (
            <BookRow
              key={book.slotB}
              variant="list"
              book={book}
              rowDir={i % 2 === 1 ? "row-reverse" : "row"}
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
