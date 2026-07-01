"use server";

import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { groups, members } from "@/db/schema";
import { generateInviteCode, generateSessionToken, normalizeCode } from "@/lib/codes";
import { hashPassword, verifyPassword, MIN_PASSWORD_LENGTH } from "@/lib/password";
import { setSessionCookie, clearSessionCookie, getCurrentMember } from "@/lib/auth";

export type ActionState = { error?: string } | undefined;

function cleanName(raw: FormDataEntryValue | null): string {
  return (typeof raw === "string" ? raw : "").trim();
}

/** Crée un groupe et le membre créateur (avec mot de passe), puis ouvre la session. */
export async function createGroup(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const groupName = cleanName(formData.get("groupName"));
  const pseudo = cleanName(formData.get("pseudo"));
  const password = cleanName(formData.get("password"));

  if (!groupName) return { error: "Donne un nom au groupe." };
  if (!pseudo) return { error: "Choisis un pseudo." };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Mot de passe trop court (${MIN_PASSWORD_LENGTH} caractères minimum).`,
    };
  }

  let inviteCode = generateInviteCode();
  for (let i = 0; i < 5; i++) {
    const exists = await db
      .select({ id: groups.id })
      .from(groups)
      .where(eq(groups.inviteCode, inviteCode))
      .limit(1);
    if (exists.length === 0) break;
    inviteCode = generateInviteCode();
  }

  const [group] = await db
    .insert(groups)
    .values({ name: groupName, inviteCode })
    .returning();

  const sessionToken = generateSessionToken();
  await db.insert(members).values({
    groupId: group.id,
    displayName: pseudo,
    passwordHash: hashPassword(password),
    sessionToken,
  });

  await setSessionCookie(sessionToken);
  redirect("/dashboard");
}

/**
 * Flux unique pour rejoindre OU se reconnecter depuis n'importe quel appareil :
 * code de groupe + pseudo + mot de passe.
 */
export async function enterGroup(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const code = normalizeCode(cleanName(formData.get("inviteCode")));
  const pseudo = cleanName(formData.get("pseudo"));
  const password = cleanName(formData.get("password"));

  if (!code) return { error: "Entre le code du groupe." };
  if (!pseudo) return { error: "Choisis un pseudo." };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Mot de passe trop court (${MIN_PASSWORD_LENGTH} caractères minimum).`,
    };
  }

  const [group] = await db
    .select()
    .from(groups)
    .where(eq(groups.inviteCode, code))
    .limit(1);

  if (!group) return { error: "Aucun groupe ne correspond à ce code." };

  // Cherche un membre existant (pseudo insensible à la casse) dans ce groupe.
  const [existing] = await db
    .select()
    .from(members)
    .where(
      and(
        eq(members.groupId, group.id),
        sql`lower(${members.displayName}) = lower(${pseudo})`,
      ),
    )
    .limit(1);

  const sessionToken = generateSessionToken();

  if (existing) {
    // Reconnexion : on vérifie le mot de passe.
    if (!verifyPassword(password, existing.passwordHash)) {
      return { error: "Mot de passe incorrect pour ce pseudo." };
    }
    await db.update(members).set({ sessionToken }).where(eq(members.id, existing.id));
  } else {
    // Première venue : on crée le membre avec ce mot de passe.
    await db.insert(members).values({
      groupId: group.id,
      displayName: pseudo,
      passwordHash: hashPassword(password),
      sessionToken,
    });
  }

  await setSessionCookie(sessionToken);
  redirect("/dashboard");
}

/** Déconnexion simple (efface le cookie, ne supprime rien). */
export async function logout(): Promise<void> {
  await clearSessionCookie();
  redirect("/");
}

/** Quitte le groupe : supprime le membre (et ses activités en cascade). */
export async function leaveGroup(): Promise<void> {
  const current = await getCurrentMember();
  if (current) {
    await db.delete(members).where(eq(members.id, current.member.id));
    await clearSessionCookie();
  }
  redirect("/");
}
