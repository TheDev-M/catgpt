import { THEMES } from "@/constants/themes.js";

export function setTheme(theme) {
  if (THEMES.includes(theme)) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }
}

export function getTheme() {
  const saved = localStorage.getItem("theme");
  const fromDom = document.documentElement.getAttribute("data-theme");
  const candidate = saved || fromDom || THEMES[0];
  return THEMES.includes(candidate) ? candidate : THEMES[0];
}

const initialTheme = getTheme();
setTheme(initialTheme);
