import { useState, useEffect, useCallback, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    id: 1,
    name: "Linen Slouch Tote",
    price: 89,
    originalPrice: 120,
    category: "Bags",
    rating: 4.8,
    reviews: 124,
    badge: "Sale",
    colors: ["#e7e5e4", "#1c1917", "#78716c"],
    img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
    description:
      "Handcrafted from premium Belgian linen. The relaxed silhouette drapes beautifully with everyday wear. Interior zip pocket and magnetic closure.",
    sizes: ["S", "M", "L"],
    inStock: true,
  },
  {
    id: 2,
    name: "Merino Cocoon Coat",
    price: 345,
    originalPrice: null,
    category: "Outerwear",
    rating: 4.9,
    reviews: 89,
    badge: "New",
    colors: ["#f5f5f4", "#292524", "#a8a29e"],
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
    description:
      "Sumptuous 100% Merino wool in a generous oversized cut. Fully lined with Japanese silk. A forever piece.",
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
  },
  {
    id: 3,
    name: "Ceramic Bud Vase Set",
    price: 62,
    originalPrice: null,
    category: "Home",
    rating: 4.7,
    reviews: 203,
    badge: null,
    colors: ["#fafaf9", "#d6d3d1", "#78716c"],
    img: "https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=600&q=80",
    description:
      "Trio of hand-thrown vases in matte reactive glaze. Each piece is unique with subtle variations in form and finish.",
    sizes: ["One Size"],
    inStock: true,
  },
  {
    id: 4,
    name: "Cashmere Ribbed Scarf",
    price: 128,
    originalPrice: 160,
    category: "Accessories",
    rating: 4.6,
    reviews: 67,
    badge: "Sale",
    colors: ["#fef3c7", "#e7e5e4", "#44403c"],
    img: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&q=80",
    description:
      "Pure Grade-A cashmere in a classic 2x2 rib. Finished with hand-knotted fringe. Incredibly soft and warm.",
    sizes: ["One Size"],
    inStock: true,
  },
  {
    id: 5,
    name: "Linen Bed Cover",
    price: 195,
    originalPrice: null,
    category: "Home",
    rating: 4.9,
    reviews: 341,
    badge: "Bestseller",
    colors: ["#fafaf9", "#d6d3d1", "#1c1917"],
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    description:
      "Stonewashed French linen with a lived-in softness from day one. Gets better with every wash. OEKO-TEX certified.",
    sizes: ["Queen", "King", "Cal King"],
    inStock: true,
  },
  {
    id: 6,
    name: "Suede Derby Shoes",
    price: 275,
    originalPrice: null,
    category: "Footwear",
    rating: 4.5,
    reviews: 52,
    badge: "New",
    colors: ["#78716c", "#1c1917", "#d6d3d1"],
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    description:
      "Vegetable-tanned suede on a Blake-stitched leather sole. Handmade in Portugal. Develops a gorgeous patina over time.",
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    inStock: false,
  },
  {
    id: 7,
    name: "Glass Carafe & Cups",
    price: 74,
    originalPrice: 90,
    category: "Home",
    rating: 4.8,
    reviews: 188,
    badge: "Sale",
    colors: ["#fafaf9"],
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    description:
      "Mouth-blown borosilicate glass in a clean cylindrical form. The set includes one 1L carafe and four 200ml cups.",
    sizes: ["One Size"],
    inStock: true,
  },
  {
    id: 8,
    name: "Structured Canvas Jacket",
    price: 220,
    originalPrice: null,
    category: "Outerwear",
    rating: 4.7,
    reviews: 95,
    badge: null,
    colors: ["#44403c", "#e7e5e4", "#fef3c7"],
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    description:
      "Heavyweight waxed canvas with a tailored fit. Brass YKK zippers throughout. Built to last decades, not seasons.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
  },
];

