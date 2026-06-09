import { useEffect } from "react";

/**
 * Locks document body scroll while the consuming component is mounted / active.
 * @param {boolean} active - when true, scroll is locked
 */
export function useLockBodyScroll(active) {
  useEffect(() => {
    if (active) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);
}
