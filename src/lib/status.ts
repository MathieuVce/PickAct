import type { ActivityStatus } from "@/db/schema";

/**
 * Libellés et couleurs des statuts d'activité, partagés par le dashboard,
 * la page « mes activités » et l'admin (source unique de vérité).
 * En jeu = cyan, Validée = vert, Passée = rose, Plus tard = violet.
 */
export const STATUS_LABEL: Record<ActivityStatus, string> = {
  active: "En jeu",
  validated: "Validée",
  skipped: "Passée",
  later: "Plus tard",
};

export const STATUS_COLOR: Record<ActivityStatus, string> = {
  active: "var(--cyan)",
  validated: "var(--green)",
  skipped: "var(--accent)",
  later: "var(--primary)",
};
