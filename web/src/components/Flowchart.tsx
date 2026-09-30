import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { CLASS_INFO, FLOW_CLASS_ORDER, STEPS, type Part, type Step } from "@/content/site";
import { EyeGlyph, STEP_ICONS } from "./icons";

const FORWARD = ["nav-forward"];
const COLS: Record<number, string> = { 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5" };

function Arrow() {
  return (
    <div aria-hidden="true" className="flex justify-center">
      <svg width="14" height="34" viewBox="0 0 14 34">
        <path d="M7 0v27" stroke="#3a4658" strokeWidth="1.6" />
        <path d="M1.8 24.5 7 33l5.2-8.5z" fill="#3a4658" />
      </svg>
    </div>
  );
}

function Reflex() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-1.5 -right-1.5 size-3 scale-50 rounded-full bg-amber opacity-0 shadow-[0_0_0_3px_#fff3d1] transition duration-200 group-hover/panel:scale-100 group-hover/panel:opacity-100"
    />
  );
}

function Panel({ step, wide, children }: { step: Step; wide?: boolean; children: ReactNode }) {
  return (
    <ViewTransition name={`step-${step.slug}`} share="morph" default="none">
      <div
        className={`group/panel relative mx-auto rounded-md border-[1.5px] border-flow-line bg-flow p-2 shadow-[0_2px_0_0_#1f2d40] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_5px_0_0_#1f2d40] sm:p-2.5 ${wide ? "w-full" : "w-40 sm:w-44"}`}
      >
        <Link
          href={`/${step.slug}`}
          transitionTypes={FORWARD}
          className="absolute inset-0 rounded-md"
          aria-label={`Step ${step.n}, ${step.title}: ${step.summary}`}
        />
        <div className="pointer-events-none relative rounded border border-flow-line bg-card py-1.5 text-center text-[0.8rem] font-bold tracking-tight sm:text-sm">
          {step.title}
        </div>
        {children}
        <Reflex />
      </div>
    </ViewTransition>
  );
}

function SubBox({ part, children, morph }: { part: Part; children: ReactNode; morph?: boolean }) {
  const box = (
    <Link
      href={part.href}
      transitionTypes={FORWARD}
      className="relative z-10 flex flex-col items-center justify-between gap-1.5 rounded border border-flow-line bg-card px-0.5 pt-1.5 pb-2 text-center text-[0.62rem] leading-[1.15] text-ink transition hover:bg-penlight sm:text-[0.72rem]"
    >
      <span className="flex min-h-[2.3em] items-center">{part.title}</span>
      {children}
    </Link>
  );
  return morph ? (
    <ViewTransition name={`part-${part.id}`} share="morph" default="none">
      {box}
    </ViewTransition>
  ) : (
    box
  );
}

function PartsRow({ step }: { step: Step }) {
  const isClasses = step.slug === "classes";
  return (
    <div className={`mt-2 grid gap-1.5 sm:gap-2 ${COLS[step.parts.length]}`}>
      {step.parts.map((part, i) => {
        if (isClasses) {
          const cls = FLOW_CLASS_ORDER[i];
          return (
            <SubBox key={part.id} part={{ ...part, title: CLASS_INFO[cls].label }}>
              <EyeGlyph cls={cls} className="w-10 sm:w-12" />
            </SubBox>
          );
        }
        const Icon = STEP_ICONS[part.id];
        return (
          <SubBox key={part.id} part={part} morph={step.slug === "classification"}>
            <Icon className="size-6 sm:size-7" />
          </SubBox>
        );
      })}
    </div>
  );
}

export function Flowchart() {
  return (
    <nav aria-label="Pipeline steps" className="mx-auto w-full max-w-[34rem]">
      {STEPS.map((step, i) => {
        const Icon = STEP_ICONS[step.slug];
        return (
          <div key={step.slug}>
            {i > 0 && <Arrow />}
            {step.parts.length ? (
              <Panel step={step} wide>
                <PartsRow step={step} />
              </Panel>
            ) : (
              <Panel step={step}>
                <div className="pointer-events-none flex justify-center pt-2 pb-0.5">
                  <Icon className="size-8" />
                </div>
              </Panel>
            )}
          </div>
        );
      })}
    </nav>
  );
}
