// ─── Footer ───────────────────────────────────────────────────────────────────

const FOOTER_COLS = [
  {
    title: "Shop",
    links: [
      "New Arrivals",
      "Bags",
      "Outerwear",
      "Home",
      "Accessories",
      "Footwear",
    ],
  },
  {
    title: "Help",
    links: ["Sizing Guide", "Shipping", "Returns", "FAQ", "Care Guide"],
  },
  {
    title: "About",
    links: ["Our Story", "Sustainability", "Makers", "Press", "Careers"],
  },
  {
    title: "Connect",
    links: ["Instagram", "Pinterest", "Newsletters", "Stockists"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-stone-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-medium text-stone-900 uppercase tracking-wider mb-3">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-stone-100">
          <span className="font-serif text-lg font-semibold text-stone-900">
            SHOPNJOY
          </span>
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} Shopnjoy. Thoughtfully made.
          </p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-xs text-stone-400 hover:text-stone-700"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
