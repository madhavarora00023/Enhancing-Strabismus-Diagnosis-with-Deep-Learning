import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { ConfusionMatrix, METRIC_LABELS } from "@/components/charts";
import { STEP_ICONS } from "@/components/icons";
import { Section, StepShell } from "@/components/StepShell";
import { CLASS_INFO, CLASSES, MODEL_DETAILS, MODELS, PUBLISHED, type Metrics, type ModelId } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return MODELS.map((m) => ({ model: m.id }));
}

export async function generateMetadata({ params }: PageProps<"/classification/[model]">): Promise<Metadata> {
  const { model } = await params;
  const m = MODELS.find((x) => x.id === model)!;
  return { title: `${m.title} · Classification`, description: MODEL_DETAILS[m.id].role };
}

function ModelHeader({ id }: { id: ModelId }) {
  const m = MODELS.find((x) => x.id === id)!;
  const Icon = STEP_ICONS[id];
  return (
    <ViewTransition name={`part-${id}`} share="morph" default="none">
      <header className="relative rounded-lg border-[1.5px] border-flow-line bg-flow p-2.5 shadow-[0_3px_0_0_#1f2d40] sm:p-3.5">
        <div className="flex items-start justify-between gap-6 rounded-md border border-flow-line bg-card px-5 py-6 sm:px-8 sm:py-9">
          <div>
            <p className="eyebrow text-amber-ink">Step 5 · Classification</p>
            <h1 className="mt-2 font-display text-title">{m.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">{MODEL_DETAILS[id].role}</p>
            <p className="mt-3 font-mono text-xs text-ink">{MODEL_DETAILS[id].transfer}</p>
          </div>
          <Icon className="hidden size-20 shrink-0 sm:block" />
        </div>
        <nav aria-label="Other models" className="mt-2.5 grid grid-cols-2 gap-2 sm:mt-3.5 sm:flex sm:gap-3">
          {MODELS.map((o, i) => {
            const here = o.id === id;
            const OIcon = STEP_ICONS[o.id];
            const direction = i < MODELS.findIndex((x) => x.id === id) ? "nav-back" : "nav-forward";
            return (
              <Link
                key={o.id}
                href={`/classification/${o.id}`}
                transitionTypes={[direction]}
                aria-current={here ? "page" : undefined}
                className={`flex flex-1 items-center gap-2.5 rounded border px-3 py-2.5 text-sm transition ${here ? "border-amber bg-penlight font-bold" : "border-flow-line bg-card hover:bg-penlight"}`}
              >
                <OIcon className="size-6 shrink-0" />
                {o.title}
              </Link>
            );
          })}
        </nav>
      </header>
    </ViewTransition>
  );
}

function LayerStack({ id }: { id: ModelId }) {
  const layers = MODEL_DETAILS[id].layers;
  return (
    <ol className="relative space-y-1.5">
      <li className="rounded border border-dashed border-ink-soft/50 px-4 py-2 text-center font-mono text-xs text-ink-soft">Eye photo in</li>
      {layers.map((l, i) => {
        const last = i === layers.length - 1;
        return (
          <li
            key={l.name}
            className={`flex items-baseline justify-between gap-3 rounded border px-4 py-2.5 text-sm ${last ? "border-amber bg-penlight font-bold" : i === 0 && id !== "alexnet" ? "border-flow-line bg-flow font-bold" : "border-rule bg-card"}`}
          >
            <span>{l.name}</span>
            {l.note && <span className="text-right font-mono text-[0.7rem] font-normal text-ink-soft">{l.note}</span>}
          </li>
        );
      })}
      <li className="grid grid-cols-5 gap-1 pt-1">
        {CLASSES.map((c) => (
          <span key={c} className="truncate rounded bg-room px-1 py-1.5 text-center font-mono text-[0.6rem] text-penlight sm:text-[0.65rem]">
            {CLASS_INFO[c].label}
          </span>
        ))}
      </li>
    </ol>
  );
}

function MetricTiles({ metrics }: { metrics: Metrics }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {(Object.keys(METRIC_LABELS) as (keyof Metrics)[]).map((k) => (
        <div key={k} className="rounded-lg border border-rule bg-card p-4">
          <dt className="text-sm text-ink-soft">{METRIC_LABELS[k]}</dt>
          <dd className="mt-1 text-3xl font-bold tracking-tight">{metrics[k].toFixed(2)}%</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function ModelPage({ params }: PageProps<"/classification/[model]">) {
  const { model } = await params;
  const id = model as ModelId;
  const details = MODEL_DETAILS[id];
  const { metrics, confusion } = PUBLISHED[id];
  const diagonal = confusion.map((row, i) => ({ cls: CLASSES[i], v: row[i] }));
  const best = diagonal.reduce((a, b) => (b.v > a.v ? b : a));
  const worst = diagonal.reduce((a, b) => (b.v < a.v ? b : a));

  return (
    <StepShell slug="classification" header={<ModelHeader id={id} />}>
      <Section eyebrow="From the paper" title="What we built" aside={<LayerStack id={id} />}>
        <p>{details.paper}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {details.techniques.map((t) => (
            <li key={t} className="rounded-full border border-rule bg-card px-3 py-1 text-sm">
              {t}
            </li>
          ))}
        </ul>
      </Section>

      <section aria-labelledby="model-results" className="space-y-8">
        <div>
          <p className="eyebrow mb-3 text-amber-ink">Published results</p>
          <h2 id="model-results" className="font-display text-3xl leading-tight sm:text-4xl">
            How {MODELS.find((m) => m.id === id)!.title} did on the 81 test photos
          </h2>
        </div>
        <MetricTiles metrics={metrics} />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:items-center">
          <ConfusionMatrix model={id} />
          <div className="prose-step">
            <p>
              Each row is a true class; the numbers show where its test photos ended up. The diagonal is the share classified
              correctly.
            </p>
            <p>
              It was strongest on <strong>{CLASS_INFO[best.cls].label.toLowerCase()}</strong> ({Math.round(best.v * 100)}% correct) and
              weakest on <strong>{CLASS_INFO[worst.cls].label.toLowerCase()}</strong> ({Math.round(worst.v * 100)}% correct).
            </p>
          </div>
        </div>
      </section>
    </StepShell>
  );
}