const CATEGORIES = [
  "All",
  "Bags",
  "Outerwear",
  "Accessories",
  "Home",
  "Footwear",
];
const SORT_OPTIONS = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Best Rated",
  "Newest",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useLockBodyScroll(active) {
  useEffect(() => {
    if (active) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconSearch = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconHeart = ({ filled }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "#f43f5e" : "none"}
    stroke={filled ? "#f43f5e" : "currentColor"}
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IconBag = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const IconClose = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconMinus = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconPlus = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconTrash = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const IconMenu = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconUser = ({ filled }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "#1c1917" : "none"}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconEye = ({ show }) =>
  show ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
const IconGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);
const IconCheck = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Star Rating ──────────────────────────────────────────────────────────────

function Stars({ rating, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "#fbbf24" : "none"}
          stroke={i <= Math.round(rating) ? "#fbbf24" : "#d6d3d1"}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ label }) {
  if (!label) return null;
  const cls =
    {
      New: "bg-stone-900 text-stone-50",
      Sale: "bg-rose-500 text-white",
      Bestseller: "bg-amber-400 text-stone-900",
    }[label] || "bg-stone-200 text-stone-700";
  return (
    <span
      className={`inline-block text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-sm ${cls}`}
    >
      {label}
    </span>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-stone-900 text-stone-50 px-5 py-3 rounded-full text-sm flex items-center gap-2 shadow-xl"
      style={{ animation: "toastIn 0.3s ease" }}
    >
      <IconCheck />
      {message}
    </div>
  );
}

// ─── Quick View Modal ─────────────────────────────────────────────────────────

function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onWishlist,
  wishlist,
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const isWishlisted = wishlist.includes(product.id);
  useLockBodyScroll(true);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        background: "rgba(28,25,23,0.55)",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
        style={{ animation: "slideUp 0.25s ease" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
        >
          <IconClose />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="p-6">
            <div className="aspect-square rounded-xl overflow-hidden bg-stone-100">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-stone-400 uppercase tracking-widest">
                {product.category}
              </span>
              <Badge label={product.badge} />
            </div>

            <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-2">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mb-3">
              <Stars rating={product.rating} size={13} />
              <span className="text-xs text-stone-400">
                {product.rating} · {product.reviews} reviews
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-medium text-stone-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-sm text-stone-400 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="text-xs text-rose-500 font-medium">
                    {discount}% off
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-stone-500 leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Colors */}
            <div className="mb-4">
              <p className="text-xs font-medium text-stone-700 uppercase tracking-wider mb-2">
                Color
              </p>
              <div className="flex gap-2">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-stone-200 hover:border-stone-500 transition-colors"
                    style={{ background: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            {product.sizes.length > 1 && (
              <div className="mb-5">
                <p className="text-xs font-medium text-stone-700 uppercase tracking-wider mb-2">
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 text-sm rounded border transition-all ${
                        selectedSize === s
                          ? "border-stone-900 bg-stone-900 text-white"
                          : "border-stone-200 text-stone-600 hover:border-stone-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="flex items-center gap-3 mb-5">
              <p className="text-xs font-medium text-stone-700 uppercase tracking-wider">
                Qty
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
                >
                  <IconMinus />
                </button>
                <span className="w-8 text-center text-sm font-medium">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
                >
                  <IconPlus />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => {
                  if (product.inStock) {
                    onAddToCart(product, selectedSize, qty);
                    onClose();
                  }
                }}
                disabled={!product.inStock}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  product.inStock
                    ? "bg-stone-900 text-white hover:bg-stone-700 hover:-translate-y-px"
                    : "bg-stone-100 text-stone-400 cursor-not-allowed"
                }`}
              >
                {product.inStock ? "Add to Bag" : "Out of Stock"}
              </button>
              <button
                onClick={() => onWishlist(product.id)}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all hover:scale-110 ${
                  isWishlisted
                    ? "border-rose-300 bg-rose-50"
                    : "border-stone-200 hover:border-rose-300 hover:bg-rose-50"
                }`}
              >
                <IconHeart filled={isWishlisted} />
              </button>
            </div>

            {!product.inStock && (
              <p className="text-xs text-rose-400 mt-2 text-center">
                Email me when back in stock →
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({ cart, onClose, onRemove, onUpdateQty }) {
  useLockBodyScroll(true);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 200 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <div
      className="fixed inset-0 z-[100] flex"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex-1"
        style={{
          background: "rgba(28,25,23,0.4)",
          animation: "fadeIn 0.2s ease",
        }}
        onClick={onClose}
      />
      <div
        className="w-full max-w-sm bg-white h-full flex flex-col shadow-2xl"
        style={{ animation: "slideLeft 0.3s ease" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900">
              Your Bag
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <IconClose />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
                <IconBag />
              </div>
              <p className="text-stone-400 text-sm">Your bag is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="flex gap-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {item.selectedSize && item.selectedSize !== "One Size"
                      ? `Size: ${item.selectedSize}`
                      : item.category}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateQty(item.cartId, item.qty - 1)}
                        className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
                      >
                        <IconMinus />
                      </button>
                      <span className="text-xs font-medium w-5 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.cartId, item.qty + 1)}
                        className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
                      >
                        <IconPlus />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-stone-900">
                        ${(item.price * item.qty).toFixed(0)}
                      </span>
                      <button
                        onClick={() => onRemove(item.cartId)}
                        className="text-stone-300 hover:text-rose-400 transition-colors"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-stone-100">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Subtotal</span>
                <span className="text-stone-900">${subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Shipping</span>
                <span
                  className={
                    shipping === 0
                      ? "text-green-600 font-medium"
                      : "text-stone-900"
                  }
                >
                  {shipping === 0 ? "Free" : `$${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-stone-400">
                  ${200 - subtotal} away from free shipping
                </p>
              )}
              <div className="flex justify-between text-base font-medium border-t border-stone-100 pt-2">
                <span>Total</span>
                <span>${total.toFixed(0)}</span>
              </div>
            </div>
            <button className="w-full py-3.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-700 transition-all hover:-translate-y-px">
              Checkout — ${total.toFixed(0)}
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-stone-400 hover:text-stone-600 transition-colors mt-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onQuickView, onWishlist, wishlist }) {
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-stone-200 hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-stone-50 cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-stone-900 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge label={product.badge} />
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-stone-900 text-white text-xs px-3 py-1 rounded-full font-medium">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick view hover button */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4/5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2.5 bg-white text-stone-900 rounded-xl text-xs font-medium shadow-md hover:bg-stone-900 hover:text-white transition-all"
          >
            Quick View
          </button>
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWishlist(product.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <IconHeart filled={isWishlisted} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-stone-400 mb-0.5 uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="font-serif text-sm font-semibold text-stone-900 mb-1 leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <Stars rating={product.rating} size={10} />
          <span className="text-xs text-stone-400 ml-0.5">
            ({product.reviews})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-medium text-stone-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {product.colors.slice(0, 3).map((c, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full border border-stone-200"
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────

function InputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  children,
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-stone-700 uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border text-sm text-stone-900 placeholder-stone-400 outline-none transition-all bg-stone-50 focus:bg-white ${
            error
              ? "border-rose-300 focus:border-rose-400"
              : "border-stone-200 focus:border-stone-400"
          }`}
        />
        {children}
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}

function AuthModal({ onClose, onLogin, initialTab = "login" }) {
  const [tab, setTab] = useState(initialTab); // "login" | "register"
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginErrors, setLoginErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPw, setRegPw] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regErrors, setRegErrors] = useState({});
  const [agree, setAgree] = useState(false);

  useLockBodyScroll(true);

  // Password strength
  const pwStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0–4
  };
  const strength = pwStrength(regPw);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = [
    "",
    "bg-rose-400",
    "bg-amber-400",
    "bg-amber-300",
    "bg-green-500",
  ][strength];

  const validateLogin = () => {
    const e = {};
    if (!loginEmail) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) e.email = "Enter a valid email";
    if (!loginPw) e.pw = "Password is required";
    setLoginErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegister = () => {
    const e = {};
    if (!regName.trim()) e.name = "Full name is required";
    if (!regEmail) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(regEmail)) e.email = "Enter a valid email";
    if (!regPw) e.pw = "Password is required";
    else if (regPw.length < 8) e.pw = "At least 8 characters";
    if (regPw !== regConfirm) e.confirm = "Passwords don't match";
    if (!agree) e.agree = "Please accept the terms to continue";
    setRegErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = () => {
    if (!validateLogin()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLogin({ email: loginEmail, name: loginEmail.split("@")[0] });
        onClose();
      }, 1200);
    }, 1400);
  };

  const handleRegister = () => {
    if (!validateRegister()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLogin({ email: regEmail, name: regName });
        onClose();
      }, 1200);
    }, 1400);
  };

  const switchTab = (t) => {
    setTab(t);
    setLoginErrors({});
    setRegErrors({});
    setSuccess(false);
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      style={{
        background: "rgba(28,25,23,0.6)",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative"
        style={{ animation: "slideUp 0.28s ease" }}
      >
        {/* Decorative top band */}
        <div className="h-1 w-full bg-gradient-to-r from-stone-300 via-stone-600 to-stone-900" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors z-10"
        >
          <IconClose />
        </button>

        <div className="px-8 pt-8 pb-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <span className="font-serif text-2xl font-semibold text-stone-900 tracking-tight">
              MAISON
            </span>
            <p className="text-xs text-stone-400 mt-1 tracking-widest uppercase">
              {tab === "login" ? "Welcome back" : "Create your account"}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-stone-100 rounded-xl p-1 mb-7">
            {["login", "register"].map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg capitalize transition-all duration-200 ${
                  tab === t
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Success state */}
          {success && (
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-serif text-lg font-semibold text-stone-900">
                {tab === "login" ? "Welcome back!" : "Account created!"}
              </p>
              <p className="text-sm text-stone-400">Signing you in…</p>
            </div>
          )}

          {/* LOGIN FORM */}
          {!success && tab === "login" && (
            <div className="space-y-4">
              <InputField
                label="Email"
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="you@example.com"
                error={loginErrors.email}
              />
              <InputField
                label="Password"
                id="login-pw"
                type={showPw ? "text" : "password"}
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                placeholder="Your password"
                error={loginErrors.pw}
              >
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <IconEye show={showPw} />
                </button>
              </InputField>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      rememberMe
                        ? "bg-stone-900 border-stone-900"
                        : "border-stone-300"
                    }`}
                  >
                    {rememberMe && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-stone-500">Remember me</span>
                </label>
                <button className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2 transition-colors">
                  Forgot password?
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className={`w-full py-3.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-stone-400 cursor-wait"
                    : "bg-stone-900 hover:bg-stone-700 hover:-translate-y-px text-white"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="relative flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-xs text-stone-400">or continue with</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              <button className="w-full py-3 rounded-xl border border-stone-200 text-sm text-stone-700 font-medium hover:bg-stone-50 hover:border-stone-300 transition-all flex items-center justify-center gap-2.5">
                <IconGoogle />
                Continue with Google
              </button>

              <p className="text-center text-xs text-stone-400 pt-1">
                Don't have an account?{" "}
                <button
                  onClick={() => switchTab("register")}
                  className="text-stone-700 font-medium hover:text-stone-900 underline underline-offset-2"
                >
                  Create one
                </button>
              </p>
            </div>
          )}

          {/* REGISTER FORM */}
          {!success && tab === "register" && (
            <div className="space-y-4">
              <InputField
                label="Full Name"
                id="reg-name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Jane Smith"
                error={regErrors.name}
              />
              <InputField
                label="Email"
                id="reg-email"
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="you@example.com"
                error={regErrors.email}
              />
              <div className="space-y-1">
                <InputField
                  label="Password"
                  id="reg-pw"
                  type={showPw ? "text" : "password"}
                  value={regPw}
                  onChange={(e) => setRegPw(e.target.value)}
                  placeholder="Min. 8 characters"
                  error={regErrors.pw}
                >
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <IconEye show={showPw} />
                  </button>
                </InputField>
                {/* Strength bar */}
                {regPw.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength ? strengthColor : "bg-stone-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-xs font-medium ${["", "text-rose-500", "text-amber-500", "text-amber-400", "text-green-600"][strength]}`}
                    >
                      {strengthLabel}
                    </span>
                  </div>
                )}
              </div>
              <InputField
                label="Confirm Password"
                id="reg-confirm"
                type={showConfirmPw ? "text" : "password"}
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                placeholder="Repeat your password"
                error={regErrors.confirm}
              >
                <button
                  type="button"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <IconEye show={showConfirmPw} />
                </button>
              </InputField>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <div
                    onClick={() => setAgree(!agree)}
                    className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                      agree
                        ? "bg-stone-900 border-stone-900"
                        : "border-stone-300"
                    }`}
                  >
                    {agree && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-stone-500 leading-relaxed">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-stone-700 font-medium underline underline-offset-2 hover:text-stone-900"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-stone-700 font-medium underline underline-offset-2 hover:text-stone-900"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {regErrors.agree && (
                  <p className="text-xs text-rose-500 mt-1 ml-6">
                    {regErrors.agree}
                  </p>
                )}
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className={`w-full py-3.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-stone-400 cursor-wait text-white"
                    : "bg-stone-900 hover:bg-stone-700 hover:-translate-y-px text-white"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Creating account…
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="relative flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-xs text-stone-400">or</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              <button className="w-full py-3 rounded-xl border border-stone-200 text-sm text-stone-700 font-medium hover:bg-stone-50 hover:border-stone-300 transition-all flex items-center justify-center gap-2.5">
                <IconGoogle />
                Sign up with Google
              </button>

              <p className="text-center text-xs text-stone-400 pt-1">
                Already have an account?{" "}
                <button
                  onClick={() => switchTab("login")}
                  className="text-stone-700 font-medium hover:text-stone-900 underline underline-offset-2"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(500);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("login");
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openAuth = (tab = "login") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const showToast = useCallback((msg) => {
    setToast(null);
    setTimeout(() => setToast(msg), 10);
  }, []);

  const handleLoginSuccess = useCallback(
    (userData) => {
      setUser(userData);
      showToast(`Welcome, ${userData.name}!`);
    },
    [showToast],
  );

  const handleLogout = useCallback(() => {
    setUser(null);
    setUserMenuOpen(false);
    showToast("Signed out successfully");
  }, [showToast]);

  const addToCart = useCallback(
    (product, selectedSize, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find(
          (i) => i.id === product.id && i.selectedSize === selectedSize,
        );
        if (existing)
          return prev.map((i) =>
            i.cartId === existing.cartId ? { ...i, qty: i.qty + qty } : i,
          );
        return [...prev, { ...product, cartId: Date.now(), selectedSize, qty }];
      });
      showToast(`${product.name} added to bag`);
    },
    [showToast],
  );

  const removeFromCart = (cartId) =>
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));

  const updateQty = (cartId, qty) => {
    if (qty < 1) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, qty } : i)),
    );
  };

  const toggleWishlist = useCallback(
    (id) => {
      setWishlist((prev) => {
        const has = prev.includes(id);
        showToast(has ? "Removed from wishlist" : "Added to wishlist");
        return has ? prev.filter((x) => x !== id) : [...prev, id];
      });
    },
    [showToast],
  );

  const filteredProducts = PRODUCTS.filter(
    (p) => activeCategory === "All" || p.category === activeCategory,
  )
    .filter((p) => p.price <= priceRange)
    .filter(
      (p) =>
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Best Rated") return b.rating - a.rating;
      if (sortBy === "Newest") return b.id - a.id;
      return 0;
    });

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { transform:translateY(24px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        @keyframes slideLeft { from { transform:translateX(100%) } to { transform:translateX(0) } }
        @keyframes toastIn { from { transform:translate(-50%,16px); opacity:0 } to { transform:translate(-50%,0); opacity:1 } }
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
        input[type=range] { -webkit-appearance:none; height:2px; background:#d6d3d1; border-radius:1px; outline:none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#1c1917; cursor:pointer; }
      `}</style>

      <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
        {/* ── Navbar ── */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="relative flex items-center justify-between h-16">
              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 text-stone-500"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <IconMenu />
              </button>

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-8">
                {["Collections", "New In", "Sale", "About"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-sm text-stone-600 hover:text-stone-900 transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-stone-900 hover:after:w-full after:transition-all"
                  >
                    {link}
                  </a>
                ))}
              </div>

              {/* Logo */}
              <span className="font-serif text-xl font-semibold tracking-tight absolute left-1/2 -translate-x-1/2">
                MAISON
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-500"
                >
                  <IconSearch />
                </button>
                <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors relative text-stone-500">
                  <IconHeart filled={wishlist.length > 0} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                      {wishlist.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setCartOpen(true)}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors relative text-stone-500"
                >
                  <IconBag />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-stone-900 text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* User / Auth */}
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1.5 ml-1 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-semibold uppercase">
                        {user.name[0]}
                      </div>
                      <span className="text-xs text-stone-700 font-medium hidden sm:block max-w-[80px] truncate">
                        {user.name}
                      </span>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#78716c"
                        strokeWidth="2.5"
                        className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {userMenuOpen && (
                      <div
                        className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-50"
                        style={{ animation: "slideUp 0.15s ease" }}
                      >
                        <div className="px-3 py-2 border-b border-stone-100">
                          <p className="text-xs font-medium text-stone-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-stone-400 truncate">
                            {user.email}
                          </p>
                        </div>
                        {["My Orders", "Wishlist", "Profile", "Settings"].map(
                          (item) => (
                            <button
                              key={item}
                              className="w-full text-left px-3 py-2 text-xs text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                            >
                              {item}
                            </button>
                          ),
                        )}
                        <div className="border-t border-stone-100 mt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-xs text-rose-500 hover:bg-rose-50 transition-colors"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => openAuth("login")}
                    className="ml-1 px-3 py-1.5 text-xs font-medium text-stone-700 border border-stone-200 rounded-lg hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all hidden sm:flex items-center gap-1.5"
                  >
                    <IconUser filled={false} />
                    Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Search bar */}
            {searchOpen && (
              <div className="pb-4">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  autoFocus
                  className="w-full px-4 py-2.5 bg-stone-100 rounded-xl text-sm placeholder-stone-400 border border-transparent focus:border-stone-300 focus:bg-white outline-none transition-all"
                />
              </div>
            )}

            {/* Mobile menu */}
            {menuOpen && (
              <div className="md:hidden pb-4 flex flex-col gap-3 border-t border-stone-100 pt-4">
                {["Collections", "New In", "Sale", "About"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-sm text-stone-600 hover:text-stone-900"
                  >
                    {link}
                  </a>
                ))}
                <div className="border-t border-stone-100 pt-3 flex gap-2">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="text-sm text-rose-500 hover:text-rose-700"
                    >
                      Sign out
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          openAuth("login");
                          setMenuOpen(false);
                        }}
                        className="flex-1 py-2 text-sm text-center border border-stone-200 rounded-lg text-stone-700 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          openAuth("register");
                          setMenuOpen(false);
                        }}
                        className="flex-1 py-2 text-sm text-center bg-stone-900 text-white rounded-lg hover:bg-stone-700 transition-all"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

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

        {/* ── Shipping Banner ── */}
        <div className="bg-stone-800 text-stone-300 text-center py-2.5 text-xs tracking-widest uppercase">
          Free shipping on orders over $200 · Free returns within 60 days
        </div>

        {/* ── Main Content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeCategory === cat
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {cat}
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

          {/* Result count */}
          <p className="text-xs text-stone-400 mb-5">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>

          {/* Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                <IconSearch />
              </div>
              <p className="text-stone-400">No products match your filters</p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setPriceRange(500);
                  setSearchQuery("");
                }}
                className="text-sm text-stone-600 underline mt-2"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                  onWishlist={toggleWishlist}
                  wishlist={wishlist}
                />
              ))}
            </div>
          )}

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
        <footer className="border-t border-stone-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              {[
                {
                  title: "Shop",
                  links: [
                    "New Arrivals",
                    "Bags",
                    "Outerwear",
                    "Home",
                    "Accessories",
                    "Footwear",
                  ],
                },
                {
                  title: "Help",
                  links: [
                    "Sizing Guide",
                    "Shipping",
                    "Returns",
                    "FAQ",
                    "Care Guide",
                  ],
                },
                {
                  title: "About",
                  links: [
                    "Our Story",
                    "Sustainability",
                    "Makers",
                    "Press",
                    "Careers",
                  ],
                },
                {
                  title: "Connect",
                  links: ["Instagram", "Pinterest", "Newsletters", "Stockists"],
                },
              ].map((col) => (
                <div key={col.title}>
                  <p className="text-xs font-medium text-stone-900 uppercase tracking-wider mb-3">
                    {col.title}
                  </p>
                  <ul className="space-y-2">
                    {col.links.map((l) => (
                      <li key={l}>
                        <a
                          href="#"
                          className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
                        >
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-stone-100">
              <span className="font-serif text-lg font-semibold text-stone-900">
                MAISON
              </span>
              <p className="text-xs text-stone-400">
                © 2026 Maison. Thoughtfully made.
              </p>
              <div className="flex gap-4">
                {["Privacy", "Terms", "Cookies"].map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="text-xs text-stone-400 hover:text-stone-700"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>

        {/* ── Modals ── */}
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={addToCart}
            onWishlist={toggleWishlist}
            wishlist={wishlist}
          />
        )}

        {cartOpen && (
          <CartDrawer
            cart={cart}
            onClose={() => setCartOpen(false)}
            onRemove={removeFromCart}
            onUpdateQty={updateQty}
          />
        )}

        {authOpen && (
          <AuthModal
            initialTab={authTab}
            onClose={() => setAuthOpen(false)}
            onLogin={(userData) => {
              handleLoginSuccess(userData);
              setAuthOpen(false);
            }}
          />
        )}

        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </div>
    </>
  );
}
