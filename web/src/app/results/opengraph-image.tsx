import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Strabismus results";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Results", title: "How the four models compared", summary: "EfficientNet-B7 reached 84% accuracy on 81 unseen test photos.", pose: "EXOTROPIA" });
}
