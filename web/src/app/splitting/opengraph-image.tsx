import { stepBySlug } from "@/content/site";
import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Strabismus pipeline step: splitting";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  const step = stepBySlug("splitting");
  return ogImage({ eyebrow: `Step ${step.n} of 6`, title: step.title, summary: step.summary, pose: "HYPERTROPIA" });
}
