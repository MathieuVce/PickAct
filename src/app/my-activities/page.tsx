import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { Plus, Clock, Wallet, Link as LinkIcon, Trash2, ClipboardList, PartyPopper } from "lucide-react";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { getCurrentMember } from "@/lib/auth";
import { deleteActivity } from "@/app/actions/activities";
import AppNav from "@/components/AppNav";
import AddedToast from "@/components/AddedToast";
import {
  formatDuration,
  travelModeIcon,
  travelModeLabel,
} from "@/lib/travel";

const STATUS_LABEL: Record<string, string> = {
  active: "En jeu",
  validated: "Validée",
  skipped: "Passée",
  later: "Plus tard",
};

const STATUS_COLOR: Record<string, string> = {
  active: "var(--cyan)",
  validated: "var(--green)",
  skipped: "var(--accent)",
  later: "var(--primary)",
};

export default async function MyActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ added?: string }>;
}) {
  const current = await getCurrentMember();
  if (!current) redirect("/");

  const { added } = await searchParams;

  const myActivities = await db
    .select()
    .from(activities)
    .where(eq(activities.memberId, current.member.id))
    .orderBy(desc(activities.createdAt));

  return (
    <>
      <AppNav groupName={current.group.name} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        {added === "1" && <AddedToast />}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Mes activités</h1>
            <p className="text-sm text-muted">
              Visibles de toi seul. Les autres ne voient pas qui a ajouté quoi.
            </p>
          </div>
          <Link href="/my-activities/new" className="btn-primary">
            <Plus className="size-4" /> Ajouter
          </Link>
        </div>

        {myActivities.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 py-12 text-center text-muted">
            <ClipboardList className="size-12" />
            <p>Tu n&apos;as pas encore ajouté d&apos;activité.</p>
            <Link href="/my-activities/new" className="btn-primary">
              <Plus className="size-4" /> Ajouter ma première activité
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {myActivities.map((a) => {
              const total = a.estMinutes + (a.travelMinutes ?? 0);
              const TravelIcon = travelModeIcon(a.travelMode);
              return (
                <li key={a.id} className="card flex items-start gap-4 p-4">
                  {a.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.imageUrl}
                      alt={a.name}
                      className="h-16 w-16 shrink-0 rounded-lg border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2">
                      <PartyPopper className="size-6 text-muted" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <h3 className="min-w-0 truncate font-semibold">{a.name}</h3>
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
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <span className="chip"><Clock className="size-3.5" /> {formatDuration(total)}</span>
                      {a.cost != null && (
                        <span className="chip"><Wallet className="size-3.5" /> {Number(a.cost).toFixed(2)} €</span>
                      )}
                      <span className="chip">
                        <TravelIcon className="size-3.5" /> {travelModeLabel(a.travelMode)}
                      </span>
                      {a.link && (
                        <a
                          href={a.link}
                          target="_blank"
                          rel="noreferrer"
                          className="chip hover:text-foreground"
                        >
                          <LinkIcon className="size-3.5" /> Lien
                        </a>
                      )}
                    </div>
                  </div>

                  <form action={deleteActivity}>
                    <input type="hidden" name="id" value={a.id} />
                    <button
                      type="submit"
                      className="btn-danger px-3 py-1.5"
                      aria-label={`Supprimer ${a.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
