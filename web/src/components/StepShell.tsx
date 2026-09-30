import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { CLASS_INFO, FLOW_CLASS_ORDER, STEPS, stepBySlug, type Step } from "@/content/site";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { EyeGlyph, STEP_ICONS } from "./icons";

export const SLIDE = { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" };
const TOTAL = STEPS.length;

function StepNav({ current }: { current: Step }) {
  return (
    <nav aria-label="Pipeline progress" className="-mx-4 overflow-x-auto px-4 py-5 sm:mx-0 sm:px-0">
      <ol className="flex min-w-max items-center gap-1 text-xs sm:text-[0.8rem]">
        {STEPS.map((s, i) => {
          const here = s.slug === current.slug;
          return (
            <li key={s.slug} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden="true" className="h-px w-3 bg-rule sm:w-5" />}
              <Link
                href={`/${s.slug}`}
                transitionTypes={[s.n < current.n ? "nav-back" : "nav-forward"]}
                aria-current={here ? "step" : undefined}
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition ${
                  here
                    ? "border-flow-line bg-flow font-bold text-ink"
                    : "border-transparent text-ink-soft hover:border-rule hover:text-ink"
                }`}
              >
                <span className={`size-1.5 rounded-full ${here ? "bg-amber" : s.n < current.n ? "bg-ink-soft" : "bg-rule"}`} />
                {s.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepHeader({ step }: { step: Step }) {
  const Icon = STEP_ICONS[step.slug];
  return (
    <ViewTransition name={`step-${step.slug}`} share="morph" default="none">
      <header className="relative rounded-lg border-[1.5px] border-flow-line bg-flow p-2.5 shadow-[0_3px_0_0_#1f2d40] sm:p-3.5">
        <div className="flex items-start justify-between gap-6 rounded-md border border-flow-line bg-card px-5 py-6 sm:px-8 sm:py-9">
          <div>
            <p className="eyebrow text-amber-ink">
              Step {step.n} of {TOTAL}
            </p>
            <h1 className="mt-2 font-display text-title text-balance">{step.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft text-pretty">{step.summary}</p>
          </div>
          {Icon && <Icon className="hidden size-16 shrink-0 text-ink sm:block" />}
        </div>
        {step.parts.length > 0 && (
          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:mt-3.5 sm:flex sm:gap-3">
            {step.parts.map((part, i) => {
              const PartIcon = STEP_ICONS[part.id];
              const cls = step.slug === "classes" ? FLOW_CLASS_ORDER[i] : null;
              const chip = (
                <Link
                  key={part.id}
                  href={part.href}
                  transitionTypes={step.slug === "classification" ? ["nav-forward"] : undefined}
                  className="flex flex-1 items-center gap-2.5 rounded border border-flow-line bg-card px-3 py-2.5 text-sm transition hover:bg-penlight"
                >
                  {cls ? <EyeGlyph cls={cls} className="w-9 shrink-0" /> : PartIcon && <PartIcon className="size-6 shrink-0" />}
                  {cls ? CLASS_INFO[cls].label : part.title}
                </Link>
              );
              return step.slug === "classification" ? (
                <ViewTransition key={part.id} name={`part-${part.id}`} share="morph" default="none">
                  {chip}
                </ViewTransition>
              ) : (
                chip
              );
            })}
          </div>
        )}
      </header>
    </ViewTransition>
  );
}

function PrevNext({ step }: { step: Step }) {
  const prev = STEPS[step.n - 2];
  const next = STEPS[step.n];
  const card =
    "group flex flex-1 flex-col gap-1 rounded-lg border border-rule bg-card px-5 py-4 transition hover:border-flow-line hover:shadow-[0_3px_0_0_#1f2d40]";
  return (
    <nav aria-label="Previous and next step" className="mt-24 flex flex-col gap-3 sm:flex-row">
      {prev ? (
        <Link href={`/${prev.slug}`} transitionTypes={["nav-back"]} className={card}>
          <span className="eyebrow text-ink-soft">← Step {prev.n}</span>
          <span className="font-display text-2xl">{prev.title}</span>
        </Link>
      ) : (
        <Link href="/#pipeline" transitionTypes={["nav-back"]} className={card}>
          <span className="eyebrow text-ink-soft">← Overview</span>
          <span className="font-display text-2xl">The whole pipeline</span>
        </Link>
      )}
      {next ? (
        <Link href={`/${next.slug}`} transitionTypes={["nav-forward"]} className={`${card} sm:items-end sm:text-right`}>
          <span className="eyebrow text-amber-ink">Step {next.n} →</span>
          <span className="font-display text-2xl">{next.title}</span>
        </Link>
      ) : (
        <Link href="/results" transitionTypes={["nav-forward"]} className={`${card} sm:items-end sm:text-right`}>
          <span className="eyebrow text-amber-ink">Results →</span>
          <span className="font-display text-2xl">How well each model did</span>
        </Link>
      )}
    </nav>
  );
}

export function StepShell({ slug, children, header }: { slug: string; children: ReactNode; header?: ReactNode }) {
  const step = stepBySlug(slug);
  return (
    <>
      <SiteHeader />
      <ViewTransition enter={SLIDE} exit={SLIDE} default="none">
        <main className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6">
          <StepNav current={step} />
          {header ?? <StepHeader step={step} />}
          <div className="mt-16 space-y-24 sm:mt-20">{children}</div>
          <PrevNext step={step} />
        </main>
      </ViewTransition>
      <SiteFooter />
    </>
  );
}

export function Section({
  id,
  title,
  eyebrow,
  children,
  aside,
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section id={id} className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
      <div className="prose-step">
        {eyebrow && <p className="eyebrow mb-3 text-amber-ink">{eyebrow}</p>}
        <h2 className="mb-5 font-display text-3xl leading-tight text-balance sm:text-4xl">{title}</h2>
        {children}
      </div>
      <div className="min-w-0">{aside}</div>
    </section>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l-2 border-amber pl-4">
      <p className="text-4xl font-bold leading-none tracking-tight">{value}</p>
      <p className="mt-1.5 text-sm text-ink-soft">{label}</p>
    </div>
  );
}
