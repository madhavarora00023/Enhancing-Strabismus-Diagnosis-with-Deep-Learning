import Link from "next/link";
import { PAPER } from "@/content/site";
import { EyeGlyph } from "./icons";

const NAV = [
  { href: "/#pipeline", label: "Pipeline" },
  { href: "/results", label: "Results" },
  { href: "/demo", label: "Demo" },
  { href: "/paper", label: "Paper" },
];

export function SiteHeader({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={
        dark
          ? "absolute inset-x-0 top-0 z-30 text-penlight"
          : "sticky top-0 z-30 border-b border-rule/70 bg-paper/85 text-ink backdrop-blur-md"
      }
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" transitionTypes={["nav-back"]} className="flex items-center gap-2 font-display text-xl tracking-tight">
          <EyeGlyph cls="NORMAL" className="w-7" />
          Strabismus
        </Link>
        <nav aria-label="Site" className="flex items-center gap-4 text-sm sm:gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${item.href === "/#pipeline" ? "hidden sm:inline" : ""} underline-offset-4 hover:underline ${dark ? "text-penlight/80 hover:text-penlight" : "text-ink-soft hover:text-ink"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-room text-penlight/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-display text-2xl text-penlight">{PAPER.title}</p>
          <p className="mt-3 text-sm">
            {PAPER.authors.join(", ")} · {PAPER.affiliation}
          </p>
          <p className="mt-1 text-sm">
            {PAPER.conferenceShort}, {PAPER.dates} · Paper {PAPER.paperId}
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <p>
            <strong className="font-bold text-penlight">A research project, not a medical device.</strong> Nothing on this site is a
            diagnosis. See an eye-care professional about any concern with your eyes.
          </p>
          <p>Photos were collected from open sources for research use. If one of them is yours and you want it removed, open an issue on GitHub.</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
            <a className="text-amber-glow underline-offset-4 hover:underline" href={PAPER.repo}>
              Code on GitHub
            </a>
            <a className="text-amber-glow underline-offset-4 hover:underline" href={PAPER.pdf}>
              Paper (PDF)
            </a>
            <a className="text-amber-glow underline-offset-4 hover:underline" href={PAPER.portfolio}>
              madhavarora.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
