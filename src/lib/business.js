export const SELLER_EMAIL = "soniasommarjobb@gmail.com";
export const SWISH_NUMBER_DISPLAY = "076 941 01 20";
export const SWISH_NUMBER_DEEPLINK = "46769410120";
export const FREE_SHIPPING_THRESHOLD = 150;
export const SHIPPING_COST = 59;

export function priceToNumber(price) {
  return parseInt(String(price).replace(/[^0-9]/g, ""), 10) || 0;
}

export function formatKr(n) {
  return n + " kr";
}

export function computeShipping(booksTotal, shipping) {
  const freeShip = booksTotal >= FREE_SHIPPING_THRESHOLD;
  const shipCost = shipping === "post" && !freeShip ? SHIPPING_COST : 0;
  return { freeShip, shipCost, total: booksTotal + shipCost };
}

export function buildSwishLink(amount, message = "Bokrummet") {
  return (
    "https://app.swish.nu/1/p/sw/?sw=" +
    SWISH_NUMBER_DEEPLINK +
    "&amt=" +
    amount +
    "&cur=SEK&msg=" +
    encodeURIComponent(message)
  );
}

export function buildSwishQrUrl(amount, message) {
  return (
    "https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=0&data=" +
    encodeURIComponent(buildSwishLink(amount, message))
  );
}

export function getGenre(tag) {
  const parts = String(tag || "").split("·");
  return (parts.length > 1 ? parts[1] : parts[0]).trim();
}

export function isValidSwedishPhone(phone) {
  const digits = String(phone || "").replace(/[^0-9+]/g, "");
  const local = digits.replace(/^\+46/, "0").replace(/^0046/, "0");
  return /^0\d{8,9}$/.test(local);
}

export function buildMailto(to, subject, body) {
  return (
    "mailto:" +
    to +
    "?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body)
  );
}
