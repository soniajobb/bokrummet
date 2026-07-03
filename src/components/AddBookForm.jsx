import { colors, fonts } from "../theme";
import HoverButton from "./HoverButton";

const fieldStyle = {
  background: colors.paper,
  border: `1px solid ${colors.border2}`,
  borderRadius: 6,
  padding: "12px 14px",
  fontSize: 15,
  color: colors.textDark,
};

export default function AddBookForm({ draft, onChange, onCoverFile, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", gap: 24, marginTop: 20, flexWrap: "wrap" }}
    >
      <div style={{ flex: "0 0 150px" }}>
        <div style={{ borderRadius: 6, overflow: "hidden", boxShadow: "0 10px 22px -12px rgba(51,41,31,.5)" }}>
          {draft.cover ? (
            <img
              src={draft.cover}
              alt=""
              style={{ display: "block", width: 150, aspectRatio: "2/3", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 150,
                aspectRatio: "2/3",
                background: colors.card,
                border: `1px dashed ${colors.border3}`,
                color: colors.textMuted2,
                fontSize: 13,
                textAlign: "center",
                padding: 8,
              }}
            >
              Välj omslag
            </div>
          )}
        </div>
        <label
          style={{
            display: "block",
            marginTop: 8,
            fontSize: 12,
            color: colors.textMuted2,
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          Välj bild på omslaget
          <input
            type="file"
            accept="image/*"
            onChange={onCoverFile}
            style={{ display: "none" }}
          />
        </label>
      </div>
      <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          value={draft.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Titel"
          style={fieldStyle}
        />
        <input
          value={draft.author}
          onChange={(e) => onChange("author", e.target.value)}
          placeholder="Författare"
          style={fieldStyle}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={draft.tag}
            onChange={(e) => onChange("tag", e.target.value)}
            placeholder="Kategori (t.ex. Barnbok · Fantasy)"
            style={{ ...fieldStyle, flex: 1 }}
          />
          <input
            value={draft.price}
            onChange={(e) => onChange("price", e.target.value)}
            placeholder="Pris (t.ex. 59)"
            style={{ ...fieldStyle, flex: "0 0 130px" }}
          />
        </div>
        <textarea
          value={draft.desc}
          onChange={(e) => onChange("desc", e.target.value)}
          rows={3}
          placeholder="Kort beskrivning"
          style={{ ...fieldStyle, resize: "vertical" }}
        />
        <input
          value={draft.condition}
          onChange={(e) => onChange("condition", e.target.value)}
          placeholder="Skick (t.ex. Bra skick, liten böjd hörna)"
          style={fieldStyle}
        />
        <HoverButton
          type="submit"
          style={{
            alignSelf: "flex-start",
            background: colors.accent,
            color: colors.paper,
            border: "none",
            padding: "13px 26px",
            borderRadius: 999,
            fontSize: 15,
            letterSpacing: ".5px",
            cursor: "pointer",
            fontFamily: fonts.body,
          }}
          hoverStyle={{ background: colors.accentHover }}
        >
          Lägg till boken
        </HoverButton>
      </div>
    </form>
  );
}
