"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { enterGroup } from "@/app/actions/groups";
import PasswordField from "@/components/PasswordField";

export default function JoinForm({ code }: { code: string }) {
  const [state, action, pending] = useActionState(enterGroup, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="inviteCode" value={code} />
      <div>
        <label className="label" htmlFor="pseudo">
          Ton pseudo
        </label>
        <input
          id="pseudo"
          name="pseudo"
          className="field"
          placeholder="Alex"
          required
          autoFocus
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Mot de passe
        </label>
        <PasswordField
          id="password"
          placeholder="Choisis ou saisis ton mot de passe"
        />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        <LogIn className="size-4" />
        {pending ? "Connexion" : "Entrer dans le groupe"}
      </button>
    </form>
  );
}
