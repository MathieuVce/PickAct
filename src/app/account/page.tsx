import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth";
import { logout } from "@/app/actions/groups";
import AppNav from "@/components/AppNav";
import CopyableCode from "@/components/CopyableCode";
import LeaveGroupButton from "@/components/LeaveGroupButton";

export default async function AccountPage() {
  const current = await getCurrentMember();
  if (!current) redirect("/");

  const { member, group } = current;

  return (
    <>
      <AppNav groupName={group.name} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Mon compte</h1>

        <div className="flex flex-col gap-5">
          <div className="card">
            <h2 className="text-lg font-semibold">Profil</h2>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted">Pseudo</dt>
              <dd className="font-medium">{member.displayName}</dd>
              <dt className="text-muted">Groupe</dt>
              <dd className="font-medium">{group.name}</dd>
            </dl>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold">Se reconnecter ailleurs</h2>
            <p className="mt-1 text-sm text-muted">
              Sur un autre appareil, choisis « Rejoindre ou se connecter » et
              saisis le code du groupe, ton pseudo et ton mot de passe. Tu
              retrouveras tes activités.
            </p>
            <div className="mt-4">
              <CopyableCode value={group.inviteCode} />
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold">Session</h2>
            <p className="mb-4 mt-1 text-sm text-muted">
              Te déconnecter ne supprime rien. Quitter le groupe efface
              définitivement tes activités.
            </p>
            <div className="flex flex-wrap gap-3">
              <form action={logout}>
                <button type="submit" className="btn-secondary">
                  Se déconnecter
                </button>
              </form>
              <LeaveGroupButton />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
