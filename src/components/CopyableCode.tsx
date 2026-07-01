"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyableCode({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard indisponible
    }
  }

  return (
    <div className="border-border bg-surface-2 flex items-center justify-between gap-2 rounded-xl border px-3 py-2">
      <code className="font-mono text-base tracking-wider">{value}</code>
      <button className="btn-ghost px-2 py-1" onClick={copy}>
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Copié" : "Copier"}
      </button>
    </div>
  );
}
