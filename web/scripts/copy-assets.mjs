// Copies the dataset images the site shows from ../data into public/images and writes an index.
import fs from "node:fs";
import path from "node:path";

const WEB = path.resolve(import.meta.dirname, "..");
const DATA = path.resolve(WEB, "..", "data");
const OUT = path.join(WEB, "public", "images");
const CLASSES = ["ESOTROPIA", "EXOTROPIA", "HYPERTROPIA", "HYPOTROPIA", "NORMAL"];
const SAMPLES_PER_CLASS = 6;
const THREAD = { cls: "ESOTROPIA", id: "1" };
const DENOISE_PAIRS = [["ESOTROPIA", "1"], ["EXOTROPIA", "2"], ["HYPOTROPIA", "2"]];

const safe = (name) => name.replace(/\((\d+)\)/g, "-$1").toLowerCase();
const byNumber = (a, b) => parseInt(a) - parseInt(b) || a.localeCompare(b);
const images = (dir) => fs.readdirSync(dir).filter((f) => /\.(jpe?g|png)$/i.test(f));

function copy(src, destRel) {
  const dest = path.join(OUT, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return `/images/${destRel.replaceAll("\\", "/")}`;
}

function jpegSize(file) {
  const b = fs.readFileSync(file);
  for (let i = 2; i < b.length; ) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    if (marker >= 0xc0 && marker <= 0xc3) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error(`no JPEG size in ${file}`);
}

fs.rmSync(OUT, { recursive: true, force: true });
const index = { samples: {}, thread: {}, denoise: [], test: [], counts: {} };

for (const cls of CLASSES) {
  const raw = images(path.join(DATA, "raw", cls)).filter((f) => !f.includes("(")).sort(byNumber);
  index.samples[cls] = raw.slice(0, SAMPLES_PER_CLASS).map((f) => {
    const src = path.join(DATA, "raw", cls, f);
    return { src: copy(src, `samples/${cls.toLowerCase()}/${safe(f)}`), ...jpegSize(src) };
  });
  index.counts[cls] = {
    raw: images(path.join(DATA, "raw", cls)).length,
    train: images(path.join(DATA, "split", "train", cls)).length,
    val: images(path.join(DATA, "split", "val", cls)).length,
    test: images(path.join(DATA, "split", "test", cls)).length,
    augmented: images(path.join(DATA, "train_augmented", cls)).length,
  };
}

const t = THREAD;
const threadRaw = path.join(DATA, "raw", t.cls, `${t.id}.jpg`);
const threadDenoised = path.join(DATA, "denoised", t.cls, `${t.id}.jpg`);
index.thread = {
  cls: t.cls,
  raw: { src: copy(threadRaw, "thread/raw.jpg"), ...jpegSize(threadRaw) },
  denoised: { src: copy(threadDenoised, "thread/denoised.jpg"), ...jpegSize(threadDenoised) },
  augmented: images(path.join(DATA, "train_augmented", t.cls))
    .filter((f) => f.startsWith(`${t.id}_`))
    .sort()
    .map((f) => ({ variant: f.slice(t.id.length + 1).replace(/\.jpe?g$/i, ""), src: copy(path.join(DATA, "train_augmented", t.cls, f), `thread/${f}`) })),
};

for (const [cls, id] of DENOISE_PAIRS) {
  const raw = path.join(DATA, "raw", cls, `${id}.jpg`);
  const den = path.join(DATA, "denoised", cls, `${id}.jpg`);
  index.denoise.push({
    cls,
    raw: { src: copy(raw, `denoise/${cls.toLowerCase()}-${id}-raw.jpg`), ...jpegSize(raw) },
    denoised: { src: copy(den, `denoise/${cls.toLowerCase()}-${id}-denoised.jpg`), ...jpegSize(den) },
  });
}

for (const cls of CLASSES) {
  for (const f of images(path.join(DATA, "split", "test", cls)).sort(byNumber)) {
    const src = path.join(DATA, "split", "test", cls, f);
    index.test.push({ file: `${cls}/${f}`, cls, src: copy(src, `test/${cls.toLowerCase()}/${safe(f)}`), ...jpegSize(src) });
  }
}

fs.copyFileSync(path.resolve(WEB, "..", "paper", "paper.pdf"), path.join(WEB, "public", "paper.pdf"));
fs.mkdirSync(path.join(WEB, "src", "data"), { recursive: true });
fs.writeFileSync(path.join(WEB, "src", "data", "images.json"), JSON.stringify(index, null, 1));
console.log(`copied ${Object.values(index.samples).flat().length} samples, ${index.thread.augmented.length} thread variants, ${index.denoise.length} denoise pairs, ${index.test.length} test images`);
