export const CLASSES = ["ESOTROPIA", "EXOTROPIA", "HYPERTROPIA", "HYPOTROPIA", "NORMAL"] as const;
export type ClassName = (typeof CLASSES)[number];

export const CLASS_INFO: Record<ClassName, { label: string; short: string; description: string }> = {
  ESOTROPIA: {
    label: "Esotropia",
    short: "turns in",
    description: "One eye turns inward, toward the nose, while the other looks straight ahead.",
  },
  EXOTROPIA: {
    label: "Exotropia",
    short: "turns out",
    description: "One eye turns outward, toward the ear, while the other looks straight ahead.",
  },
  HYPERTROPIA: {
    label: "Hypertropia",
    short: "turns up",
    description: "One eye sits higher than the other, so its line of sight points upward.",
  },
  HYPOTROPIA: {
    label: "Hypotropia",
    short: "turns down",
    description: "One eye sits lower than the other, so its line of sight points downward.",
  },
  NORMAL: {
    label: "Normal",
    short: "aligned",
    description: "Both eyes point the same way, and a penlight's reflection lands in the same spot on each.",
  },
};

export const FLOW_CLASS_ORDER: ClassName[] = ["HYPERTROPIA", "HYPOTROPIA", "NORMAL", "ESOTROPIA", "EXOTROPIA"];

export type Part = { id: string; title: string; href: string };
export type Step = {
  slug: string;
  n: number;
  title: string;
  summary: string;
  parts: Part[];
};

export const MODELS = [
  { id: "alexnet", title: "AlexNet", flowTitle: "AlexNet" },
  { id: "vgg19", title: "VGG19", flowTitle: "VGGNet19" },
  { id: "resnet50", title: "ResNet50", flowTitle: "ResNet50" },
  { id: "efficientnet-b7", title: "EfficientNet-B7", flowTitle: "EfficientNetB7" },
] as const;
export type ModelId = (typeof MODELS)[number]["id"];

export const STEPS: Step[] = [
  {
    slug: "data-collection",
    n: 1,
    title: "Data Collection",
    summary: "517 eye photographs, handpicked from open sources, cropped to the eyes and labelled into five classes.",
    parts: [],
  },
  {
    slug: "preprocessing",
    n: 2,
    title: "Data Preprocessing",
    summary: "Every photo is turned upright, resized to one standard size and cleaned of noise.",
    parts: [
      { id: "auto-orientation", title: "Auto Orientation", href: "/preprocessing#auto-orientation" },
      { id: "resizing", title: "Resizing", href: "/preprocessing#resizing" },
      { id: "denoising", title: "Denoising", href: "/preprocessing#denoising" },
    ],
  },
  {
    slug: "splitting",
    n: 3,
    title: "Splitting",
    summary: "The photos are divided 70/15/15 into training, validation and test sets before anything else touches them.",
    parts: [],
  },
  {
    slug: "augmentation",
    n: 4,
    title: "Data Augmentation",
    summary: "Each training photo becomes ten: flipped, brightened, contrast-shifted and greyscale versions.",
    parts: [
      { id: "flipping", title: "Flipping", href: "/augmentation#flipping" },
      { id: "brightness", title: "Brightness", href: "/augmentation#brightness" },
      { id: "contrast", title: "Contrast Adjustment", href: "/augmentation#contrast" },
      { id: "grayscale", title: "Grayscale Conversion", href: "/augmentation#grayscale" },
    ],
  },
  {
    slug: "classification",
    n: 5,
    title: "Classification",
    summary: "Four neural networks learn to sort the photos: AlexNet, VGG19, ResNet50 and EfficientNet-B7.",
    parts: MODELS.map((m) => ({ id: m.id, title: m.flowTitle, href: `/classification/${m.id}` })),
  },
  {
    slug: "classes",
    n: 6,
    title: "Strabismus Classes",
    summary: "Every photo ends up in one of five classes: four kinds of misalignment, or normal.",
    parts: FLOW_CLASS_ORDER.map((c) => ({ id: c.toLowerCase(), title: CLASS_INFO[c].label, href: `/classes#${c.toLowerCase()}` })),
  },
];

