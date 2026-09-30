import type { ClassName } from "@/content/site";

const ALMOND = "M-120 0C-70-80 70-80 120 0C70 72-70 72-120 0Z";

const POSES = [
  { name: "Normal", note: "both reflections sit centred" },
  { name: "Esotropia", note: "one eye turns in, toward the nose" },
  { name: "Exotropia", note: "one eye turns out, toward the ear" },
  { name: "Hypertropia", note: "one eye turns up" },
  { name: "Hypotropia", note: "one eye turns down" },
];

export const POSE_OFFSET: Record<ClassName, [number, number]> = {
  NORMAL: [0, 0],
  ESOTROPIA: [-24, 0],
  EXOTROPIA: [24, 0],
  HYPERTROPIA: [0, -17],
  HYPOTROPIA: [0, 17],
};

function Eye({ uid, x, animated, offset }: { uid: string; x: number; animated?: boolean; offset?: [number, number] }) {
  const clip = `${uid}-clip-${x}`;
  return (
    <g transform={`translate(${x} 120)`}>
      <clipPath id={clip}>
        <path d={ALMOND} />
      </clipPath>
      <path d="M-104-50C-56-100 56-100 104-50" stroke="#fff3d1" strokeOpacity={0.14} strokeWidth={1.5} fill="none" />
      <g clipPath={`url(#${clip})`}>
        <path d={ALMOND} fill={`url(#${uid}-sclera)`} />
        <g className={animated ? "hero-iris" : undefined} transform={offset ? `translate(${offset[0]} ${offset[1]})` : undefined}>
          <circle r="50" fill={`url(#${uid}-iris)`} />
          <circle r="35" fill="none" stroke="#6b420c" strokeOpacity={0.35} strokeWidth={14} strokeDasharray="1.2 3.4" />
          <circle r="49" fill="none" stroke="#2c1a05" strokeWidth={3.5} />
          <circle r="19" fill="#070b12" />
        </g>
        <path d="M-120-80H120V-6C70-58-70-58-120-6Z" fill="#0e1726" fillOpacity={0.22} />
        {animated && <rect className="hero-lid" x="-130" y="-250" width="260" height="170" fill="#0e1726" />}
      </g>
      <path d={ALMOND} fill="none" stroke="#fff3d1" strokeOpacity={0.3} strokeWidth={1.5} />
      <circle cx="-5" cy="-7" r="7" fill="#fff3d1" filter={`url(#${uid}-glow)`} />
      {(animated || offset) && (
        <g className={animated ? "hero-tick" : undefined} stroke="#e9a94b" strokeWidth={2.5} strokeLinecap="round">
          <path d="M0-92v12M0 80v12M-146 0h12M134 0h12" />
        </g>
      )}
    </g>
  );
}

function Defs({ uid }: { uid: string }) {
  return (
    <defs>
      <radialGradient id={`${uid}-sclera`} cx="50%" cy="45%" r="60%">
        <stop offset="0%" stopColor="#fffdf6" />
        <stop offset="70%" stopColor="#ece5d6" />
        <stop offset="100%" stopColor="#b9ae9a" />
      </radialGradient>
      <radialGradient id={`${uid}-iris`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f4c877" />
        <stop offset="45%" stopColor="#c8841f" />
        <stop offset="100%" stopColor="#5e3a0a" />
      </radialGradient>
      <filter id={`${uid}-glow`} x="-200%" y="-200%" width="500%" height="500%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

export function PosedEyes({ cls, className }: { cls: ClassName; className?: string }) {
  const uid = `pose-${cls.toLowerCase()}`;
  return (
    <svg viewBox="0 0 640 240" className={className} role="img" aria-label={`Illustration of ${cls.toLowerCase()} eye alignment`}>
      <Defs uid={uid} />
      <Eye uid={uid} x={180} />
      <Eye uid={uid} x={460} offset={cls === "NORMAL" ? undefined : POSE_OFFSET[cls]} />
    </svg>
  );
}

export function HeroEyes() {
  return (
    <figure className="w-full bg-[radial-gradient(ellipse_at_center,rgba(255,243,209,0.13)_0%,rgba(255,243,209,0.04)_45%,transparent_70%)]">
      <svg viewBox="0 0 640 240" className="h-auto w-full" role="img" aria-labelledby="hero-eyes-title">
        <title id="hero-eyes-title">
          Two eyes under a penlight. One eye drifts in, out, up and down in turn, showing the four forms of strabismus.
        </title>
        <Defs uid="hero" />
        <Eye uid="hero" x={180} />
        <Eye uid="hero" x={460} animated />
      </svg>
      <figcaption className="relative mt-4 h-12 text-center sm:h-7">
        {POSES.map((pose, i) => (
          <span
            key={pose.name}
            className="hero-label absolute inset-x-0 top-0 px-2 font-mono text-sm tracking-wide text-penlight/90"
            style={{ animationDelay: `${i * 3.2}s` }}
          >
            <span className="mr-2 inline-block size-2 translate-y-[-1px] rounded-full bg-amber-glow align-middle" />
            <span className="uppercase tracking-[0.14em]">{pose.name}</span>
            <span className="text-penlight/60"> — {pose.note}</span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
