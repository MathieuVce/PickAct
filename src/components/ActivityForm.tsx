"use client";

import Link from "next/link";
import { useActionState } from "react";
import { addActivity } from "@/app/actions/activities";
import { TRAVEL_MODES, TRAVEL_MODE_META } from "@/lib/travel";

export default function ActivityForm() {
  const [state, action, pending] = useActionState(addActivity, undefined);

  return (
    <form action={action} className="card flex flex-col gap-5">
      <div>
        <label className="label" htmlFor="name">
          Nom de l&apos;activité <span className="text-accent">*</span>
        </label>
        <input
          id="name"
          name="name"
          className="field"
          placeholder="Escape game au centre-ville"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="estMinutes">
            Durée estimée (min) <span className="text-accent">*</span>
          </label>
          <input
            id="estMinutes"
            name="estMinutes"
            type="number"
            min={0}
            className="field"
            placeholder="90"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="cost">
            Coût approximatif (€)
          </label>
          <input
            id="cost"
            name="cost"
            type="text"
            inputMode="decimal"
            className="field"
            placeholder="25"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="travelMinutes">
            Temps de trajet (min)
          </label>
          <input
            id="travelMinutes"
            name="travelMinutes"
            type="number"
            min={0}
            className="field"
            placeholder="20"
          />
        </div>
        <div>
          <label className="label" htmlFor="travelMode">
            Mode de transport
          </label>
          <select id="travelMode" name="travelMode" className="field" defaultValue="">
            <option value="">Peu importe</option>
            {TRAVEL_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {TRAVEL_MODE_META[mode].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="imageUrl">
          Image (URL)
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          className="field"
          placeholder="https://exemple.com/photo.jpg"
        />
      </div>

      <div>
        <label className="label" htmlFor="link">
          Lien (réservation, infos…)
        </label>
        <input
          id="link"
          name="link"
          type="url"
          className="field"
          placeholder="https://exemple.com"
        />
      </div>

      <div>
        <label className="label" htmlFor="notes">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="field resize-none"
          placeholder="Réserver à l'avance, prévoir des baskets…"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        <Link href="/my-activities" className="btn-secondary flex-1">
          Annuler
        </Link>
        <button type="submit" disabled={pending} className="btn-primary flex-1">
          {pending ? "Ajout…" : "Ajouter l'activité"}
        </button>
      </div>
    </form>
  );
}
