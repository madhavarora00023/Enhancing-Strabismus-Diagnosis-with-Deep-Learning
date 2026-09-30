"use client";

import Image from "next/image";
import { useState } from "react";
import { CLASS_INFO, type ClassName } from "@/content/site";

type Img = { src: string; width: number; height: number };
type Pair = { cls: string; raw: Img; denoised: Img };

export function BeforeAfter({ pairs }: { pairs: Pair[] }) {
  const [index, setIndex] = useState(0);
  const [split, setSplit] = useState(50);
  const [zoom, setZoom] = useState(false);
  const pair = pairs[index];
  const layer = `absolute inset-0 h-full w-full object-cover transition-transform duration-500 ${zoom ? "scale-[2.6]" : ""}`;

  return (
    <figure>
      <div className="mb-3 flex flex-wrap items-center gap-2" role="group" aria-label="Choose a photo">
        {pairs.map((p, i) => (
          <button
            key={p.raw.src}
            onClick={() => setIndex(i)}
            aria-pressed={i === index}
            className={`rounded-full border px-3 py-1 text-sm transition ${i === index ? "border-flow-line bg-flow font-bold" : "border-rule bg-card text-ink-soft hover:text-ink"}`}
          >
            {CLASS_INFO[p.cls as ClassName].label}
          </button>
        ))}
        <button
          onClick={() => setZoom((z) => !z)}
          aria-pressed={zoom}
          className="ml-auto rounded-full border border-rule bg-card px-3 py-1 text-sm text-ink-soft transition hover:text-ink"
        >
          {zoom ? "Zoom out" : "Zoom in 2.6×"}
        </button>
      </div>
      <div
        className="relative overflow-hidden rounded-lg border border-rule bg-room"
        style={{ aspectRatio: `${pair.raw.width} / ${pair.raw.height}` }}
      >
        <Image src={pair.denoised.src} alt="The same photo after denoising" fill sizes="(min-width: 1024px) 50vw, 100vw" className={layer} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
          <Image src={pair.raw.src} alt="The original photo" fill sizes="(min-width: 1024px) 50vw, 100vw" className={layer} />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-penlight shadow-[0_0_0_1px_rgba(14,23,38,0.4)]" style={{ left: `${split}%` }} />
        <span className="eyebrow absolute top-2 left-2 rounded bg-room/75 px-2 py-1 text-penlight">Original</span>
        <span className="eyebrow absolute top-2 right-2 rounded bg-room/75 px-2 py-1 text-penlight">Denoised</span>
        <input
          type="range"
          min={0}
          max={100}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          aria-label="Drag to compare the original and denoised photo"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-3 text-sm text-ink-soft">Drag across the photo to compare. Zoom in to see the grain disappear.</figcaption>
    </figure>
  );
}
