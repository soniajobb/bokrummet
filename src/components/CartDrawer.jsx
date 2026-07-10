import { colors, fonts } from "../theme";
import HoverButton from "./HoverButton";
import { SWISH_NUMBER_DISPLAY, buildSwishLink, buildSwishQrUrl } from "../lib/business";

const fieldStyle = {
  background: colors.card,
  border: `1px solid ${colors.border2}`,
  borderRadius: 6,
  padding: "12px 14px",
  fontSize: 15,
  color: colors.textDark,
};

export default function CartDrawer({
  open,
  onClose,
  cartBooks,
  onRemove,
  shipping,
  onSetShipping,
  freeShip,
  total,
  checkedOut,
  onBackToCart,
  order,
  onOrderChange,
  orderSent,
  sendingOrder,
  orderError,
  onSubmitOrder,
}) {
  if (!open) return null;

  const shipLabel = shipping === "post" ? "Skicka hem" : "Hämtas / möts upp";
  const swishMessage = cartBooks.map((b) => b.title).join(", ").slice(0, 50) || "Bokrummet";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(51,41,31,.4)" }} />
      <aside
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          width: 400,
          maxWidth: "90vw",
          background: colors.paper,
          boxShadow: "-24px 0 60px -20px rgba(51,41,31,.5)",
          display: "flex",
          flexDirection: "column",
          fontFamily: fonts.body,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px clamp(16px, 6vw, 30px)",
            borderBottom: `1px solid ${colors.border1}`,
          }}
        >
          <h2 style={{ margin: 0, fontFamily: fonts.heading, fontWeight: 600, fontSize: 30, color: colors.textDark }}>
            Varukorg
          </h2>
          <HoverButton
            onClick={onClose}
            style={{ background: "transparent", border: "none", fontSize: 26, lineHeight: 1, color: colors.textSoft2, cursor: "pointer" }}
            hoverStyle={{ color: colors.accent }}
          >
            ×
          </HoverButton>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px clamp(16px, 6vw, 30px)" }}>
          {cartBooks.length === 0 ? (
            <p style={{ margin: "36px 0", textAlign: "center", fontStyle: "italic", color: colors.textSoft2, fontSize: 16 }}>
              Din varukorg är tom.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {cartBooks.map((item) => (
                <div
                  key={item.pos}
                  style={{ display: "flex", gap: 16, alignItems: "center", padding: "20px 0", borderBottom: `1px solid ${colors.cartRowBorder}` }}
                >
                  {item.cover ? (
                    <img
                      src={item.cover}
                      alt={item.title}
                      style={{ flex: "0 0 54px", width: 54, height: 78, borderRadius: 4, objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ flex: "0 0 54px", width: 54, height: 78, borderRadius: 4, background: colors.card }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px", fontFamily: fonts.heading, fontWeight: 600, fontSize: 20, lineHeight: 1.1, color: colors.textDark }}>
                      {item.title}
                    </p>
                    <p style={{ margin: 0, fontSize: 14, color: colors.accent }}>{item.price}</p>
                  </div>
                  <HoverButton
                    onClick={() => onRemove(item.pos)}
                    style={{ background: "transparent", border: "none", color: colors.textMuted2, fontSize: 13, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px", fontFamily: fonts.body }}
                    hoverStyle={{ color: colors.accent }}
                  >
                    Ta bort
                  </HoverButton>
                </div>
              ))}
            </div>
          )}

          {cartBooks.length > 0 && (
            <div style={{ padding: "24px 0 4px", marginTop: 8, borderTop: `1px solid ${colors.border1}` }}>
              {!checkedOut ? (
                <>
                  <div style={{ marginBottom: 18 }}>
                    <p style={{ margin: "0 0 10px", fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: colors.textMuted }}>
                      Leverans
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <button
                        onClick={() => onSetShipping("pickup")}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          textAlign: "left",
                          padding: "13px 15px",
                          borderRadius: 10,
                          cursor: "pointer",
                          border: `1px solid ${shipping === "pickup" ? colors.accent : colors.border2}`,
                          background: shipping === "pickup" ? colors.saveBg : colors.card,
                          fontFamily: fonts.body,
                        }}
                      >
                        <span style={{ fontSize: 15, color: colors.textDark }}>Hämtas / möts upp</span>
                        <span style={{ fontSize: 14, color: colors.textSoft2 }}>0 kr</span>
                      </button>
                      <button
                        onClick={() => onSetShipping("post")}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          textAlign: "left",
                          padding: "13px 15px",
                          borderRadius: 10,
                          cursor: "pointer",
                          border: `1px solid ${shipping === "post" ? colors.accent : colors.border2}`,
                          background: shipping === "post" ? colors.saveBg : colors.card,
                          fontFamily: fonts.body,
                        }}
                      >
                        <span style={{ fontSize: 15, color: colors.textDark }}>Skicka hem</span>
                        <span style={{ fontSize: 14, color: colors.textSoft2 }}>{freeShip ? "Fri frakt" : "+59 kr"}</span>
                      </button>
                    </div>
                    <p style={{ margin: "10px 2px 2px", fontSize: 13, lineHeight: 1.5, color: colors.accent }}>
                      {freeShip ? "Du har fri frakt! 🎉" : "Fri frakt när böckerna kostar 150 kr eller mer."}
                    </p>
                    <p style={{ margin: "6px 2px 0", fontSize: 13, lineHeight: 1.5, color: colors.textSoft2 }}>
                      {shipping === "post"
                        ? "Skriv din adress nedan, så skickar Sonia boken dit."
                        : "Skriv ungefär var du finns nedan, så kommer ni överens om plats och tid för hämtning."}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
                    <span style={{ fontSize: 15, letterSpacing: ".5px", color: colors.textSoft2 }}>Summa</span>
                    <span style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 30, color: colors.textDark }}>{total} kr</span>
                  </div>

                  <p style={{ margin: "0 0 10px", fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: colors.textMuted }}>
                    Dina uppgifter
                  </p>
                  <form onSubmit={onSubmitOrder} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input
                      value={order.name}
                      onChange={(e) => onOrderChange("name", e.target.value)}
                      placeholder="Ditt namn"
                      style={fieldStyle}
                    />
                    <input
                      value={order.phone}
                      onChange={(e) => onOrderChange("phone", e.target.value)}
                      placeholder="Telefon"
                      style={fieldStyle}
                    />
                    <textarea
                      value={order.address}
                      onChange={(e) => onOrderChange("address", e.target.value)}
                      rows={3}
                      placeholder="Adress (eller område om du hämtar)"
                      style={{ ...fieldStyle, resize: "vertical" }}
                    />
                    <HoverButton
                      type="submit"
                      disabled={sendingOrder}
                      style={{
                        background: colors.accent,
                        color: colors.paper,
                        border: "none",
                        padding: 16,
                        borderRadius: 999,
                        fontSize: 16,
                        letterSpacing: ".5px",
                        cursor: sendingOrder ? "default" : "pointer",
                        fontFamily: fonts.body,
                        opacity: sendingOrder ? 0.7 : 1,
                      }}
                      hoverStyle={{ background: colors.accentHover }}
                    >
                      {sendingOrder ? "Skickar…" : "Skicka beställning"}
                    </HoverButton>
                    {orderError && (
                      <p style={{ margin: "2px 0 0", fontSize: 13, lineHeight: 1.5, color: colors.soldBadge }}>{orderError}</p>
                    )}
                  </form>
                </>
              ) : (
                <div style={{ textAlign: "center" }}>
                  {orderSent && (
                    <div style={{ marginBottom: 20 }}>
                      <p style={{ margin: "0 0 6px", fontFamily: fonts.heading, fontWeight: 600, fontSize: 22, color: colors.textDark }}>
                        Tack, {order.name}!
                      </p>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: colors.textSoft3 }}>
                        Din beställning har skickats till Sonia.
                      </p>
                    </div>
                  )}

                  <p style={{ margin: "0 0 4px", fontFamily: fonts.heading, fontWeight: 600, fontSize: 24, color: colors.textDark }}>
                    Betala med Swish
                  </p>
                  <p style={{ margin: "0 0 16px", fontSize: 14, color: colors.textSoft2 }}>
                    Skanna koden i Swish-appen, eller skicka summan till numret nedan.
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                    <div style={{ background: "#fff", padding: 12, borderRadius: 12, border: `1px solid ${colors.border1}` }}>
                      <img src={buildSwishQrUrl(total, swishMessage)} alt="Swish QR-kod" style={{ display: "block", width: 180, height: 180 }} />
                    </div>
                  </div>
                  <div style={{ background: colors.card, border: `1px solid ${colors.border2}`, borderRadius: 10, padding: "14px 16px", textAlign: "left", marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, letterSpacing: ".5px", color: colors.textSoft2 }}>Swish-nummer</span>
                      <span style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 22, color: colors.textDark }}>{SWISH_NUMBER_DISPLAY}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, letterSpacing: ".5px", color: colors.textSoft2 }}>Belopp</span>
                      <span style={{ fontFamily: fonts.heading, fontWeight: 600, fontSize: 22, color: colors.accent }}>{total} kr</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, letterSpacing: ".5px", color: colors.textSoft2 }}>Leverans</span>
                      <span style={{ fontSize: 15, color: colors.textDark }}>{shipLabel}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 13, letterSpacing: ".5px", color: colors.textSoft2 }}>Meddelande</span>
                      <span style={{ fontSize: 15, color: colors.textDark, textAlign: "right" }}>{swishMessage}</span>
                    </div>
                  </div>
                  <a
                    href={buildSwishLink(total, swishMessage)}
                    style={{
                      display: "block",
                      width: "100%",
                      boxSizing: "border-box",
                      background: colors.accent,
                      color: colors.paper,
                      border: "none",
                      padding: 15,
                      borderRadius: 999,
                      fontSize: 15,
                      letterSpacing: ".5px",
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    Öppna Swish-appen
                  </a>

                  <HoverButton
                    onClick={onBackToCart}
                    style={{
                      marginTop: 14,
                      background: "transparent",
                      border: "none",
                      color: colors.textMuted2,
                      fontSize: 13,
                      cursor: "pointer",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                      fontFamily: fonts.body,
                    }}
                    hoverStyle={{ color: colors.accent }}
                  >
                    ← Tillbaka till varukorgen
                  </HoverButton>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
