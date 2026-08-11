import { useState } from "react";
import { colors, fonts } from "../theme";
import { getGenre, priceToNumber } from "../lib/business";
import HoverButton from "./HoverButton";
import AddBookForm from "./AddBookForm";
import BookRow from "./BookRow";
import Pagination from "./Pagination";
import Footer from "./Footer";

const PER_PAGE = 7;

const SORT_OPTIONS = [
  { key: "standard", label: "Standard" },
  { key: "price-asc", label: "Pris: lägst till högst" },
  { key: "price-desc", label: "Pris: högst till lägst" },
];

function chipStyle(active) {
  return {
    background: active ? colors.textDark : "transparent",
    color: active ? colors.paper : colors.textSoft2,
    border: `1px solid ${active ? colors.textDark : colors.border3}`,
    padding: "7px 16px",
    borderRadius: 999,
    fontSize: 13,
    letterSpacing: ".3px",
    cursor: "pointer",
    fontFamily: fonts.body,
  };
}

function chipHoverStyle(active) {
  return { borderColor: colors.accent, color: active ? colors.paper : colors.accent };
}

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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("standard");
  const [searchQuery, setSearchQuery] = useState("");

  const genres = Array.from(new Set(allBooks.map((b) => getGenre(b.tag)))).sort((a, b) =>
    a.localeCompare(b, "sv")
  );

  const query = searchQuery.trim().toLowerCase();
  const searchedBooks = !query
    ? allBooks
    : allBooks.filter(
        (b) => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query)
      );

  const filteredBooks =
    filterGenre === "Alla" ? searchedBooks : searchedBooks.filter((b) => getGenre(b.tag) === filterGenre);

  const sortedBooks =
    sortOrder === "price-asc"
      ? [...filteredBooks].sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price))
      : sortOrder === "price-desc"
        ? [...filteredBooks].sort((a, b) => priceToNumber(b.price) - priceToNumber(a.price))
        : filteredBooks;

  const totalPages = Math.max(1, Math.ceil(sortedBooks.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * PER_PAGE;
  const pageBooks = sortedBooks.slice(start, start + PER_PAGE);

  const hasActiveFilter = filterGenre !== "Alla" || sortOrder !== "standard";
  const handleSetSort = (key) => {
    setSortOrder(key);
    onGoPage(0);
  };
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    onGoPage(0);
  };

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

      <div style={{ position: "relative", marginBottom: 20 }}>
        <input
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Sök efter titel eller författare…"
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: colors.card,
            border: `1px solid ${colors.border2}`,
            borderRadius: 999,
            padding: "13px 20px",
            fontSize: 15,
            color: colors.textDark,
            fontFamily: fonts.body,
          }}
        />
        {searchQuery && (
          <HoverButton
            onClick={() => handleSearchChange("")}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: colors.textMuted2,
              fontSize: 20,
              lineHeight: 1,
              cursor: "pointer",
              padding: "6px 10px",
            }}
            hoverStyle={{ color: colors.accent }}
          >
            ×
          </HoverButton>
        )}
      </div>

      <div style={{ marginBottom: 28 }}>
        <HoverButton
          onClick={() => setFiltersOpen((v) => !v)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            background: filtersOpen ? colors.textDark : "transparent",
            color: filtersOpen ? colors.paper : colors.textSoft2,
            border: `1px solid ${filtersOpen ? colors.textDark : colors.border3}`,
            padding: "9px 18px",
            borderRadius: 999,
            fontSize: 14,
            letterSpacing: ".4px",
            cursor: "pointer",
            fontFamily: fonts.body,
          }}
          hoverStyle={{ borderColor: colors.accent, color: filtersOpen ? colors.paper : colors.accent }}
        >
          Filtrera
          {hasActiveFilter && (
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: filtersOpen ? colors.paper : colors.accent,
                display: "inline-block",
              }}
            />
          )}
          <span
            style={{
              fontSize: 11,
              display: "inline-block",
              transform: filtersOpen ? "rotate(180deg)" : "none",
              transition: "transform .15s",
            }}
          >
            ▾
          </span>
        </HoverButton>

        {filtersOpen && (
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: colors.textMuted }}>
                Kategori
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Alla", ...genres].map((g) => (
                  <HoverButton
                    key={g}
                    onClick={() => onSetFilterGenre(g)}
                    style={chipStyle(filterGenre === g)}
                    hoverStyle={chipHoverStyle(filterGenre === g)}
                  >
                    {g}
                  </HoverButton>
                ))}
              </div>
            </div>

            <div>
              <p style={{ margin: "0 0 8px", fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: colors.textMuted }}>
                Sortera
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SORT_OPTIONS.map((opt) => (
                  <HoverButton
                    key={opt.key}
                    onClick={() => handleSetSort(opt.key)}
                    style={chipStyle(sortOrder === opt.key)}
                    hoverStyle={chipHoverStyle(sortOrder === opt.key)}
                  >
                    {opt.label}
                  </HoverButton>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredBooks.length === 0 && (
        <p style={{ margin: "24px 0", fontStyle: "italic", color: colors.textSoft2, fontSize: 16 }}>
          {query ? "Inga böcker matchade sökningen." : "Inga böcker hittades i den här kategorin."}
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
