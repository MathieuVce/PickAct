"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { activities, type TravelMode, type ActivityStatus } from "@/db/schema";
import { requireCurrentMember } from "@/lib/auth";
import { safeUrl } from "@/lib/url";

const TRAVEL_MODES: TravelMode[] = ["walk", "bike", "car", "transit"];
const STATUSES: ActivityStatus[] = ["active", "validated", "skipped", "later"];

export type ActivityActionState = { error?: string } | undefined;

function str(raw: FormDataEntryValue | null): string {
  return (typeof raw === "string" ? raw : "").trim();
}

function optionalStr(raw: FormDataEntryValue | null): string | null {
  const v = str(raw);
  return v.length > 0 ? v : null;
}

function optionalInt(raw: FormDataEntryValue | null): number | null {
  const v = str(raw);
  if (!v) return null;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Ajoute une activité pour le membre courant. */
export async function addActivity(
  _prev: ActivityActionState,
  formData: FormData,
): Promise<ActivityActionState> {
  const { member, group } = await requireCurrentMember();

  const name = str(formData.get("name")).slice(0, 120);
  const estMinutes = optionalInt(formData.get("estMinutes"));

  if (!name) return { error: "Le nom de l'activité est obligatoire." };
  if (estMinutes === null) {
    return { error: "La durée estimée (en minutes) est obligatoire." };
  }

  const modeRaw = str(formData.get("travelMode"));
  const travelMode = TRAVEL_MODES.includes(modeRaw as TravelMode)
    ? (modeRaw as TravelMode)
    : null;

  const costRaw = str(formData.get("cost")).replace(",", ".");
  const cost = costRaw && Number.isFinite(Number(costRaw)) ? costRaw : null;

  await db.insert(activities).values({
    memberId: member.id,
    groupId: group.id,
    name,
    estMinutes,
    imageUrl: safeUrl(optionalStr(formData.get("imageUrl"))),
    link: safeUrl(optionalStr(formData.get("link"))),
    travelMinutes: optionalInt(formData.get("travelMinutes")),
    travelMode,
    cost,
    notes: optionalStr(formData.get("notes"))?.slice(0, 500) ?? null,
  });

  revalidatePath("/my-activities");
  revalidatePath("/dashboard");
  redirect("/my-activities?added=1");
}

/** Supprime une activité, uniquement si elle appartient au membre courant. */
export async function deleteActivity(formData: FormData): Promise<void> {
  const { member } = await requireCurrentMember();
  const id = str(formData.get("id"));
  if (!id) return;

  await db
    .delete(activities)
    .where(and(eq(activities.id, id), eq(activities.memberId, member.id)));

  revalidatePath("/my-activities");
  revalidatePath("/dashboard");
}

/**
 * Change le statut d'une activité du groupe (décision partagée par tout le groupe).
 * "active" remet l'activité en jeu, les autres statuts posent la date de décision.
 */
export async function setActivityStatus(
  id: string,
  status: ActivityStatus,
): Promise<void> {
  const { group } = await requireCurrentMember();
  if (!STATUSES.includes(status)) return;

  await db
    .update(activities)
    .set({ status, decidedAt: status === "active" ? null : new Date() })
    .where(and(eq(activities.id, id), eq(activities.groupId, group.id)));

  revalidatePath("/dashboard");
}
