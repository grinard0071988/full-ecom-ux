import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/index";
import { imgEndPoint } from "../../api/productsApi";

//Helpers
const API_BASE = import.meta.env.VITE_API_URL || imgEndPoint;
const UPLOAD_PATH = `${API_BASE}/uploads/`;

const normalizeItem = (i) => {
  if (!i || !i.id) return null; // skip bad rows
  return {
    cartId: i.id,
    productId: i.product_id,
    name: i.name,
    img: i.img ? `${UPLOAD_PATH}/${i.img}` : null,
    price: Number(i.price),
    qty: i.quantity,
    category: i.category,
    selectedSize: i.selectedSize || "One Size",
  };
};
// Safely map + filter out any null rows
const normalizeItems = (items) =>
  (items || []).map(normalizeItem).filter(Boolean);

//Shared pending/rejected handlers to keep extraReducers DRY
const setPending = (state) => {
  state.loading = true;
  state.error = null;
};
const setRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.get("/cart/");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load cart");
    }
  }
);

// Add item
// POST to add, then GET full joined cart — avoids partial INSERT response
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product_id, quantity }, thunkAPI) => {
    try {
      await axiosClient.post("/cart/", { product_id, quantity });
      const res = await axiosClient.get("/cart/");
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to add item");
    }
  }
);

// Update item
// PUT to update quantity, then GET full cart so price/img stay intact
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ item_id, quantity }, thunkAPI) => {
    try {
      await axiosClient.put(`/cart/${item_id}`, { quantity });
      const res = await axiosClient.get("/cart/");
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue("Failed to update item");
    }
  }
);

// Remove item
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (item_id, thunkAPI) => {
    try {
      await axiosClient.delete(`/cart/${item_id}`);
      return item_id;
    } catch {
      return thunkAPI.rejectWithValue("Failed to remove item");
    }
  }
);
// clear cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      await axiosClient.delete("/cart/");
      return true;
    } catch {
      return thunkAPI.rejectWithValue("Failed to clear cart");
    }
  }
);
// Checkout
export const checkout = createAsyncThunk(
  "cart/checkout",
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.post("/orders/checkout");
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue("Checkout failed");
    }
  }
);

//Slice

// Shared reducer for any action that returns the full { cart_id, items } shape
const applyFullCart = (state, action) => {
  state.loading = false;
  state.cart_id = action.payload.cart_id;
  state.items = normalizeItems(action.payload.items);
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    cart_id: null,
    loading: false,
    error: null,
    checkoutSuccess: null,
  },
  reducers: {
    resetCheckout(state) {
      state.checkoutSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Fetch cart
      .addCase(fetchCart.pending, setPending)
      .addCase(fetchCart.rejected, setRejected)
      .addCase(fetchCart.fulfilled, applyFullCart)

      //Add item
      .addCase(addToCart.pending, setPending)
      .addCase(addToCart.rejected, setRejected)
      .addCase(addToCart.fulfilled, applyFullCart)

      //Update item — also returns full cart now
      .addCase(updateCartItem.pending, setPending)
      .addCase(updateCartItem.rejected, setRejected)
      .addCase(updateCartItem.fulfilled, applyFullCart)

      //Remove item
      .addCase(removeCartItem.pending, setPending)
      .addCase(removeCartItem.rejected, setRejected)
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((i) => i.cartId !== action.payload);
      })

      // Clear cart
      .addCase(clearCart.pending, setPending)
      .addCase(clearCart.rejected, setRejected)
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
      })

      //Checkout
      .addCase(checkout.pending, setPending)
      .addCase(checkout.rejected, setRejected)
      .addCase(checkout.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [];
        state.checkoutSuccess = action.payload;
      });
  },
});

export const { resetCheckout } = cartSlice.actions;
export default cartSlice.reducer;
