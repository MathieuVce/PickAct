import "server-only";
import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "pickact_admin";

function adminToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;
  if (!password || !secret) return null;
  return createHash("sha256").update(`${password}:${secret}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Vérifie le mot de passe admin et renvoie le jeton de cookie à poser, ou null. */
export function checkAdminPassword(password: string): string | null {
  const expected = process.env.ADMIN_PASSWORD;
  const token = adminToken();
  if (!expected || !token) return null;
  if (!safeEqual(password, expected)) return null;
  return token;
}

/** True si la requête courante possède un cookie admin valide. */
export async function isAdmin(): Promise<boolean> {
  const token = adminToken();
  if (!token) return false;
  const store = await cookies();
  const cookieValue = store.get(ADMIN_COOKIE)?.value;
  if (!cookieValue) return false;
  return safeEqual(cookieValue, token);
}

export async function setAdminCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
