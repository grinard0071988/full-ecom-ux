import { useState, useMemo } from "react";
import { IconHeart } from "../../icons/index";
import { Stars } from "../../components/Stars";
import { Badge } from "../../components/Badge";

//Helpers

function formatPrice(value) {
  if (value == null) return null;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function deriveBadge(product) {
  const discount = product.original_price ?? product.compare_price;
  if (discount && discount > product.price) return "Sale";
  if (product.is_new) return "New";
  if (product.is_bestseller) return "Bestseller";
  if (product.badge) return product.badge; // pass-through if backend sends it directly
  return null;
}

// ProductCard

export function ProductCard({
  product,
  onQuickView,
  onWishlist,
  wishlist = [],
  user,
}) {
  const [imgError, setImgError] = useState(false);

  // Guard: if product is missing, render nothing rather than crashing
  if (!product) return null;

  const wishlistSet = useMemo(() => new Set(wishlist), [wishlist]);
  const isWishlisted = user && wishlistSet.has(product.id);

  const id = product.id;
  const img = product.img || product.image || product.image_url || null;
  const name = product.name || "Unnamed Product";
  // Backend may send category as a nested object, a name string, or an id
  const category =
    product.category_name || product.category?.name || product.category || "";

  // Stock — backend may send a boolean or a quantity number
  const inStock =
    product.in_stock ??
    product.is_in_stock ??
    (product.stock_quantity != null ? product.stock_quantity > 0 : true);

  const rating = Number(product.rating ?? product.average_rating ?? 0);
  const reviews = Number(
    product.reviews ?? product.review_count ?? product.reviews_count ?? 0
  );
  const price = product.price != null ? Number(product.price) : null;

  // covers original_price, compare_price, or compare_at_price
  const originalPrice =
    product.original_price != null
      ? Number(product.original_price)
      : product.compare_price != null
      ? Number(product.compare_price)
      : product.compare_at_price != null
      ? Number(product.compare_at_price)
      : null;

  // colors — null from backend won't trigger the [] default, so coerce explicitly
  const colors = Array.isArray(product.colors) ? product.colors : [];

  // derive badge from flags rather than expecting an exact "badge" field
  const badge = deriveBadge(product);

  const handleQuickView = () => {
    if (typeof onQuickView === "function") onQuickView(product);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (typeof onWishlist === "function") onWishlist(id);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-stone-200 hover:shadow-lg transition-all duration-300">
      {/* ── Image area ── */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`View details for ${name}`}
        className="relative aspect-[3/4] overflow-hidden bg-stone-50 cursor-pointer"
        onClick={handleQuickView}
        onKeyDown={(e) => e.key === "Enter" && handleQuickView()}
      >
        {/* Image with fallback on error */}
        {imgError || !img ? (
          <div className="w-full h-full flex items-center justify-center bg-stone-100">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d6d3d1"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        ) : (
          <img
            src={img}
            alt={name}
            loading="lazy"
            onError={() => setImgError(true)} // graceful fallback
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-stone-900 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3">
            <Badge label={badge} />
          </div>
        )}

        {/* Out-of-stock veil */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-stone-900 text-white text-xs px-3 py-1 rounded-full font-medium">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View CTA — only shown when in stock */}
        {inStock && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4/5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuickView();
              }}
              className="w-full py-2.5 bg-white text-stone-900 rounded-xl text-xs font-medium shadow-md hover:bg-stone-900 hover:text-white transition-all"
            >
              Quick View
            </button>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          aria-label={
            isWishlisted
              ? `Remove ${name} from wishlist`
              : `Add ${name} to wishlist`
          }
          aria-pressed={isWishlisted} // screen reader toggle state
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <IconHeart filled={isWishlisted} />
        </button>
      </div>

      {/* Info area */}
      <div className="p-4">
        {category && (
          <p className="text-xs text-stone-400 mb-0.5 uppercase tracking-wider">
            {category}
          </p>
        )}

        <h3 className="font-serif text-sm font-semibold text-stone-900 mb-1 leading-snug line-clamp-2">
          {name}
        </h3>

        {/* Rating row — only render if we have a rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Stars rating={rating} size={10} />
            <span className="text-xs text-stone-400 ml-0.5">
              ({reviews.toLocaleString()}) {/* formats 1000 as 1,000 */}
            </span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            {price != null && (
              <span className="text-base font-medium text-stone-900">
                {formatPrice(price)} {/* $10.50 not $10.5 */}
              </span>
            )}
            {originalPrice != null && originalPrice > price && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Colour swatches — key by color value, not index */}
          {colors.length > 0 && (
            <div className="flex gap-1">
              {colors.slice(0, 3).map((c) => (
                <div
                  key={c} //stable key
                  title={c}
                  className="w-3 h-3 rounded-full border border-stone-200"
                  style={{ background: c }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
