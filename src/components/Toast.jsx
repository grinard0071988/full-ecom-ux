import { useEffect } from "react";
import { IconCheck } from "../icons/index";

//Toast - transient success notification

export function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-stone-900 text-stone-50 px-5 py-3 rounded-full text-sm flex items-center gap-2 shadow-xl"
      style={{ animation: "toastIn 0.3s ease" }}
    >
      <IconCheck />
      {message}
    </div>
  );
}
