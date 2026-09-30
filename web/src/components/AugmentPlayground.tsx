"use client";

import Image from "next/image";
import { useState } from "react";

type Img = { src: string };

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="w-24 shrink-0">{label}</span>
      <input
        type="range"
        min={-20}
        max={20}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-amber"
      />
      <span className="w-12 text-right font-mono tabular-nums text-ink-soft">
        {value > 0 ? "+" : ""}
        {value}%
      </span>
    </label>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      aria-pressed={on}
      className={`rounded-full border px-4 py-1.5 text-sm transition ${on ? "border-flow-line bg-flow font-bold" : "border-rule bg-card text-ink-soft hover:text-ink"}`}
    >
      {label}
    </button>
  );
}

export function AugmentPlayground({ image }: { image: Img }) {
  const [flip, setFlip] = useState(false);
  const [gray, setGray] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);

  return (
    <figure className="rounded-lg border border-rule bg-card p-4 sm:p-5">
      <div className="relative aspect-[640/178] overflow-hidden rounded-md bg-room">
        <Image
          src={image.src}
          alt="Our esotropia training photo with your augmentation settings applied"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition duration-300"
          style={{
            transform: flip ? "scaleX(-1)" : undefined,
            filter: `brightness(${1 + brightness / 100}) contrast(${1 + contrast / 100}) grayscale(${gray ? 1 : 0})`,
          }}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Toggle label="Flip" on={flip} onChange={setFlip} />
        <Toggle label="Grayscale" on={gray} onChange={setGray} />
        <button
          onClick={() => {
            setFlip(false);
            setGray(false);
            setBrightness(0);
            setContrast(0);
          }}
          className="ml-auto text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
        >
          Reset
        </button>
      </div>
      <div className="mt-4 space-y-3">
        <Slider label="Brightness" value={brightness} onChange={setBrightness} />
        <Slider label="Contrast" value={contrast} onChange={setContrast} />
      </div>
      <figcaption className="mt-4 text-xs leading-relaxed text-ink-soft">
        A preview in your browser, within the same ±20% limits the paper used. The real versions below were made with the
        albumentations library.
      </figcaption>
    </figure>
  );
}
