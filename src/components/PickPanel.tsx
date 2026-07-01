"use client";

import { useState, useTransition } from "react";
import { spinPick, type SpinResult } from "@/app/actions/pick";
import type { TravelMode } from "@/db/schema";
import { TRAVEL_MODES } from "@/lib/travel";
import PickFilters from "@/components/PickFilters";
import PickScene from "@/components/PickScene";
import SpinModal from "@/components/SpinModal";

type OkResult = Extract<SpinResult, { ok: true }>;

const ERROR_MESSAGE: Record<string, string> = {
  empty: "Aucune activité éligible pour l'instant. Ajoutez en quelques unes.",
  filtered:
    "Aucune activité ne correspond à ces filtres. Élargissez le temps, le budget ou les transports.",
};

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
        setError(ERROR_MESSAGE[res.reason] ?? ERROR_MESSAGE.filtered);
        return;
      }
      setModalResult(res);
    });
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
      <PickFilters
        maxTime={maxTime}
        maxBudget={maxBudget}
        modes={modes}
        onTimeChange={setMaxTime}
        onBudgetChange={setMaxBudget}
        onToggleMode={toggleMode}
      />

      <PickScene error={error} pending={pending} onRoll={roll} />

      {modalResult && (
        <SpinModal result={modalResult} onClose={() => setModalResult(null)} />
      )}
    </div>
  );
}
