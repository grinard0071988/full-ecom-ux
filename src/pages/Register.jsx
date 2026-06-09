import { useState } from "react";
import { useSelector } from "react-redux";
import { InputField } from "../utils/InputFields";
import { IconEye, IconGoogle } from "../icons";

export function Register({ onSubmit, switchToLogin }) {
  const { loading, error } = useSelector((state) => state.auth);

  // Form state
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phone, setPhone] = useState("");

  // UI state
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation
  const validate = () => {
    const e = {};

    if (!firstName.trim()) e.firstName = "First name required";
    if (!lastName.trim()) e.lastName = "Last name required";
    if (!email.trim()) e.email = "Email required";
    if (pw.length < 8) e.pw = "At least 8 characters";
    if (pw !== confirm) e.confirm = "Passwords do not match";
    if (!phone.trim()) e.phone = "Phone number required";
    if (!agree) e.agree = "You must accept the terms";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Submit handler
  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      firstname: firstName,
      lastname: lastName,
      email,
      password: pw,
      phone,
    });
  };

  return (
    <div className="space-y-4 w-full max-w-md max-h-[80vh] overflow-y-auto">
      {/* Backend error */}
      {error && (
        <p className="text-xs text-rose-500">
          {error.error || "Registration failed"}
        </p>
      )}
      <InputField
        label="First Name"
        value={firstName}
        onChange={(e) => setFirst(e.target.value)}
        error={errors.firstName}
      />
      <InputField
        label="Last Name"
        value={lastName}
        onChange={(e) => setLast(e.target.value)}
        error={errors.lastName}
      />
      <InputField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <InputField
        label="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={errors.phone}
      />
      <InputField
        label="Password"
        type={showPw ? "text" : "password"}
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        error={errors.pw}
      >
        <button type="button" onClick={() => setShowPw(!showPw)}>
          <IconEye show={showPw} />
        </button>
      </InputField>
      <InputField
        label="Confirm Password"
        type={showConfirmPw ? "text" : "password"}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
      >
        <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)}>
          <IconEye show={showConfirmPw} />
        </button>
      </InputField>
      <label className="text-xs flex items-center gap-2">
        <input
          type="checkbox"
          checked={agree}
          onChange={() => setAgree(!agree)}
        />
        Agree to terms
      </label>
      {errors.agree && <p className="text-xs text-rose-500">{errors.agree}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-stone-900 text-white rounded-xl"
      >
        {loading ? "Creating…" : "Create Account"}
      </button>
      <button className="w-full py-3 border rounded-xl flex justify-center gap-2">
        <IconGoogle /> Sign up with Google
      </button>
      <p className="text-center text-xs">
        Already have an account?{" "}
        <button onClick={switchToLogin} className="underline">
          Sign in
        </button>
      </p>
    </div>
  );
}
///////////////////////////////////////////
