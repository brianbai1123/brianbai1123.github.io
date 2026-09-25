"use client";

import { useEffect, useMemo, useState } from "react";
import room from "@/data/room.json";

type Book = (typeof room.books)[number];
type Entry = (typeof room.entries)[number];

const SHELVES = ["导读", "经文卡片", "索引"] as const;
const LAST_KEY = "reading-room:last";

type LastRead = { href: string; title: string; at: number };

export function Hall() {
  const [query, setQuery] = useState("");
  const [last, setLast] = useState<LastRead | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(LAST_KEY);
        if (raw) setLast(JSON.parse(raw) as LastRead);
      } catch {
        setLast(null);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return room.entries.filter((entry) => {
      const book = room.books.find((item) => item.id === entry.book);
      const blob = `${entry.title} ${entry.blurb} ${book?.title ?? ""} ${book?.author ?? ""}`.toLowerCase();
      return blob.includes(q);
    }).slice(0, 24);
  }, [query]);

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="text-sm font-semibold text-clay">六本书，三种读法</p>
      <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">藏书室</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed">
        导读按原书一站一站走，经文做成可以背的卡片，历久把两边都出现过的道理收成索引。从这里进任何一本，读到的位置会留在这台浏览器里。
      </p>

      <label className="mt-8 block">
        <span className="text-sm font-semibold text-muted">在六本书里找</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="例如：要事第一、始计、乾、可控"
          className="mt-2 w-full border border-line bg-paper px-4 py-3 text-base outline-none focus:border-pine"
        />
      </label>

      {query.trim() ? (
        <section className="mt-6" aria-live="polite">
          {results.length === 0 ? (
            <p className="text-muted">没有对上的篇目。换一个书里出现过的词，比如「合作」或「谦」。</p>
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {results.map((entry) => (
                <li key={entry.href}>
                  <Result entry={entry} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {last ? (
        <p className="mt-6 text-sm">
          <a className="font-semibold text-pine underline-offset-4 hover:underline" href={last.href}>
            继续读：{last.title}
          </a>
        </p>
      ) : (
        <p className="mt-6 text-sm text-muted">还没有续读记录。打开任意一章之后，回到这里就能接着走。</p>
      )}

      <div className="mt-12 space-y-12">
        {SHELVES.map((shelf) => (
          <section key={shelf} aria-labelledby={`shelf-${shelf}`}>
            <h2 id={`shelf-${shelf}`} className="font-serif text-2xl text-ink">
              {shelf}
            </h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {room.books
                .filter((book) => book.shelf === shelf)
                .map((book) => (
                  <li key={book.id}>
                    <a
                      href={book.href}
                      className="block h-full border border-line bg-paper p-5 hover:border-pine"
                    >
                      <span className="block h-1.5 w-10" style={{ background: book.accent }} />
                      <span className="mt-4 block font-serif text-2xl text-ink">{book.title}</span>
                      <span className="mt-1 block text-sm text-muted">{book.author}</span>
                      <span className="mt-3 block leading-relaxed">{book.blurb}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="mt-16 text-sm leading-relaxed text-muted">
        各书仍是独立导读或读书卡，不替代原书。在某一页底下出现的「这条在别处」，是同一件事在另一本书里的位置。
      </footer>
    </main>
  );
}

function Result({ entry }: { entry: Entry }) {
  const book = room.books.find((item) => item.id === entry.book) as Book;
  return (
    <a href={entry.href} className="block py-3 hover:bg-band/50">
      <span className="text-xs font-semibold text-clay">{book.title}</span>
      <span className="mt-1 block font-semibold text-ink">{entry.title}</span>
      {entry.blurb ? <span className="mt-1 block text-sm text-muted">{entry.blurb}</span> : null}
    </a>
  );
}
