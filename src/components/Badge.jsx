// ─── Badge — product label pill (New / Sale / Bestseller) ────────────────────

export function Badge({ label }) {
  if (!label) return null;

  const cls =
    {
      New: "bg-stone-900 text-stone-50",
      Sale: "bg-rose-500 text-white",
      Bestseller: "bg-amber-400 text-stone-900",
    }[label] || "bg-stone-200 text-stone-700";

  return (
    <span
      className={`inline-block text-[10px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-sm ${cls}`}
    >
      {label}
    </span>
  );
}
