import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Strabismus demo";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({ eyebrow: "Demo", title: "See it classify test photos", summary: "Pick a test photo to see EfficientNet-B7’s prediction and where it looked.", pose: "HYPERTROPIA" });
}
