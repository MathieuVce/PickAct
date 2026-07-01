import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { ArrowLeft, Trash2, User } from "lucide-react";
import { db } from "@/db";
import { groups, members, activities } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { deleteMember, deleteAdminActivity, renameGroup } from "@/app/actions/admin";
import AdminNav from "@/components/AdminNav";
import { formatDuration, travelModeLabel } from "@/lib/travel";
import { STATUS_COLOR, STATUS_LABEL } from "@/lib/status";

export default async function AdminGroupDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;

  const [group] = await db.select().from(groups).where(eq(groups.id, id)).limit(1);
  if (!group) notFound();

  const groupMembers = await db
    .select()
    .from(members)
    .where(eq(members.groupId, id))
    .orderBy(desc(members.createdAt));

  // Activités AVEC auteur (autorisé en zone admin uniquement).
  const acts = await db
    .select({
      id: activities.id,
      name: activities.name,
      status: activities.status,
      estMinutes: activities.estMinutes,
      travelMinutes: activities.travelMinutes,
      travelMode: activities.travelMode,
      cost: activities.cost,
      author: members.displayName,
    })
    .from(activities)
    .innerJoin(members, eq(activities.memberId, members.id))
    .where(eq(activities.groupId, id))
    .orderBy(desc(activities.createdAt));

  return (
    <>
      <AdminNav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <Link href="/admin" className="btn-ghost mb-4 px-0 text-sm">
          <ArrowLeft className="size-4" /> Tous les groupes
        </Link>

        <div className="card mb-6">
          <form action={renameGroup} className="flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={group.id} />
            <div className="flex-1">
              <label className="label" htmlFor="name">
                Nom du groupe
              </label>
              <input id="name" name="name" defaultValue={group.name} className="field" />
            </div>
            <button type="submit" className="btn-secondary">
              Renommer
            </button>
            <code className="chip font-mono">{group.inviteCode}</code>
          </form>
        </div>

        <section className="mb-6">
          <h2 className="mb-3 text-lg font-semibold">Membres ({groupMembers.length})</h2>
          <ul className="flex flex-col gap-2">
            {groupMembers.map((m) => (
              <li key={m.id} className="card flex items-center justify-between gap-3 p-3">
                <span className="flex items-center gap-2 text-sm">
                  <User className="text-muted size-4" /> {m.displayName}
                </span>
                <form action={deleteMember}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="groupId" value={group.id} />
                  <button
                    type="submit"
                    className="btn-danger px-3 py-1.5"
                    aria-label="Supprimer le membre"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Activités ({acts.length})</h2>
          <ul className="flex flex-col gap-2">
            {acts.map((a) => {
              const total = a.estMinutes + (a.travelMinutes ?? 0);
              return (
                <li
                  key={a.id}
                  className="card flex items-start justify-between gap-3 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <h3 className="min-w-0 truncate font-medium">{a.name}</h3>
                      <span
                        className="chip shrink-0"
                        style={{
                          color: STATUS_COLOR[a.status],
                          borderColor: STATUS_COLOR[a.status],
                        }}
                      >
                        {STATUS_LABEL[a.status]}
                      </span>
                    </div>
                    <div className="text-muted mt-1 flex flex-wrap gap-1.5 text-xs">
                      <span className="chip">
                        <User className="size-3.5" /> {a.author}
                      </span>
                      <span className="chip">{formatDuration(total)}</span>
                      {a.cost != null && (
                        <span className="chip">{Number(a.cost).toFixed(2)} €</span>
                      )}
                      <span className="chip">{travelModeLabel(a.travelMode)}</span>
                    </div>
                  </div>
                  <form action={deleteAdminActivity}>
                    <input type="hidden" name="id" value={a.id} />
                    <input type="hidden" name="groupId" value={group.id} />
                    <button
                      type="submit"
                      className="btn-danger px-3 py-1.5"
                      aria-label="Supprimer l'activité"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </>
  );
}
