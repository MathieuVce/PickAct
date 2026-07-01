import "server-only";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { members, groups, type Member, type Group } from "@/db/schema";

export const SESSION_COOKIE = "pickact_session";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 an

/** Pose le cookie de session pour identifier ce membre sur ce navigateur. */
export async function setSessionCookie(sessionToken: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/**
 * Récupère le membre courant (et son groupe) à partir du cookie de session.
 * Renvoie null si non connecté ou session invalide.
 */
export async function getCurrentMember(): Promise<{
  member: Member;
  group: Group;
} | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await db
    .select({ member: members, group: groups })
    .from(members)
    .innerJoin(groups, eq(members.groupId, groups.id))
    .where(eq(members.sessionToken, token))
    .limit(1);

  return rows[0] ?? null;
}

/** Comme getCurrentMember mais lève si non connecté — pour les actions protégées. */
export async function requireCurrentMember(): Promise<{
  member: Member;
  group: Group;
}> {
  const current = await getCurrentMember();
  if (!current) {
    throw new Error("Non connecté. Rejoignez ou créez un groupe d'abord.");
  }
  return current;
}
