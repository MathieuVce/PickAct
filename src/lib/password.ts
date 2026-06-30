import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LEN = 64;

/** Hache un mot de passe avec scrypt. Format stocké: scrypt$salt$hash (hex). */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LEN).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

/** Vérifie un mot de passe en temps constant. */
export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, hashHex] = parts;
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, KEY_LEN);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

export const MIN_PASSWORD_LENGTH = 4;
