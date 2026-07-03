import { colors, fonts } from "../theme";
import HoverButton from "./HoverButton";

const fieldStyle = {
  background: colors.paper,
  border: `1px solid ${colors.border2}`,
  borderRadius: 6,
  padding: "11px 13px",
  fontSize: 15,
  color: colors.textDark,
};

export default function EditBookForm({ draft, onChange, onSave, onCancel }) {
  return (
    <div
      style={{
        marginTop: 8,
        background: colors.card,
        border: `1px solid ${colors.border2}`,
        borderRadius: 12,
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <span style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 22, color: colors.textDark }}>
        Ändra boken
      </span>
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
          placeholder="Kategori"
          style={{ ...fieldStyle, flex: 1 }}
        />
        <input
          value={draft.price}
          onChange={(e) => onChange("price", e.target.value)}
          placeholder="Pris"
          style={{ ...fieldStyle, flex: "0 0 120px" }}
        />
      </div>
      <textarea
        value={draft.desc}
        onChange={(e) => onChange("desc", e.target.value)}
        rows={3}
        placeholder="Beskrivning"
        style={{ ...fieldStyle, resize: "vertical" }}
      />
      <input
        value={draft.condition}
        onChange={(e) => onChange("condition", e.target.value)}
        placeholder="Skick"
        style={fieldStyle}
      />
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <HoverButton
          onClick={onSave}
          style={{
            background: colors.accent,
            color: colors.paper,
            border: "none",
            padding: "12px 24px",
            borderRadius: 999,
            fontSize: 14,
            letterSpacing: ".5px",
            cursor: "pointer",
            fontFamily: fonts.body,
          }}
          hoverStyle={{ background: colors.accentHover }}
        >
          Spara ändringar
        </HoverButton>
        <HoverButton
          onClick={onCancel}
          style={{
            background: "transparent",
            color: colors.textSoft2,
            border: `1px solid ${colors.border3}`,
            padding: "12px 24px",
            borderRadius: 999,
            fontSize: 14,
            letterSpacing: ".5px",
            cursor: "pointer",
            fontFamily: fonts.body,
          }}
          hoverStyle={{ color: colors.accent }}
        >
          Avbryt
        </HoverButton>
      </div>
    </div>
  );
}
