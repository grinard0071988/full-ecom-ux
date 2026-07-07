import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import { ProductCard } from "../features/products/productCard";

// Skeleton card

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-stone-100 animate-pulse">
      <div className="aspect-[3/4] bg-stone-200" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-stone-200 rounded w-1/3" />
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        <div className="h-3 bg-stone-200 rounded w-1/2" />
        <div className="h-4 bg-stone-200 rounded w-1/4" />
      </div>
    </div>
  );
}

// Selectors

const selectItems = (state) => state.products.items;
const selectListLoading = (state) => state.products.listLoading;
const selectListError = (state) => state.products.listError;

// ProductList

export default function ProductList({
  onQuickView,
  activeCategory = 0,
  searchQuery = "",
  priceRange = 500,
  sortBy = "Featured",
  onClearFilters,
  wishlistIds,
  toggleWishlist,
  user,
}) {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const listLoading = useSelector(selectListLoading);
  const listError = useSelector(selectListError);

  // Fetch products once on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter + sort (all local, no extra network calls)
  const filteredItems = items
    .filter((p) => activeCategory === 0 || p.category_id === activeCategory)
    .filter((p) => p.price == null || p.price <= priceRange)
    .filter((p) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name?.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low to High")
        return (a.price ?? 0) - (b.price ?? 0);
      if (sortBy === "Price: High to Low")
        return (b.price ?? 0) - (a.price ?? 0);
      if (sortBy === "Best Rated") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sortBy === "Newest") return b.id - a.id;
      return 0; // "Featured" — preserve backend order
    });

  // Loading
  if (listLoading && items.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Error
  if (listError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-stone-500 text-sm text-center max-w-xs">
          {typeof listError === "string"
            ? listError
            : "Failed to load products."}
        </p>
        <button
          onClick={() => dispatch(fetchProducts())}
          className="px-5 py-2 bg-stone-900 text-white text-sm rounded-xl hover:bg-stone-700 transition-all"
        >
          Try again
        </button>
      </div>
    );
  }

  // Empty
  if (filteredItems.length === 0) {
    // find the category name for a friendlier message
    const activeCategoryName =
      activeCategory === 0
        ? null
        : filteredItems[0]?.category_name ?? `#${activeCategory}`;

    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a8a29e"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <p className="text-stone-400 text-sm text-center">
          {items.length === 0
            ? "No products available yet."
            : activeCategoryName
            ? `No products found in "${activeCategoryName}".`
            : "No products match your filters."}
        </p>
        {/* Only show clear button when a filter is actually active */}
        {(activeCategory !== 0 ||
          searchQuery ||
          priceRange < 500 ||
          sortBy !== "Featured") && (
          <button
            onClick={onClearFilters}
            className="text-xs text-stone-500 underline underline-offset-2 hover:text-stone-800 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  // Product List Grid
  return (
    <>
      <p className="text-xs text-stone-400 mb-5">
        {filteredItems.length} product{filteredItems.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredItems.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            wishlist={[...wishlistIds]}
            onQuickView={onQuickView}
            onWishlist={toggleWishlist}
            user={user}
          />
        ))}
      </div>
    </>
  );
}
