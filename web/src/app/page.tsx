import Link from "next/link";
import { ViewTransition } from "react";
import { ModelBars } from "@/components/charts";
import { Flowchart } from "@/components/Flowchart";
import { HeroEyes } from "@/components/HeroEyes";
import { EyeGlyph } from "@/components/icons";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { SLIDE } from "@/components/StepShell";
import { CLASS_INFO, FLOW_CLASS_ORDER, PAPER, PUBLISHED } from "@/content/site";

export default function Home() {
  const best = PUBLISHED["efficientnet-b7"].metrics;
  return (
    <>
      <SiteHeader tone="dark" />
      <ViewTransition enter={SLIDE} exit={SLIDE} default="none">
        <main>
          <section className="relative isolate overflow-hidden bg-room text-penlight">
            <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-4 pt-20 pb-14 sm:px-6">
              <div className="w-full max-w-3xl">
                <HeroEyes />
              </div>
              <p className="eyebrow mt-12 text-penlight/55">
                {PAPER.conferenceShort} · Paper {PAPER.paperId}
              </p>
              <h1 className="mt-4 text-center font-display text-hero font-light text-balance">
                Which way is that eye <em className="text-amber-glow">turning?</em>
              </h1>
              <p className="mt-6 max-w-2xl text-center text-lg leading-relaxed text-penlight/75 text-pretty">
                Strabismus is a misalignment of the eyes. We trained four neural networks to recognise its four main forms, and a normal
                pair, from a single cropped photograph.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <a href="#pipeline" className="rounded-full bg-penlight px-6 py-3 text-sm font-bold text-room transition hover:bg-white">
                  Walk through the pipeline
                </a>
                <Link
                  href="/demo"
                  transitionTypes={["nav-forward"]}
                  className="rounded-full border border-penlight/35 px-6 py-3 text-sm font-bold text-penlight transition hover:border-penlight"
                >
                  See it classify test photos
                </Link>
              </div>
            </div>
          </section>

          <section className="border-b border-rule">
            <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <div className="prose-step">
                <p className="eyebrow mb-3 text-amber-ink">The problem</p>
                <h2 className="mb-5 font-display text-4xl leading-tight text-balance sm:text-5xl">A penlight and a trained eye</h2>
                <p>
                  Clinicians find strabismus with hands-on tests. In the Hirschberg test they shine a penlight at both eyes: when the eyes
                  are aligned, its reflection sits in the same spot on each. When one eye turns, that eye&apos;s reflection sits off-centre,
                  which is what the animation above shows.
                </p>
                <p>
                  Tests like this need a specialist in the room, and reading them is partly a judgement call. We wanted to know whether a
                  neural network could read the same misalignment from a photograph, and tell its kinds apart.
                </p>
              </div>
              <ul className="grid gap-3 self-start sm:grid-cols-2">
                {FLOW_CLASS_ORDER.map((c) => (
                  <li key={c} className={`flex gap-4 rounded-lg border border-rule bg-card p-4 ${c === "NORMAL" ? "sm:col-span-2" : ""}`}>
                    <EyeGlyph cls={c} className="mt-1 w-12 shrink-0" />
                    <div>
                      <p className="font-bold">
                        {CLASS_INFO[c].label} <span className="font-normal text-ink-soft">· {CLASS_INFO[c].short}</span>
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{CLASS_INFO[c].description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="pipeline" className="scroll-mt-4">
            <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
              <div className="prose-step lg:sticky lg:top-24 lg:self-start">
                <p className="eyebrow mb-3 text-amber-ink">The pipeline</p>
                <h2 className="mb-5 font-display text-4xl leading-tight text-balance sm:text-5xl">Six steps from a photo to a class</h2>
                <p>
                  This is the flowchart from our paper. Every box opens its step: what we did there, why, and the real images and code
                  behind it.
                </p>
                <p>
                  Along the way you can follow one photograph — an eye turning inward — from the moment it was collected to the moment it
                  joined the training set.
                </p>
              </div>
              <Flowchart />
            </div>
          </section>

          <section className="border-t border-rule bg-card">
            <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
              <div className="prose-step">
                <p className="eyebrow mb-3 text-amber-ink">The result</p>
                <p className="text-7xl font-bold leading-none tracking-tight sm:text-8xl">{best.accuracy.toFixed(0)}%</p>
                <h2 className="mt-4 mb-5 font-display text-3xl leading-tight text-balance sm:text-4xl">
                  accuracy from EfficientNet-B7 on photos it had never seen
                </h2>
                <p>
                  It beat the three other networks on every metric we measured. The test set was held back from training entirely, so
                  these are photos the models met for the first time.
                </p>
                <Link
                  href="/results"
                  transitionTypes={["nav-forward"]}
                  className="mt-6 inline-block font-bold text-amber-ink underline-offset-4 hover:underline"
                >
                  See every metric and confusion matrix →
                </Link>
              </div>
              <div className="self-center">
                <ModelBars />
              </div>
            </div>
          </section>
        </main>
      </ViewTransition>
      <SiteFooter />
    </>
  );
}
