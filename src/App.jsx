import { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { loadUser } from "./features/auth/authSlice";
import Home from "./pages/Home";
import CheckoutPage from "./features/orders/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";

export default function App() {
  const dispatch = useDispatch();
  // Load user on app start (session persistence)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </Router>
  );
}
