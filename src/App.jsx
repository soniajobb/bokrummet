import { useState } from "react";
import { baseBooks } from "./data/books";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { colors, fonts } from "./theme";
import { priceToNumber, computeShipping, buildMailto, SELLER_EMAIL, SWISH_NUMBER_DISPLAY } from "./lib/business";
import TopBar from "./components/TopBar";
import ListView from "./components/ListView";
import DetailView from "./components/DetailView";
import SavedView from "./components/SavedView";
import CartDrawer from "./components/CartDrawer";

const EMPTY_DRAFT = { title: "", author: "", tag: "Barnbok", price: "", desc: "", condition: "Bra skick", cover: "" };
const EMPTY_EDIT_DRAFT = { title: "", author: "", tag: "", price: "", desc: "", condition: "" };

function normalizePrice(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return /kr/i.test(trimmed) ? trimmed : trimmed + " kr";
}

export default function App() {
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(0);
  const [page, setPage] = useState(0);
  const [sellerMode, setSellerMode] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraftState] = useState(EMPTY_DRAFT);
  const [editingSlot, setEditingSlot] = useState(null);
  const [editDraft, setEditDraftState] = useState(EMPTY_EDIT_DRAFT);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [shipping, setShipping] = useState("pickup");
  const [form, setFormState] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const [order, setOrderState] = useState({ name: "", phone: "", address: "" });
  const [orderSent, setOrderSent] = useState(false);

  const [cart, setCart] = useLocalStorageState("bokrummet_cart", []);
  const [liked, setLiked] = useLocalStorageState("bokrummet_liked", []);
  const [sold, setSold] = useLocalStorageState("bokrummet_sold", []);
  const [customBooks, setCustomBooks] = useLocalStorageState("bokrummet_custom_books", []);
  const [overrides, setOverrides] = useLocalStorageState("bokrummet_overrides", {});

  const books = [...baseBooks, ...customBooks].map((b) => (overrides[b.slotB] ? { ...b, ...overrides[b.slotB] } : b));
  const allBooks = books.map((b, i) => ({ ...b, idx: i, sold: sold.includes(i), custom: !!b.custom }));

  const scrollTop = () => window.scrollTo(0, 0);

  const openDetail = (i) => {
    setView("detail");
    setSelected(i);
    setSent(false);
    setFormState({ name: "", email: "", msg: "" });
    scrollTop();
  };
  const openSaved = () => {
    setView("saved");
    scrollTop();
  };
  const goBack = () => {
    setView("list");
    scrollTop();
  };
  const goPage = (n) => {
    setPage(n);
    scrollTop();
  };

  const addToCart = (i) => {
    if (sold.includes(i)) return;
    setCart((c) => [...c, i]);
    setCartOpen(true);
  };
  const removeFromCart = (pos) => setCart((c) => c.filter((_, k) => k !== pos));
  const toggleCart = () => {
    setCartOpen((v) => !v);
    setCheckedOut(false);
  };
  const backToCart = () => setCheckedOut(false);
  const checkout = () => setCheckedOut(true);

  const toggleLike = (i) => setLiked((l) => (l.includes(i) ? l.filter((x) => x !== i) : [...l, i]));
  const toggleSold = (i) => setSold((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  const toggleSellerMode = () => setSellerMode((v) => !v);
  const toggleAdd = () => setShowAdd((v) => !v);

  const setDraftField = (k, v) => setDraftState((d) => ({ ...d, [k]: v }));
  const onDraftCoverFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraftField("cover", reader.result);
    reader.readAsDataURL(file);
  };

  const addBook = (e) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.price.trim()) return;
    const book = {
      title: draft.title.trim(),
      author: draft.author.trim() || "Okänd",
      tag: draft.tag.trim() || "Barnbok",
      price: normalizePrice(draft.price),
      desc: draft.desc.trim(),
      condition: draft.condition.trim() || "Bra skick",
      cover: draft.cover || "",
      slotB: "custom-" + Date.now(),
      custom: true,
    };
    setCustomBooks((cb) => [...cb, book]);
    setDraftState(EMPTY_DRAFT);
    setShowAdd(false);
  };
  const removeBook = (slotB) => setCustomBooks((cb) => cb.filter((b) => b.slotB !== slotB));

  const startEdit = (slotB) => {
    const b = books.find((x) => x.slotB === slotB) || {};
    setEditingSlot(slotB);
    setEditDraftState({
      title: b.title || "",
      author: b.author || "",
      tag: b.tag || "",
      price: b.price || "",
      desc: b.desc || "",
      condition: b.condition || "Bra skick",
    });
  };
  const setEditField = (k, v) => setEditDraftState((d) => ({ ...d, [k]: v }));
  const cancelEdit = () => setEditingSlot(null);
  const saveEdit = () => {
    if (!editingSlot) return;
    setOverrides((ov) => ({
      ...ov,
      [editingSlot]: {
        title: editDraft.title.trim(),
        author: editDraft.author.trim(),
        tag: editDraft.tag.trim(),
        price: normalizePrice(editDraft.price),
        desc: editDraft.desc.trim(),
        condition: editDraft.condition.trim() || "Bra skick",
      },
    }));
    setEditingSlot(null);
  };

  const setFormField = (k, v) => {
    setFormState((f) => ({ ...f, [k]: v }));
    setSent(false);
  };
  const submitMessage = (e) => {
    e.preventDefault();
    const book = books[selected] || {};
    const subject = "Fråga om boken: " + (book.title || "Bokrummet");
    const body =
      "Hej Sonia,\n\n" +
      (form.msg || "") +
      "\n\n— — —\nGäller boken: " +
      (book.title || "") +
      "\nFrån: " +
      (form.name || "") +
      "\nE-post: " +
      (form.email || "");
    try {
      window.location.href = buildMailto(SELLER_EMAIL, subject, body);
    } catch {
      // ignore
    }
    setSent(true);
  };

  const setOrderField = (k, v) => {
    setOrderState((o) => ({ ...o, [k]: v }));
    setOrderSent(false);
  };
  const submitOrder = (e) => {
    e.preventDefault();
    const lines = cart.map((i) => "• " + books[i].title + " – " + books[i].price).join("\n");
    const booksTotal = cart.reduce((sum, i) => sum + priceToNumber(books[i].price), 0);
    const { shipCost, total } = computeShipping(booksTotal, shipping);
    const shipLabel = shipping === "post" ? "Skicka hem" : "Hämtas / möts upp";
    const subject = "Ny beställning – Bokrummet";
    const body =
      "Hej Sonia,\n\nJag vill beställa:\n" +
      lines +
      "\n\nLeverans: " +
      shipLabel +
      (shipCost ? " (+" + shipCost + " kr)" : "") +
      "\nTotalt: " +
      total +
      " kr" +
      "\n\nNamn: " +
      (order.name || "") +
      "\nTelefon: " +
      (order.phone || "") +
      "\nAdress / område: " +
      (order.address || "") +
      "\n\nJag swishar " +
      total +
      " kr till " +
      SWISH_NUMBER_DISPLAY +
      ".";
    try {
      window.location.href = buildMailto(SELLER_EMAIL, subject, body);
    } catch {
      // ignore
    }
    setOrderSent(true);
  };

  const cartBooks = cart.map((i, pos) => ({ ...books[i], pos }));
  const booksTotal = cartBooks.reduce((sum, b) => sum + priceToNumber(b.price), 0);
  const { freeShip, total } = computeShipping(booksTotal, shipping);

  const savedBooks = liked.map((i) => allBooks[i]).filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", background: colors.paper, fontFamily: fonts.body, color: colors.textDark }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "36px 40px 96px" }}>
        <TopBar
          sellerMode={sellerMode}
          onToggleSeller={toggleSellerMode}
          likedCount={liked.length}
          onOpenSaved={openSaved}
          cartCount={cart.length}
          onOpenCart={toggleCart}
        />

        {view === "list" && (
          <ListView
            allBooks={allBooks}
            page={page}
            onGoPage={goPage}
            liked={liked}
            sellerMode={sellerMode}
            showAdd={showAdd}
            onToggleAdd={toggleAdd}
            draft={draft}
            onDraftChange={setDraftField}
            onDraftCoverFile={onDraftCoverFile}
            onAddBook={addBook}
            onOpenDetail={openDetail}
            onAddToCart={addToCart}
            onToggleLike={toggleLike}
            onToggleSold={toggleSold}
            editingSlot={editingSlot}
            editDraft={editDraft}
            onStartEdit={startEdit}
            onEditChange={setEditField}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEdit}
            onRemoveCustom={removeBook}
          />
        )}

        {view === "saved" && (
          <SavedView
            savedBooks={savedBooks}
            onGoBack={goBack}
            onOpenDetail={openDetail}
            onAddToCart={addToCart}
            onToggleLike={toggleLike}
          />
        )}

        {view === "detail" && (
          <DetailView
            book={allBooks[selected]}
            liked={liked.includes(selected)}
            onGoBack={goBack}
            onAddToCart={() => addToCart(selected)}
            onToggleLike={() => toggleLike(selected)}
            form={form}
            onFormChange={setFormField}
            sent={sent}
            onSubmit={submitMessage}
          />
        )}
      </div>

      <CartDrawer
        open={cartOpen}
        onClose={toggleCart}
        cartBooks={cartBooks}
        onRemove={removeFromCart}
        shipping={shipping}
        onSetShipping={setShipping}
        freeShip={freeShip}
        total={total}
        checkedOut={checkedOut}
        onCheckout={checkout}
        onBackToCart={backToCart}
        order={order}
        onOrderChange={setOrderField}
        orderSent={orderSent}
        onSubmitOrder={submitOrder}
      />
    </div>
  );
}
