import Link from "next/link";
import { ShieldCheck, LogOut } from "lucide-react";
import { logoutAdmin } from "@/app/actions/admin";

export default function AdminNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4">
        <Link href="/admin" className="flex min-w-0 items-center gap-2">
          <ShieldCheck className="size-5 shrink-0 text-primary" />
          <span className="shrink-0 text-lg font-extrabold">
            Pick<span className="gradient-text">Act</span>
          </span>
          <span className="chip-accent shrink-0">Admin</span>
        </Link>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="btn-ghost shrink-0 px-2 py-1.5 text-sm sm:px-3"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </form>
      </div>
    </header>
  );
}
