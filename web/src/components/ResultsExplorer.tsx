"use client";

import { useState } from "react";
import { METRIC_LABELS, ModelBars } from "./charts";
import type { Metrics } from "@/content/site";

export function ResultsExplorer() {
  const [metric, setMetric] = useState<keyof Metrics>("accuracy");
  return (
    <div>
      <div role="group" aria-label="Choose a metric" className="mb-8 flex flex-wrap gap-2">
        {(Object.keys(METRIC_LABELS) as (keyof Metrics)[]).map((k) => (
          <button
            key={k}
            onClick={() => setMetric(k)}
            aria-pressed={metric === k}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${metric === k ? "border-flow-line bg-flow font-bold" : "border-rule bg-card text-ink-soft hover:text-ink"}`}
          >
            {METRIC_LABELS[k]}
          </button>
        ))}
      </div>
      <ModelBars metric={metric} />
    </div>
  );
}
