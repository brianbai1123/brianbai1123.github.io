import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import room from "../src/data/room.json" with { type: "json" };
import { startThemeLinkSync } from "../src/components/theme-link-sync.tsx";
import { with7HabitTheme } from "../src/lib/theme-links.ts";

const origin = "https://brianbai1123.github.io";

test("7habit links carry the selected home theme", () => {
  assert.equal(
    with7HabitTheme("https://brianbai1123.github.io/7habit/habit-1/#plain", "night", origin),
    "https://brianbai1123.github.io/7habit/habit-1/?theme=night#plain",
  );
  assert.equal(
    with7HabitTheme("https://brianbai1123.github.io/7habit/path/?from=room#plain", "celadon", origin),
    "https://brianbai1123.github.io/7habit/path/?from=room&theme=celadon#plain",
  );
  assert.equal(with7HabitTheme("https://example.com/7habit/", "night", origin), "https://example.com/7habit/");
  assert.equal(
    with7HabitTheme("https://brianbai1123.github.io/cgt/1/", "night", origin),
    "https://brianbai1123.github.io/cgt/1/",
  );
});

test("the principles page mounts theme link sync", async () => {
  const source = await readFile(new URL("../src/components/principles-page.tsx", import.meta.url), "utf8");
  assert.match(source, /import\s+\{\s*ThemeLinkSync\s*\}.*theme-link-sync/);
  assert.match(source, /<ThemeLinkSync\s*\/>/);
});

test("the theme switcher announces theme changes", async () => {
  const source = await readFile(new URL("../src/components/theme-switcher.tsx", import.meta.url), "utf8");
  assert.match(source, /dispatchEvent\(new CustomEvent\("principles:theme-change",\s*\{\s*detail:\s*id\s*\}\)\)/);
});

test("theme-change event detail drives link sync when storage is unavailable", () => {
  const anchor = { href: "https://brianbai1123.github.io/7habit/habit-1/#plain" };
  const target = new EventTarget();
  const previous = {
    document: globalThis.document,
    localStorage: globalThis.localStorage,
    location: globalThis.location,
    MutationObserver: globalThis.MutationObserver,
    window: globalThis.window,
  };

  class TestMutationObserver {
    observe() {}
    disconnect() {}
  }

  Object.assign(globalThis, {
    document: {
      body: {},
      querySelectorAll: () => [anchor],
    },
    localStorage: {
      getItem() {
        throw new Error("storage unavailable");
      },
    },
    location: { origin },
    MutationObserver: TestMutationObserver,
    window: target,
  });

  try {
    const stop = startThemeLinkSync();
    target.dispatchEvent(new CustomEvent("principles:theme-change", { detail: "night" }));
    assert.equal(
      anchor.href,
      "https://brianbai1123.github.io/7habit/habit-1/?theme=night#plain",
    );
    stop();
  } finally {
    Object.assign(globalThis, previous);
  }
});

test("six books sit on three shelves", () => {
  assert.deepEqual(
    room.books.map((book) => book.id),
    ["7habit", "ruiprincipal", "ep", "sunzi", "zhouyi", "lijiu"],
  );
  assert.deepEqual(
    [...new Set(room.books.map((book) => book.shelf))],
    ["导读", "经文卡片", "索引"],
  );
});

test("search catalog covers every book", () => {
  for (const book of room.books) {
    const count = room.entries.filter((entry) => entry.book === book.id).length;
    assert.ok(count > 0, book.id);
  }
  assert.equal(room.entries.filter((entry) => entry.book === "zhouyi").length, 64);
  assert.equal(room.entries.filter((entry) => entry.book === "sunzi").length, 13);
  assert.equal(room.entries.filter((entry) => entry.book === "lijiu").length, 35);
});

test("cross links point at catalog entries", () => {
  const hrefs = new Set(room.entries.map((entry) => entry.href));
  for (const book of room.books) hrefs.add(book.href);
  for (const [from, list] of Object.entries(room.links)) {
    assert.ok(list.length > 0, from);
    for (const item of list) {
      assert.ok(item.title && item.href && item.book, from);
    }
  }
});
