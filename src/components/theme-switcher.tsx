"use client";

import { useSyncExternalStore } from "react";

export const THEME_KEY = "principles:theme";

const THEMES = [
  { id: "paper", name: "宣纸", swatch: ["#f3efe6", "#1c3d36"] },
  { id: "celadon", name: "青瓷", swatch: ["#e5ede9", "#1d4a5c"] },
  { id: "night", name: "夜读", swatch: ["#161412", "#8fc7b0"] },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function applyTheme(id: ThemeId) {
  if (id === "paper") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", id);
}

const readTheme = () => (document.documentElement.dataset.theme as ThemeId | undefined) ?? "paper";

export function ThemeSwitcher() {
  // The inline script in the layout sets data-theme before paint; the server always renders the default.
  const theme = useSyncExternalStore(subscribe, readTheme, () => "paper" as ThemeId);

  function choose(id: ThemeId) {
    applyTheme(id);
    try {
      localStorage.setItem(THEME_KEY, id);
    } catch {
      /* private mode: the choice just won't persist */
    }
  }

  return (
    <div role="radiogroup" aria-label="主题颜色" className="inline-flex rounded-full border border-line bg-paper p-1">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={theme === t.id}
          onClick={() => choose(t.id)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            theme === t.id ? "bg-pine text-on-pine" : "text-muted hover:text-pine"
          }`}
        >
          <span
            aria-hidden
            className="size-3 rounded-full border border-black/10"
            style={{ background: `linear-gradient(135deg, ${t.swatch[0]} 50%, ${t.swatch[1]} 50%)` }}
          />
          {t.name}
        </button>
      ))}
    </div>
  );
}
