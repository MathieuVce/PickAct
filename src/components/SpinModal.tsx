"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Clock,
  Wallet,
  Dices,
  Link as LinkIcon,
  Check,
  X,
  Hourglass,
  Sparkles,
} from "lucide-react";
import type { SpinResult } from "@/app/actions/pick";
import { setActivityStatus } from "@/app/actions/activities";
import type { ActivityStatus } from "@/db/schema";
import { travelModeIcon, travelModeLabel, formatDuration } from "@/lib/travel";
import { celebrate } from "@/lib/confetti";
import Wheel from "@/components/Wheel";

const SPIN_MS = 3800;

type OkResult = Extract<SpinResult, { ok: true }>;

export default function SpinModal({
  result,
  onClose,
}: {
  result: OkResult;
  onClose: () => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const total = Math.max(result.candidates.length, 1);
    const seg = 360 / total;
    const idx = result.candidates.findIndex((c) => c.id === result.winner.id);
    const mid = (idx < 0 ? 0 : idx) * seg + seg / 2;
    const target = 360 * 6 + (360 - mid);

    const raf = requestAnimationFrame(() => setRotation(target));
    const t = setTimeout(() => {
      setRevealed(true);
      celebrate();
    }, SPIN_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [result]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-md animate-fade-up"
      onClick={() => {
        if (revealed) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="card relative flex max-h-[94vh] w-full max-w-2xl flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="btn-ghost absolute right-3 top-3 z-30 rounded-full p-2 hover:bg-surface-2"
        >
          <X className="size-5" />
        </button>

        {!revealed ? (
          <div className="flex flex-col items-center justify-center gap-6 py-6">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted">
              <Sparkles className="size-4 text-amber" />
              Suspense
            </div>
            <div className="w-[min(78vw,420px)]">
              <Wheel
                segments={result.candidates}
                rotation={rotation}
                spinning
                count={result.total}
              />
            </div>
            <p className="text-center text-sm text-muted">
              La roue choisit parmi vos activités éligibles.
            </p>
          </div>
        ) : (
          <Reveal result={result} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

function Reveal({
  result,
  onClose,
}: {
  result: OkResult;
  onClose: () => void;
}) {
  const a = result.winner;
  const total = a.estMinutes + (a.travelMinutes ?? 0);
  const TravelIcon = travelModeIcon(a.travelMode);
  const [decided, setDecided] = useState<ActivityStatus | null>(null);
  const [, startTransition] = useTransition();

  function decide(status: ActivityStatus) {
    setDecided(status);
    startTransition(() => setActivityStatus(a.id, status));
  }

  return (
    <div className="flex w-full flex-col py-2">
      <div className="mb-4 flex flex-col items-center gap-2 text-center animate-pop-in">
        <span className="chip-accent">
          <Dices className="size-3.5" /> Tirée au hasard
        </span>
        <h2 className="text-3xl font-extrabold leading-tight gradient-text sm:text-4xl">
          {a.name}
        </h2>
        <span className="text-xs text-muted">{result.total} activité(s) en lice</span>
      </div>

      {a.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={a.imageUrl}
          alt={a.name}
          className="mb-4 h-44 w-full rounded-xl border border-border object-cover animate-fade-up sm:h-52"
        />
      )}

      <div className="flex flex-wrap justify-center gap-2 animate-fade-up">
        <span className="chip">
          <Clock className="size-3.5" /> {formatDuration(total)} au total
        </span>
        {a.cost != null && (
          <span className="chip">
            <Wallet className="size-3.5" /> {Number(a.cost).toFixed(2)} €
          </span>
        )}
        <span className="chip">
          <TravelIcon className="size-3.5" /> {travelModeLabel(a.travelMode)}
          {a.travelMinutes != null ? ` (${formatDuration(a.travelMinutes)})` : ""}
        </span>
      </div>

      {a.notes && (
        <p className="mt-4 text-center text-sm text-muted animate-fade-up">{a.notes}</p>
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

      <div className="mt-5 grid grid-cols-3 gap-2">
        <button
          onClick={() => decide("validated")}
          className={`btn-secondary px-2 ${
            decided === "validated" ? "border-green text-green" : ""
          }`}
        >
          <Check className="size-4" /> Valider
        </button>
        <button
          onClick={() => decide("skipped")}
          className={`btn-secondary px-2 ${
            decided === "skipped" ? "border-accent text-accent" : ""
          }`}
        >
          <X className="size-4" /> Passer
        </button>
        <button
          onClick={() => decide("later")}
          className={`btn-secondary px-2 ${
            decided === "later" ? "border-cyan text-cyan" : ""
          }`}
        >
          <Hourglass className="size-4" /> Plus tard
        </button>
      </div>

      {decided ? (
        <p className="mt-2 text-center text-xs text-muted">
          Décision enregistrée pour le groupe.
        </p>
      ) : null}

      <button onClick={onClose} className="btn-primary mt-4 w-full">
        <Dices className="size-4" /> Fermer
      </button>
    </div>
  );
}
