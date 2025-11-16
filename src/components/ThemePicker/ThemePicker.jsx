import { useEffect, useRef, useState } from "react";
import { THEMES } from "@/constants/themes.js";
import { getTheme, setTheme } from "@/utils/theme";
import ThemeButton from "./ThemeButton.jsx";

export default function ThemePicker({ className = "" }) {
  const [currentTheme, setCurrentTheme] = useState(getTheme());
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setTheme(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (containerRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={containerRef} className={`dropdown dropdown-end ${className}`}>
      <button
        type="button"
        title={`Theme: ${currentTheme}`}
        onClick={() => setOpen((o) => !o)}
        className="btn btn-circle btn-ghost border border-base-300 shadow"
      >
        <div
          data-theme={currentTheme}
          className="w-5 h-5 rounded-full bg-primary"
        />
      </button>

      <div
        className={`dropdown-content mt-2 p-3 shadow bg-base-100 rounded-box ${
          open ? "" : "hidden"
        }`}
      >
        <div className="flex gap-3">
          {THEMES.map((t) => (
            <ThemeButton
              key={t}
              themeName={t}
              active={currentTheme === t}
              onSelect={(name) => {
                setTheme(name);
                setCurrentTheme(name);
                setOpen(false);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
