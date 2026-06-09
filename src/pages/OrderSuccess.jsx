import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Receives { order_id, orderTotal } from CheckoutPage via router state.
// Matches exactly what confirmOrder returns: { message, order_id, total }

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order_id = state?.order_id;
  const orderTotal = state?.orderTotal;

  // Guard: if someone lands here directly with no state, send them home
  useEffect(() => {
    if (!order_id) navigate("/");
  }, [order_id, navigate]);

  if (!order_id) return null;

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
        {/* Success icon */}
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="font-serif text-2xl font-semibold text-stone-900 mb-2">
          Order Confirmed
        </h1>
        <p className="text-stone-500 text-sm mb-6">
          Thank you for your purchase. You'll receive a confirmation email
          shortly.
        </p>

        {/* Order summary — matches { order_id, total } from confirmOrder response */}
        <div className="bg-stone-50 rounded-xl p-4 text-left mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Order ID</span>
            <span className="font-medium text-stone-900">#{order_id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Total Paid</span>
            <span className="font-medium text-stone-900">
              £{Number(orderTotal).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-700 transition-all hover:-translate-y-px"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
