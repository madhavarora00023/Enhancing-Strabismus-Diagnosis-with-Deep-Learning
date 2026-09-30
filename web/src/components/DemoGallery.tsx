"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { CLASS_INFO, CLASSES, type ClassName } from "@/content/site";

export type DemoItem = {
  file: string;
  cls: string;
  src: string;
  width: number;
  height: number;
  pred: string;
  probs: number[];
  heatmap: number[][] | null;
};

function Heatmap({ grid }: { grid: number[][] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const small = document.createElement("canvas");
      small.width = grid[0].length;
      small.height = grid.length;
      const sctx = small.getContext("2d")!;
      const img = sctx.createImageData(small.width, small.height);
      grid.flat().forEach((v, i) => {
        img.data.set([233, 169, 75, Math.round(Math.pow(v, 1.6) * 175)], i * 4);
      });
      sctx.putImageData(img, 0, 0);
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(small, 0, 0, canvas.width, canvas.height);
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [grid]);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}

function Status({ correct }: { correct: boolean }) {
  return correct ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-flow px-2.5 py-0.5 text-xs font-bold text-ink">
      <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
        <path d="M2 6.5 5 9l5-6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Correct
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fbeedb] px-2.5 py-0.5 text-xs font-bold text-amber-ink">
      <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
        <path d="M3 3l6 6M9 3 3 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      Wrong
    </span>
  );
}

export function DemoGallery({ items, placeholder }: { items: DemoItem[]; placeholder: boolean }) {
  const [filter, setFilter] = useState<"ALL" | "MISTAKES" | ClassName>("ALL");
  const [selected, setSelected] = useState(items[0].file);
  const [overlay, setOverlay] = useState(true);

  const shown = useMemo(
    () => items.filter((it) => (filter === "ALL" ? true : filter === "MISTAKES" ? it.pred !== it.cls : it.cls === filter)),
    [items, filter],
  );
  const item = items.find((it) => it.file === selected) ?? items[0];
  const correct = item.pred === item.cls;
  const mistakes = items.filter((it) => it.pred !== it.cls).length;

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition ${active ? "border-flow-line bg-flow font-bold" : "border-rule bg-card text-ink-soft hover:text-ink"}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
      <div className="lg:sticky lg:top-20 lg:self-start">
        <div className="relative overflow-hidden rounded-lg bg-room" style={{ aspectRatio: `${item.width} / ${item.height}` }}>
          <Image src={item.src} alt={`Test photo, true class ${CLASS_INFO[item.cls as ClassName].label}`} fill loading="eager" sizes="(min-width: 1024px) 45vw, 95vw" className="object-cover" />
          {overlay && item.heatmap && <Heatmap grid={item.heatmap} />}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={overlay} onChange={(e) => setOverlay(e.target.checked)} className="size-4 accent-amber" />
            Show where the model looked
          </label>
          <span className="flex items-center gap-2 text-xs text-ink-soft">
            less
            <span className="h-2 w-16 rounded-full" style={{ background: "linear-gradient(90deg, rgba(233,169,75,0.05), rgba(233,169,75,0.85))" }} />
            more attention
          </span>
        </div>

        <div className="mt-6 rounded-lg border border-rule bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-soft">
              True class <span className="font-bold text-ink">{CLASS_INFO[item.cls as ClassName].label}</span>
            </p>
            <Status correct={correct} />
          </div>
          <p className="mt-3 font-display text-3xl">
            Predicted: <em>{CLASS_INFO[item.pred as ClassName].label}</em>
          </p>
          <ul className="mt-5 space-y-2" aria-label="Model confidence for each class">
            {CLASSES.map((c, i) => {
              const p = item.probs[i];
              const isPred = c === item.pred;
              return (
                <li key={c} className="flex items-center gap-3 text-sm">
                  <span className={`w-24 shrink-0 text-right ${isPred ? "font-bold" : "text-ink-soft"}`}>
                    {CLASS_INFO[c].label}
                    {c === item.cls && <span className="sr-only"> (true class)</span>}
                  </span>
                  <span className="relative h-4 flex-1">
                    <span className="absolute inset-y-0.5 left-0 rounded-r-[3px]" style={{ width: `${p * 100}%`, background: isPred ? "#c8841f" : "#7f8c9d" }} />
                  </span>
                  <span className="w-12 text-right font-mono tabular-nums">{Math.round(p * 100)}%</span>
                  <span aria-hidden="true" className={`w-8 font-mono text-[0.65rem] ${c === item.cls ? "text-ink" : "text-transparent"}`}>
                    true
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div>
        <div role="group" aria-label="Filter test photos" className="mb-4 flex flex-wrap gap-2">
          <button onClick={() => setFilter("ALL")} aria-pressed={filter === "ALL"} className={chip(filter === "ALL")}>
            All {items.length}
          </button>
          {CLASSES.map((c) => (
            <button key={c} onClick={() => setFilter(c)} aria-pressed={filter === c} className={chip(filter === c)}>
              {CLASS_INFO[c].label}
            </button>
          ))}
          <button onClick={() => setFilter("MISTAKES")} aria-pressed={filter === "MISTAKES"} className={chip(filter === "MISTAKES")}>
            Mistakes {mistakes}
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {shown.map((it) => {
            const ok = it.pred === it.cls;
            const active = it.file === item.file;
            return (
              <li key={it.file}>
                <button
                  onClick={() => setSelected(it.file)}
                  aria-pressed={active}
                  aria-label={`${CLASS_INFO[it.cls as ClassName].label} photo, predicted ${CLASS_INFO[it.pred as ClassName].label}, ${ok ? "correct" : "wrong"}`}
                  className={`relative block w-full overflow-hidden rounded outline-offset-2 transition ${active ? "ring-2 ring-amber ring-offset-2 ring-offset-paper" : "hover:opacity-85"}`}
                >
                  <Image src={it.src} width={it.width} height={it.height} alt="" className="aspect-[18/5] w-full object-cover" />
                  <span
                    aria-hidden="true"
                    className={`absolute top-1 right-1 grid size-4 place-items-center rounded-full text-[0.6rem] font-bold ${ok ? "bg-flow text-ink" : "bg-amber text-white"}`}
                  >
                    {ok ? "✓" : "✕"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {placeholder && (
          <p className="mt-4 text-xs text-ink-soft">Placeholder predictions — see the note at the top of the page.</p>
        )}
      </div>
    </div>
  );
}
