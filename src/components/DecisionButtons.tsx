"use client";

import { Check, X, Hourglass, type LucideIcon } from "lucide-react";
import type { ActivityStatus } from "@/db/schema";

const DECISIONS: {
  status: ActivityStatus;
  label: string;
  Icon: LucideIcon;
  activeClass: string;
}[] = [
  {
    status: "validated",
    label: "Valider",
    Icon: Check,
    activeClass: "border-green text-green",
  },
  {
    status: "skipped",
    label: "Passer",
    Icon: X,
    activeClass: "border-accent text-accent",
  },
  {
    status: "later",
    label: "Plus tard",
    Icon: Hourglass,
    activeClass: "border-cyan text-cyan",
  },
];

export default function DecisionButtons({
  decided,
  onDecide,
}: {
  decided: ActivityStatus | null;
  onDecide: (status: ActivityStatus) => void;
}) {
  return (
    <div className="mt-5 grid grid-cols-3 gap-2">
      {DECISIONS.map(({ status, label, Icon, activeClass }) => (
        <button
          key={status}
          onClick={() => onDecide(status)}
          className={`btn-secondary px-2 ${decided === status ? activeClass : ""}`}
        >
          <Icon className="size-4" /> {label}
        </button>
      ))}
    </div>
  );
}
