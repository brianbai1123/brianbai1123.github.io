import assert from "node:assert/strict";
import test from "node:test";
import room from "../src/data/room.json" with { type: "json" };

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
