import { redirect } from "next/navigation";
import { Clock, Wallet, Car, Dices } from "lucide-react";
import { getCurrentMember } from "@/lib/auth";
import HomeForms from "@/components/HomeForms";

export default async function HomePage() {
  const current = await getCurrentMember();
  if (current) redirect("/dashboard");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-12">
      <div className="max-w-xl text-center">
        <div className="border-border bg-surface-2 text-muted mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
          <Dices className="size-4" />
          Entre amis, sans prise de tête
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Pick<span className="gradient-text">Act</span>
        </h1>
        <p className="text-muted mt-4 text-lg text-balance">
          Chacun ajoute ses idées d&apos;activités, anonymement. Quand vous hésitez,
          PickAct en tire une au hasard selon votre temps, votre budget et votre mode de
          transport.
        </p>
      </div>

      <HomeForms />

      <ul className="text-muted flex flex-wrap justify-center gap-3 text-sm">
        <li className="chip">
          <Clock className="size-3.5" /> Filtre temps
        </li>
        <li className="chip">
          <Wallet className="size-3.5" /> Filtre budget
        </li>
        <li className="chip">
          <Car className="size-3.5" /> Filtre transport
        </li>
      </ul>
    </main>
  );
}