export const stepBySlug = (slug: string) => {
  const step = STEPS.find((s) => s.slug === slug);
  if (!step) throw new Error(`unknown step ${slug}`);
  return step;
};

export const PAPER = {
  title: "Enhancing Strabismus Diagnosis from Detection to Classification with Deep Learning",
  authors: ["Bhumit Gupta", "Madhav Arora", "Shubh Garg", "Dr. Debabrata Ghosh"],
  affiliation: "Thapar Institute of Engineering and Technology, Patiala",
  conference: "Third International Conference on Artificial Intelligence and Machine Learning Applications (AIMLA)",
  conferenceShort: "AIMLA 2025",
  dates: "29–30 April 2025",
  venue: "K.S. Rangasamy College of Technology, Tamil Nadu, India",
  paperId: "1140",
  pdf: "/paper.pdf",
  repo: "https://github.com/madhavarora00023/Enhancing-Strabismus-Diagnosis-with-Deep-Learning",
  dataset: "https://drive.google.com/drive/folders/1pU6S3G0Rm6ZIIHgLfFS3Q_aARTXCGxxk",
  portfolio: "https://madhavarora.com",
  abstract:
    "Accurate and early diagnosis of strabismus, a disorder characterized by ocular misalignment, is essential to prevent long-term visual impairment. Traditional diagnostic approaches heavily rely on clinical expertise, often introducing subjectivity and inconsistency. In this study, we propose a deep learning-based framework for automated strabismus classification using four state-of-the-art convolutional neural networks — EfficientNet-B7, ResNet-50, AlexNet, and VGGNet-19. The models are trained on a diverse open-source dataset to classify strabismus into five categories: Esotropia, Exotropia, Hypertropia, Hypotropia, and Normal eye alignment. Our extensive experiments demonstrate that EfficientNet-B7 outperforms other models, achieving superior accuracy and generalization across evaluation metrics, including precision, recall, and F1-score.",
};

export type Metrics = { accuracy: number; precision: number; recall: number; f1: number };

// Table I and Figs. 2–5 of the published paper; confusion rows are true classes in CLASSES order, normalised per row.
export const PUBLISHED: Record<ModelId, { metrics: Metrics; confusion: number[][] }> = {
  alexnet: {
    metrics: { accuracy: 59.26, precision: 58.88, recall: 59.26, f1: 58.71 },
    confusion: [
      [0.73, 0.07, 0.07, 0.0, 0.13],
      [0.0, 0.65, 0.06, 0.18, 0.12],
      [0.19, 0.19, 0.44, 0.19, 0.0],
      [0.12, 0.12, 0.12, 0.44, 0.19],
      [0.06, 0.06, 0.06, 0.12, 0.71],
    ],
  },
  vgg19: {
    metrics: { accuracy: 66.67, precision: 67.45, recall: 66.67, f1: 67.0 },
    confusion: [
      [0.8, 0.13, 0.0, 0.0, 0.07],
      [0.06, 0.47, 0.18, 0.24, 0.06],
      [0.06, 0.25, 0.62, 0.06, 0.0],
      [0.06, 0.12, 0.06, 0.69, 0.06],
      [0.0, 0.18, 0.06, 0.0, 0.76],
    ],
  },
  resnet50: {
    metrics: { accuracy: 74.0, precision: 79.0, recall: 73.0, f1: 74.0 },
    confusion: [
      [0.93, 0.0, 0.0, 0.0, 0.07],
      [0.24, 0.59, 0.12, 0.0, 0.06],
      [0.0, 0.06, 0.88, 0.06, 0.0],
      [0.0, 0.25, 0.12, 0.62, 0.0],
      [0.0, 0.18, 0.06, 0.06, 0.71],
    ],
  },
  "efficientnet-b7": {
    metrics: { accuracy: 84.0, precision: 85.0, recall: 83.0, f1: 84.4 },
    confusion: [
      [0.8, 0.07, 0.0, 0.07, 0.07],
      [0.06, 0.76, 0.0, 0.06, 0.12],
      [0.06, 0.0, 0.94, 0.0, 0.0],
      [0.0, 0.06, 0.06, 0.75, 0.12],
      [0.0, 0.0, 0.0, 0.06, 0.94],
    ],
  },
};

