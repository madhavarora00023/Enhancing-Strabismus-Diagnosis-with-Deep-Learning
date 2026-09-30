import type { Metadata } from "next";
import { BeforeAfter } from "@/components/BeforeAfter";
import { OrientDemo, ResizeDemo } from "@/components/explainers";
import { Section, StepShell } from "@/components/StepShell";
import { ThreadCard } from "@/components/ThreadCard";
import images from "@/data/images.json";

export const metadata: Metadata = {
  title: "Data Preprocessing",
  description: "Auto orientation, resizing to 227 × 227 pixels and denoising: how every eye photo was standardised before training.",
};

export default function Preprocessing() {
  return (
    <StepShell slug="preprocessing">
      <Section id="auto-orientation" eyebrow="2.1" title="Auto orientation" aside={<OrientDemo image={images.thread.raw} />}>
        <p>
          Photos from the open web arrive tilted — by the camera, or by how the person was holding their head. Auto orientation
          corrected each image to a consistent upright alignment across the dataset.
        </p>
        <p>
          It removes a difference that has nothing to do with strabismus, so the models compare eyes rather than camera angles.
        </p>
      </Section>

      <Section id="resizing" eyebrow="2.2" title="Resizing" aside={<ResizeDemo image={images.thread.raw} />}>
        <p>
          Every photo came in at its own size. All of them were resized to 227 × 227 pixels, the input size the models expect.
        </p>
        <p>
          A fixed size means every image carries the same amount of detail into the network, and the network&apos;s first layer can
          be built for exactly that shape.
        </p>
      </Section>

      <Section id="denoising" eyebrow="2.3" title="Denoising" aside={<BeforeAfter pairs={images.denoise} />}>
        <p>
          Photos collected from the web carry camera grain and compression artifacts. A denoising pass cleaned them up before training,
          improving clarity so the models see the eye rather than the noise.
        </p>
        <p>
          We used OpenCV&apos;s non-local means filter. It replaces each pixel with an average of similar-looking patches from across
          the image, which removes grain while keeping sharp edges — like the rim of the iris — intact.
        </p>
      </Section>

      <ThreadCard image={images.thread.denoised} stage="Preprocessed">
        Our esotropia photo after preprocessing: upright, standardised and denoised, ready to be split.
      </ThreadCard>
    </StepShell>
  );
}
