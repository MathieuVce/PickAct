"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { groups, members, activities } from "@/db/schema";
import {
  checkAdminPassword,
  isAdmin,
  setAdminCookie,
  clearAdminCookie,
} from "@/lib/admin";

export type AdminState = { error?: string } | undefined;

export async function loginAdmin(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const password =
    typeof formData.get("password") === "string"
      ? (formData.get("password") as string)
      : "";
  const token = checkAdminPassword(password);
  if (!token) return { error: "Mot de passe administrateur incorrect." };
  await setAdminCookie(token);
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminCookie();
  redirect("/admin/login");
}

async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Accès administrateur requis.");
  }
}

export async function deleteGroup(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await db.delete(groups).where(eq(groups.id, id));
  revalidatePath("/admin");
}

export async function renameGroup(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (id && name) await db.update(groups).set({ name }).where(eq(groups.id, id));
  revalidatePath("/admin");
  revalidatePath(`/admin/groups/${id}`);
}

export async function deleteMember(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const groupId = String(formData.get("groupId") ?? "");
  if (id) await db.delete(members).where(eq(members.id, id));
  if (groupId) revalidatePath(`/admin/groups/${groupId}`);
}

export async function deleteAdminActivity(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const groupId = String(formData.get("groupId") ?? "");
  if (id) await db.delete(activities).where(eq(activities.id, id));
  if (groupId) revalidatePath(`/admin/groups/${groupId}`);
}
