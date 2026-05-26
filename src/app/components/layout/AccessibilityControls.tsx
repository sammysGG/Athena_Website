"use client";

import { useEffect, useState } from "react";

// Mirrors the accessibility affordances on valitsus.ee: text resizing and a
// high-contrast (yellow-on-black) mode. State is persisted in localStorage and
// applied as classes on <html>, where globals.css picks them up.
export default function AccessibilityControls() {
  const [size, setSize] = useState<0 | 1 | 2>(0);
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    const s = Number(localStorage.getItem("a11y-size") ?? "0") as 0 | 1 | 2;
    const c = localStorage.getItem("a11y-contrast") === "1";
    setSize(s);
    setContrast(c);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("text-lg", size === 1);
    html.classList.toggle("text-xl", size === 2);
    html.classList.toggle("contrast", contrast);
    localStorage.setItem("a11y-size", String(size));
    localStorage.setItem("a11y-contrast", contrast ? "1" : "0");
  }, [size, contrast]);

  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        type="button"
        aria-label="Decrease text size"
        onClick={() => setSize((s) => (s > 0 ? ((s - 1) as 0 | 1 | 2) : 0))}
        className="px-1.5 py-0.5 hover:underline"
      >
        A−
      </button>
      <button
        type="button"
        aria-label="Increase text size"
        onClick={() => setSize((s) => (s < 2 ? ((s + 1) as 0 | 1 | 2) : 2))}
        className="px-1.5 py-0.5 hover:underline font-semibold"
      >
        A+
      </button>
      <span className="opacity-40">|</span>
      <button
        type="button"
        aria-pressed={contrast}
        onClick={() => setContrast((c) => !c)}
        className="px-1.5 py-0.5 hover:underline"
      >
        {contrast ? "Default colours" : "High contrast"}
      </button>
    </div>
  );
}
