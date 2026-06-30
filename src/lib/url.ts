/**
 * Renvoie l'URL si elle est sûre (http/https uniquement), sinon null.
 * Bloque javascript:, data: et autres schémas dangereux (anti XSS).
 */
export function safeUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    return null;
  }
  return null;
}
