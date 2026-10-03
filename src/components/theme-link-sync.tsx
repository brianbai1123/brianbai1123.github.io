"use client";

import { useEffect } from "react";
import { THEME_KEY } from "@/components/theme-switcher";
import { isThemeId, type ThemeId, withReadingTheme } from "@/lib/theme-links";

function readTheme(): ThemeId {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    if (isThemeId(theme)) return theme;
  } catch {
    /* private mode: use the default theme */
  }
  return "paper";
}

export function startThemeLinkSync() {
  let currentTheme = readTheme();

  function sync() {
    for (const anchor of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      const themed = withReadingTheme(anchor.href, currentTheme, location.origin);
      if (themed !== anchor.href) anchor.href = themed;
    }
  }

  function onThemeChange(event: Event) {
    currentTheme = event instanceof CustomEvent && isThemeId(event.detail) ? event.detail : readTheme();
    sync();
  }

  sync();
  window.addEventListener("principles:theme-change", onThemeChange);
  const observer = new MutationObserver(() => sync());
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    window.removeEventListener("principles:theme-change", onThemeChange);
    observer.disconnect();
  };
}

export function ThemeLinkSync() {
  useEffect(startThemeLinkSync, []);
  return null;
}
