import type { Metadata } from "next";
import { ViewTransition } from "react";
import { DemoGallery } from "@/components/DemoGallery";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { SLIDE } from "@/components/StepShell";
import demo from "@/data/demo.json";

export const metadata: Metadata = {
  title: "Demo",
  description: "Pick any of the 81 test photos to see EfficientNet-B7's prediction, its confidence for each class, and where in the photo it looked.",
};

export default function Demo() {
  return (
    <>
      <SiteHeader />
      <ViewTransition enter={SLIDE} exit={SLIDE} default="none">
        <main className="mx-auto w-full max-w-6xl px-4 pt-14 pb-24 sm:px-6 sm:pt-20">
          <p className="eyebrow text-amber-ink">Demo · EfficientNet-B7</p>
          <h1 className="mt-3 max-w-3xl font-display text-title text-balance">See it classify test photos</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            These are the 81 test photos; none of them were used in training. Pick one to see what the model predicted, how confident
            it was about each class, and which parts of the photo drove its answer.
          </p>
          {demo.placeholder && (
            <p role="note" className="mt-8 max-w-3xl rounded-lg border border-amber bg-[#fbeedb] px-5 py-4 text-sm leading-relaxed">
              <strong>Preview data.</strong> The predictions and heatmaps on this page are placeholders while the models are being
              retrained. They will be replaced with EfficientNet-B7&apos;s real outputs.
            </p>
          )}
          <div className="mt-12">
            <DemoGallery items={demo.items} placeholder={demo.placeholder} />
          </div>
          <div className="mt-16 grid gap-6 border-t border-rule pt-8 text-sm leading-relaxed text-ink-soft md:grid-cols-2">
            <p>
              <strong className="text-ink">How the glow is made.</strong> It is a Grad-CAM heatmap: it traces the model&apos;s answer back
              through its last layer of image features and highlights the regions that pushed it toward that class. A model that has
              learned the right thing should light up around the eyes.
            </p>
            <p>
              <strong className="text-ink">Not a diagnosis.</strong> This is a research demo trained on 517 photos. It cannot tell you
              anything about your own eyes; an eye-care professional can.
            </p>
          </div>
        </main>
      </ViewTransition>
      <SiteFooter />
    </>
  );
}
