import { useState } from "react";
import { useSelector } from "react-redux";

import { InputField } from "../utils/InputFields";
import { IconEye, IconGoogle } from "../icons";

export function Login({ onSubmit, switchToRegister }) {
  //form state
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  //UI state
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { loading, error } = useSelector((state) => state.auth);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!pw) e.pw = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ email, password: pw, rememberMe });
  };

  return (
    <div className="space-y-4">
      {/* Backend error */}
      {error && (
        <p className="text-xs text-rose-500">{error.error || "Login failed"}</p>
      )}

      <InputField
        label="Email"
        id="login-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        error={errors.email}
      />

      <InputField
        label="Password"
        id="login-pw"
        type={showPw ? "text" : "password"}
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="Your password"
        error={errors.pw}
      >
        <button
          type="button"
          onClick={() => setShowPw(!showPw)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
        >
          <IconEye show={showPw} />
        </button>
      </InputField>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <span className="text-xs text-stone-500">Remember me</span>
        </label>

        <button className="text-xs underline">Forgot password</button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-stone-900 text-white"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>

      <button className="w-full py-3 border rounded-xl flex justify-center gap-2">
        <IconGoogle /> Continue with Google
      </button>

      <p className="text-center text-xs">
        Don't have an account{" "}
        <button onClick={switchToRegister} className="underline">
          Create one
        </button>
      </p>
    </div>
  );
}
