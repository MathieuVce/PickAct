import "server-only";

/**
 * URL absolue du site, utilisée comme `metadataBase` et pour les images de
 * partage (Open Graph / Twitter). Ordre de priorité :
 *  1. NEXT_PUBLIC_SITE_URL (domaine personnalisé éventuel)
 *  2. VERCEL_PROJECT_PRODUCTION_URL (fourni automatiquement par Vercel)
 *  3. localhost en développement
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}
