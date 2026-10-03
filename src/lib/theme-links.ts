export const THEMES = [
  { id: "paper", name: "宣纸", swatch: ["#f3efe6", "#1c3d36"] },
  { id: "celadon", name: "青瓷", swatch: ["#e5ede9", "#1d4a5c"] },
  { id: "night", name: "夜读", swatch: ["#161412", "#8fc7b0"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

const READING_PATHS = [
  "/7habit/",
  "/ruiprincipal/",
  "/ep/",
  "/sunzi/",
  "/zhouyi-reading-cards/",
  "/lijiu/",
  "/cgt/",
  "/36/",
] as const;

export function withReadingTheme(href: string, theme: ThemeId, origin: string): string {
  const url = new URL(href);
  if (url.origin !== origin || !READING_PATHS.some((path) => url.pathname.startsWith(path))) {
    return href;
  }
  url.searchParams.set("theme", theme);
  return url.href;
}
