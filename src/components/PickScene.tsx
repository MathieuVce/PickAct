"use client";

import { Dices, X } from "lucide-react";

export default function PickScene({
  error,
  pending,
  onRoll,
}: {
  error: string | null;
  pending: boolean;
  onRoll: () => void;
}) {
  return (
    <div className="card relative flex min-h-[20rem] flex-col items-center justify-center gap-6 overflow-hidden text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.28),transparent_70%)] opacity-70 blur-3xl"
      />

      <div className="animate-float relative grid size-28 place-items-center rounded-full bg-[conic-gradient(from_0deg,#8b5cf6,#f472b6,#22d3ee,#fbbf24,#34d399,#8b5cf6)] p-1 sm:size-32">
        <div className="bg-surface grid size-full place-items-center rounded-full">
          <Dices className="text-foreground size-12 sm:size-14" />
        </div>
      </div>

      <div className="relative">
        <h3 className="text-xl font-bold">Prêt pour le tirage</h3>
        <p className="text-muted mx-auto mt-1 max-w-xs text-sm">
          Réglez vos filtres puis lancez la roue pour découvrir votre prochaine sortie.
        </p>
      </div>

      {error && (
        <p className="border-accent/40 bg-accent/10 text-foreground relative flex items-start gap-2 rounded-xl border px-3 py-2 text-left text-sm">
          <X className="text-accent mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      <button
        onClick={onRoll}
        disabled={pending}
        className="btn-primary relative w-full text-base"
      >
        <Dices className="size-5" />
        {pending ? "La roue prépare le tirage" : "Choisir une activité au hasard"}
      </button>
    </div>
  );
}
