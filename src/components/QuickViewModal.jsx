import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLockBodyScroll } from "../utils/useLockBodyScroll";
import { IconClose, IconMinus, IconPlus, IconHeart } from "../icons";
import { Stars } from "./Stars";
import { Badge } from "./Badge";
import { addToCart } from "../features/cart/cartSlice";

// ─── QuickViewModal ───────────────────────────────────────────────────────────

export function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onWishlist,
  wishlist,
}) {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? null);
  const [qty, setQty] = useState(1);

  const isWishlisted = wishlist.includes(product.id);

  useLockBodyScroll(true);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  // that matches what the thunk destructures and the backend expects
  const handleAddToCart = () => {
    if (!product.inStock) return;
    dispatch(
      addToCart({
        product_id: product.id,
        quantity: qty,
      })
    );

    onClose();
  };

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
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
        >
          <IconClose />
        </button>

        <div className="grid md:grid-cols-2">
          {/* ── Image ── */}
          <div className="p-6">
            <div className="aspect-square rounded-xl overflow-hidden bg-stone-100">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* ── Details ── */}
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

            {/* Colour swatches */}
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

            {/* Quantity */}
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

            {/* CTA row */}
            <div className="flex gap-2 mt-auto">
              <button
                onClick={handleAddToCart}
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
