import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { chapters, chapterGroups, GROUP_ORDER, STRIPS } from "../src/content/book.ts";

test("stations follow the book, then a closing synthesis", () => {
  assert.deepEqual(
    chapters.map((chapter) => chapter.slug),
    [
      "start",
      "foundation",
      "survival",
      "women",
      "men",
      "short-term",
      "parenting",
      "kinship",
      "cooperate",
      "aggression",
      "conflict",
      "status",
      "together",
    ],
  );
});

test("every station has both layers and the five-step reread", () => {
  for (const chapter of chapters) {
    assert.ok(chapter.lead.length > 40, chapter.slug);
    assert.ok(chapter.essenceIntro.length > 20, chapter.slug);
    assert.ok(chapter.essence.length >= 4, chapter.slug);
    assert.ok(chapter.bookRef.length > 0, chapter.slug);
    assert.equal(chapter.plain.checks.length, 3, chapter.slug);
    assert.ok(chapter.plain.logic.length >= 4, chapter.slug);
    assert.ok(chapter.plain.scenes.length >= 2, chapter.slug);
    assert.equal((chapter.plain.core.match(/。/g) || []).length, 1, chapter.slug);
    for (const block of chapter.essence) {
      assert.ok(block.paragraphs.length >= 1, block.heading);
      assert.ok(block.paragraphs.every((paragraph) => paragraph.length > 20));
    }
    for (const check of chapter.plain.checks) {
      assert.ok(check.question.endsWith("？") || check.question.endsWith("吗？"), check.question);
      assert.ok(check.answer.length > 20, check.question);
    }
  }
});

test("mating, family, and group strips keep the book's order", () => {
  for (const kind of ["mating", "family", "group"]) {
    const group = chapters.filter((chapter) => chapter.strip?.kind === kind);
    assert.deepEqual(
      group.map((chapter) => chapter.strip?.index),
      STRIPS[kind].names.map((_, index) => index + 1),
      kind,
    );
    assert.deepEqual(
      group.map((chapter) => chapter.navLabel),
      [...STRIPS[kind].names],
      kind,
    );
  }
});

test("navigation groups cover every station once", () => {
  const grouped = chapterGroups().flatMap((group) => group.chapters.map((chapter) => chapter.slug));
  assert.deepEqual(grouped, chapters.map((chapter) => chapter.slug));
  assert.deepEqual(
    chapterGroups().map((group) => group.label),
    [...GROUP_ORDER],
  );
});

test("the page shows the five-step method in order", () => {
  const source = readFileSync(new URL("../src/components/chapter-view.tsx", import.meta.url), "utf8");
  const labels = ["先理解", "找出核心观点", "重建逻辑", "用简单语言表达", "检查你是否能快速理解"];
  let cursor = 0;
  for (const label of labels) {
    const at = source.indexOf(label, cursor);
    assert.ok(at > cursor, label);
    cursor = at;
  }
});