export const MODEL_DETAILS: Record<
  ModelId,
  { role: string; paper: string; transfer: string; layers: { name: string; note?: string }[]; techniques: string[] }
> = {
  alexnet: {
    role: "The baseline, used to understand how a network extracts features from this data.",
    paper:
      "The AlexNet-based model was used to examine feature extraction and understand how the model operates. It incorporated DepthwiseConv2D layers, adaptive learning-rate scheduling and early stopping, mixed-precision training and the AdamW optimizer.",
    transfer: "The baseline, built to study feature extraction",
    layers: [
      { name: "Conv 11×11, 96 filters", note: "stride 4" },
      { name: "Batch norm + max pool" },
      { name: "Depthwise conv 5×5" },
      { name: "Batch norm + max pool" },
      { name: "Conv 3×3 ×3", note: "384 · 384 · 256" },
      { name: "Max pool → global average pool" },
      { name: "Dense 4096 → dropout" },
      { name: "Dense 4096 → dropout" },
      { name: "Softmax, 5 classes" },
    ],
    techniques: ["DepthwiseConv2D", "Mixed precision", "AdamW", "Label smoothing", "Adaptive learning rate", "Early stopping"],
  },
  vgg19: {
    role: "A deep, uniform stack of 3×3 convolutions, pretrained on ImageNet and fine-tuned in stages.",
    paper:
      "VGGNet-19 used Flatten layers, Batch Normalization and Dropout, with adjusted fully connected layers. A progressive unfreezing approach gradually unfroze deeper layers for task-specific features, while the outer layers stayed frozen to keep their learned representations.",
    transfer: "ImageNet weights, progressive unfreezing",
    layers: [
      { name: "VGG19 convolutional base", note: "16 conv layers, ImageNet" },
      { name: "Flatten" },
      { name: "Dense 512 → batch norm → dropout" },
      { name: "Dense 256 → batch norm → dropout" },
      { name: "Dense 128 → batch norm → dropout" },
      { name: "Softmax, 5 classes" },
    ],
    techniques: ["Transfer learning", "Progressive unfreezing", "Batch normalization", "Dropout", "L2 regularization"],
  },
  resnet50: {
    role: "A residual network whose skip connections let a very deep model train stably.",
    paper:
      "ResNet-50 was initialised from pretrained weights with the last 75 layers unfrozen for domain-specific feature learning, adding Conv2D, Global Average Pooling, Dropout and Layer Normalization, fully connected ReLU layers, and a softmax output.",
    transfer: "ImageNet weights, last 75 layers unfrozen",
    layers: [
      { name: "ResNet50 residual base", note: "ImageNet" },
      { name: "Conv 3×3, 512 filters → batch norm" },
      { name: "Global average pool" },
      { name: "Dense 1024 → dropout" },
      { name: "Dense 512 → layer norm" },
      { name: "Dense 256 → dropout" },
      { name: "Softmax, 5 classes" },
    ],
    techniques: ["Transfer learning", "Residual connections", "Layer normalization", "Dropout", "AdamW"],
  },
  "efficientnet-b7": {
    role: "The largest EfficientNet, which scales depth, width and resolution together. The best performer.",
    paper:
      "EfficientNet-B7 was selected as the final model because it outperformed the others. It integrated Conv2D layers, Global Average Pooling, weight-decay regularization and an adaptive learning-rate optimizer, with the last 30 layers unfrozen to refine its representations on this dataset.",
    transfer: "ImageNet weights, last 30 layers unfrozen",
    layers: [
      { name: "EfficientNet-B7 base", note: "compound-scaled, ImageNet" },
      { name: "Conv 3×3, 512 filters → batch norm" },
      { name: "Global average pool" },
      { name: "Dense 1024 → dropout" },
      { name: "Dense 512 → layer norm" },
      { name: "Dense 256 → dropout" },
      { name: "Softmax, 5 classes" },
    ],
    techniques: ["Transfer learning", "Compound scaling", "Weight decay", "Mixed precision", "Adaptive learning rate"],
  },
};

export const TEAM = {
  collection: ["Shubh Garg", "Dr. Debabrata Ghosh"],
  labelling: ["Madhav Arora", "Bhumit Gupta"],
};
