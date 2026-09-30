# Data

**Download:** [Google Drive](https://drive.google.com/drive/folders/1pU6S3G0Rm6ZIIHgLfFS3Q_aARTXCGxxk). The folders are kept out of git because of their size.

The 517 photos were handpicked from open-source sites (Kaggle, GitHub and other public repositories), cropped to the eye region and labelled in CVAT. They are shared for research use. If a photo is yours and you would like it removed, open an issue on this repository.

## Folder layout (gitignored)

| Folder | Contents | Produced by |
|---|---|---|
| `data/raw/` | 517 source images across 5 class folders (`ESOTROPIA`, `EXOTROPIA`, `HYPERTROPIA`, `HYPOTROPIA`, `NORMAL`) | Collected and labelled by hand |
| `data/denoised/` | The same 517 images, denoised and resized so the longer side is 640 px | `notebooks/pipeline/01_denoise_resize.ipynb` |
| `data/split/{train,val,test}/` | 70/15/15 split (360/76/81 images) of `data/denoised/` | `notebooks/pipeline/02_split.ipynb` |
| `data/train_augmented/` | 3,600 images: 10 versions of each training image (val/test are never augmented) | `notebooks/pipeline/03_augment.ipynb` |
| `data/legacy_denoised/` | 5,170 images: all 517 photos augmented 10× *before* splitting. Not used by the final pipeline, because splitting after augmenting would put near-copies of test photos into training | An earlier iteration |

## Known issue: duplicate photos

Eight photos in `HYPOTROPIA` were saved twice (for example `55.jpg` and `55(1).jpg`, byte-identical). Two of those pairs ended up on opposite sides of the split, so 2 of the 81 test photos have an identical twin in training. `training/prepare_data.py` detects this, including resized, re-saved or mirrored near-copies, and every retraining run reports its test score both with and without those photos. The split itself is left exactly as used in the paper.

## Regenerating the dataset

1. Put labelled images into `data/raw/<CLASS_NAME>/`, using the five class names above.
2. Run the three notebooks in `notebooks/pipeline/` in order (01 → 02 → 03). They still contain the original machines' absolute paths (`E:/Projects/Strabismus/...` locally, `/content/drive/MyDrive/Strabismus_New/...` on Colab); point them at this repo's `data/` folder first.

The original notebooks set no random seed, so a fresh split will differ from the one used in the paper. To reproduce the paper's split, download the `data/split/` folders from Google Drive instead of regenerating them.
