import { useState, useEffect, useRef } from "react";
import {
  IconSearch,
  IconHeart,
  IconBag,
  IconMenu,
  IconUser,
} from "../icons/index";

// Navbar

export function Navbar({
  wishlistCount,
  cartCount,
  user,
  onOpenCart,
  onOpenAuth,
  onLogout,
  searchQuery,
  onSearchChange,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* ── Logo — left aligned ── */}
          <span className="font-serif text-lg sm:text-xl font-semibold tracking-tight shrink-0">
            SHOPNJOY
          </span>

          {/* ── Desktop nav links — hidden on mobile ── */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1">
            {["Collections", "New In", "Sale", "About"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-stone-900 hover:after:w-full after:transition-all"
              >
                {link}
              </a>
            ))}
          </div>

          {/* ── Action icons ── */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-500"
            >
              <IconSearch />
            </button>

            {/* Wishlist */}
            <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors relative text-stone-500">
              <IconHeart filled={wishlistCount > 0} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={onOpenCart}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors relative text-stone-500"
            >
              <IconBag />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-stone-900 text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User / Auth */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 ml-1 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px] font-semibold uppercase">
                    {user?.name?.[0] || "?"}
                  </div>
                  <span className="text-xs text-stone-700 font-medium hidden sm:block max-w-[80px] truncate">
                    {user?.name || ""}
                  </span>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#78716c"
                    strokeWidth="2.5"
                    className={`transition-transform ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-50"
                    style={{ animation: "slideUp 0.15s ease" }}
                  >
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="text-xs font-medium text-stone-900 truncate">
                        {user?.name || ""}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                    {["My Orders", "Wishlist", "Profile", "Settings"].map(
                      (item) => (
                        <button
                          key={item}
                          className="w-full text-left px-3 py-2 text-xs text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                        >
                          {item}
                        </button>
                      )
                    )}
                    <div className="border-t border-stone-100 mt-1">
                      <button
                        onClick={onLogout}
                        className="w-full text-left px-3 py-2 text-xs text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth("login")}
                className="ml-1 px-3 py-1.5 text-xs font-medium text-stone-700 border border-stone-200 rounded-lg hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all hidden sm:flex items-center gap-1.5"
              >
                <IconUser filled={false} />
                Sign In
              </button>
            )}

            {/* Mobile hamburger — rightmost item on small screens */}
            <button
              className="md:hidden p-2 text-stone-500 ml-1"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <IconMenu />
            </button>
          </div>
        </div>

        {/* Expandable search bar */}
        {searchOpen && (
          <div className="pb-4">
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products…"
              autoFocus
              className="w-full px-4 py-2.5 bg-stone-100 rounded-xl text-sm placeholder-stone-400 border border-transparent focus:border-stone-300 focus:bg-white outline-none transition-all"
            />
          </div>
        )}

        {/* Mobile slide-down menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3 border-t border-stone-100 pt-4">
            {["Collections", "New In", "Sale", "About"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-stone-600 hover:text-stone-900"
              >
                {link}
              </a>
            ))}
            <div className="border-t border-stone-100 pt-3 flex gap-2">
              {user ? (
                <button
                  onClick={onLogout}
                  className="text-sm text-rose-500 hover:text-rose-700"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onOpenAuth("login");
                      setMenuOpen(false);
                    }}
                    className="flex-1 py-2 text-sm text-center border border-stone-200 rounded-lg text-stone-700 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth("register");
                      setMenuOpen(false);
                    }}
                    className="flex-1 py-2 text-sm text-center bg-stone-900 text-white rounded-lg hover:bg-stone-700 transition-all"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
