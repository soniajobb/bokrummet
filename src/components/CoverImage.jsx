import { colors } from "../theme";

export default function CoverImage({ src, alt, width, radius = 5, placeholder = "Omslag", onClick, boxShadow }) {
  const shared = {
    display: "block",
    width,
    aspectRatio: "2/3",
    borderRadius: radius,
    cursor: onClick ? "pointer" : undefined,
  };

  const wrapperStyle = {
    flex: `0 0 ${width}px`,
    borderRadius: radius,
    overflow: "hidden",
    boxShadow,
    cursor: onClick ? "pointer" : undefined,
  };

  return (
    <div style={wrapperStyle} onClick={onClick}>
      {src ? (
        <img src={src} alt={alt} style={{ ...shared, width: "100%", objectFit: "cover" }} />
      ) : (
        <div
          style={{
            ...shared,
            width: "100%",
            background: colors.card,
            border: `1px dashed ${colors.border3}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.textMuted2,
            fontSize: 13,
            textAlign: "center",
            padding: 8,
          }}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
}
