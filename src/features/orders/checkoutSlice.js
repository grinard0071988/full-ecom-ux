import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/index";

// Step 1 — called when CheckoutPage mounts
// Backend returns: { clientSecret, amount, subtotal, tax, shipping, total,shipping_address }
export const createPaymentIntent = createAsyncThunk(
  "order/createPaymentIntent",
  async (_, thunkAPI) => {
    try {
      const res = await axiosClient.post("/order/create-payment-intent");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to initialise payment"
      );
    }
  }
);

// Step 2 — called after Stripe confirms payment on the frontend
// Sends paymentIntentId and shippingAddress
// Backend returns: { message, order_id, total }
export const confirmOrder = createAsyncThunk(
  "order/confirmOrder",
  async ({ paymentIntentId, shippingAddress }, thunkAPI) => {
    try {
      const res = await axiosClient.post("/order/confirm", {
        paymentIntentId,
        shippingAddress,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error || "Failed to confirm order"
      );
    }
  }
);

//Slice

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    // From createPaymentIntent response
    clientSecret: null,
    amount: null, // in pence — for Stripe
    subtotal: null, // in £ — for display
    tax: null,
    shipping: null,
    total: null,

    // From confirmOrder response
    order_id: null,
    orderTotal: null,

    loading: false,
    error: null,
    // idle → payment → confirming → success | error
    step: "idle",
  },
  reducers: {
    resetCheckout(state) {
      state.clientSecret = null;
      state.amount = null;
      state.subtotal = null;
      state.tax = null;
      state.shipping = null;
      state.total = null;
      state.order_id = null;
      state.orderTotal = null;
      state.loading = false;
      state.error = null;
      state.step = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Create PaymentIntent
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.step = "idle";
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.step = "error";
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
        state.amount = action.payload.amount; // pence — passed to Stripe
        state.subtotal = action.payload.subtotal; // £ — displayed in summary
        state.tax = action.payload.tax;
        state.shipping = action.payload.shipping;
        state.total = action.payload.total;
        state.step = "payment";
      })

      //Confirm order
      .addCase(confirmOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.step = "confirming";
      })
      .addCase(confirmOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.step = "error";
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order_id = action.payload.order_id;
        state.orderTotal = action.payload.total;
        state.step = "success";
      });
  },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
