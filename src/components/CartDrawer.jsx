import { useLockBodyScroll } from "../utils/useLockBodyScroll";
import {
  IconClose,
  IconMinus,
  IconPlus,
  IconTrash,
  IconBag,
} from "../icons/index";
import { useNavigate } from "react-router-dom";

//CartDrawer

export function CartDrawer({ cart, onClose, onRemove, onUpdateQty }) {
  useLockBodyScroll(true);

  const navigate = useNavigate();

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 200 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <div
      className="fixed inset-0 z-[100] flex"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div
        className="flex-1"
        style={{
          background: "rgba(28,25,23,0.4)",
          animation: "fadeIn 0.2s ease",
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="w-full max-w-sm bg-white h-full flex flex-col shadow-2xl"
        style={{ animation: "slideLeft 0.3s ease" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div>
            <h2 className="font-serif text-xl font-semibold text-stone-900">
              Your Bag
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <IconClose />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
                <IconBag />
              </div>
              <p className="text-stone-400 text-sm">Your bag is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.cartId} className="flex gap-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
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
                  <p className="text-xs text-stone-400 mt-0.5">
                    {item.selectedSize && item.selectedSize !== "One Size"
                      ? `Size: ${item.selectedSize}`
                      : item.category}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    {/* Qty stepper */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onUpdateQty(item.cartId, item.qty - 1)}
                        className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
                      >
                        <IconMinus />
                      </button>
                      <span className="text-xs font-medium w-5 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.cartId, item.qty + 1)}
                        className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors"
                      >
                        <IconPlus />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-stone-900">
                        ${(item.price * item.qty).toFixed(0)}
                      </span>
                      <button
                        onClick={() => onRemove(item.cartId)}
                        className="text-stone-300 hover:text-rose-400 transition-colors"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order summary */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-stone-100">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Subtotal</span>
                <span className="text-stone-900">${subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Shipping</span>
                <span
                  className={
                    shipping === 0
                      ? "text-green-600 font-medium"
                      : "text-stone-900"
                  }
                >
                  {shipping === 0 ? "Free" : `$${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-stone-400">
                  ${200 - subtotal} away from free shipping
                </p>
              )}
              <div className="flex justify-between text-base font-medium border-t border-stone-100 pt-2">
                <span>Total</span>
                <span>${total.toFixed(0)}</span>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
              className="w-full py-3.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-700 transition-all hover:-translate-y-px"
            >
              Checkout — ${total.toFixed(0)}
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-stone-400 hover:text-stone-600 transition-colors mt-2"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
