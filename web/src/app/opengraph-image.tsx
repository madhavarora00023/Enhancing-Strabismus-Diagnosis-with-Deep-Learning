import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Strabismus: reading eye alignment from a photograph";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Research · the pipeline", title: "Which way is that eye turning?", summary: "Four neural networks that sort eye photographs into five kinds of strabismus.", pose: "ESOTROPIA" });
}
