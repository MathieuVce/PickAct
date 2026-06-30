import Link from "next/link";
import { redirect } from "next/navigation";
import { SearchX } from "lucide-react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { groups } from "@/db/schema";
import { getCurrentMember } from "@/lib/auth";
import { normalizeCode } from "@/lib/codes";
import JoinForm from "@/components/JoinForm";

export default async function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const current = await getCurrentMember();
  if (current) redirect("/dashboard");

  const { code: rawCode } = await params;
  const code = normalizeCode(decodeURIComponent(rawCode));

  const [group] = await db
    .select()
    .from(groups)
    .where(eq(groups.inviteCode, code))
    .limit(1);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
      <Link href="/" className="text-lg font-extrabold">
        Pick<span className="text-primary">Act</span>
      </Link>

      <div className="card w-full max-w-md">
        {group ? (
          <>
            <p className="text-sm text-muted">Tu es invité à rejoindre</p>
            <h1 className="mb-1 text-2xl font-bold">{group.name}</h1>
            <p className="mb-6 text-sm text-muted">
              Choisis un pseudo et un mot de passe pour entrer dans le groupe.
            </p>
            <JoinForm code={group.inviteCode} />
          </>
        ) : (
          <div className="text-center">
            <SearchX className="mx-auto size-12 text-muted" />
            <h1 className="mt-3 text-xl font-bold">Groupe introuvable</h1>
            <p className="mt-2 text-sm text-muted">
              Le lien d&apos;invitation semble invalide ou expiré.
            </p>
            <Link href="/" className="btn-primary mt-5 inline-flex">
              Retour à l&apos;accueil
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
