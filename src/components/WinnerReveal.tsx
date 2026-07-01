"use client";

import { useState, useTransition } from "react";
import { Clock, Wallet, Dices, Link as LinkIcon } from "lucide-react";
import type { SpinResult } from "@/app/actions/pick";
import { setActivityStatus } from "@/app/actions/activities";
import type { ActivityStatus } from "@/db/schema";
import { travelModeLabel, formatDuration } from "@/lib/travel";
import DecisionButtons from "@/components/DecisionButtons";
import TravelModeIcon from "@/components/TravelModeIcon";

type OkResult = Extract<SpinResult, { ok: true }>;

export default function WinnerReveal({
  result,
  onClose,
}: {
  result: OkResult;
  onClose: () => void;
}) {
  const a = result.winner;
  const total = a.estMinutes + (a.travelMinutes ?? 0);
  const [decided, setDecided] = useState<ActivityStatus | null>(null);
  const [, startTransition] = useTransition();

  function decide(status: ActivityStatus) {
    setDecided(status);
    startTransition(() => setActivityStatus(a.id, status));
  }

  return (
    <div className="flex w-full flex-col py-2">
      <div className="animate-pop-in mb-4 flex flex-col items-center gap-2 text-center">
        <span className="chip-accent">
          <Dices className="size-3.5" /> Tirée au hasard
        </span>
        <h2 className="gradient-text text-3xl leading-tight font-extrabold sm:text-4xl">
          {a.name}
        </h2>
        <span className="text-muted text-xs">{result.total} activité(s) en lice</span>
      </div>

      {a.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={a.imageUrl}
          alt={a.name}
          className="border-border animate-fade-up mb-4 h-44 w-full rounded-xl border object-cover sm:h-52"
        />
      )}

      <div className="animate-fade-up flex flex-wrap justify-center gap-2">
        <span className="chip">
          <Clock className="size-3.5" /> {formatDuration(total)} au total
        </span>
        {a.cost != null && (
          <span className="chip">
            <Wallet className="size-3.5" /> {Number(a.cost).toFixed(2)} €
          </span>
        )}
        <span className="chip">
          <TravelModeIcon mode={a.travelMode} className="size-3.5" />{" "}
          {travelModeLabel(a.travelMode)}
          {a.travelMinutes != null ? ` (${formatDuration(a.travelMinutes)})` : ""}
        </span>
      </div>

      {a.notes && (
        <p className="text-muted animate-fade-up mt-4 text-center text-sm">{a.notes}</p>
      )}

      {a.link && (
        <a
          href={a.link}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary mt-4 w-full"
        >
          <LinkIcon className="size-4" /> Ouvrir le lien
        </a>
      )}

      <DecisionButtons decided={decided} onDecide={decide} />

      {decided ? (
        <p className="text-muted mt-2 text-center text-xs">
          Décision enregistrée pour le groupe.
        </p>
      ) : null}

      <button onClick={onClose} className="btn-primary mt-4 w-full">
        <Dices className="size-4" /> Fermer
      </button>
    </div>
  );
}
