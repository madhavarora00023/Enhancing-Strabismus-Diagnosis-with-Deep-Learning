import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { STEP_ICONS } from "@/components/icons";
import { Section, StepShell } from "@/components/StepShell";
import { CLASS_INFO, CLASSES, MODEL_DETAILS, MODELS, PUBLISHED } from "@/content/site";
import images from "@/data/images.json";

export const metadata: Metadata = {
  title: "Classification",
  description: "The four neural networks that learned to classify strabismus: AlexNet, VGG19, ResNet50 and EfficientNet-B7.",
};

const ILLUSTRATIVE = [0.08, 0.14, 0.05, 0.06, 0.67];

function HowItWorks() {
  return (
    <figure className="rounded-lg border border-rule bg-card p-4 sm:p-6">
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <div className="relative overflow-hidden rounded" style={{ aspectRatio: `${images.thread.denoised.width} / ${images.thread.denoised.height}` }}>
            <Image src={images.thread.denoised.src} alt="An eye photo going into the network" fill sizes="30vw" className="object-cover" />
          </div>
          <p className="mt-2 font-mono text-xs text-ink-soft">A photo goes in</p>
        </div>
        <div aria-hidden="true" className="flex flex-col items-center gap-2 py-2">
          <span className="flex items-center gap-1">
            {[34, 28, 22, 16, 10].map((h) => (
              <span key={h} className="w-2.5 rounded-sm bg-flow-line/80" style={{ height: h }} />
            ))}
          </span>
          <span className="font-mono text-xs text-ink-soft">layers</span>
        </div>
        <div>
          <ul className="space-y-1.5">
            {CLASSES.map((c, i) => (
              <li key={c} className="flex items-center gap-2 text-xs">
                <span className="w-20 shrink-0 text-right text-ink-soft">{CLASS_INFO[c].label}</span>
                <span className="h-3 flex-1">
                  <span
                    className="block h-full rounded-r-[3px]"
                    style={{ width: `${ILLUSTRATIVE[i] * 100}%`, background: c === "ESOTROPIA" ? "#c8841f" : "#7f8c9d" }}
                  />
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 font-mono text-xs text-ink-soft">Five scores come out</p>
        </div>
      </div>
      <figcaption className="mt-4 border-t border-rule pt-3 text-xs text-ink-soft">
        Illustration of the idea, not real model output. The highest score becomes the answer.
      </figcaption>
    </figure>
  );
}

export default function Classification() {
  return (
    <StepShell slug="classification">
      <Section eyebrow="How it works" title="Four networks, one question" aside={<HowItWorks />}>
        <p>
          Each network looks at a photo and produces five scores, one per class, that add up to 100%. The highest score is its answer.
          Training nudges millions of internal weights, one batch of photos at a time, until those answers match the labels.
        </p>
        <p>
          VGG19, ResNet50 and EfficientNet-B7 started from weights already learned on ImageNet, a collection of over a million
          everyday photos, and were then fine-tuned on our eye photos. This is transfer learning: the networks arrive knowing edges,
          curves and textures, so they only have to learn what makes an eye misaligned.
        </p>
      </Section>

      <section aria-labelledby="models-title">
        <p className="eyebrow mb-3 text-amber-ink">The four models</p>
        <h2 id="models-title" className="mb-8 font-display text-3xl leading-tight sm:text-4xl">
          From a baseline to the best performer
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {MODELS.map((m) => {
            const Icon = STEP_ICONS[m.id];
            const best = m.id === "efficientnet-b7";
            return (
              <Link
                key={m.id}
                href={`/classification/${m.id}`}
                transitionTypes={["nav-forward"]}
                className={`group flex flex-col rounded-lg border bg-card p-5 transition hover:shadow-[0_3px_0_0_#1f2d40] sm:p-6 ${best ? "border-amber" : "border-rule hover:border-flow-line"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Icon className="size-9 shrink-0" />
                    <h3 className="font-display text-2xl">{m.title}</h3>
                  </div>
                  <p className="text-right">
                    <span className="block text-2xl font-bold leading-none">{PUBLISHED[m.id].metrics.accuracy.toFixed(2)}%</span>
                    <span className="text-xs text-ink-soft">accuracy</span>
                  </p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">{MODEL_DETAILS[m.id].role}</p>
                <p className="mt-4 text-sm font-bold text-amber-ink">
                  {best ? "Best performer · " : ""}See the architecture and results →
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </StepShell>
  );
}
