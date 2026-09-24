import { close } from "./close";
import { life } from "./life";
import { map } from "./map";
import { origin } from "./origin";
import { GROUP_ORDER, type Chapter } from "./types";
import { work } from "./work";

export type { Chapter, DiagramId, EssenceBlock, StripKind } from "./types";
export { GROUP_ORDER, LIFE_NAMES, WORK_NAMES } from "./types";

export const chapters: Chapter[] = [...map, ...origin, ...life, ...work, ...close];

export function findChapter(slug: string) {
  return chapters.find((chapter) => chapter.slug === slug);
}

export function chapterHref(slug: string) {
  return slug === "start" ? "/" : `/${slug}/`;
}

export function chapterGroups() {
  return GROUP_ORDER.map((label) => ({
    label,
    chapters: chapters.filter((chapter) => chapter.group === label),
  })).filter((group) => group.chapters.length > 0);
}

export function locate(slug: string) {
  const index = chapters.findIndex((chapter) => chapter.slug === slug);
  return {
    index,
    total: chapters.length,
    prev: index > 0 ? chapters[index - 1] : undefined,
    next:
      index >= 0 && index < chapters.length - 1
        ? chapters[index + 1]
        : undefined,
  };
}
