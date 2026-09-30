# Strabismus — website

The site at [strabismus.madhavarora.com](https://strabismus.madhavarora.com): an interactive walkthrough of the paper's pipeline, from data collection to results.

Built with Next.js 16 (App Router, fully static), React view transitions and Tailwind CSS v4. Every page is prerendered at build time, including per-page link-preview images.

## Run locally

```bash
npm install
npm run dev
```

## Where things live

| Path | What it is |
|---|---|
| `src/content/site.ts` | All copy that isn't page-specific: steps, classes, model descriptions, and the paper's published metrics and confusion matrices |
| `src/app/<step>/page.tsx` | One page per flowchart box |
| `src/components/Flowchart.tsx` | The paper's Fig. 1, rebuilt as links |
| `src/components/HeroEyes.tsx` | The penlight animation (pure SVG + CSS keyframes, no JavaScript) |
| `src/data/images.json`, `public/images/` | Dataset images shown on the site, copied by `npm run assets` |
| `src/data/demo.json` | Demo gallery predictions and Grad-CAM heatmaps, built by `npm run artifacts` |

## Updating data

```bash
npm run assets                                   # re-copy images from ../data (run after dataset changes)
npm run artifacts -- efficientnet_b7 corrected   # import predictions from ../training/site_artifacts
```

Until `../training/site_artifacts/` exists, `npm run artifacts` writes clearly flagged placeholder predictions, and the demo page shows a "Preview data" notice.

## Deploying

Import the GitHub repository into Vercel with **Root Directory** set to `web`. Then add the custom domain `strabismus.madhavarora.com`, and in Cloudflare create a `CNAME` record `strabismus` → `cname.vercel-dns.com` with the proxy turned off (DNS only).
