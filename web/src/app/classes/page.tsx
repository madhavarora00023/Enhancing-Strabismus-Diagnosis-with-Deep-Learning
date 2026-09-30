import type { Metadata } from "next";
import Image from "next/image";
import { CountBars } from "@/components/charts";
import { PosedEyes } from "@/components/HeroEyes";
import { Section, StepShell } from "@/components/StepShell";
import { ThreadCard } from "@/components/ThreadCard";
import { CLASS_INFO, CLASSES, FLOW_CLASS_ORDER, PUBLISHED } from "@/content/site";
import images from "@/data/images.json";

export const metadata: Metadata = {
  title: "Strabismus Classes",
  description: "The five classes every photo is sorted into — esotropia, exotropia, hypertropia, hypotropia and normal — with real examples.",
};

const DETAIL: Record<string, string> = {
  HYPERTROPIA:
    "In hypertropia the turned eye points upward. In a photo, its iris sits higher in the eye opening than its partner's, often showing more white below it.",
  HYPOTROPIA:
    "In hypotropia the turned eye points downward. Its iris sits lower in the eye opening, and the upper lid may cover more of it than on the other side.",
  NORMAL:
    "Normal is the reference the other four are measured against. A model has to learn what straight eyes look like just as well as it learns what a turn looks like, or it will see misalignment everywhere.",
  ESOTROPIA:
    "In esotropia one eye turns inward, toward the nose. It is the most common form in children, and it shows as extra white on the outer side of the turned eye.",
  EXOTROPIA:
    "In exotropia one eye turns outward, toward the ear. It can come and go at first, showing mostly when the person is tired or daydreaming.",
};

export default function Classes() {
  const diag = PUBLISHED["efficientnet-b7"].confusion;
  const recall = Object.fromEntries(CLASSES.map((c, i) => [c, diag[i][i]]));
  return (
    <StepShell slug="classes">
      <Section
        eyebrow="The five answers"
        title="Four kinds of misalignment, and normal"
        aside={
          <div className="rounded-lg border border-rule bg-card p-5 sm:p-6">
            <p className="text-sm font-bold">EfficientNet-B7: test photos of each class classified correctly</p>
            <p className="mb-4 text-xs text-ink-soft">From the paper&apos;s confusion matrix (Fig. 5)</p>
            <CountBars rows={FLOW_CLASS_ORDER.map((c) => ({ label: CLASS_INFO[c].label, value: Math.round(recall[c] * 100) }))} max={100} unit="%" />
          </div>
        }
      >
        <p>
          Every photo ends in exactly one of five classes. Four describe the direction a turned eye points; the fifth is a normal,
          aligned pair.
        </p>
        <p>
          The best model found some classes easier than others. Hypertropia and normal eyes were the clearest, at 94% each. Hypotropia
          and exotropia were the hardest to pin down, at 75% and 76%.
        </p>
      </Section>

      {FLOW_CLASS_ORDER.map((c, i) => (
        <section key={c} id={c.toLowerCase()} className="scroll-mt-24 grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className={i % 2 ? "lg:order-2" : ""}>
            <div className="rounded-lg bg-room p-5 sm:p-8">
              <PosedEyes cls={c} className="h-auto w-full" />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {images.samples[c].slice(0, 3).map((img) => (
                <Image key={img.src} src={img.src} width={img.width} height={img.height} alt={`A real ${CLASS_INFO[c].label.toLowerCase()} photo from the dataset`} className="aspect-[18/5] w-full rounded object-cover" />
              ))}
            </div>
          </div>
          <div className="prose-step">
            <p className="eyebrow mb-3 text-amber-ink">{CLASS_INFO[c].short}</p>
            <h2 className="mb-5 font-display text-4xl leading-tight sm:text-5xl">{CLASS_INFO[c].label}</h2>
            <p className="text-lg">{CLASS_INFO[c].description}</p>
            <p>{DETAIL[c]}</p>
            <dl className="mt-6 flex gap-8 border-t border-rule pt-5">
              <div>
                <dt className="text-sm text-ink-soft">Photos in the dataset</dt>
                <dd className="text-2xl font-bold">{images.counts[c].raw}</dd>
              </div>
              <div>
                <dt className="text-sm text-ink-soft">EfficientNet-B7 got right</dt>
                <dd className="text-2xl font-bold">{Math.round(recall[c] * 100)}%</dd>
              </div>
            </dl>
          </div>
        </section>
      ))}

      <ThreadCard image={images.thread.augmented.find((v) => v.variant === "original")!} stage="Its class">
        Our photo belongs here, in esotropia. Because it was a training photo, the models learned from it rather than being tested on
        it: one of the 3,600 images behind what they know about this class.
      </ThreadCard>
    </StepShell>
  );
}
