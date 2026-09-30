import Image from "next/image";
import type { ReactNode } from "react";

type Img = { src: string; width?: number; height?: number };

export function ThreadCard({ image, stage, children }: { image: Img; stage: string; children: ReactNode }) {
  return (
    <aside className="grid items-center gap-5 rounded-lg border-[1.5px] border-flow-line bg-flow p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:p-4">
      <div className="relative overflow-hidden rounded-md bg-room" style={{ aspectRatio: `${image.width ?? 640} / ${image.height ?? 178}` }}>
        <Image src={image.src} alt={`Our esotropia photo, ${stage.toLowerCase()}`} fill sizes="(min-width: 640px) 40vw, 90vw" className="object-cover" />
      </div>
      <div className="px-1 pb-1 sm:px-0 sm:pb-0">
        <p className="eyebrow flex items-center gap-2 text-amber-ink">
          <span className="size-2 rounded-full bg-amber" /> Our photo · {stage}
        </p>
        <p className="mt-2 text-sm leading-relaxed">{children}</p>
      </div>
    </aside>
  );
}
