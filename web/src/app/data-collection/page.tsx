import type { Metadata } from "next";
import Image from "next/image";
import { CountBars } from "@/components/charts";
import { CropToEyes } from "@/components/explainers";
import { Section, Stat, StepShell } from "@/components/StepShell";
import { ThreadCard } from "@/components/ThreadCard";
import { CLASSES, CLASS_INFO, PAPER } from "@/content/site";
import images from "@/data/images.json";

export const metadata: Metadata = {
  title: "Data Collection",
  description: "How 517 eye photographs were handpicked from open sources, cropped to the eyes and labelled into five strabismus classes.",
};

export default function DataCollection() {
  const counts = CLASSES.map((c) => ({ label: CLASS_INFO[c].label, value: images.counts[c].raw }));
  const total = counts.reduce((a, b) => a + b.value, 0);
  return (
    <StepShell slug="data-collection">
      <Section eyebrow="Where the photos came from" title="Handpicked, cropped, labelled" aside={<CropToEyes />}>
        <p>
          There is no large public collection of strabismus photos sorted by type, so we built one. We searched open-source image
          collections — Kaggle, GitHub and other public repositories — and handpicked photos where both eyes were clearly visible.
        </p>
        <p>
          Each photo was cropped to the strip around the eyes and labelled with its class in CVAT, an open-source annotation tool. Shubh
          Garg and Dr. Debabrata Ghosh collected the photos; Madhav Arora and Bhumit Gupta labelled them, working through the set
          together, turn by turn.
        </p>
        <p>
          The crop matters. The models only ever see the eyes, so they have to learn from how the eyes are aligned, not from faces, hair
          or backgrounds.
        </p>
      </Section>

      <Section
        eyebrow="The dataset"
        title={`${total} photos in five classes`}
        aside={
          <div className="rounded-lg border border-rule bg-card p-5 sm:p-6">
            <p className="mb-4 text-sm font-bold">Photos per class</p>
            <CountBars rows={counts} />
          </div>
        }
      >
        <p>
          The classes are close to balanced: each has between 100 and 110 photos. Normal has slightly more, so during training every
          class was weighted equally, and no class could dominate simply by being bigger.
        </p>
        <div className="mt-8 flex flex-wrap gap-8">
          <Stat value={String(total)} label="photos" />
          <Stat value="5" label="classes" />
          <Stat value="100–110" label="photos per class" />
        </div>
      </Section>

      <section aria-labelledby="samples-title">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3 text-amber-ink">What the photos look like</p>
            <h2 id="samples-title" className="font-display text-3xl leading-tight sm:text-4xl">
              Six from each class
            </h2>
          </div>
          <a
            href={PAPER.dataset}
            className="rounded-full border border-flow-line bg-flow px-5 py-2.5 text-sm font-bold transition hover:bg-penlight"
          >
            Browse the full dataset on Google Drive ↗
          </a>
        </div>
        <div className="space-y-6">
          {CLASSES.map((c) => (
            <div key={c} className="grid items-center gap-3 md:grid-cols-[9rem_minmax(0,1fr)]">
              <p className="font-bold">
                {CLASS_INFO[c].label} <span className="block text-sm font-normal text-ink-soft">{CLASS_INFO[c].short}</span>
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {images.samples[c].map((img) => (
                  <Image
                    key={img.src}
                    src={img.src}
                    width={img.width}
                    height={img.height}
                    alt={`${CLASS_INFO[c].label} example`}
                    className="aspect-[18/5] w-full rounded object-cover"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink-soft">
          Photos come from open sources and are shown for research use. If one of them is yours and you would like it removed, open an
          issue on{" "}
          <a href={PAPER.repo} className="underline underline-offset-4 hover:text-ink">
            GitHub
          </a>
          .
        </p>
      </section>

      <ThreadCard image={images.thread.raw} stage="Collected">
        This photo of an eye turning inward — esotropia — is the one we&apos;ll follow through every step. Here it is exactly as it was
        collected and cropped.
      </ThreadCard>
    </StepShell>
  );
}
