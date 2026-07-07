// Product catalogue

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

//Global keyframe animations (injected once at root)
export const GLO_STYLES = `
  @keyframes fadeIn   { from { opacity:0 }                        to { opacity:1 } }
  @keyframes slideUp  { from { transform:translateY(24px);opacity:0 } to { transform:translateY(0);opacity:1 } }
  @keyframes slideLeft{ from { transform:translateX(100%) }       to { transform:translateX(0) } }
  @keyframes toastIn  { from { transform:translate(-50%,16px);opacity:0 } to { transform:translate(-50%,0);opacity:1 } }
  .font-serif { font-family: 'Playfair Display', Georgia, serif; }
  input[type=range] { -webkit-appearance:none; height:2px; background:#d6d3d1; border-radius:1px; outline:none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#1c1917; cursor:pointer; }
`;
