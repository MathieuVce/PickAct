import { randomBytes, randomUUID } from "crypto";

// Caractères sans ambiguïté (pas de I/O/0/1) pour des codes faciles à lire/dicter.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomChars(length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

/** Code d'invitation de groupe sans tiret, ex. PICK4F2A. */
export function generateInviteCode(): string {
  return `PICK${randomChars(4)}`;
}

/** Jeton de session opaque stocké en cookie httpOnly. */
export function generateSessionToken(): string {
  return randomUUID() + randomUUID().replace(/-/g, "");
}

/** Normalise un code saisi par l'utilisateur (espaces, casse). */
export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}
