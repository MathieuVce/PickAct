"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { loginAdmin } from "@/app/actions/admin";
import PasswordField from "@/components/PasswordField";

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <label className="label" htmlFor="password">
          Mot de passe administrateur
        </label>
        <PasswordField id="password" required autoFocus />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        <LogIn className="size-4" />
        {pending ? "Connexion" : "Entrer"}
      </button>
    </form>
  );
}
