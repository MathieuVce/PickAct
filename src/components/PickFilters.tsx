"use client";

import { Clock, Wallet } from "lucide-react";
import type { TravelMode } from "@/db/schema";
import { TRAVEL_MODES, TRAVEL_MODE_META, formatDuration } from "@/lib/travel";

const MAX_TIME = 480;
const MAX_BUDGET = 200;

export default function PickFilters({
  maxTime,
  maxBudget,
  modes,
  onTimeChange,
  onBudgetChange,
  onToggleMode,
}: {
  maxTime: number;
  maxBudget: number;
  modes: TravelMode[];
  onTimeChange: (value: number) => void;
  onBudgetChange: (value: number) => void;
  onToggleMode: (mode: TravelMode) => void;
}) {
  return (
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
          onChange={(e) => onTimeChange(Number(e.target.value))}
          className="w-full accent-[var(--primary)]"
        />
        <p className="text-muted mt-1 text-xs">Activite plus trajet aller.</p>
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
          onChange={(e) => onBudgetChange(Number(e.target.value))}
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
                onClick={() => onToggleMode(mode)}
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
        <p className="text-muted mt-1 text-xs">
          Les activités sans mode précisé sont toujours incluses.
        </p>
      </div>
    </div>
  );
}
