export const THEMES = [
  { id: "paper", name: "宣纸", swatch: ["#f3efe6", "#1c3d36"] },
  { id: "celadon", name: "青瓷", swatch: ["#e5ede9", "#1d4a5c"] },
  { id: "night", name: "夜读", swatch: ["#161412", "#8fc7b0"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

export function with7HabitTheme(href: string, theme: ThemeId, origin: string): string {
  const url = new URL(href);
  if (url.origin !== origin || !url.pathname.startsWith("/7habit/")) return href;

  url.searchParams.set("theme", theme);
  return url.href;
}
