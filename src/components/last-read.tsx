"use client";

import { useEffect, useState } from "react";

const LAST_KEY = "reading-room:last";

type LastRead = { href: string; title: string; at: number };

export function LastRead() {
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

  if (!last) {
    return <p className="text-sm text-muted">打开任意一本书读过之后，这里会记住你读到的位置。</p>;
  }

  return (
    <a
      href={last.href}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-pine hover:border-pine"
    >
      继续读：{last.title}
      <span aria-hidden>→</span>
    </a>
  );
}
