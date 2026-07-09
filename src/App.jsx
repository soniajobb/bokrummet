import { useEffect, useState } from "react";
import { colors, fonts } from "./theme";
import { priceToNumber, computeShipping, buildMailto, SELLER_EMAIL, SWISH_NUMBER_DISPLAY } from "./lib/business";
import { supabase } from "./lib/supabaseClient";
import AuthScreen from "./components/AuthScreen";
import TopBar from "./components/TopBar";
import ListView from "./components/ListView";
import DetailView from "./components/DetailView";
import SavedView from "./components/SavedView";
import CartDrawer from "./components/CartDrawer";

function fromRow(row) {
  return {
    slotB: row.slot_b,
    title: row.title,
    author: row.author,
    tag: row.tag,
    price: row.price,
    cover: row.cover,
    desc: row.description,
    condition: row.condition,
    sold: row.sold,
    custom: row.custom,
  };
}

const EMPTY_DRAFT = { title: "", author: "", tag: "Barnbok", price: "", desc: "", condition: "Bra skick", cover: "" };
const EMPTY_EDIT_DRAFT = { title: "", author: "", tag: "", price: "", desc: "", condition: "" };

function normalizePrice(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return /kr/i.test(trimmed) ? trimmed : trimmed + " kr";
}

export default function App() {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      return;
    }
    supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setProfile(data);
      });
  }, [session?.user?.id]);

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

  const [cart, setCartState] = useState([]);
  const [liked, setLikedState] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (profile) {
      setCartState(profile.cart || []);
      setLikedState(profile.liked || []);
    } else {
      setCartState([]);
      setLikedState([]);
    }
  }, [profile?.id]);

  const setCart = (updater) => {
    setCartState((c) => {
      const next = typeof updater === "function" ? updater(c) : updater;
      if (session?.user) supabase.from("profiles").update({ cart: next }).eq("id", session.user.id);
      return next;
    });
  };
  const setLiked = (updater) => {
    setLikedState((l) => {
      const next = typeof updater === "function" ? updater(l) : updater;
      if (session?.user) supabase.from("profiles").update({ liked: next }).eq("id", session.user.id);
      return next;
    });
  };

  const fetchBooks = async () => {
    const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: true });
    if (!error && data) setBooks(data.map(fromRow));
  };

  useEffect(() => {
    fetchBooks();
    const channel = supabase
      .channel("books-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "books" }, fetchBooks)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const allBooks = books.map((b, i) => ({ ...b, idx: i }));

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
    if (books[i]?.sold) return;
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
  const toggleSold = async (i) => {
    const book = books[i];
    if (!book) return;
    await supabase.from("books").update({ sold: !book.sold }).eq("slot_b", book.slotB);
    fetchBooks();
  };
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

  const addBook = async (e) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.price.trim()) return;
    const book = {
      slot_b: "custom-" + Date.now(),
      title: draft.title.trim(),
      author: draft.author.trim() || "Okänd",
      tag: draft.tag.trim() || "Barnbok",
      price: normalizePrice(draft.price),
      description: draft.desc.trim(),
      condition: draft.condition.trim() || "Bra skick",
      cover: draft.cover || "",
      custom: true,
    };
    setDraftState(EMPTY_DRAFT);
    setShowAdd(false);
    await supabase.from("books").insert(book);
    fetchBooks();
  };
  const removeBook = async (slotB) => {
    await supabase.from("books").delete().eq("slot_b", slotB);
    fetchBooks();
  };

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
  const saveEdit = async () => {
    if (!editingSlot) return;
    const slotB = editingSlot;
    setEditingSlot(null);
    await supabase
      .from("books")
      .update({
        title: editDraft.title.trim(),
        author: editDraft.author.trim(),
        tag: editDraft.tag.trim(),
        price: normalizePrice(editDraft.price),
        description: editDraft.desc.trim(),
        condition: editDraft.condition.trim() || "Bra skick",
      })
      .eq("slot_b", slotB);
    fetchBooks();
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

  const handleLogout = async () => {
    setView("list");
    await supabase.auth.signOut();
  };

  if (session === undefined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.paper,
          fontFamily: fonts.body,
          color: colors.textSoft,
        }}
      >
        Laddar…
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onAuthed={() => {}} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: colors.paper, fontFamily: fonts.body, color: colors.textDark }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "clamp(20px, 5vw, 36px) clamp(16px, 5vw, 40px) 72px" }}>
        <TopBar
          isSeller={!!profile?.is_seller}
          sellerMode={sellerMode}
          onToggleSeller={toggleSellerMode}
          likedCount={liked.length}
          onOpenSaved={openSaved}
          cartCount={cart.length}
          onOpenCart={toggleCart}
          username={profile?.username}
          onLogout={handleLogout}
        />

        {view === "list" && (
          <ListView
            allBooks={allBooks}
            page={page}
            onGoPage={goPage}
            liked={liked}
            sellerMode={sellerMode && !!profile?.is_seller}
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
