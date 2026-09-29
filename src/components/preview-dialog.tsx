"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type Preview = { href: string; title: string; book: string };

/** Opens any `a[data-preview]` on this page in a dialog instead of navigating away. */
export function PreviewDialog() {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[data-preview]");
      if (!link) return;
      event.preventDefault();
      setLoaded(false);
      setPreview({
        href: link.href,
        title: link.dataset.previewTitle ?? link.textContent ?? "",
        book: link.dataset.previewBook ?? "",
      });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <Dialog open={preview !== null} onOpenChange={(open) => !open && setPreview(null)}>
      <DialogContent className="flex h-[90dvh] w-[calc(100%-1rem)] max-w-5xl flex-col gap-0 overflow-hidden rounded-2xl border-line bg-paper p-0 sm:max-w-5xl">
        {preview ? (
          <>
            <div className="flex items-center gap-3 border-b border-line py-3 pr-12 pl-5">
              <div className="min-w-0 flex-1">
                <DialogDescription className="text-xs text-clay">{preview.book}</DialogDescription>
                <DialogTitle className="mt-1 truncate font-serif text-xl text-ink">{preview.title}</DialogTitle>
              </div>
              <a
                href={preview.href}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-pine hover:border-pine"
              >
                新页面打开 ↗
              </a>
            </div>
            <div className="relative flex-1 bg-background">
              {!loaded ? (
                <p className="absolute inset-0 flex items-center justify-center text-sm text-muted">
                  正在打开《{preview.book}》的这一页…
                </p>
              ) : null}
              <iframe
                key={preview.href}
                src={preview.href}
                title={`${preview.book} · ${preview.title}`}
                onLoad={(event) => {
                  setLoaded(true);
                  // Focus moves into the frame, so Escape never reaches the dialog unless we listen there too.
                  try {
                    event.currentTarget.contentWindow?.addEventListener("keydown", (key) => {
                      if (key.key === "Escape") setPreview(null);
                    });
                  } catch {
                    /* cross-origin frame: the close button still works */
                  }
                }}
                className={`absolute inset-0 size-full border-0 transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
