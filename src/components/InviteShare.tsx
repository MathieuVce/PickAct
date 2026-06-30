"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link as LinkIcon } from "lucide-react";

export default function InviteShare({ code }: { code: string }) {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  useEffect(() => {
    setLink(`${window.location.origin}/join/${code}`);
  }, [code]);

  async function copy(value: string, which: "code" | "link") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard indisponible — on ignore silencieusement
    }
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold">Inviter des amis</h2>
      <p className="mt-1 text-sm text-muted">
        Partage le code ou le lien pour qu&apos;ils rejoignent ce groupe.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center justify-between gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2">
          <code className="font-mono text-base tracking-wider">{code}</code>
          <button className="btn-ghost px-2 py-1" onClick={() => copy(code, "code")}>
            {copied === "code" ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied === "code" ? "Copié" : "Copier"}
          </button>
        </div>
        <button
          className="btn-secondary"
          onClick={() => copy(link, "link")}
          disabled={!link}
        >
          <LinkIcon className="size-4" />
          {copied === "link" ? "Lien copié" : "Copier le lien"}
        </button>
      </div>
    </div>
  );
}
