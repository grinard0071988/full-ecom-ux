export function InputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  children,
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-stone-700 uppercase tracking-wider"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border text-sm text-stone-900 placeholder-stone-400 outline-none transition-all bg-stone-50 focus:bg-white ${
            error
              ? "border-rose-300 focus:border-rose-400"
              : "border-stone-200 focus:border-stone-400"
          }`}
        />
        {children}
      </div>

      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
