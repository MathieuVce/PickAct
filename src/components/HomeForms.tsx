"use client";

import { useActionState, useState } from "react";
import { Sparkles, LogIn } from "lucide-react";
import {
  createGroup,
  enterGroup,
  type ActionState,
} from "@/app/actions/groups";
import PasswordField from "@/components/PasswordField";

type Tab = "create" | "enter";

const TABS: { id: Tab; label: string }[] = [
  { id: "create", label: "Créer un groupe" },
  { id: "enter", label: "Rejoindre ou se connecter" },
];

function ErrorText({ state }: { state: ActionState }) {
  if (!state?.error) return null;
  return (
    <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
      {state.error}
    </p>
  );
}

export default function HomeForms({ initialTab }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab ?? "create");

  const [createState, createAction, creating] = useActionState(createGroup, undefined);
  const [enterState, enterAction, entering] = useActionState(enterGroup, undefined);

  return (
    <div className="card w-full max-w-md">
      <div className="mb-6 flex rounded-xl border border-border bg-surface-2 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              tab === t.id
                ? "bg-primary text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "create" && (
        <form action={createAction} className="flex flex-col gap-4">
          <div>
            <label className="label" htmlFor="groupName">
              Nom du groupe
            </label>
            <input
              id="groupName"
              name="groupName"
              className="field"
              placeholder="Les copains du jeudi"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="pseudo-create">
              Ton pseudo
            </label>
            <input
              id="pseudo-create"
              name="pseudo"
              className="field"
              placeholder="Alex"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password-create">
              Mot de passe
            </label>
            <PasswordField
              id="password-create"
              placeholder="Pour te reconnecter partout"
            />
          </div>
          <ErrorText state={createState} />
          <button type="submit" className="btn-primary w-full">
            <Sparkles className="size-4" />
            {creating ? "Création" : "Créer le groupe"}
          </button>
        </form>
      )}

      {tab === "enter" && (
        <form action={enterAction} className="flex flex-col gap-4">
          <p className="text-sm text-muted">
            Entre le code du groupe avec ton pseudo et ton mot de passe. Premier
            passage ou reconnexion sur un autre appareil, c&apos;est le même
            formulaire.
          </p>
          <div>
            <label className="label" htmlFor="inviteCode">
              Code du groupe
            </label>
            <input
              id="inviteCode"
              name="inviteCode"
              className="field font-mono uppercase tracking-wider"
              placeholder="PICK4F2A"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="pseudo-enter">
              Ton pseudo
            </label>
            <input
              id="pseudo-enter"
              name="pseudo"
              className="field"
              placeholder="Alex"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password-enter">
              Mot de passe
            </label>
            <PasswordField id="password-enter" placeholder="Ton mot de passe" />
          </div>
          <ErrorText state={enterState} />
          <button type="submit" className="btn-primary w-full">
            <LogIn className="size-4" />
            {entering ? "Connexion" : "Entrer dans le groupe"}
          </button>
        </form>
      )}
    </div>
  );
}
