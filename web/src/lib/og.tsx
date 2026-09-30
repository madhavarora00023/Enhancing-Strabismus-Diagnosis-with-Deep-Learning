import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ClassName } from "@/content/site";

export const OG_SIZE = { width: 1200, height: 630 };

const ROOM = "#0e1726";
const PENLIGHT = "#fff3d1";
const AMBER = "#e9a94b";
const OFFSET: Record<ClassName, [number, number]> = {
  NORMAL: [0, 0],
  ESOTROPIA: [-24, 0],
  EXOTROPIA: [24, 0],
  HYPERTROPIA: [0, -17],
  HYPOTROPIA: [0, 17],
};

const font = (file: string) => readFile(join(process.cwd(), "assets", "fonts", file));

function eye({ x, offset = [0, 0] }: { x: number; offset?: [number, number] }) {
  const [dx, dy] = offset;
  return (
    <g transform={`translate(${x} 120)`}>
      <path d="M-120 0C-70-80 70-80 120 0C70 72-70 72-120 0Z" fill="#ece5d6" />
      <circle cx={dx} cy={dy} r="50" fill="#c8841f" />
      <circle cx={dx} cy={dy} r="49" fill="none" stroke="#2c1a05" strokeWidth="3.5" />
      <circle cx={dx} cy={dy} r="19" fill="#070b12" />
      <path d="M-130-100H130V0C70-80-70-80-130 0Z" fill={ROOM} />
      <path d="M-130 100H130V0C70 72-70 72-130 0Z" fill={ROOM} />
      <circle cx="-5" cy="-7" r="7" fill={PENLIGHT} />
      <path d="M-120 0C-70-80 70-80 120 0C70 72-70 72-120 0Z" fill="none" stroke={PENLIGHT} strokeOpacity="0.35" strokeWidth="2" />
    </g>
  );
}

export async function ogImage({ eyebrow, title, summary, pose = "ESOTROPIA" }: { eyebrow: string; title: string; summary: string; pose?: ClassName }) {
  const [display, sans, sansBold, mono] = await Promise.all([
    font("newsreader-400.ttf"),
    font("atkinson-400.ttf"),
    font("atkinson-700.ttf"),
    font("atkinson-mono-400.ttf"),
  ]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: ROOM, padding: "64px 72px", color: PENLIGHT, fontFamily: "Atkinson" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontFamily: "Newsreader", fontSize: 38 }}>Strabismus</div>
          <svg width="330" height="124" viewBox="0 0 640 240">
            {eye({ x: 180 })}
            {eye({ x: 460, offset: OFFSET[pose] })}
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: "Mono", fontSize: 24, letterSpacing: 4, color: AMBER, textTransform: "uppercase" }}>{eyebrow}</div>
          <div style={{ display: "flex", fontFamily: "Newsreader", fontSize: 84, lineHeight: 1.05, marginTop: 14, maxWidth: 1000 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 30, lineHeight: 1.4, marginTop: 22, maxWidth: 900, color: "rgba(255,243,209,0.72)" }}>{summary}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Mono", fontSize: 22, color: "rgba(255,243,209,0.55)" }}>
          <span>strabismus.madhavarora.com</span>
          <span>AIMLA 2025 · Paper 1140</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Newsreader", data: display, style: "normal", weight: 400 },
        { name: "Atkinson", data: sans, style: "normal", weight: 400 },
        { name: "Atkinson", data: sansBold, style: "normal", weight: 700 },
        { name: "Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
