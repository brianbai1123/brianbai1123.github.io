export type ThemeId = "paper" | "celadon" | "night";

export function with7HabitTheme(href: string, theme: ThemeId, origin: string): string {
  const url = new URL(href);
  if (url.origin !== origin || !url.pathname.startsWith("/7habit/")) return href;

  url.searchParams.set("theme", theme);
  return url.href;
}
