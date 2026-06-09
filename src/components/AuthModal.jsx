////////////////////////////////////////////////////////////////////////////
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser, loadUser } from "../features/auth/authSlice";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { useLockBodyScroll } from "../utils/useLockBodyScroll";
import { IconClose } from "../icons";

export function AuthModal({ onClose, initialTab = "login" }) {
  const [tab, setTab] = useState(initialTab);
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  useLockBodyScroll(true);

  const handleAuth = async (formData, mode) => {
    let result;

    if (mode === "login") {
      result = await dispatch(loginUser(formData));
      if (!result.error) await dispatch(loadUser());
    } else {
      result = await dispatch(registerUser(formData));
    }

    if (!result.error) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    // <div className="fixed inset-0 flex items-center justify-center">
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      style={{
        background: "rgba(28,25,23,0.6)",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* <div className="bg-white rounded-2xl w-full max-w-md p-6 relative"> */}
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative"
        style={{ animation: "slideUp 0.28s ease" }}
      >
        <div className="h-1 w-full bg-gradient-to-r from-stone-300 via-stone-600 to-stone-900" />
        <button
          onClick={onClose}
          className="absolute top-4 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors z-10"
        >
          <IconClose />
        </button>
        <div className="px-8 pt-8 pb-8">
          {/* Logo & subtitle */}
          <div className="text-center mb-6">
            <span className="font-serif text-2xl font-semibold text-stone-900 tracking-tight">
              SHOPNJOY
            </span>
            <p className="text-xs text-stone-400 mt-1 tracking-widest uppercase">
              {tab === "login" ? "Welcome back" : "Create your account"}
            </p>
          </div>
          {/* Tabs */}
          {/* <div className="flex mb-6 gap-4">
            <button onClick={() => setTab("login")}>Login</button>
            <button onClick={() => setTab("register")}>Register</button>
          </div> */}
          <div className="flex bg-stone-100 rounded-xl p-1 mb-5">
            {["login", "register"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)} // keep your original logic
                className={`flex-1 py-2 text-xs font-medium rounded-lg capitalize transition-all duration-200 ${
                  tab === t
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {t === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          {success ? (
            <p className="text-center">Success...</p>
          ) : tab === "login" ? (
            <Login
              switchToRegister={() => setTab("register")}
              onSubmit={(data) => handleAuth(data, "login")}
            />
          ) : (
            <Register
              switchToLogin={() => setTab("login")}
              onSubmit={(data) => handleAuth(data, "register")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
