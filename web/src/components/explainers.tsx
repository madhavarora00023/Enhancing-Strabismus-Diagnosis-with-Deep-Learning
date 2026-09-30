import Image from "next/image";

type Img = { src: string; width: number; height: number };

function FaceEye({ x, turn = 0 }: { x: number; turn?: number }) {
  return (
    <g transform={`translate(${x} 185)`}>
      <path d="M-34 0C-18-20 18-20 34 0C18 17-18 17-34 0Z" fill="#ece5d6" />
      <circle cx={turn} r="11" fill="#c8841f" />
      <circle cx={turn} r="4.5" fill="#070b12" />
      <circle cx={-2} cy={-3} r="2" fill="#fff3d1" />
      <path d="M-34 0C-18-20 18-20 34 0" stroke="#fff3d1" strokeOpacity={0.5} strokeWidth={1.5} fill="none" />
    </g>
  );
}

export function CropToEyes() {
  return (
    <figure className="overflow-hidden rounded-lg bg-room">
      <svg viewBox="0 0 400 420" className="h-auto w-full" role="img" aria-label="A face illustration. A crop box closes in on the eyes, the rest of the face dims, and the crop is labelled Esotropia.">
        <path d="M70 150C70 40 330 40 330 150" stroke="#fff3d1" strokeOpacity={0.25} strokeWidth={2} fill="none" />
        <ellipse cx="200" cy="215" rx="135" ry="178" fill="#17243a" stroke="#fff3d1" strokeOpacity={0.35} strokeWidth={1.5} />
        <path d="M118 150c14-9 38-9 54 0M228 150c16-9 40-9 54 0" stroke="#fff3d1" strokeOpacity={0.55} strokeWidth={3} strokeLinecap="round" fill="none" />
        <FaceEye x={150} />
        <FaceEye x={250} turn={-9} />
        <path d="M200 205c-4 22-12 40-14 52 6 5 22 5 28 0" stroke="#fff3d1" strokeOpacity={0.4} strokeWidth={1.8} strokeLinecap="round" fill="none" />
        <path d="M166 318c20 13 48 13 68 0" stroke="#fff3d1" strokeOpacity={0.5} strokeWidth={2} strokeLinecap="round" fill="none" />
        <path className="crop-dim" d="M0 0H400V420H0ZM98 160V210H302V160Z" fillRule="evenodd" fill="#0e1726" />
        <rect className="crop-box" x="98" y="160" width="204" height="50" rx="2" fill="none" stroke="#e9a94b" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
        <g className="crop-label">
          <rect x="98" y="134" width="94" height="22" rx="3" fill="#e9a94b" />
          <text x="107" y="149.5" fill="#0e1726" className="font-mono text-[12px] font-bold">
            Esotropia
          </text>
        </g>
      </svg>
    </figure>
  );
}

export function OrientDemo({ image }: { image: Img }) {
  return (
    <figure className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg bg-room">
      <div aria-hidden="true" className="absolute inset-x-6 top-1/2 h-px bg-penlight/25" />
      <div aria-hidden="true" className="absolute inset-y-6 left-1/2 w-px bg-penlight/15" />
      <div className="orient-turn relative w-[78%]" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
        <Image src={image.src} alt="An eye photo being turned upright" loading="eager" fill sizes="(min-width: 1024px) 40vw, 80vw" className="rounded object-cover shadow-2xl" />
      </div>
      <figcaption className="eyebrow absolute bottom-3 left-4 text-penlight/60">Straightened to a common orientation</figcaption>
    </figure>
  );
}

export function ResizeDemo({ image }: { image: Img }) {
  return (
    <figure className="rounded-lg border border-rule bg-card p-4 sm:p-6">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:w-[58%]">
          <div className="relative w-full" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
            <Image src={image.src} alt="The original photo at its own size" fill sizes="(min-width: 1024px) 30vw, 90vw" className="rounded object-cover" />
          </div>
          <p className="mt-2 font-mono text-xs text-ink-soft">
            Original · {image.width} × {image.height} px, and every photo differs
          </p>
        </div>
        <span aria-hidden="true" className="font-mono text-2xl text-ink-soft sm:pb-10">→</span>
        <div className="w-40 shrink-0 sm:w-[30%]">
          <div className="relative aspect-square w-full overflow-hidden rounded border border-flow-line">
            <Image src={image.src} alt="The same photo resized to 227 by 227 pixels" fill sizes="200px" className="object-fill" />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(20,35,58,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,35,58,0.18) 1px, transparent 1px)",
                backgroundSize: "10% 10%",
              }}
            />
          </div>
          <p className="mt-2 font-mono text-xs text-ink">227 × 227 px, for every photo</p>
        </div>
      </div>
    </figure>
  );
}
