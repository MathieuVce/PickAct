"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Champ mot de passe avec bouton oeil pour afficher ou masquer la saisie.
 * `readOnly` + reactivation au focus bloque le remplissage automatique au chargement.
 */
export default function PasswordField({
  id,
  name = "password",
  placeholder,
  autoFocus,
  required = true,
}: {
  id: string;
  name?: string;
  placeholder?: string;
  autoFocus?: boolean;
  required?: boolean;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        className="field pr-11"
        autoComplete="new-password"
        readOnly
        onFocus={(e) => e.currentTarget.removeAttribute("readonly")}
        placeholder={placeholder}
        required={required}
        autoFocus={autoFocus}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={show}
        className="text-muted hover:text-foreground absolute top-1/2 right-1.5 -translate-y-1/2 rounded-lg p-2 transition-colors"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
