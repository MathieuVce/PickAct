"use client";

import { useState } from "react";
import { leaveGroup } from "@/app/actions/groups";

export default function LeaveGroupButton() {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button className="btn-danger" onClick={() => setConfirming(true)}>
        Quitter le groupe
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4">
      <p className="text-sm text-foreground">
        Sûr·e ? Tes activités seront <strong>définitivement supprimées</strong> et
        tu quitteras ce groupe.
      </p>
      <div className="flex gap-2">
        <button className="btn-secondary" onClick={() => setConfirming(false)}>
          Annuler
        </button>
        <form action={leaveGroup}>
          <button type="submit" className="btn-danger">
            Oui, quitter
          </button>
        </form>
      </div>
    </div>
  );
}
