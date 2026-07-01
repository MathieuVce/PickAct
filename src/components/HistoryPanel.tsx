"use client";

import { useState, useTransition } from "react";
import { RotateCcw, Check, X, Hourglass } from "lucide-react";
import { setActivityStatus } from "@/app/actions/activities";

export type HistoryItem = { id: string; name: string; decidedAt: string | null };

type TabId = "validated" | "skipped" | "later";

const TABS: { id: TabId; label: string; Icon: typeof Check }[] = [
  { id: "validated", label: "Validées", Icon: Check },
  { id: "skipped", label: "Passées", Icon: X },
  { id: "later", label: "Plus tard", Icon: Hourglass },
];

export default function HistoryPanel({
  validated,
  skipped,
  later,
}: {
  validated: HistoryItem[];
  skipped: HistoryItem[];
  later: HistoryItem[];
}) {
  const [tab, setTab] = useState<TabId>("validated");
  const [, startTransition] = useTransition();
  const lists: Record<TabId, HistoryItem[]> = { validated, skipped, later };
  const items = lists[tab];

  function reactivate(id: string) {
    startTransition(() => setActivityStatus(id, "active"));
  }

  return (
    <div className="card">
      <h2 className="mb-3 text-lg font-semibold">Historique</h2>
      <div className="border-border bg-surface-2 mb-4 flex rounded-xl border p-1">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              tab === id ? "bg-primary text-white" : "text-muted hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            {label} ({lists[id].length})
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-muted py-6 text-center text-sm">Rien ici pour le moment.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((it) => (
            <li
              key={it.id}
              className="border-border bg-surface-2 flex items-center justify-between gap-3 rounded-xl border px-3 py-2"
            >
              <span className="min-w-0 flex-1 truncate text-sm">{it.name}</span>
              <button
                onClick={() => reactivate(it.id)}
                className="btn-ghost px-2 py-1 text-xs"
                title="Remettre en jeu"
              >
                <RotateCcw className="size-3.5" /> Remettre en jeu
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
