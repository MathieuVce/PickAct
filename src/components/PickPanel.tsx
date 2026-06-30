"use client";

import { useState, useTransition } from "react";
import { Clock, Wallet, Dices, X } from "lucide-react";
import { spinPick, type SpinResult } from "@/app/actions/pick";
import type { TravelMode } from "@/db/schema";
import { TRAVEL_MODES, TRAVEL_MODE_META, formatDuration } from "@/lib/travel";
import SpinModal from "@/components/SpinModal";

const MAX_TIME = 480;
const MAX_BUDGET = 200;

type OkResult = Extract<SpinResult, { ok: true }>;

export default function PickPanel() {
  const [maxTime, setMaxTime] = useState(180);
  const [maxBudget, setMaxBudget] = useState(50);
  const [modes, setModes] = useState<TravelMode[]>([...TRAVEL_MODES]);

  const [modalResult, setModalResult] = useState<OkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggleMode(mode: TravelMode) {
    setModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode],
    );
  }

  function roll() {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const res = await spinPick({
        maxTotalMinutes: maxTime,
        maxCost: maxBudget,
        allowedModes: modes,
      });
      if (!res.ok) {
        setError(
          res.reason === "empty"
            ? "Aucune activité éligible pour l'instant. Ajoutez en quelques unes."
            : "Aucune activité ne correspond à ces filtres. Élargissez le temps, le budget ou les transports.",
        );
        return;
      }
      setModalResult(res);
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
      {/* Filtres */}
      <div className="card flex flex-col gap-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="label mb-0">Temps total max</span>
            <span className="chip-accent">
              <Clock className="size-3.5" /> {formatDuration(maxTime)}
            </span>
          </div>
          <input
            type="range"
            min={15}
            max={MAX_TIME}
            step={15}
            value={maxTime}
            onChange={(e) => setMaxTime(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
          <p className="mt-1 text-xs text-muted">Activite plus trajet aller.</p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="label mb-0">Budget max</span>
            <span className="chip-accent">
              <Wallet className="size-3.5" />{" "}
              {maxBudget >= MAX_BUDGET ? "200 € et plus" : `${maxBudget} €`}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={MAX_BUDGET}
            step={5}
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </div>

        <div>
          <span className="label">Modes de transport acceptes</span>
          <div className="grid grid-cols-2 gap-2">
            {TRAVEL_MODES.map((mode) => {
              const active = modes.includes(mode);
              const Icon = TRAVEL_MODE_META[mode].Icon;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => toggleMode(mode)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                    active
                      ? "border-primary bg-primary/15 text-foreground"
                      : "border-border bg-surface-2 text-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  {TRAVEL_MODE_META[mode].label}
                </button>
              );
            })}
          </div>
          <p className="mt-1 text-xs text-muted">
            Les activités sans mode précisé sont toujours incluses.
          </p>
        </div>
      </div>

      {/* Scene de tirage */}
      <div className="card relative flex min-h-[20rem] flex-col items-center justify-center gap-6 overflow-hidden text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.28),transparent_70%)] opacity-70 blur-3xl"
        />

        <div className="relative grid size-28 place-items-center rounded-full bg-[conic-gradient(from_0deg,#8b5cf6,#f472b6,#22d3ee,#fbbf24,#34d399,#8b5cf6)] p-1 animate-float sm:size-32">
          <div className="grid size-full place-items-center rounded-full bg-surface">
            <Dices className="size-12 text-foreground sm:size-14" />
          </div>
        </div>

        <div className="relative">
          <h3 className="text-xl font-bold">Prêt pour le tirage</h3>
          <p className="mx-auto mt-1 max-w-xs text-sm text-muted">
            Réglez vos filtres puis lancez la roue pour découvrir votre prochaine
            sortie.
          </p>
        </div>

        {error && (
          <p className="relative flex items-start gap-2 rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-left text-sm text-foreground">
            <X className="mt-0.5 size-4 shrink-0 text-accent" />
            {error}
          </p>
        )}

        <button
          onClick={roll}
          disabled={pending}
          className="btn-primary relative w-full text-base"
        >
          <Dices className="size-5" />
          {pending ? "La roue prépare le tirage" : "Choisir une activité au hasard"}
        </button>
      </div>

      {modalResult && (
        <SpinModal result={modalResult} onClose={() => setModalResult(null)} />
      )}
    </div>
  );
}
