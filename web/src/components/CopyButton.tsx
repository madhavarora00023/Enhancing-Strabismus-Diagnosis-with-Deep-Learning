"use client";

import { useState } from "react";

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="rounded-full border border-rule bg-card px-3 py-1 text-sm transition hover:border-flow-line"
    >
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}
