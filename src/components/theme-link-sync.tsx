"use client";

import { useEffect } from "react";
import { THEME_KEY } from "@/components/theme-switcher";
import { type ThemeId, with7HabitTheme } from "@/lib/theme-links";

const THEMES = new Set<ThemeId>(["paper", "celadon", "night"]);

function readTheme(): ThemeId {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    if (THEMES.has(theme as ThemeId)) return theme as ThemeId;
  } catch {
    /* private mode: use the default theme */
  }
  return "paper";
}

export function ThemeLinkSync() {
  useEffect(() => {
    function sync() {
      const theme = readTheme();
      for (const anchor of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
        const themed = with7HabitTheme(anchor.href, theme, location.origin);
        if (themed !== anchor.href) anchor.href = themed;
      }
    }

    sync();
    window.addEventListener("principles:theme-change", sync);
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("principles:theme-change", sync);
      observer.disconnect();
    };
  }, []);

  return null;
}
