import type { Metadata } from "next";
import Image from "next/image";
import { AugmentPlayground } from "@/components/AugmentPlayground";
import { STEP_ICONS } from "@/components/icons";
import { Section, Stat, StepShell } from "@/components/StepShell";
import images from "@/data/images.json";

export const metadata: Metadata = {
  title: "Data Augmentation",
  description: "How each training photo became ten: flipping, brightness, contrast adjustment and grayscale conversion, with the real augmented images.",
};

const VARIANT_LABELS: Record<string, string> = {
  original: "Original",
  flipped: "Flipped",
  brightness_1: "Brightness, version 1",
  brightness_2: "Brightness, version 2",
  flipped_brightness: "Flipped + brightness",
  contrast_1: "Contrast, version 1",
  contrast_2: "Contrast, version 2",
  flipped_contrast: "Flipped + contrast",
  grayscale: "Grayscale",
  flipped_grayscale: "Flipped + grayscale",
};

const TECHNIQUES = [
  {
    id: "flipping",
    title: "Flipping",
    text: "Horizontal mirroring shows the model eyes and gaze from both sides, so it doesn't learn that a turned eye is always on one particular side.",
    variants: ["original", "flipped"],
  },
  {
    id: "brightness",
    title: "Brightness",
    text: "Brightness shifted by up to 20% either way, so photos taken in dim or bright light don't bias the model.",
    variants: ["brightness_1", "brightness_2"],
  },
  {
    id: "contrast",
    title: "Contrast adjustment",
    text: "Contrast shifted by up to 20% either way, so important details stay recognisable in both flat and punchy photos.",
    variants: ["contrast_1", "contrast_2"],
  },
  {
    id: "grayscale",
    title: "Grayscale conversion",
    text: "Colour removed, so the model relies on the shape and position of the iris rather than on eye or skin colour.",
    variants: ["original", "grayscale"],
  },
];

export default function Augmentation() {
  const variant = (name: string) => images.thread.augmented.find((v) => v.variant === name)!;
  const original = variant("original");
  return (
    <StepShell slug="augmentation">
      <Section eyebrow="Try it" title="One photo, ten versions" aside={<AugmentPlayground image={original} />}>
        <p>
          Augmentation teaches a model what doesn&apos;t matter. A photo taken in dim light, or mirrored, still shows the same
          misalignment; seeing those variations stops the model from memorising lighting and pose instead of eyes.
        </p>
        <p>Only the 360 training photos were augmented. Validation and test photos stayed exactly as they were.</p>
        <div className="mt-8 flex flex-wrap gap-8">
          <Stat value="360" label="training photos" />
          <Stat value="× 10" label="versions each" />
          <Stat value="3,600" label="training images" />
        </div>
      </Section>

      <section aria-label="The four techniques" className="grid gap-4 sm:grid-cols-2">
        {TECHNIQUES.map((t) => {
          const Icon = STEP_ICONS[t.id];
          return (
            <article key={t.id} id={t.id} className="scroll-mt-24 rounded-lg border border-rule bg-card p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <Icon className="size-8 shrink-0" />
                <h2 className="font-display text-2xl">{t.title}</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t.text}</p>
              <div className={`mt-4 grid gap-2 ${t.variants.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                {t.variants.map((v) => (
                  <figure key={v}>
                    <Image src={variant(v).src} width={640} height={178} alt={VARIANT_LABELS[v]} className="w-full rounded" />
                    <figcaption className="mt-1 font-mono text-[0.7rem] text-ink-soft">{VARIANT_LABELS[v]}</figcaption>
                  </figure>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <section aria-labelledby="ten-title">
        <p className="eyebrow mb-3 text-amber-ink">Our photo · Augmented</p>
        <h2 id="ten-title" className="mb-3 font-display text-3xl leading-tight sm:text-4xl">
          All ten versions of our photo
        </h2>
        <p className="mb-8 max-w-[62ch] text-ink-soft">
          These are the actual files the models trained on, generated from our esotropia photo. Every training photo got the same
          treatment.
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {Object.keys(VARIANT_LABELS).map(variant).map((v) => (
            <figure key={v.variant}>
              <Image src={v.src} width={640} height={178} alt={VARIANT_LABELS[v.variant]} className="w-full rounded" />
              <figcaption className="mt-1.5 font-mono text-[0.7rem] text-ink-soft">{VARIANT_LABELS[v.variant]}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </StepShell>
  );
}
