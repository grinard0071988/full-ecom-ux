import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  createPaymentIntent,
  confirmOrder,
  resetCheckout,
} from "./checkoutSlice";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

//PaymentForm (must live inside <Elements>)

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Totals come from Redux — calculated by the backend on createPaymentIntent
  const { amount, subtotal, tax, shipping, total, loading, error, step } =
    useSelector((s) => s.checkout);

  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setCardError(null);

    // Step 1 — Stripe collects and processes the card
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setCardError(stripeError.message);
      setProcessing(false);
      return;
    }

    // Step 2 — payment succeeded, tell our backend to create the order
    if (paymentIntent.status === "succeeded") {
      const result = await dispatch(
        confirmOrder({ paymentIntentId: paymentIntent.id })
      );

      if (confirmOrder.fulfilled.match(result)) {
        // Pass order_id and total to success page via router state
        navigate("/order-success", {
          state: {
            order_id: result.payload.order_id,
            orderTotal: result.payload.total,
          },
        });
      }
    }

    setProcessing(false);
  };

  const isBusy = processing || loading || step === "confirming";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />

      {(cardError || error) && (
        <p className="text-sm text-rose-500">{cardError || error}</p>
      )}

      {/* Order breakdown above the pay button */}
      <div className="bg-stone-50 rounded-xl p-4 space-y-1.5 text-sm">
        <div className="flex justify-between text-stone-500">
          <span>Subtotal</span>
          <span>£{Number(subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-stone-500">
          <span>Tax (10%)</span>
          <span>£{Number(tax).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-stone-500">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
            {shipping === 0 ? "Free" : `£${Number(shipping).toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between font-medium text-stone-900 border-t border-stone-200 pt-1.5">
          <span>Total</span>
          <span>£{Number(total).toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isBusy}
        className={`w-full py-3.5 rounded-xl text-sm font-medium transition-all ${
          isBusy
            ? "bg-stone-300 text-stone-500 cursor-not-allowed"
            : "bg-stone-900 text-white hover:bg-stone-700 hover:-translate-y-px"
        }`}
      >
        {isBusy
          ? step === "confirming"
            ? "Placing order..."
            : "Processing..."
          : `Pay £${(amount / 100).toFixed(2)}`}
      </button>

      <p className="text-xs text-stone-400 text-center">
        🔒 Payments secured by Stripe
      </p>
    </form>
  );
}

//CheckoutPage

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((s) => s.cart.items);
  const { clientSecret, step, error } = useSelector((s) => s.checkout);

  // Guard: send home if cart is empty
  useEffect(() => {
    if (cart.length === 0) navigate("/");
  }, [cart, navigate]);

  // Create PaymentIntent as soon as page loads
  useEffect(() => {
    dispatch(createPaymentIntent());
    // Clean up checkout state when leaving the page
    return () => {
      dispatch(resetCheckout());
    };
  }, [dispatch]);

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#1c1917",
      colorBackground: "#ffffff",
      colorText: "#1c1917",
      borderRadius: "12px",
      fontFamily: "ui-sans-serif, system-ui, sans-serif",
    },
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-8">
          Checkout
        </h1>

        <div className="grid md:grid-cols-5 gap-8">
          {/* ── Left: Payment form ── */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl p-6">
              <h2 className="font-medium text-stone-900 mb-4">Payment</h2>

              {/* Loading state while PaymentIntent is being created */}
              {(step === "idle" || !clientSecret) && !error && (
                <div className="flex items-center justify-center py-10">
                  <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
                </div>
              )}

              {/* Error state — e.g. cart empty or server error */}
              {step === "error" && (
                <div className="text-center py-8">
                  <p className="text-sm text-rose-500 mb-4">{error}</p>
                  <button
                    onClick={() => dispatch(createPaymentIntent())}
                    className="text-xs text-stone-500 underline hover:text-stone-700"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Stripe Elements — only render once clientSecret is ready */}
              {clientSecret && step === "payment" && (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance }}
                >
                  <PaymentForm />
                </Elements>
              )}
            </div>
          </div>

          {/* ── Right: Cart item summary ── */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-6 sticky top-6">
              <h2 className="font-medium text-stone-900 mb-4">
                Your Bag ({cart.length} {cart.length === 1 ? "item" : "items"})
              </h2>

              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
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
                      <p className="text-xs text-stone-400">Qty: {item.qty}</p>
                    </div>
                    <span className="text-sm font-medium text-stone-900 whitespace-nowrap">
                      £{(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(-1)}
                className="mt-4 w-full py-2 text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                ← Edit bag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
