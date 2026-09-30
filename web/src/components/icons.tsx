import type { ReactElement, ReactNode, SVGProps } from "react";
import type { ClassName } from "@/content/site";

type IconProps = SVGProps<SVGSVGElement>;

function Line({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const CloudDataIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M9.5 22.5H8a5 5 0 0 1-.6-9.96 7 7 0 0 1 13.5-1.6 5 5 0 0 1 4.9 3.8" />
    <ellipse cx="20.5" cy="18" rx="4.5" ry="1.6" />
    <path d="M16 18v6.5c0 .9 2 1.6 4.5 1.6s4.5-.7 4.5-1.6V18" />
    <path d="M16 21.2c0 .9 2 1.6 4.5 1.6s4.5-.7 4.5-1.6" />
  </Line>
);

export const RotateIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M24.5 11.5a10 10 0 1 1-4.3-4.6" />
    <path d="M20.5 3.5v4.2h4.2" />
  </Line>
);

export const ResizeIcon = (p: IconProps) => (
  <Line {...p}>
    <rect x="10" y="10" width="12" height="12" rx="1.5" />
    <path d="M4 4l5 5M4 4v3.5M4 4h3.5M28 4l-5 5M28 4v3.5M28 4h-3.5M4 28l5-5M4 28v-3.5M4 28h3.5M28 28l-5-5M28 28v-3.5M28 28h-3.5" />
  </Line>
);

export const DenoiseIcon = (p: IconProps) => (
  <Line {...p}>
    <rect x="5" y="5" width="22" height="22" rx="2" />
    <path d="M5 16h4l1.5-3 2 6 2-9 2 7 1.5-1H27" strokeWidth={1.3} />
    <path d="M9 24h14" strokeOpacity={0.5} />
  </Line>
);

export const SplitIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M16 4v10M6 14h20M6 14v11M16 14v11M26 14v11" />
    <path d="M3.5 22.5 6 25l2.5-2.5M13.5 22.5 16 25l2.5-2.5M23.5 22.5 26 25l2.5-2.5" />
  </Line>
);

export const FlipIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M13 11 4 22h9zM19 11l9 11h-9z" />
    <path d="M16 6v20" strokeDasharray="2 2.5" />
    <path d="M10.5 7.5a8 8 0 0 1 11 0m0 0-.5-3m.5 3-3 .3" />
  </Line>
);

export const BrightnessIcon = (p: IconProps) => (
  <Line {...p}>
    <path d="M12.5 21.5a6.5 6.5 0 1 1 7 0v2.5h-7z" />
    <path d="M13 27h6M16 3v2.5M7 7l1.8 1.8M25 7l-1.8 1.8M3.5 15.5H6M26 15.5h2.5" />
  </Line>
);

export const ContrastIcon = (p: IconProps) => (
  <Line {...p}>
    <rect x="5" y="5" width="22" height="22" rx="2.5" />
    <path d="M10 11h12M10 16h12M10 21h12" />
    <circle cx="14" cy="11" r="1.8" fill="currentColor" />
    <circle cx="19" cy="16" r="1.8" fill="currentColor" />
    <circle cx="12" cy="21" r="1.8" fill="currentColor" />
  </Line>
);

export const GrayscaleIcon = (p: IconProps) => (
  <Line {...p}>
    <circle cx="16" cy="16" r="10" />
    <path d="M16 6a10 10 0 0 1 0 20z" fill="currentColor" />
  </Line>
);

const node = (x: number, y: number, key: string) => <circle key={key} cx={x} cy={y} r="1.5" fill="currentColor" stroke="none" />;

function Network({ layers, extra, ...p }: IconProps & { layers: number[][]; extra?: ReactNode }) {
  const xs = layers.map((_, i) => 4 + (i * 24) / (layers.length - 1));
  const edges: ReactNode[] = [];
  layers.forEach((col, i) => {
    if (i === layers.length - 1) return;
    col.forEach((y1, a) =>
      layers[i + 1].forEach((y2, b) => edges.push(<path key={`${i}-${a}-${b}`} d={`M${xs[i]} ${y1}L${xs[i + 1]} ${y2}`} strokeWidth={0.55} strokeOpacity={0.6} />)),
    );
  });
  return (
    <Line {...p}>
      {edges}
      {extra}
      {layers.flatMap((col, i) => col.map((y, j) => node(xs[i], y, `${i}-${j}`)))}
    </Line>
  );
}

export const AlexNetIcon = (p: IconProps) => <Network layers={[[10, 16, 22], [7, 13, 19, 25], [12, 20], [16]]} {...p} />;
export const VggIcon = (p: IconProps) => <Network layers={[[7, 13, 19, 25], [7, 13, 19, 25], [7, 13, 19, 25], [13, 19]]} {...p} />;
export const ResNetIcon = (p: IconProps) => (
  <Network
    layers={[[9, 16, 23], [9, 16, 23], [9, 16, 23], [12, 20]]}
    extra={<path d="M4 9C10 1 22 1 28 12M4 23c6 8 18 8 24-3" strokeWidth={1} strokeDasharray="1.5 1.5" />}
    {...p}
  />
);
export const EfficientNetIcon = (p: IconProps) => (
  <Network layers={[[6, 11, 16, 21, 26], [8.5, 13.5, 18.5, 23.5], [6, 11, 16, 21, 26], [11, 21]]} {...p} />
);

const PUPIL: Record<ClassName, [number, number]> = {
  ESOTROPIA: [-6, 1],
  EXOTROPIA: [6, 1],
  HYPERTROPIA: [0, -3],
  HYPOTROPIA: [0, 5],
  NORMAL: [0, 1],
};

export function EyeGlyph({ cls, ...p }: IconProps & { cls: ClassName }) {
  const [dx, dy] = PUPIL[cls];
  return (
    <svg viewBox="0 0 48 28" fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden="true" {...p}>
      <path d="M3 17C12 3 36 3 45 17" strokeWidth={3} />
      <path d="M5 17c9 9 29 9 38 0" strokeWidth={1.2} />
      <path d="M6 9.5c5-6 31-6 36 0" strokeWidth={1} strokeOpacity={0.55} />
      <circle cx={24 + dx} cy={15 + dy} r="6.5" strokeWidth={1.4} />
      <circle cx={24 + dx} cy={15 + dy} r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const STEP_ICONS: Record<string, (p: IconProps) => ReactElement> = {
  "data-collection": CloudDataIcon,
  splitting: SplitIcon,
  "auto-orientation": RotateIcon,
  resizing: ResizeIcon,
  denoising: DenoiseIcon,
  flipping: FlipIcon,
  brightness: BrightnessIcon,
  contrast: ContrastIcon,
  grayscale: GrayscaleIcon,
  alexnet: AlexNetIcon,
  vgg19: VggIcon,
  resnet50: ResNetIcon,
  "efficientnet-b7": EfficientNetIcon,
};
