"use client";

import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import type { SpinResult } from "@/app/actions/pick";
import { celebrate } from "@/lib/confetti";
import Wheel from "@/components/Wheel";
import WinnerReveal from "@/components/WinnerReveal";

const SPIN_MS = 3800;

type OkResult = Extract<SpinResult, { ok: true }>;

/** Calcule la rotation finale pour que le gagnant s'arrête sous le curseur. */
function targetRotation(result: OkResult): number {
  const total = Math.max(result.candidates.length, 1);
  const seg = 360 / total;
  const idx = result.candidates.findIndex((c) => c.id === result.winner.id);
  const mid = (idx < 0 ? 0 : idx) * seg + seg / 2;
  return 360 * 6 + (360 - mid);
}

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
    const raf = requestAnimationFrame(() => setRotation(targetRotation(result)));
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
      className="bg-background/85 animate-fade-up fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
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
          className="btn-ghost hover:bg-surface-2 absolute top-3 right-3 z-30 rounded-full p-2"
        >
          <X className="size-5" />
        </button>

        {!revealed ? (
          <div className="flex flex-col items-center justify-center gap-6 py-6">
            <div className="text-muted flex items-center gap-2 text-sm font-semibold tracking-wider uppercase">
              <Sparkles className="text-amber size-4" />
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
            <p className="text-muted text-center text-sm">
              La roue choisit parmi vos activités éligibles.
            </p>
          </div>
        ) : (
          <WinnerReveal result={result} onClose={onClose} />
        )}
      </div>
    </div>
  );
}
