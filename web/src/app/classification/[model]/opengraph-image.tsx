import { MODEL_DETAILS, MODELS, PUBLISHED, type ModelId } from "@/content/site";
import { OG_SIZE, ogImage } from "@/lib/og";

export const alt = "Strabismus classification model";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return MODELS.map((m) => ({ model: m.id }));
}

export default async function Image({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  const m = MODELS.find((x) => x.id === model)!;
  return ogImage({
    eyebrow: `Step 5 · ${PUBLISHED[m.id as ModelId].metrics.accuracy.toFixed(2)}% accuracy`,
    title: m.title,
    summary: MODEL_DETAILS[m.id as ModelId].role,
    pose: "ESOTROPIA",
  });
}
