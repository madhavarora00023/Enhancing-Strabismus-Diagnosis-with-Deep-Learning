import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Strabismus paper";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "The paper · AIMLA 2025", title: "Enhancing Strabismus Diagnosis", summary: "From detection to classification with deep learning. Gupta, Arora, Garg, Ghosh.", pose: "HYPOTROPIA" });
}
