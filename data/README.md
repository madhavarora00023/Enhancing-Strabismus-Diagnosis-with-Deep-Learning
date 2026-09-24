# Data

The dataset itself is **not published in this repository** — the raw images are photos of real people sourced from public repositories (Kaggle, GitHub, and other online sources), and redistribution rights for those specific images haven't been confirmed. Everything below describes the folder structure the pipeline notebooks expect, so you can regenerate it locally.

## Folder layout (generated locally, gitignored)

| Folder | Contents | Produced by |
|---|---|---|
| `data/raw/` | 517 source images across 5 class folders (`ESOTROPIA`, `EXOTROPIA`, `HYPERTROPIA`, `HYPOTROPIA`, `NORMAL`) | Sourced manually — see note below |
| `data/legacy_denoised/` | 5,170 images — an earlier, larger denoised set not used by the current pipeline | Superseded; kept for reference only |
| `data/denoised/` | 517 images — denoised + aspect-ratio-preserving resize (640px longer side) of `data/raw/` | `notebooks/pipeline/01_denoise_resize.ipynb` |
| `data/split/{train,val,test}/` | 70/15/15 split (360/76/81 images) of `data/denoised/` | `notebooks/pipeline/02_split.ipynb` |
| `data/train_augmented/` | 3,600 images — 10x augmented version of `data/split/train/` only (val/test are never augmented) | `notebooks/pipeline/03_augment.ipynb` |

## Regenerating the dataset

1. Collect your own set of labeled strabismus images into `data/raw/<CLASS_NAME>/`, using the five class names above.
2. Run the three notebooks in `notebooks/pipeline/` in order (01 → 02 → 03).
3. **Before running**: every pipeline notebook currently has hardcoded absolute paths from the original development machines (`E:/Projects/Strabismus/...` locally, `/content/drive/MyDrive/Strabismus_New/...` on Colab). Update these to point at this repo's `data/` folder before running.

## A note on the dataset used in the published results

The results reported in `paper/paper.pdf` and reproduced in `prep/deepdive.md` came from a 517-image dataset assembled from public sources for academic research use. If you're trying to reproduce those specific numbers, be aware there was no fixed random seed anywhere in the split/training code — exact numbers will vary run to run, sometimes by several points (see `prep/deepdive.md` for a documented example with the ResNet50 run).
