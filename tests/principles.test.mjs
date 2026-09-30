import assert from "node:assert/strict";
import test from "node:test";
import room from "../src/data/room.json" with { type: "json" };
import caigentan from "../src/data/caigentan.json" with { type: "json" };
import sanshiliuji from "../src/data/sanshiliuji.json" with { type: "json" };
import { candidates, dimensions, essayHref, principles } from "../src/content/principles.ts";
import { inventory } from "../src/content/inventory.ts";

const pages = new Set(room.entries.map((entry) => entry.href));
const essayPages = new Set([
  ...caigentan.map((entry) => essayHref("cgt", entry.n)),
  ...sanshiliuji.map((entry) => essayHref("sanshiliuji", entry.n)),
]);

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
    assert.ok(p.understand && p.limits && p.check, `steps ${p.n}`);
  }
});

test("every principle lays out a full causal chain", () => {
  for (const p of principles) {
    assert.ok(p.chain.length >= 7, `chain ${p.n}`);
    assert.equal(p.chain[0].via, undefined, `first link ${p.n}`);
    for (const link of p.chain.slice(1)) {
      assert.ok(link.via, `via ${p.n} ${link.claim}`);
    }
    for (const link of p.chain) {
      assert.ok(link.claim && link.detail.length >= 20, `link ${p.n} ${link.claim}`);
    }
    assert.ok(p.chain.at(-1).claim.startsWith("结果"), `result ${p.n}`);
    assert.ok(p.breaks.length >= 2, `breaks ${p.n}`);
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

test("every evidence link lands on a real page", () => {
  for (const p of principles) {
    for (const item of p.evidence) {
      const known = item.book === "cgt" || item.book === "sanshiliuji" ? essayPages : pages;
      for (const link of item.links) assert.ok(known.has(link.href), link.href);
    }
  }
  for (const link of candidates.flatMap((c) => c.links)) {
    assert.ok(pages.has(link.href), link.href);
  }
});

test("菜根谭 backs every principle; 三十六计 only where it truly corresponds", () => {
  const withJi = [];
  for (const p of principles) {
    const cgt = p.evidence.find((item) => item.book === "cgt");
    assert.ok(cgt && cgt.links.length >= 2 && cgt.links.length <= 3, `cgt ${p.n}`);
    const ji = p.evidence.find((item) => item.book === "sanshiliuji");
    if (ji) withJi.push(p.n);
  }
  assert.deepEqual(withJi, [1, 3, 5, 7, 8, 9, 10, 12]);
  for (const n of [3, 5]) {
    const ji = principles[n - 1].evidence.find((item) => item.book === "sanshiliuji");
    assert.ok(ji.angle.includes("反面"), `reverse ${n}`);
  }
});

test("菜根谭 entry 404 links to /0404/, away from the not-found page", () => {
  assert.equal(essayHref("cgt", 404), "https://brianbai1123.github.io/cgt/0404/");
  assert.equal(essayHref("cgt", 403), "https://brianbai1123.github.io/cgt/403/");
  assert.equal(essayHref("sanshiliuji", 36), "https://brianbai1123.github.io/36/36/");
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
