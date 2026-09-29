import room from "@/data/room.json";
import {
  candidates,
  dimensions,
  principles,
  type BookId,
  type Principle,
} from "@/content/principles";
import { inventory } from "@/content/inventory";
import { LastRead } from "@/components/last-read";
import { PreviewDialog } from "@/components/preview-dialog";
import { ThemeSwitcher } from "@/components/theme-switcher";

const SHELVES = [
  { name: "导读", note: "按原书一站一站走，每站读两遍" },
  { name: "经文卡片", note: "原文、白话、名家对比，可以背" },
  { name: "索引", note: "扛住了时间的原则，写明失效边界" },
] as const;

const SHORT: Record<BookId, string> = {
  "7habit": "七习惯",
  ruiprincipal: "原则",
  ep: "进化",
  sunzi: "孙子",
  zhouyi: "周易",
  lijiu: "历久",
};

const BOOK_IDS: BookId[] = ["7habit", "ruiprincipal", "ep", "sunzi", "zhouyi", "lijiu"];

// The sites' own accents are near-identical dark greens, so the matrix needs its own hues.
const HUE: Record<BookId, string> = {
  "7habit": "#3d7a52",
  ruiprincipal: "#2f5a8a",
  ep: "#3a8a8f",
  sunzi: "#a4472b",
  zhouyi: "#b8872f",
  lijiu: "#8a3558",
};

const bookById = new Map(
  room.books.map((book) => [book.id as BookId, { ...book, accent: HUE[book.id as BookId] }]),
);

const STEPS = ["先理解", "核心观点", "重建逻辑", "简单表达", "检查"] as const;

const entryTitle = new Map(room.entries.map((entry) => [entry.href, entry.title]));

const dimShort = new Map(dimensions.map((d) => [d.id, d.name.slice(0, 2)]));

const citedBy = new Map<string, number[]>();
for (const p of principles) {
  for (const link of p.evidence.flatMap((item) => item.links)) {
    const list = citedBy.get(link.href) ?? [];
    if (!list.includes(p.n)) list.push(p.n);
    citedBy.set(link.href, list);
  }
}

export function PrinciplesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <Masthead />
      <Matrix />
      <div className="mt-16 grid gap-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <Sidebar />
        <main className="min-w-0">
          {dimensions.map((dimension) => {
            const list = principles.filter((p) => p.dimension === dimension.id);
            return (
              <section key={dimension.id} aria-labelledby={`dim-${dimension.id}`} className="mb-16">
                <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-ink/80 pb-2">
                  <h2 id={`dim-${dimension.id}`} className="font-serif text-2xl text-ink">
                    {dimension.name}
                  </h2>
                  <p className="font-kai text-base text-muted">{dimension.question}</p>
                </header>
                <div className="mt-6 space-y-8">
                  {list.map((p) => (
                    <PrincipleCard key={p.n} p={p} />
                  ))}
                </div>
              </section>
            );
          })}
          <Candidates />
        </main>
      </div>
      <References />
      <PreviewDialog />
      <footer className="border-t border-line py-10 font-kai text-base leading-relaxed text-muted">
        这里是读书人自己的归纳，不代表各书作者的观点，也不替代原书。六本书各自仍是独立的导读或读书卡；每条佐证都能点回原来那一页核对。
      </footer>
    </div>
  );
}

