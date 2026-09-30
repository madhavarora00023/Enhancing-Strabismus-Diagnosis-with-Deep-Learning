"use client";

import { useEffect, useRef, useState } from "react";
import { CLASSES } from "@/content/site";

type Counts = Record<string, { train: number; val: number; test: number }>;

const GAP = 10;
const BINS = {
  train: { x: 0, cols: 24, label: "Training" },
  val: { x: 270, cols: 8, label: "Validation" },
  test: { x: 380, cols: 8, label: "Test" },
} as const;
const START_COLS = 33;
const START_X = (460 - START_COLS * GAP) / 2;

export function SplitDots({ counts }: { counts: Counts }) {
  const [split, setSplit] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setSplit(true), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const dots: { set: keyof typeof BINS; thread: boolean }[] = [];
  for (const cls of CLASSES) {
    const c = counts[cls];
    for (const set of ["train", "val", "test"] as const) {
      for (let k = 0; k < c[set]; k++) dots.push({ set, thread: cls === "ESOTROPIA" && set === "train" && k === 0 });
    }
  }
  const seen = { train: 0, val: 0, test: 0 };
  const placed = dots.map((d, i) => {
    const n = seen[d.set]++;
    const bin = BINS[d.set];
    return {
      ...d,
      start: [START_X + (i % START_COLS) * GAP, 18 + Math.floor(i / START_COLS) * GAP],
      end: [bin.x + (n % bin.cols) * GAP, 18 + Math.floor(n / bin.cols) * GAP],
      delay: i * 1.3,
    };
  });
  const totals = { train: seen.train, val: seen.val, test: seen.test };

  return (
    <figure ref={ref} className="rounded-lg border border-rule bg-card p-4 sm:p-6">
      <svg viewBox="-8 0 476 214" className="h-auto w-full" role="img" aria-label={`${dots.length} photos split into ${totals.train} training, ${totals.val} validation and ${totals.test} test photos`}>
        {placed.map((d, i) => {
          const [x, y] = split ? d.end : d.start;
          return (
            <circle
              key={i}
              r={d.thread ? 4.4 : 3.2}
              fill={d.thread ? "#c8841f" : "#14233a"}
              fillOpacity={d.thread ? 1 : 0.78}
              stroke={d.thread ? "#ffffff" : "none"}
              strokeWidth={2}
              className="transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
              style={{ transform: `translate(${x}px, ${y}px)`, transitionDelay: `${split ? d.delay : 0}ms` }}
            />
          );
        })}
        {(Object.keys(BINS) as (keyof typeof BINS)[]).map((k) => (
          <text
            key={k}
            x={BINS[k].x - 3}
            y={194}
            className={`fill-ink font-mono text-[11px] transition-opacity duration-500 ${split ? "opacity-100 delay-700" : "opacity-0"}`}
          >
            {BINS[k].label}
            <tspan x={BINS[k].x - 3} dy={15} className="font-bold">
              {totals[k]}
            </tspan>
          </text>
        ))}
        <text x={START_X - 3} y={194} className={`fill-ink font-mono text-[11px] transition-opacity ${split ? "opacity-0" : "opacity-100"}`}>
          {dots.length} photos
        </text>
      </svg>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-ink/80" /> one photo
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-amber ring-2 ring-white" /> our esotropia photo, which lands in training
        </span>
        <button onClick={() => setSplit((s) => !s)} className="ml-auto font-bold text-amber-ink underline-offset-4 hover:underline">
          {split ? "Put them back" : "Split them"}
        </button>
      </figcaption>
    </figure>
  );
}
