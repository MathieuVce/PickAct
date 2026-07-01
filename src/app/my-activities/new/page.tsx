import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/auth";
import AppNav from "@/components/AppNav";
import ActivityForm from "@/components/ActivityForm";

export default async function NewActivityPage() {
  const current = await getCurrentMember();
  if (!current) redirect("/");

  return (
    <>
      <AppNav groupName={current.group.name} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold">Nouvelle activité</h1>
        <p className="text-muted mb-6 text-sm">
          Seul le nom et la durée sont obligatoires. Elle restera anonyme pour les autres
          membres.
        </p>
        <ActivityForm />
      </main>
    </>
  );
}