function Masthead() {
  const total = room.entries.length;
  return (
    <header className="pt-6 pb-10 sm:pt-8">
      <div className="flex justify-end">
        <ThemeSwitcher />
      </div>
      <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-clay sm:mt-10">六本书读下来，反复出现的道理</p>
      <h1 className="mt-4 font-serif text-5xl font-black leading-tight text-ink sm:text-7xl">
        <span className="block sm:inline">原则、思想、</span>
        <span className="text-pine">知与行</span>
      </h1>
      <p className="mt-6 max-w-2xl font-kai text-xl leading-relaxed text-ink/90">
        把七个习惯、原则、进化心理学、孙子兵法、周易和历久放在一起读，只留下至少三本书各自独立说过的道理。每一条都按五步讲：先理解，找出核心，重建逻辑，用大白话说一遍，最后留一道自检题。
      </p>
      <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
        {[
          ["6", "本书"],
          [String(total), "个条目读过"],
          [String(principles.length), "条共同原则"],
          [String(dimensions.length), "个维度"],
        ].map(([value, label]) => (
          <div key={label} className="bg-paper px-4 py-4">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="font-num mt-1 text-4xl font-semibold leading-none text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}

function supportOf(p: Principle) {
  return new Set(p.evidence.map((item) => item.book));
}

function Matrix() {
  return (
    <section aria-labelledby="matrix-title" className="rounded-2xl border border-line bg-paper p-5 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="matrix-title" className="font-serif text-2xl text-ink">
            十二条原则，各由哪几本书撑住
          </h2>
          <p className="mt-1 text-sm text-muted">
            从上往下，是从「看清」走到「做成」、再走到「知止」。点一行，跳到那条原则。
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {BOOK_IDS.map((id) => (
            <li key={id} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: bookById.get(id)?.accent }} />
              {bookById.get(id)?.title}
            </li>
          ))}
        </ul>
      </div>

      <ol className="mt-5 divide-y divide-line border-y border-line sm:hidden">
        {principles.map((p) => {
          const support = supportOf(p);
          return (
            <li key={p.n}>
              <a href={`#p-${p.n}`} className="block py-3">
                <span className="flex items-baseline gap-2">
                  <span className="font-num w-5 shrink-0 text-base font-semibold italic text-muted">{p.n}</span>
                  <span className="font-semibold text-ink">{p.title}</span>
                </span>
                <span className="mt-1.5 flex items-center gap-1.5 pl-7">
                  {BOOK_IDS.map((id) => (
                    <span
                      key={id}
                      className={`size-3 rounded-full ${support.has(id) ? "" : "border border-line"}`}
                      style={support.has(id) ? { background: bookById.get(id)?.accent } : undefined}
                    />
                  ))}
                  <span className="ml-1 text-xs text-muted">
                    {dimensions.find((d) => d.id === p.dimension)?.name} · {support.size} 本
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 hidden sm:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="text-xs text-muted">
              <th scope="col" className="w-28 pb-3 font-semibold">维度</th>
              <th scope="col" className="pb-3 font-semibold">原则</th>
              {BOOK_IDS.map((id) => (
                <th key={id} scope="col" className="w-14 pb-3 text-center font-semibold">
                  {SHORT[id]}
                </th>
              ))}
              <th scope="col" className="w-14 pb-3 text-right font-semibold">几本</th>
            </tr>
          </thead>
          <tbody>
            {dimensions.map((dimension) => {
              const list = principles.filter((p) => p.dimension === dimension.id);
              return list.map((p, index) => {
                const support = supportOf(p);
                return (
                  <tr key={p.n} className="group border-t border-line">
                    {index === 0 ? (
                      <th
                        scope="rowgroup"
                        rowSpan={list.length}
                        className="py-2.5 pr-3 align-top text-xs font-semibold text-clay"
                      >
                        {dimension.name}
                      </th>
                    ) : null}
                    <td className="py-2.5 pr-3">
                      <a href={`#p-${p.n}`} className="flex items-baseline gap-2 text-ink group-hover:text-pine">
                        <span className="font-num w-5 shrink-0 text-base font-semibold italic text-muted">{p.n}</span>
                        <span className="font-semibold">{p.title}</span>
                      </a>
                    </td>
                    {BOOK_IDS.map((id) => (
                      <td key={id} className="py-2.5 text-center">
                        {support.has(id) ? (
                          <span
                            className="inline-block size-3.5 rounded-full"
                            style={{ background: bookById.get(id)?.accent }}
                            title={`${bookById.get(id)?.title} 支持`}
                          />
                        ) : (
                          <span className="inline-block size-3.5 rounded-full border border-line" aria-label="无" />
                        )}
                      </td>
                    ))}
                    <td className="font-num py-2.5 text-right text-lg font-semibold text-ink">{support.size}</td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Sidebar() {
  return (
    <nav aria-label="原则目录" className="hidden lg:block">
      <div className="sticky top-8 space-y-5 text-sm">
        {dimensions.map((dimension) => (
          <div key={dimension.id}>
            <p className="text-xs font-semibold text-clay">{dimension.name}</p>
            <ul className="mt-1.5 space-y-1">
              {principles
                .filter((p) => p.dimension === dimension.id)
                .map((p) => (
                  <li key={p.n}>
                    <a href={`#p-${p.n}`} className="flex gap-2 leading-snug text-muted hover:text-pine">
                      <span className="font-num w-4 shrink-0 text-base italic">{p.n}</span>
                      <span>{p.title}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <div className="space-y-1 border-t border-line pt-4">
          <a href="#candidates" className="block text-muted hover:text-pine">还在观察的候选</a>
          <a href="#references" className="block text-muted hover:text-pine">参考：六本书</a>
        </div>
      </div>
    </nav>
  );
}

function Step({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-4">
      <p className="flex items-baseline gap-1.5 text-xs font-semibold tracking-wider text-clay">
        <span className="font-num text-lg italic leading-none">{index + 1}</span>
        {STEPS[index]}
      </p>
      <div>{children}</div>
    </div>
  );
}

function PrincipleCard({ p }: { p: Principle }) {
  return (
    <article id={`p-${p.n}`} className="scroll-mt-6 rounded-2xl border border-line bg-paper p-5 sm:p-8">
      <header className="flex items-start gap-4">
        <span className="font-num text-6xl font-semibold italic leading-none text-pine/30 sm:text-7xl">{p.n}</span>
        <div className="min-w-0">
          <h3 className="font-serif text-2xl font-bold leading-snug text-ink sm:text-3xl">{p.title}</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {p.evidence.map((item) => (
              <li
                key={item.book}
                className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                style={{ background: bookById.get(item.book)?.accent }}
              >
                {bookById.get(item.book)?.title}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="mt-7 space-y-6">
        <Step index={0}>
          <p>{p.understand}</p>
        </Step>
        <Step index={1}>
          <p className="border-l-4 border-pine pl-4 font-kai text-2xl leading-relaxed text-ink">{p.core}</p>
        </Step>
        <Step index={2}>
          <ol className="space-y-2">
            {p.logic.map((line, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-clay" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 rounded-lg bg-band/70 px-4 py-2.5 text-sm">
            <span className="font-semibold text-clay">边界　</span>
            {p.limits}
          </p>
        </Step>
        <Step index={3}>
          <p className="rounded-xl bg-pine px-5 py-4 font-kai text-lg leading-relaxed text-on-pine">{p.plain}</p>
        </Step>
        <Step index={4}>
          <p className="font-kai text-lg text-ink">{p.check}</p>
        </Step>
      </div>

      <details className="group mt-7 border-t border-line pt-4">
        <summary className="cursor-pointer list-none text-sm font-semibold text-pine marker:hidden">
          <span className="group-open:hidden">看佐证：{p.evidence.length} 本书在哪一页说过 ↓</span>
          <span className="hidden group-open:inline">收起佐证 ↑</span>
        </summary>
        <ul className="mt-4 divide-y divide-line">
          {p.evidence.map((item) => (
            <li key={item.book} className="grid gap-1 py-3 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="size-2.5 rounded-full" style={{ background: bookById.get(item.book)?.accent }} />
                {bookById.get(item.book)?.title}
              </p>
              <div className="text-sm">
                <p className="flex flex-wrap gap-x-3">
                  {item.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      data-preview=""
                      data-preview-title={link.label}
                      data-preview-book={bookById.get(item.book)?.title}
                      className="font-semibold text-pine underline decoration-line underline-offset-4 hover:decoration-pine"
                    >
                      {link.label}
                    </a>
                  ))}
                </p>
                <p className="mt-0.5 text-muted">{item.angle}</p>
              </div>
            </li>
          ))}
        </ul>
      </details>
    </article>
  );
}

function Candidates() {
  return (
    <section id="candidates" aria-labelledby="candidates-title" className="scroll-mt-6">
      <header className="border-b border-ink/80 pb-2">
        <h2 id="candidates-title" className="font-serif text-2xl text-ink">还在观察的候选</h2>
        <p className="mt-1 text-sm text-muted">只有两本书支持，还不算共同原则。以后读到第三本的佐证，再升格。</p>
      </header>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {candidates.map((candidate) => (
          <li key={candidate.title} className="rounded-xl border border-dashed border-line p-4">
            <p className="font-kai text-lg leading-snug text-ink">{candidate.title}</p>
            <ul className="mt-2 space-y-1 text-sm">
              {candidate.links.map((link) => (
                <li key={link.href} className="flex items-baseline gap-2">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: bookById.get(link.book)?.accent }}
                  />
                  <a href={link.href} className="text-pine hover:underline">
                    {bookById.get(link.book)?.title} · {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

function References() {
  return (
    <section
      id="references"
      aria-labelledby="references-title"
      className="mt-8 scroll-mt-6 rounded-2xl bg-band/60 px-5 py-10 sm:px-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="references-title" className="font-serif text-2xl text-ink">参考：六本书</h2>
          <p className="mt-1 text-sm text-muted">
            上面每一条佐证都出自这里。每本书的条目都能展开：一句话概括、所属维度，以及被哪几条原则引用。点条目名在这一页弹窗里看原文；点右上角的路径，打开原来的网站。
          </p>
        </div>
        <LastRead />
      </div>
      <div className="mt-8 space-y-8">
        {SHELVES.map((shelf) => {
          const books = room.books.filter((book) => book.shelf === shelf.name);
          return (
            <div key={shelf.name}>
              <p className="text-sm">
                <span className="font-semibold text-ink">
                  {shelf.name} {books.length}
                </span>
                <span className="font-kai text-base text-muted">　{shelf.note}</span>
              </p>
              <ul className="mt-3 space-y-3">
                {books.map((book) => (
                  <li key={book.id}>
                    <BookReference id={book.id as BookId} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        <div>
          <p className="text-sm">
            <span className="font-semibold text-ink">杂说 1</span>
            <span className="font-kai text-base text-muted">　不在十二条佐证里，另外备读</span>
          </p>
          <ul className="mt-3 space-y-3">
            <li>
              <CaigentanReference />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

const CAIGENTAN = {
  title: "菜根谭",
  author: "洪应明",
  href: "https://brianbai1123.github.io/cgt/",
  accent: "#5a6b3a",
  blurb: "清刻本五百三十四则，先读原文，再按五步讲开：先理解、找核心、重建逻辑、白话说、自检。",
  parts: [
    { name: "修身", from: 1, to: 30, line: "先管好自己：守得住本心，才谈得上处世。" },
    { name: "应酬", from: 31, to: 81, line: "与人相处：宽一分待人，留一步给己。" },
    { name: "评议", from: 82, to: 130, line: "看人论事：不被表面的得失荣辱带着走。" },
    { name: "闲适", from: 131, to: 176, line: "闲处安顿：山林花鸟里养出一份从容。" },
    { name: "概论", from: 177, to: 534, line: "综合总说：修身、处世、观物的道理合在一处。" },
  ],
};

function CaigentanReference() {
  const book = CAIGENTAN;
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-paper">
      <div className="flex gap-4 p-4">
        <span className="w-1.5 shrink-0 rounded-full" style={{ background: book.accent }} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p>
              <span className="font-serif text-xl font-bold text-ink">{book.title}</span>
              <span className="ml-2 text-xs text-muted">{book.author}</span>
            </p>
            <a href={book.href} className="text-sm font-semibold text-pine hover:underline">
              {book.href.replace("https://brianbai1123.github.io", "")} →
            </a>
          </div>
          <p className="mt-1 font-kai text-base leading-relaxed">{book.blurb}</p>
        </div>
      </div>
      <details className="group border-t border-line">
        <summary className="cursor-pointer list-none px-4 py-2.5 text-sm font-semibold text-pine marker:hidden hover:bg-band/40">
          <span className="group-open:hidden">展开 {book.parts.length} 部：一句话与则数 ↓</span>
          <span className="hidden group-open:inline">收起 ↑</span>
        </summary>
        <ol className="divide-y divide-line border-t border-line">
          {book.parts.map((part) => {
            const href = `${book.href}${part.from}/`;
            return (
              <li
                key={part.name}
                className="grid gap-x-4 gap-y-1 px-4 py-2.5 text-sm sm:grid-cols-[10rem_minmax(0,1fr)_13rem]"
              >
                <a
                  href={href}
                  data-preview=""
                  data-preview-title={part.name}
                  data-preview-book={book.title}
                  className="font-semibold text-ink hover:text-pine"
                >
                  {part.name}
                </a>
                <p>{part.line}</p>
                <p className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                  <span className="rounded bg-band px-1.5 text-xs text-clay">
                    第{part.from}–{part.to}则
                  </span>
                  <span className="text-xs text-muted">共{part.to - part.from + 1}则</span>
                </p>
              </li>
            );
          })}
        </ol>
      </details>
    </div>
  );
}

const UNIT: Record<BookId, string> = {
  "7habit": "站",
  ruiprincipal: "站",
  ep: "站",
  sunzi: "篇",
  zhouyi: "卦",
  lijiu: "条",
};

function itemLabel(id: BookId, href: string) {
  const title = entryTitle.get(href) ?? href;
  if (id === "sunzi" || id === "zhouyi") return `${href.split("/").pop()} ${title}`;
  return title;
}

function BookReference({ id }: { id: BookId }) {
  const book = bookById.get(id)!;
  const items = inventory[id];
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-paper">
      <div className="flex gap-4 p-4">
        <span className="w-1.5 shrink-0 rounded-full" style={{ background: book.accent }} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p>
              <span className="font-serif text-xl font-bold text-ink">{book.title}</span>
              <span className="ml-2 text-xs text-muted">{book.author}</span>
            </p>
            <a href={book.href} className="text-sm font-semibold text-pine hover:underline">
              {book.href.replace("https://brianbai1123.github.io", "")} →
            </a>
          </div>
          <p className="mt-1 font-kai text-base leading-relaxed">{book.blurb}</p>
        </div>
      </div>
      <details className="group border-t border-line">
        <summary className="cursor-pointer list-none px-4 py-2.5 text-sm font-semibold text-pine marker:hidden hover:bg-band/40">
          <span className="group-open:hidden">
            展开 {items.length} {UNIT[id]}：一句话与维度 ↓
          </span>
          <span className="hidden group-open:inline">收起 ↑</span>
        </summary>
        <ol className="divide-y divide-line border-t border-line">
          {items.map((item) => {
            const cited = citedBy.get(item.href);
            return (
              <li
                key={item.href}
                className="grid gap-x-4 gap-y-1 px-4 py-2.5 text-sm sm:grid-cols-[10rem_minmax(0,1fr)_13rem]"
              >
                <a
                  href={item.href}
                  data-preview=""
                  data-preview-title={itemLabel(id, item.href)}
                  data-preview-book={book.title}
                  className="font-semibold text-ink hover:text-pine"
                >
                  {itemLabel(id, item.href)}
                </a>
                <p>{item.line}</p>
                <p className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                  <span className="rounded bg-band px-1.5 text-xs text-clay">{dimShort.get(item.dims[0])}</span>
                  {item.dims[1] ? (
                    <span className="text-xs text-muted">次：{dimShort.get(item.dims[1])}</span>
                  ) : null}
                  {cited?.map((n) => (
                    <a
                      key={n}
                      href={`#p-${n}`}
                      title={principles[n - 1].title}
                      className="rounded-full border border-pine/40 px-1.5 text-xs text-pine hover:bg-pine hover:text-on-pine"
                    >
                      第{n}条
                    </a>
                  ))}
                </p>
              </li>
            );
          })}
        </ol>
      </details>
    </div>
  );
}
