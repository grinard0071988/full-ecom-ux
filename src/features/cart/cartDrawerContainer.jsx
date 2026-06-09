import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItem, removeCartItem } from "./cartSlice";
import { CartDrawer } from "../../components/CartDrawer";

export default function CartDrawerContainer({ open, onClose }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);

  if (!open) return null;

  return (
    <CartDrawer
      cart={cart}
      onClose={onClose}
      onRemove={(cartId) => dispatch(removeCartItem(cartId))}
      onUpdateQty={(cartId, qty) =>
        dispatch(updateCartItem({ item_id: cartId, quantity: qty }))
      }
    />
  );
}
