/////////////////////////////////////////////////////////////////////////
import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { updateCartItem, removeCartItem } from "../features/cart/cartSlice";

//UI primitives
import { Toast } from "../components/Toast";
import { CATEGORIES, SORT_OPTIONS, GLO_STYLES } from "../utils/data";

//Layout
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

//Product
import ProductList from "./ProductList";

//Modals
import { QuickViewModal } from "../components/QuickViewModal";
import { CartDrawer } from "../components/CartDrawer";
import { AuthModal } from "../components/AuthModal";

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cart = useSelector((state) => state.cart.items);

  //Filter / sort state — owned here, passed down to ProductList ──
  const [activeCategory, setActiveCategory] = useState(0); // 0 = "All" (matches category_id)
  const [sortBy, setSortBy] = useState("Featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(500);

  //  Commerce state ──
  //const [cart, setCart] = useState([]);

  //UI state ──
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [toast, setToast] = useState(null);

  // Derived
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  //Local wishlist (frontend only until backend is ready)
  // const [wishlistIds, setWishlistIds] = useState(new Set());
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // When user logs in and profile loads — merge with backend wishlist
  useEffect(() => {
    if (user) {
      const saved = user?.wishlist ?? user?.wishlist_items ?? [];
      if (saved.length > 0) {
        const ids = saved.map((item) =>
          typeof item === "object" ? item.product_id ?? item.id : item
        );
        // Merge backend wishlist with any locally added items
        setWishlistIds((prev) => new Set([...prev, ...ids]));
      }
    } else {
      // Logged out — clear everything
      setWishlistIds(new Set());
      localStorage.removeItem("wishlist");
    }
  }, [user]);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify([...wishlistIds]));
    } catch {
      // fail silently
    }
  }, [wishlistIds]);

  const toggleWishlist = useCallback((productId) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  }, []);

  //onUpdateQty handler
  const handleUpdateQty = useCallback(
    (cartId, qty) => {
      if (qty < 1) {
        dispatch(removeCartItem(cartId)); // remove cleanly
      } else {
        dispatch(updateCartItem({ item_id: cartId, quantity: qty }));
      }
    },
    [dispatch]
  );

  //Toast
  const showToast = useCallback((msg) => {
    setToast(null);
    setTimeout(() => setToast(msg), 10);
  }, []);

  //Auth handlers
  const openAuth = (tab = "login") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };
  const closeAuth = () => setAuthOpen(false);

  const handleLogout = useCallback(() => {
    dispatch(logoutUser()); //correct action name
    // setWishlistIds(new Set());
    // localStorage.removeItem("wishlist");
    showToast("Signed out successfully");
  }, [dispatch, showToast]);

  //Filter reset — consistent with initial state (0 = All) ──
  const clearFilters = useCallback(() => {
    setActiveCategory(0); //matches useState(0) initial value
    setPriceRange(500);
    setSearchQuery("");
    setSortBy("Featured");
  }, []);

  return (
    <>
      <style>{GLO_STYLES}</style>

      <div className="min-h-screen bg-stone-100 font-sans text-stone-900">
        {/* ── Navbar ── */}
        <Navbar
          user={user}
          wishlistCount={wishlistIds.size} // replace with wishlist count when backend ready
          cartCount={cartCount}
          onOpenCart={() => setCartOpen(true)}
          onOpenAuth={openAuth}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* ── Hero ── */}
        <div
          className="relative overflow-hidden bg-stone-900"
          style={{ minHeight: 320 }}
        >
          <div className="absolute inset-0 opacity-30">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
            <p className="text-xs text-stone-300 uppercase tracking-[0.3em] mb-4">
              Spring Collection 2026
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 leading-tight">
              Considered Design,
              <br />
              <em className="font-normal">Lasting Quality</em>
            </h1>
            <p className="text-stone-300 text-sm sm:text-base mb-8 max-w-md mx-auto">
              Thoughtfully sourced. Consciously made. Objects that earn their
              place in your life.
            </p>
            <button className="px-8 py-3.5 bg-white text-stone-900 rounded-full text-sm font-medium hover:bg-stone-100 transition-all hover:-translate-y-px">
              Shop New Arrivals
            </button>
          </div>
        </div>

        {/* ── Shipping banner ── */}
        <div className="bg-stone-800 text-stone-300 text-center py-2.5 text-xs tracking-widest uppercase">
          Free shipping on orders over $200 · Free returns within 60 days
        </div>

        {/* ── Catalogue ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Filter / sort row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
            {/* Category chips — frontend CATEGORIES data */}
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeCategory === cat.id
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Price range */}
              <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-3 py-1.5">
                <span className="text-xs text-stone-400 whitespace-nowrap">
                  Max $
                </span>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-xs font-medium text-stone-700 whitespace-nowrap">
                  {priceRange}
                </span>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs border border-stone-200 rounded-lg px-3 py-2 bg-white text-stone-600 outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ProductList owns fetch + wishlist; Home owns filters + sort + cart */}
          <ProductList
            onQuickView={setQuickViewProduct}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            priceRange={priceRange} // passed down so ProductList can filter
            sortBy={sortBy} // passed down so ProductList can sort
            onClearFilters={clearFilters}
            wishlistIds={wishlistIds}
            toggleWishlist={toggleWishlist}
          />

          {/* Newsletter */}
          <div className="mt-20 bg-stone-900 rounded-3xl px-6 sm:px-12 py-12 text-center">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-3">
              Join the Community
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-2">
              Good things, thoughtfully delivered.
            </h2>
            <p className="text-stone-400 text-sm mb-6">
              New arrivals, care guides, and the occasional behind-the-scenes.
            </p>
            <div className="flex max-w-sm mx-auto gap-2">
              <input
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl bg-stone-800 border border-stone-700 text-stone-100 text-sm placeholder-stone-500 outline-none focus:border-stone-400 transition-colors"
              />
              <button className="px-5 py-3 bg-white text-stone-900 rounded-xl text-sm font-medium hover:bg-stone-100 transition-all hover:-translate-y-px whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <Footer />

        {/* ── Modals ── */}
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            wishlist={[...wishlistIds]}
            onWishlist={toggleWishlist}
          />
        )}

        {cartOpen && (
          <CartDrawer
            cart={cart}
            onClose={() => setCartOpen(false)}
            // onRemove={removeFromCart}
            // onUpdateQty={updateQty}
            onRemove={(cartId) => dispatch(removeCartItem(cartId))}
            onUpdateQty={handleUpdateQty}
          />
        )}

        {authOpen && <AuthModal initialTab={authTab} onClose={closeAuth} />}

        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </div>
    </>
  );
}
