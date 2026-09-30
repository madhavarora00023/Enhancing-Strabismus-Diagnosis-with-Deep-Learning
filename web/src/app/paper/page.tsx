import type { Metadata } from "next";
import { ViewTransition } from "react";
import { CopyButton } from "@/components/CopyButton";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { SLIDE } from "@/components/StepShell";
import { PAPER } from "@/content/site";

export const metadata: Metadata = {
  title: "Paper",
  description: `${PAPER.title}. ${PAPER.conference}, ${PAPER.dates}.`,
};

const BIBTEX = `@inproceedings{gupta2025strabismus,
  title     = {${PAPER.title}},
  author    = {Gupta, Bhumit and Arora, Madhav and Garg, Shubh and Ghosh, Debabrata},
  booktitle = {${PAPER.conference}},
  year      = {2025},
  address   = {Tiruchengode, Tamil Nadu, India},
  note      = {Paper ID ${PAPER.paperId}}
}`;

const PLAIN = `B. Gupta, M. Arora, S. Garg and D. Ghosh, "${PAPER.title}," in ${PAPER.conference}, Tiruchengode, India, 2025, Paper ID ${PAPER.paperId}.`;

export default function Paper() {
  return (
    <>
      <SiteHeader />
      <ViewTransition enter={SLIDE} exit={SLIDE} default="none">
        <main className="mx-auto w-full max-w-4xl px-4 pt-14 pb-24 sm:px-6 sm:pt-20">
          <p className="eyebrow text-amber-ink">
            {PAPER.conferenceShort} · Paper {PAPER.paperId}
          </p>
          <h1 className="mt-4 font-display text-title text-balance">{PAPER.title}</h1>
          <p className="mt-6 text-lg">{PAPER.authors.join(", ")}</p>
          <p className="mt-1 text-ink-soft">{PAPER.affiliation}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={PAPER.pdf} className="rounded-full bg-room px-5 py-2.5 text-sm font-bold text-penlight transition hover:bg-ink">
              Read the paper (PDF)
            </a>
            <a href={PAPER.repo} className="rounded-full border border-rule bg-card px-5 py-2.5 text-sm font-bold transition hover:border-flow-line">
              Code on GitHub
            </a>
            <a href={PAPER.dataset} className="rounded-full border border-rule bg-card px-5 py-2.5 text-sm font-bold transition hover:border-flow-line">
              Dataset on Google Drive
            </a>
          </div>

          <dl className="mt-12 grid gap-6 border-y border-rule py-8 sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-ink-soft">Conference</dt>
              <dd className="mt-1.5">{PAPER.conference}</dd>
            </div>
            <div>
              <dt className="eyebrow text-ink-soft">Where and when</dt>
              <dd className="mt-1.5">
                {PAPER.venue}, {PAPER.dates}
              </dd>
            </div>
          </dl>

          <section aria-labelledby="abstract" className="mt-12">
            <h2 id="abstract" className="mb-4 font-display text-3xl">
              Abstract
            </h2>
            <p className="max-w-[68ch] text-lg leading-relaxed">{PAPER.abstract}</p>
          </section>

          <section aria-labelledby="cite" className="mt-14">
            <h2 id="cite" className="mb-4 font-display text-3xl">
              Cite this paper
            </h2>
            <div className="rounded-lg border border-rule bg-card p-5">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-sm font-bold">Plain text</p>
                <CopyButton text={PLAIN} label="Copy" />
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">{PLAIN}</p>
            </div>
            <div className="mt-4 rounded-lg border border-rule bg-card p-5">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-sm font-bold">BibTeX</p>
                <CopyButton text={BIBTEX} label="Copy" />
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-ink-soft">{BIBTEX}</pre>
            </div>
          </section>
        </main>
      </ViewTransition>
      <SiteFooter />
    </>
  );
}
