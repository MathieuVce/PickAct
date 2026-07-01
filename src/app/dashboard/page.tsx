import Link from "next/link";
import { redirect } from "next/navigation";
import { and, desc, eq, sql } from "drizzle-orm";
import { Plus, ListChecks } from "lucide-react";
import { db } from "@/db";
import { activities, type ActivityStatus } from "@/db/schema";
import { getCurrentMember } from "@/lib/auth";
import AppNav from "@/components/AppNav";
import PickPanel from "@/components/PickPanel";
import InviteShare from "@/components/InviteShare";
import HistoryPanel, { type HistoryItem } from "@/components/HistoryPanel";

export default async function DashboardPage() {
  const current = await getCurrentMember();
  if (!current) redirect("/");

  const { group } = current;

  // Compteurs par statut (group-scoped, anonymes : aucun champ d'auteur).
  const counts = await db
    .select({ status: activities.status, count: sql<number>`count(*)::int` })
    .from(activities)
    .where(eq(activities.groupId, group.id))
    .groupBy(activities.status);

  const byStatus = (s: ActivityStatus) => counts.find((c) => c.status === s)?.count ?? 0;
  const total = counts.reduce((acc, c) => acc + c.count, 0);
  const eligible = byStatus("active") + byStatus("later");

  // Historique (noms + date de décision, anonyme).
  async function history(status: ActivityStatus): Promise<HistoryItem[]> {
    const rows = await db
      .select({
        id: activities.id,
        name: activities.name,
        decidedAt: activities.decidedAt,
      })
      .from(activities)
      .where(and(eq(activities.groupId, group.id), eq(activities.status, status)))
      .orderBy(desc(activities.decidedAt));
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      decidedAt: r.decidedAt ? r.decidedAt.toISOString() : null,
    }));
  }

  const [validated, skipped, later] = await Promise.all([
    history("validated"),
    history("skipped"),
    history("later"),
  ]);

  const stats = [
    { label: "Total", value: total, color: "var(--primary)" },
    { label: "En jeu", value: eligible, color: "var(--cyan)" },
    { label: "Validées", value: byStatus("validated"), color: "var(--green)" },
    { label: "Passées", value: byStatus("skipped"), color: "var(--accent)" },
  ];

  return (
    <>
      <AppNav groupName={group.name} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <p className="text-muted text-sm">
              Lancez la roue selon vos contraintes du moment.
            </p>
          </div>
          <Link href="/my-activities/new" className="btn-primary">
            <Plus className="size-4" /> Ajouter une activité
          </Link>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="card relative flex flex-col items-center overflow-hidden py-4"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </span>
              <span className="text-muted text-xs">{s.label}</span>
            </div>
          ))}
        </div>

        <PickPanel />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <HistoryPanel validated={validated} skipped={skipped} later={later} />
          <div className="flex flex-col gap-6">
            <InviteShare code={group.inviteCode} />
            <Link href="/my-activities" className="btn-secondary">
              <ListChecks className="size-4" /> Gérer mes activités
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
