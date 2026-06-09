// ─── Product catalogue ────────────────────────────────────────────────────────

export const PRODUCTS = [
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

export const CATEGORIES = [
  // Parent categories
  { id: 1, name: "Electronics", parent_id: null },
  { id: 2, name: "Fashion", parent_id: null },

  // Electronics children
  { id: 3, name: "Laptops", parent_id: 1 },

  // Fashion children
  { id: 4, name: "Men's Clothing", parent_id: 2 },
  { id: 5, name: "Women's Clothing", parent_id: 2 },
  { id: 6, name: "Wrist Watches", parent_id: 2 },
  { id: 7, name: "Footwear", parent_id: 2 },

  // Optional: "All" as a virtual category
  { id: 0, name: "All", parent_id: null },
];

export const SORT_OPTIONS = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Best Rated",
  "Newest",
];

// ─── Global keyframe animations (injected once at root) ───────────────────────
export const GLO_STYLES = `
  @keyframes fadeIn   { from { opacity:0 }                        to { opacity:1 } }
  @keyframes slideUp  { from { transform:translateY(24px);opacity:0 } to { transform:translateY(0);opacity:1 } }
  @keyframes slideLeft{ from { transform:translateX(100%) }       to { transform:translateX(0) } }
  @keyframes toastIn  { from { transform:translate(-50%,16px);opacity:0 } to { transform:translate(-50%,0);opacity:1 } }
  .font-serif { font-family: 'Playfair Display', Georgia, serif; }
  input[type=range] { -webkit-appearance:none; height:2px; background:#d6d3d1; border-radius:1px; outline:none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#1c1917; cursor:pointer; }
`;
