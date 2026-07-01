"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { celebrate } from "@/lib/confetti";

export default function AddedToast() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    celebrate();
    const t = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;
  return (
    <div className="border-primary/40 bg-primary/10 mb-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
      <CheckCircle2 className="text-primary size-5" />
      Activité ajoutée. Elle est maintenant en jeu pour le tirage.
    </div>
  );
}
