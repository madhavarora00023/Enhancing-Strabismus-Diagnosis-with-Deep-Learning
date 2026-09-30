import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { ConfusionMatrix, METRIC_LABELS } from "@/components/charts";
import { ResultsExplorer } from "@/components/ResultsExplorer";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { SLIDE } from "@/components/StepShell";
import { MODELS, PAPER, PUBLISHED, type Metrics } from "@/content/site";

export const metadata: Metadata = {
  title: "Results",
  description: "Accuracy, precision, recall, F1 and confusion matrices for AlexNet, VGG19, ResNet50 and EfficientNet-B7, as published at AIMLA 2025.",
};

const DEFINITIONS: { k: keyof Metrics; text: string }[] = [
  { k: "accuracy", text: "Out of all test photos, the share the model classified correctly." },
  { k: "precision", text: "When the model names a class, how often it is right, averaged across classes." },
  { k: "recall", text: "Of the photos that truly belong to a class, how many the model found, averaged across classes." },
  { k: "f1", text: "A single score that balances precision and recall; it is high only when both are." },
];

export default function Results() {
  const keys = Object.keys(METRIC_LABELS) as (keyof Metrics)[];
  return (
    <>
      <SiteHeader />
      <ViewTransition enter={SLIDE} exit={SLIDE} default="none">
        <main className="mx-auto w-full max-w-6xl px-4 pt-14 pb-24 sm:px-6 sm:pt-20">
          <p className="eyebrow text-amber-ink">Results · published in the paper</p>
          <h1 className="mt-3 max-w-3xl font-display text-title text-balance">How the four models compared</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            All numbers come from Table I and Figures 2–5 of our {PAPER.conferenceShort} paper. They were measured on the 81 test photos,
            which the models never saw during training.
          </p>

          <section aria-label="Model comparison" className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
            <ResultsExplorer />
            <div>
              <table className="w-full text-sm">
                <caption className="mb-3 text-left font-bold">Every metric, every model</caption>
                <thead>
                  <tr className="border-b border-rule text-left text-ink-soft">
                    <th scope="col" className="py-2 pr-2 font-normal">
                      Model
                    </th>
                    {keys.map((k) => (
                      <th key={k} scope="col" className="py-2 text-right font-normal">
                        {METRIC_LABELS[k]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map((m) => (
                    <tr key={m.id} className={`border-b border-rule/70 ${m.id === "efficientnet-b7" ? "font-bold" : ""}`}>
                      <th scope="row" className="py-2.5 pr-2 text-left font-[inherit]">
                        {m.title}
                      </th>
                      {keys.map((k) => (
                        <td key={k} className="py-2.5 text-right font-mono tabular-nums">
                          {PUBLISHED[m.id].metrics[k].toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <dl className="mt-8 space-y-3">
                {DEFINITIONS.map((d) => (
                  <div key={d.k} className="text-sm">
                    <dt className="inline font-bold">{METRIC_LABELS[d.k]}: </dt>
                    <dd className="inline text-ink-soft">{d.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section aria-labelledby="matrices-title" className="mt-24">
            <p className="eyebrow mb-3 text-amber-ink">Where each model went wrong</p>
            <h2 id="matrices-title" className="mb-3 font-display text-3xl leading-tight sm:text-4xl">
              Confusion matrices
            </h2>
            <p className="mb-10 max-w-[62ch] text-ink-soft">
              Each row is a true class and shows where its test photos ended up. A strong model puts its weight on the diagonal. The
              weaker models spread theirs: VGG19 and ResNet50, for example, send many of their mistakes to exotropia.
            </p>
            <div className="grid gap-x-12 gap-y-14 lg:grid-cols-2">
              {MODELS.map((m) => (
                <div key={m.id}>
                  <div className="mb-3 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl">{m.title}</h3>
                    <Link href={`/classification/${m.id}`} transitionTypes={["nav-forward"]} className="text-sm font-bold text-amber-ink underline-offset-4 hover:underline">
                      About this model →
                    </Link>
                  </div>
                  <ConfusionMatrix model={m.id} compact />
                </div>
              ))}
            </div>
          </section>

          <Link
            href="/demo"
            transitionTypes={["nav-forward"]}
            className="mt-24 flex flex-col gap-1 rounded-lg border border-rule bg-card px-6 py-5 transition hover:border-flow-line hover:shadow-[0_3px_0_0_#1f2d40] sm:items-end sm:text-right"
          >
            <span className="eyebrow text-amber-ink">Next →</span>
            <span className="font-display text-2xl">See it classify test photos</span>
          </Link>
        </main>
      </ViewTransition>
      <SiteFooter />
    </>
  );
}
