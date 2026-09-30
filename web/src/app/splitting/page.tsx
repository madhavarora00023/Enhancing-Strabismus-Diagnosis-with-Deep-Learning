import type { Metadata } from "next";
import { SplitDots } from "@/components/SplitDots";
import { Section, Stat, StepShell } from "@/components/StepShell";
import { ThreadCard } from "@/components/ThreadCard";
import images from "@/data/images.json";

export const metadata: Metadata = {
  title: "Splitting",
  description: "How the 517 photos were divided 70/15/15 into training, validation and test sets, and why that happened before augmentation.",
};

const SETS = [
  { name: "Training", n: 360, job: "The only photos the models learn from." },
  { name: "Validation", n: 76, job: "Checked after every round of training, to decide when to slow down or stop." },
  { name: "Test", n: 81, job: "Locked away until the very end. Every result on this site comes from these photos." },
];

function Tile({ label, tone }: { label: string; tone: "train" | "test" | "leak" }) {
  const styles = {
    train: "border-flow-line bg-flow",
    test: "border-ink bg-card",
    leak: "border-amber bg-[#fbeedb]",
  };
  return <span className={`flex h-9 items-center justify-center rounded border px-2 font-mono text-xs ${styles[tone]}`}>{label}</span>;
}

function LeakDiagram() {
  const copies = ["A", "A flipped", "A brighter", "A grey"];
  return (
    <figure className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-rule bg-card p-4">
        <p className="text-sm font-bold">Split first, then copy</p>
        <p className="mt-1 mb-4 text-xs text-ink-soft">What we did</p>
        <p className="eyebrow mb-2 text-ink-soft">Training</p>
        <div className="grid grid-cols-2 gap-1.5">
          {copies.map((c) => (
            <Tile key={c} label={c} tone="train" />
          ))}
        </div>
        <p className="eyebrow mt-4 mb-2 text-ink-soft">Test</p>
        <div className="grid grid-cols-2 gap-1.5">
          <Tile label="B" tone="test" />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-ink-soft">Photo B stays unseen. The test is fair.</p>
      </div>
      <div className="rounded-lg border border-rule bg-card p-4">
        <p className="text-sm font-bold">Copy first, then split</p>
        <p className="mt-1 mb-4 text-xs text-ink-soft">What we avoided</p>
        <p className="eyebrow mb-2 text-ink-soft">Training</p>
        <div className="grid grid-cols-2 gap-1.5">
          <Tile label="A" tone="train" />
          <Tile label="A flipped" tone="leak" />
          <Tile label="A grey" tone="train" />
        </div>
        <p className="eyebrow mt-4 mb-2 text-ink-soft">Test</p>
        <div className="grid grid-cols-2 gap-1.5">
          <Tile label="A brighter" tone="leak" />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-ink-soft">
          <span className="font-bold text-amber-ink">Leak:</span> the test holds a near-copy of a training photo, so the score comes out too
          high.
        </p>
      </div>
    </figure>
  );
}

export default function Splitting() {
  const counts = Object.fromEntries(Object.entries(images.counts).map(([c, v]) => [c, { train: v.train, val: v.val, test: v.test }]));
  return (
    <StepShell slug="splitting">
      <Section eyebrow="70 / 15 / 15" title="Three sets, chosen before anything else" aside={<SplitDots counts={counts} />}>
        <p>
          The preprocessed photos were divided into training, validation and test sets in a 70:15:15 ratio. The split was made class by
          class, so every set keeps the same mix of the five classes.
        </p>
        <div className="mt-8 flex flex-wrap gap-8">
          {SETS.map((s) => (
            <Stat key={s.name} value={String(s.n)} label={`${s.name.toLowerCase()} photos`} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Three jobs"
        title="Why three sets and not two"
        aside={
          <ul className="space-y-3">
            {SETS.map((s) => (
              <li key={s.name} className="flex gap-4 rounded-lg border border-rule bg-card p-4">
                <span className="w-14 shrink-0 font-mono text-2xl tabular-nums">{s.n}</span>
                <span>
                  <span className="font-bold">{s.name}</span>
                  <span className="mt-0.5 block text-sm text-ink-soft">{s.job}</span>
                </span>
              </li>
            ))}
          </ul>
        }
      >
        <p>
          A model can look good on photos it has studied and still fail on new ones. Keeping photos aside is how you measure what it
          actually learned.
        </p>
        <p>
          Validation photos guide training while it runs. Test photos are never used for any decision, so the final score is a clean
          measure of how the model handles photos it has never seen.
        </p>
      </Section>

      <Section eyebrow="The order matters" title="Why we split before augmenting" aside={<LeakDiagram />}>
        <p>
          The next step makes ten versions of every training photo. If we had made the copies first and split afterwards, a
          photo&apos;s flipped version could land in training while its brighter twin landed in the test set.
        </p>
        <p>
          The model would then be tested on photos it had effectively already seen, and its score would look better than it really is.
          This is called data leakage. Splitting first keeps the test set honest: none of its photos, or any version of them, is ever
          used for training.
        </p>
      </Section>

      <ThreadCard image={images.thread.denoised} stage="Split">
        Our esotropia photo landed in the training set, so it will be one of the photos the models learn from — and the next step
        turns it into ten.
      </ThreadCard>
    </StepShell>
  );
}
