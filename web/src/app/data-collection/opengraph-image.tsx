import { stepBySlug } from "@/content/site";
import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Strabismus pipeline step: data collection";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  const step = stepBySlug("data-collection");
  return ogImage({ eyebrow: `Step ${step.n} of 6`, title: step.title, summary: step.summary, pose: "ESOTROPIA" });
}
