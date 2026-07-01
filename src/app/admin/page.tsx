import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, sql, eq } from "drizzle-orm";
import { Users, ListChecks, ChevronRight, Trash2 } from "lucide-react";
import { db } from "@/db";
import { groups, members, activities } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { deleteGroup } from "@/app/actions/admin";
import AdminNav from "@/components/AdminNav";

export default async function AdminHomePage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const memberCount = db
    .select({ groupId: members.groupId, mc: sql<number>`count(*)::int`.as("mc") })
    .from(members)
    .groupBy(members.groupId)
    .as("mc");
  const activityCount = db
    .select({ groupId: activities.groupId, ac: sql<number>`count(*)::int`.as("ac") })
    .from(activities)
    .groupBy(activities.groupId)
    .as("ac");

  const raw = await db
    .select({
      id: groups.id,
      name: groups.name,
      inviteCode: groups.inviteCode,
      createdAt: groups.createdAt,
      members: memberCount.mc,
      activities: activityCount.ac,
    })
    .from(groups)
    .leftJoin(memberCount, eq(memberCount.groupId, groups.id))
    .leftJoin(activityCount, eq(activityCount.groupId, groups.id))
    .orderBy(desc(groups.createdAt));

  const rows = raw.map((g) => ({
    ...g,
    members: g.members ?? 0,
    activities: g.activities ?? 0,
  }));

  return (
    <>
      <AdminNav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold">Tous les groupes</h1>
        <p className="text-muted mb-6 text-sm">{rows.length} groupe(s) au total.</p>

        {rows.length === 0 ? (
          <div className="card text-muted py-12 text-center">
            Aucun groupe pour l&apos;instant.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {rows.map((g) => (
              <li
                key={g.id}
                className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <h2 className="min-w-0 truncate font-semibold">{g.name}</h2>
                    <code className="chip shrink-0 font-mono">{g.inviteCode}</code>
                  </div>
                  <div className="text-muted mt-1.5 flex flex-wrap gap-1.5 text-xs">
                    <span className="chip">
                      <Users className="size-3.5" /> {g.members} membre(s)
                    </span>
                    <span className="chip">
                      <ListChecks className="size-3.5" /> {g.activities} activité(s)
                    </span>
                    <span className="chip">
                      {new Date(g.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/groups/${g.id}`}
                    className="btn-secondary flex-1 px-3 py-1.5 sm:flex-initial"
                  >
                    Détail <ChevronRight className="size-4" />
                  </Link>
                  <form action={deleteGroup}>
                    <input type="hidden" name="id" value={g.id} />
                    <button
                      type="submit"
                      className="btn-danger px-3 py-1.5"
                      aria-label="Supprimer le groupe"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
