import assert from "node:assert/strict";
import test from "node:test";
import room from "../src/data/room.json" with { type: "json" };
import { candidates, dimensions, principles } from "../src/content/principles.ts";
import { inventory } from "../src/content/inventory.ts";

const pages = new Set(room.entries.map((entry) => entry.href));

test("twelve principles, numbered in order, cover every dimension", () => {
  assert.deepEqual(
    principles.map((p) => p.n),
    Array.from({ length: 12 }, (_, i) => i + 1),
  );
  for (const dimension of dimensions) {
    assert.ok(principles.some((p) => p.dimension === dimension.id), dimension.id);
  }
});

test("every principle is backed by at least three different books", () => {
  for (const p of principles) {
    const books = p.evidence.map((item) => item.book);
    assert.equal(new Set(books).size, books.length, `duplicate book in ${p.n}`);
    assert.ok(books.length >= 3, `principle ${p.n}`);
  }
});

test("the five steps stay short enough to read at a glance", () => {
  for (const p of principles) {
    assert.ok([...p.core].length <= 30, `core ${p.n}`);
    assert.ok([...p.plain].length <= 100, `plain ${p.n}`);
    assert.ok(p.understand && p.logic.length > 0 && p.limits && p.check, `steps ${p.n}`);
  }
});

test("principle 9 absorbed the try-small candidate", () => {
  const nine = principles.find((p) => p.n === 9);
  const hrefs = nine.evidence.flatMap((item) => item.links.map((link) => link.href));
  assert.ok(hrefs.includes("https://brianbai1123.github.io/lijiu/#start-small"));
  assert.ok(!candidates.some((c) => c.links.some((link) => link.href.endsWith("#start-small"))));
});

test("candidates each rest on exactly two books", () => {
  assert.equal(candidates.length, 6);
  for (const candidate of candidates) {
    assert.equal(new Set(candidate.links.map((link) => link.book)).size, 2, candidate.title);
  }
});

test("every evidence link lands on a real page in one of the six books", () => {
  const links = [
    ...principles.flatMap((p) => p.evidence.flatMap((item) => item.links)),
    ...candidates.flatMap((c) => c.links),
  ];
  for (const link of links) {
    assert.ok(pages.has(link.href), link.href);
  }
});

test("the reference inventory lists every entry of every book once", () => {
  const counts = Object.fromEntries(Object.entries(inventory).map(([book, items]) => [book, items.length]));
  assert.deepEqual(counts, { "7habit": 11, ruiprincipal: 12, ep: 13, sunzi: 13, zhouyi: 64, lijiu: 35 });
  const ids = new Set(dimensions.map((d) => d.id));
  const seen = new Set();
  for (const items of Object.values(inventory)) {
    for (const item of items) {
      assert.ok(pages.has(item.href), item.href);
      assert.ok(!seen.has(item.href), `duplicate ${item.href}`);
      seen.add(item.href);
      assert.ok(item.line, item.href);
      assert.ok(item.dims.length >= 1 && item.dims.length <= 2 && item.dims.every((d) => ids.has(d)), item.href);
    }
  }
  assert.equal(seen.size, pages.size);
});
