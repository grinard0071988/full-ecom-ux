import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/index";
import { imgEndPoint } from "../../api/productsApi";

// Update UPLOAD_PATH to match wherever your Express server serves static files.
// Common patterns:
//   http://localhost:8000/uploads/          ← multer default
//   http://localhost:8000/images/products/
//   http://localhost:8000/static/

const API_BASE = import.meta.env.VITE_API_URL || imgEndPoint;
const UPLOAD_PATH = `${API_BASE}/uploads/`;

function resolveImage(filename) {
  if (!filename) return null;

  // Already a full URL — leave it alone
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }

  // Absolute path e.g. "/uploads/file.jpg" — just prepend the host
  if (filename.startsWith("/")) {
    return `${API_BASE}${filename}`;
  }

  // Bare filename e.g. "1775319999810-617300331.jpeg" — prepend full upload path
  return `${UPLOAD_PATH}${filename}`;
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.get("/products");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load products"
      );
    }
  },
  {
    // Skip fetch if data already loaded — prevents redundant network calls
    condition: (_, { getState }) => {
      const { items, listLoading } = getState().products;
      if (listLoading || items.length > 0) return false;
    },
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, thunkAPI) => {
    try {
      const res = await axiosClient.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load product"
      );
    }
  }
);

// Slice

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    selectedProduct: null,
    listLoading: false,
    detailLoading: false,
    listError: null,
    detailError: null,
  },

  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
      state.detailError = null;
    },
    // Call this after a create / update / delete so the list re-fetches fresh
    invalidateProducts(state) {
      state.items = [];
      state.listError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      //Fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.listLoading = false;

        // Normalise every product's image field to a full URL here,
        //    once, so ProductCard (and any other component) just uses img.
        state.items = action.payload.map((p) => ({
          ...p,
          img: resolveImage(
            p.img ?? p.image ?? p.image_url ?? p.thumbnail ?? null
          ),
          //Add safe defaults for fields the backend doesn't send yet
          sizes: p.sizes ?? [], // QuickViewModal uses this
          colors: p.colors ?? [], // ProductCard + QuickViewModal use this
          inStock: p.in_stock ?? p.is_active ?? true,
          rating: Number(p.rating ?? 0),
          reviews: Number(p.reviews ?? p.review_count ?? 0),
          originalPrice: p.original_price ?? p.compare_price ?? null,
          badge: p.badge ?? null,
          category: p.category_name ?? p.category ?? "",
        }));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.listLoading = false;
        if (action.meta.condition !== true) {
          state.listError = action.payload ?? "Unknown error";
        }
      })

      //Fetch single
      .addCase(fetchProductById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.selectedProduct = null; // clear stale product immediately
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailLoading = false;
        const p = action.payload;
        state.selectedProduct = {
          ...p,
          img: resolveImage(
            p.img ?? p.image ?? p.image_url ?? p.thumbnail ?? null
          ),
          // Add safe defaults for fields the backend doesn't send yet
          sizes: p.sizes ?? [], // QuickViewModal uses this
          colors: p.colors ?? [], // ProductCard + QuickViewModal use this
          inStock: p.in_stock ?? p.is_active ?? true,
          rating: Number(p.rating ?? 0),
          reviews: Number(p.reviews ?? p.review_count ?? 0),
          originalPrice: p.original_price ?? p.compare_price ?? null,
          badge: p.badge ?? null,
          category: p.category_name ?? p.category ?? "",
        };
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload ?? "Unknown error";
      });
  },
});

export const { clearSelectedProduct, invalidateProducts } =
  productSlice.actions;
export default productSlice.reducer;

///////////////////////////////////////////////////////////////////////////
