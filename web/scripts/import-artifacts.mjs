// Builds src/data/demo.json from ../training/site_artifacts, or flagged placeholder data until training finishes.
import fs from "node:fs";
import path from "node:path";

const WEB = path.resolve(import.meta.dirname, "..");
const MODEL = process.argv[2] ?? "efficientnet_b7";
const VARIANT = process.argv[3] ?? "corrected";
const ARTIFACTS = path.resolve(WEB, "..", "training", "site_artifacts", MODEL, VARIANT);
const CLASSES = ["ESOTROPIA", "EXOTROPIA", "HYPERTROPIA", "HYPOTROPIA", "NORMAL"];
const images = JSON.parse(fs.readFileSync(path.join(WEB, "src", "data", "images.json"), "utf8"));

let demo;
if (fs.existsSync(path.join(ARTIFACTS, "predictions.json"))) {
  const predictions = JSON.parse(fs.readFileSync(path.join(ARTIFACTS, "predictions.json"), "utf8"));
  const gradcam = JSON.parse(fs.readFileSync(path.join(ARTIFACTS, "gradcam.json"), "utf8"));
  const byFile = Object.fromEntries(predictions.map((p) => [p.file, p]));
  demo = {
    placeholder: false,
    model: MODEL,
    variant: VARIANT,
    items: images.test.map((img) => ({
      ...img,
      pred: byFile[img.file].pred,
      probs: byFile[img.file].probs,
      heatmap: gradcam[img.file]?.heatmap ?? null,
    })),
  };
} else {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  demo = {
    placeholder: true,
    model: MODEL,
    variant: VARIANT,
    items: images.test.map((img) => {
      const t = CLASSES.indexOf(img.cls);
      const correct = rand() < 0.84;
      const p = correct ? t : (t + 1 + Math.floor(rand() * 4)) % 5;
      const raw = CLASSES.map((_, i) => (i === p ? 3 + rand() * 3 : rand()));
      const sum = raw.reduce((a, b) => a + b, 0);
      const heatmap = Array.from({ length: 10 }, (_, y) =>
        Array.from({ length: 10 }, (_, x) => {
          const d = Math.min((x - 2.5) ** 2 + (y - 4.5) ** 2, (x - 7.5) ** 2 + (y - 4.5) ** 2);
          return Math.round(Math.exp(-d / 1.6) * 1000) / 1000;
        }),
      );
      return { ...img, pred: CLASSES[p], probs: raw.map((v) => Math.round((v / sum) * 1e5) / 1e5), heatmap };
    }),
  };
}

fs.writeFileSync(path.join(WEB, "src", "data", "demo.json"), JSON.stringify(demo));
console.log(`demo.json: ${demo.items.length} items, placeholder=${demo.placeholder}, model=${MODEL}/${VARIANT}`);
