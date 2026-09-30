import { CLASSES, CLASS_INFO, MODELS, PUBLISHED, type Metrics, type ModelId } from "@/content/site";

const ACCENT = "#c8841f";
const CONTEXT = "#7f8c9d";
const RAMP = ["#cde2fb", "#b7d3f6", "#9ec5f4", "#86b6ef", "#6da7ec", "#5598e7", "#3987e5", "#2a78d6", "#256abf", "#1c5cab", "#184f95", "#104281", "#0d366b"];

export const METRIC_LABELS: Record<keyof Metrics, string> = {
  accuracy: "Accuracy",
  precision: "Precision",
  recall: "Recall",
  f1: "F1 score",
};

const modelTitle = (id: ModelId) => MODELS.find((m) => m.id === id)!.title;
const ABBR: Record<(typeof CLASSES)[number], string> = { ESOTROPIA: "Eso", EXOTROPIA: "Exo", HYPERTROPIA: "Hyper", HYPOTROPIA: "Hypo", NORMAL: "Normal" };

export function ModelBars({ metric = "accuracy", highlight = "efficientnet-b7" }: { metric?: keyof Metrics; highlight?: ModelId }) {
  const rows = MODELS.map((m) => ({ id: m.id, title: m.title, m: PUBLISHED[m.id].metrics })).sort((a, b) => b.m[metric] - a.m[metric]);
  return (
    <figure>
      <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[7.5rem] right-12 sm:left-36">
          {[0, 25, 50, 75, 100].map((t) => (
            <div key={t} className="absolute inset-y-0 w-px bg-rule/70" style={{ left: `${t}%` }}>
              <span className="absolute -bottom-6 -translate-x-1/2 font-mono text-[0.7rem] tabular-nums text-ink-soft">{t}</span>
            </div>
          ))}
        </div>
        <ul className="relative space-y-3.5">
          {rows.map((r) => {
            const on = r.id === highlight;
            return (
              <li key={r.id} className="group relative flex items-center" tabIndex={0} aria-label={`${r.title}: ${METRIC_LABELS[metric]} ${r.m[metric].toFixed(2)}%`}>
                <span className={`w-[7.5rem] shrink-0 pr-3 text-right text-sm sm:w-36 ${on ? "font-bold text-ink" : "text-ink-soft"}`}>{r.title}</span>
                <span className="relative mr-12 h-6 flex-1">
                  <span
                    className="absolute inset-y-0.5 left-0 rounded-r-[4px] transition-[filter] group-hover:brightness-110"
                    style={{ width: `${r.m[metric]}%`, background: on ? ACCENT : CONTEXT }}
                  />
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 pl-2 font-mono text-sm tabular-nums ${on ? "font-bold text-ink" : "text-ink-soft"}`}
                    style={{ left: `${r.m[metric]}%` }}
                  >
                    {r.m[metric].toFixed(2)}%
                  </span>
                </span>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-[7.5rem] top-full z-20 mt-1 w-56 rounded-md border border-rule bg-card p-3 text-xs opacity-0 shadow-lg transition group-hover:opacity-100 group-focus:opacity-100 sm:left-36"
                >
                  <span className="mb-1.5 block font-bold text-ink">{r.title}</span>
                  {(Object.keys(METRIC_LABELS) as (keyof Metrics)[]).map((k) => (
                    <span key={k} className="flex justify-between text-ink-soft">
                      {METRIC_LABELS[k]} <span className="font-mono tabular-nums text-ink">{r.m[k].toFixed(2)}%</span>
                    </span>
                  ))}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <figcaption className="mt-10 text-sm text-ink-soft">
        {METRIC_LABELS[metric]} on the held-out test set, as published in the paper (Table I). Hover or focus a bar for all four metrics.
      </figcaption>
    </figure>
  );
}

function cellStyle(v: number) {
  if (v < 0.005) return { background: "#f3f7fc", color: "#8a97a8" };
  const i = Math.min(RAMP.length - 1, Math.round(v * (RAMP.length - 1)));
  return { background: RAMP[i], color: i >= 7 ? "#ffffff" : "#14233a" };
}

export function ConfusionMatrix({ model, compact }: { model: ModelId; compact?: boolean }) {
  const matrix = PUBLISHED[model].confusion;
  const short = (c: (typeof CLASSES)[number]) => (compact ? ABBR[c] : CLASS_INFO[c].label);
  return (
    <figure className="min-w-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[20rem] table-fixed border-separate border-spacing-[2px] text-center">
          <caption className="sr-only">
            Confusion matrix for {modelTitle(model)}. Rows are the true class, columns the predicted class; each cell is the share of that
            true class&apos;s test photos.
          </caption>
          <thead>
            <tr>
              <td />
              <th colSpan={5} scope="colgroup" className="pb-1 text-left font-mono text-[0.65rem] font-normal tracking-wide text-ink-soft uppercase">
                Predicted class →
              </th>
            </tr>
            <tr>
              <th scope="col" className="w-20 p-1 text-right align-bottom font-mono text-[0.65rem] font-normal tracking-wide text-ink-soft uppercase sm:w-24">
                True ↓
              </th>
              {CLASSES.map((c) => (
                <th key={c} scope="col" className="truncate p-1 align-bottom text-[0.68rem] font-normal text-ink-soft sm:text-xs">
                  {short(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={CLASSES[i]}>
                <th scope="row" className="pr-2 text-right text-[0.68rem] font-normal text-ink-soft sm:text-xs">
                  {short(CLASSES[i])}
                </th>
                {row.map((v, j) => (
                  <td
                    key={j}
                    tabIndex={0}
                    title={`${CLASS_INFO[CLASSES[i]].label} photos predicted as ${CLASS_INFO[CLASSES[j]].label}: ${Math.round(v * 100)}%`}
                    className={`h-11 rounded-[4px] font-mono text-xs tabular-nums sm:h-12 sm:text-sm ${i === j ? "font-bold" : ""}`}
                    style={cellStyle(v)}
                  >
                    {v.toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-3 flex items-center gap-3 text-xs text-ink-soft">
        <span>0</span>
        <span className="h-2 w-28 rounded-full" style={{ background: `linear-gradient(90deg, #f3f7fc, ${RAMP.join(", ")})` }} />
        <span>1 — share of each true class; the diagonal is correct predictions</span>
      </figcaption>
    </figure>
  );
}

export function CountBars({ rows, max, unit }: { rows: { label: string; value: number }[]; max?: number; unit?: string }) {
  const top = max ?? Math.max(...rows.map((r) => r.value));
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label} className="flex items-center gap-3 text-sm">
          <span className="w-24 shrink-0 text-right text-ink-soft">{r.label}</span>
          <span className="relative h-5 flex-1">
            <span className="absolute inset-y-0.5 left-0 rounded-r-[4px] bg-ink" style={{ width: `${(r.value / top) * 88}%` }} />
            <span className="absolute top-1/2 -translate-y-1/2 pl-2 font-mono text-xs tabular-nums" style={{ left: `${(r.value / top) * 88}%` }}>
              {r.value}
              {unit}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
