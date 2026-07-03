import { colors, fonts } from "../theme";
import HoverButton from "./HoverButton";
import CoverImage from "./CoverImage";
import { SELLER_EMAIL } from "../lib/business";

const fieldStyle = {
  background: colors.card,
  border: `1px solid ${colors.border2}`,
  borderRadius: 6,
  padding: "14px 16px",
  fontSize: 16,
  color: colors.textDark,
};

export default function DetailView({
  book,
  liked,
  onGoBack,
  onAddToCart,
  onToggleLike,
  form,
  onFormChange,
  sent,
  onSubmit,
}) {
  if (!book) return null;

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
          marginBottom: 28,
          fontFamily: fonts.body,
        }}
        hoverStyle={{ color: colors.accent }}
      >
        ← Tillbaka till alla böcker
      </HoverButton>

      <div style={{ display: "flex", gap: 56, alignItems: "flex-start", flexWrap: "wrap" }}>
        <CoverImage
          src={book.cover}
          alt={book.title}
          width="clamp(200px, 70vw, 300px)"
          radius={6}
          boxShadow="0 24px 44px -18px rgba(51,41,31,.6)"
        />

        <div style={{ flex: "1 1 260px", minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: colors.accent }}>
              {book.tag}
            </span>
            {book.sold && (
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

          <h1
            style={{
              margin: 0,
              fontFamily: fonts.heading,
              fontWeight: 600,
              fontSize: "clamp(32px, 7vw, 52px)",
              lineHeight: 1.02,
              color: colors.textDark,
            }}
          >
            {book.title}
          </h1>
          <p style={{ margin: 0, fontStyle: "italic", fontSize: 19, color: colors.textSoft2 }}>av {book.author}</p>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              width: "fit-content",
              fontSize: 15,
              color: colors.green,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors.green }} />
            {book.condition}
          </span>
          <p style={{ margin: "8px 0 0", fontSize: 18, lineHeight: 1.7, color: colors.textSoft3 }}>{book.desc}</p>

          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <span style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: "clamp(28px, 6vw, 40px)", color: colors.accent }}>
              {book.price}
            </span>

            {!book.sold ? (
              <HoverButton
                onClick={onAddToCart}
                style={{
                  background: colors.textDark,
                  color: colors.paper,
                  border: "none",
                  padding: "15px 30px",
                  borderRadius: 999,
                  fontSize: 15,
                  letterSpacing: ".5px",
                  cursor: "pointer",
                  fontFamily: fonts.body,
                }}
                hoverStyle={{ background: colors.accent }}
              >
                Lägg i varukorg
              </HoverButton>
            ) : (
              <span
                style={{
                  background: colors.border4,
                  color: colors.textMuted,
                  padding: "15px 30px",
                  borderRadius: 999,
                  fontSize: 15,
                  letterSpacing: ".5px",
                }}
              >
                Slutsåld
              </span>
            )}

            {liked ? (
              <HoverButton
                onClick={onToggleLike}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  border: `1px solid ${colors.saveBorder}`,
                  background: colors.saveBg,
                  color: colors.accent,
                  padding: "14px 24px",
                  borderRadius: 999,
                  fontSize: 15,
                  letterSpacing: ".5px",
                  cursor: "pointer",
                  fontFamily: fonts.body,
                }}
              >
                <span style={{ fontSize: 19, lineHeight: 1 }}>♥</span> Sparad
              </HoverButton>
            ) : (
              <HoverButton
                onClick={onToggleLike}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: colors.border3,
                  background: "transparent",
                  color: colors.textSoft2,
                  padding: "14px 24px",
                  borderRadius: 999,
                  fontSize: 15,
                  letterSpacing: ".5px",
                  cursor: "pointer",
                  fontFamily: fonts.body,
                }}
                hoverStyle={{ borderColor: colors.accent, color: colors.accent }}
              >
                <span style={{ fontSize: 19, lineHeight: 1 }}>♡</span> Spara
              </HoverButton>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 64, paddingTop: 44, borderTop: `1px solid ${colors.border1}`, maxWidth: 640 }}>
        <h2 style={{ margin: "0 0 6px", fontFamily: fonts.heading, fontWeight: 600, fontSize: 36, color: colors.textDark }}>
          Fråga om boken
        </h2>
        <p style={{ margin: "0 0 26px", fontSize: 16, lineHeight: 1.6, color: colors.textSoft2 }}>
          Har du en fråga om skick, frakt eller något annat? Skriv direkt till mig, så svarar jag så snart jag kan.
        </p>

        {!sent ? (
          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              value={form.name}
              onChange={(e) => onFormChange("name", e.target.value)}
              placeholder="Ditt namn"
              style={fieldStyle}
            />
            <input
              value={form.email}
              onChange={(e) => onFormChange("email", e.target.value)}
              type="email"
              placeholder="Din e-post"
              style={fieldStyle}
            />
            <textarea
              value={form.msg}
              onChange={(e) => onFormChange("msg", e.target.value)}
              rows={5}
              placeholder="Din fråga eller ditt meddelande…"
              style={{ ...fieldStyle, resize: "vertical" }}
            />
            <HoverButton
              type="submit"
              style={{
                alignSelf: "flex-start",
                background: colors.accent,
                color: colors.paper,
                border: "none",
                padding: "15px 34px",
                borderRadius: 999,
                fontSize: 15,
                letterSpacing: ".5px",
                cursor: "pointer",
                fontFamily: fonts.body,
              }}
              hoverStyle={{ background: colors.accentHover }}
            >
              Skicka meddelande
            </HoverButton>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: colors.textMuted2 }}>
              När du trycker skicka öppnas din e-post med meddelandet färdigt till Sonia.
            </p>
          </form>
        ) : (
          <div style={{ background: colors.card, border: `1px solid ${colors.border2}`, borderRadius: 8, padding: "28px 30px" }}>
            <p style={{ margin: "0 0 8px", fontFamily: fonts.heading, fontSize: 28, color: colors.textDark }}>
              Tack, {form.name}!
            </p>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: colors.textSoft3 }}>
              Ditt e-postprogram har öppnats med meddelandet färdigt. Tryck bara på skicka där, så når det Sonia.
              Hörs inget fönster upp? Mejla direkt till{" "}
              <a href={`mailto:${SELLER_EMAIL}`} style={{ color: colors.accent }}>
                {SELLER_EMAIL}
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
