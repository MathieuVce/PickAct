"use server";

import { and, eq, inArray, lte, or, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { activities, type TravelMode } from "@/db/schema";
import { requireCurrentMember } from "@/lib/auth";

const ALL_MODES: TravelMode[] = ["walk", "bike", "car", "transit"];
const MAX_WHEEL_SEGMENTS = 16;

/** Activité renvoyée au dashboard, SANS aucun champ d'identité (anonymat). */
export type PickedActivity = {
  id: string;
  name: string;
  imageUrl: string | null;
  link: string | null;
  estMinutes: number;
  travelMinutes: number | null;
  travelMode: TravelMode | null;
  cost: string | null;
  notes: string | null;
};

export type PickFilters = {
  maxTotalMinutes: number;
  maxCost: number;
  allowedModes: TravelMode[];
};

export type SpinResult =
  | {
      ok: true;
      candidates: { id: string; name: string }[];
      winner: PickedActivity;
      total: number;
    }
  | { ok: false; reason: "empty" | "no-match"; total: number };

/**
 * Tire une activité au hasard (côté serveur) parmi les éligibles, et renvoie
 * aussi une liste anonymisée de candidats pour animer la roue côté client.
 */
export async function spinPick(filters: PickFilters): Promise<SpinResult> {
  const { group } = await requireCurrentMember();

  const modes = filters.allowedModes.length > 0 ? filters.allowedModes : ALL_MODES;

  // Total d'activités éligibles (statut actif ou remis à plus tard).
  const [{ count: totalEligible }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(activities)
    .where(
      and(
        eq(activities.groupId, group.id),
        inArray(activities.status, ["active", "later"]),
      ),
    );

  if (totalEligible === 0) {
    return { ok: false, reason: "empty", total: 0 };
  }

  const totalMinutesExpr = sql<number>`(${activities.estMinutes} + coalesce(${activities.travelMinutes}, 0))`;
  const costExpr = sql<number>`coalesce(${activities.cost}, 0)`;

  const matches = await db
    .select({
      id: activities.id,
      name: activities.name,
      imageUrl: activities.imageUrl,
      link: activities.link,
      estMinutes: activities.estMinutes,
      travelMinutes: activities.travelMinutes,
      travelMode: activities.travelMode,
      cost: activities.cost,
      notes: activities.notes,
    })
    .from(activities)
    .where(
      and(
        eq(activities.groupId, group.id),
        inArray(activities.status, ["active", "later"]),
        lte(totalMinutesExpr, filters.maxTotalMinutes),
        lte(costExpr, String(filters.maxCost)),
        or(inArray(activities.travelMode, modes), isNull(activities.travelMode)),
      ),
    );

  if (matches.length === 0) {
    return { ok: false, reason: "no-match", total: totalEligible };
  }

  // Tirage aléatoire côté serveur.
  const winner = matches[Math.floor(Math.random() * matches.length)];

  // Segments de roue : le gagnant + un échantillon des autres (cap visuel).
  const others = matches
    .filter((m) => m.id !== winner.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, MAX_WHEEL_SEGMENTS - 1);
  const candidates = [...others, { id: winner.id, name: winner.name }]
    .map((m) => ({ id: m.id, name: m.name }))
    .sort(() => Math.random() - 0.5);

  return { ok: true, candidates, winner, total: matches.length };
}
