import Link from "next/link";
import { PosedEyes } from "@/components/HeroEyes";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center">
        <div className="w-full max-w-sm rounded-lg bg-room p-6">
          <PosedEyes cls="EXOTROPIA" className="h-auto w-full" />
        </div>
        <h1 className="mt-10 font-display text-4xl">This page looked the other way</h1>
        <p className="mt-4 text-ink-soft">There is nothing at this address. The pipeline starts from the home page.</p>
        <Link href="/" className="mt-8 rounded-full bg-room px-6 py-3 text-sm font-bold text-penlight">
          Go to the home page
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
