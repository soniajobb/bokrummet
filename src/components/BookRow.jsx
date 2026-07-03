import { colors, fonts } from "../theme";
import HoverButton from "./HoverButton";
import CoverImage from "./CoverImage";
import EditBookForm from "./EditBookForm";
import { useMediaQuery } from "../hooks/useMediaQuery";

export default function BookRow({
  book,
  rowDir,
  variant = "list",
  sellerMode,
  liked,
  onOpen,
  onAdd,
  onLike,
  onStartEdit,
  onToggleSold,
  onRemoveCustom,
  editing,
  editDraft,
  onEditChange,
  onSaveEdit,
  onCancelEdit,
}) {
  const isList = variant === "list";
  const stacked = useMediaQuery("(max-width: 680px)");
  const coverWidth = isList ? "clamp(150px, 55vw, 240px)" : "clamp(130px, 48vw, 200px)";
  const titleSize = isList ? "clamp(28px, 6.5vw, 46px)" : "clamp(26px, 6vw, 40px)";
  const priceSize = isList ? "clamp(24px, 5.5vw, 34px)" : "clamp(22px, 5vw, 32px)";

  return (
    <div
      style={{
        display: "flex",
        gap: "clamp(20px, 6vw, 52px)",
        alignItems: stacked ? "stretch" : "center",
        flexDirection: stacked ? "column" : rowDir,
        padding: "clamp(28px, 6vw, 44px) 0",
        borderTop: `1px solid ${colors.border1}`,
      }}
    >
      <CoverImage
        src={book.cover}
        alt={book.title}
        width={coverWidth}
        radius={5}
        boxShadow="0 18px 34px -16px rgba(51,41,31,.55)"
        onClick={onOpen}
      />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: isList ? 14 : 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: colors.accent }}>
            {book.tag}
          </span>
          {isList && book.sold && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: 11,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: colors.paper,
                background: colors.soldBadge,
                padding: "4px 10px",
                borderRadius: 999,
              }}
            >
              Såld
            </span>
          )}
        </div>

        <HoverButton
          as="h3"
          onClick={onOpen}
          style={{
            margin: 0,
            fontFamily: fonts.heading,
            fontWeight: 600,
            fontSize: titleSize,
            lineHeight: 1.04,
            color: colors.textDark,
            cursor: "pointer",
            width: "fit-content",
            maxWidth: "100%",
          }}
          hoverStyle={{ color: colors.accent }}
        >
          {book.title}
        </HoverButton>

        <p style={{ margin: 0, fontStyle: "italic", fontSize: isList ? 18 : 17, color: colors.textSoft2 }}>
          av {book.author}
        </p>

        {isList && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              width: "fit-content",
              fontSize: 14,
              color: colors.green,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors.green }} />
            {book.condition}
          </span>
        )}

        {isList && (
          <p style={{ margin: "6px 0 0", maxWidth: "min(460px, 100%)", fontSize: 17, lineHeight: 1.6, color: colors.textSoft3 }}>
            {book.desc}
          </p>
        )}

        <div style={{ marginTop: isList ? 16 : 14, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <span style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: priceSize, color: colors.accent }}>
            {book.price}
          </span>

          {!book.sold && (
            <HoverButton
              onClick={onAdd}
              style={{
                background: colors.textDark,
                color: colors.paper,
                border: "none",
                padding: "12px 22px",
                borderRadius: 999,
                fontSize: 14,
                letterSpacing: ".5px",
                cursor: "pointer",
                fontFamily: fonts.body,
              }}
              hoverStyle={{ background: colors.accent }}
            >
              Lägg i varukorg
            </HoverButton>
          )}
          {isList && book.sold && (
            <span
              style={{
                background: colors.border4,
                color: colors.textMuted,
                border: "none",
                padding: "12px 22px",
                borderRadius: 999,
                fontSize: 14,
                letterSpacing: ".5px",
              }}
            >
              Slutsåld
            </span>
          )}

          {isList && sellerMode && (
            <>
              <HoverButton
                onClick={onStartEdit}
                style={{
                  background: "transparent",
                  color: colors.textDark,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: colors.border3,
                  padding: "11px 18px",
                  borderRadius: 999,
                  fontSize: 13,
                  letterSpacing: ".3px",
                  cursor: "pointer",
                  fontFamily: fonts.body,
                }}
                hoverStyle={{ borderColor: colors.accent, color: colors.accent }}
              >
                Ändra
              </HoverButton>
              <HoverButton
                onClick={onToggleSold}
                style={{
                  background: "transparent",
                  color: colors.soldBadge,
                  border: "1px solid #d9b7a8",
                  padding: "11px 18px",
                  borderRadius: 999,
                  fontSize: 13,
                  letterSpacing: ".3px",
                  cursor: "pointer",
                  fontFamily: fonts.body,
                }}
                hoverStyle={{ background: colors.saveBg }}
              >
                {book.sold ? "Markera som tillgänglig" : "Markera som såld"}
              </HoverButton>
            </>
          )}

          {isList && sellerMode && book.custom && (
            <HoverButton
              onClick={onRemoveCustom}
              style={{
                background: "transparent",
                color: colors.textMuted2,
                border: "none",
                padding: "11px 6px",
                fontSize: 13,
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                fontFamily: fonts.body,
              }}
              hoverStyle={{ color: colors.soldBadge }}
            >
              Ta bort bok
            </HoverButton>
          )}

          {isList &&
            (liked ? (
              <HoverButton
                onClick={onLike}
                title="Ta bort från sparade"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 46,
                  height: 46,
                  borderRadius: 999,
                  border: `1px solid ${colors.saveBorder}`,
                  background: colors.saveBg,
                  color: colors.accent,
                  fontSize: 20,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ♥
              </HoverButton>
            ) : (
              <HoverButton
                onClick={onLike}
                title="Spara"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 46,
                  height: 46,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: colors.border3,
                  background: "transparent",
                  color: colors.textMuted2,
                  fontSize: 20,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
                hoverStyle={{ borderColor: colors.accent, color: colors.accent }}
              >
                ♡
              </HoverButton>
            ))}

          {isList && (
            <HoverButton
              onClick={onOpen}
              style={{
                background: "transparent",
                color: colors.textSoft2,
                border: "none",
                padding: "12px 4px",
                fontSize: 14,
                letterSpacing: ".5px",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                fontFamily: fonts.body,
              }}
              hoverStyle={{ color: colors.accent }}
            >
              Läs mer & fråga
            </HoverButton>
          )}

          {!isList && (
            <HoverButton
              onClick={onLike}
              title="Ta bort från sparade"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 46,
                height: 46,
                borderRadius: 999,
                border: `1px solid ${colors.saveBorder}`,
                background: colors.saveBg,
                color: colors.accent,
                fontSize: 20,
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ♥
            </HoverButton>
          )}
        </div>

        {isList && editing && (
          <EditBookForm draft={editDraft} onChange={onEditChange} onSave={onSaveEdit} onCancel={onCancelEdit} />
        )}
      </div>
    </div>
  );
}
