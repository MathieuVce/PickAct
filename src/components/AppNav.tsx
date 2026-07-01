"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "Tirage" },
  { href: "/my-activities", label: "Mes activités" },
  { href: "/account", label: "Mon compte" },
];

export default function AppNav({ groupName }: { groupName: string }) {
  const pathname = usePathname();

  return (
    <header className="border-border bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-lg font-extrabold">
            Pick<span className="gradient-text">Act</span>
          </span>
          <span className="text-muted hidden truncate text-sm sm:inline">
            · {groupName}
          </span>
        </Link>
        <nav className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                  active
                    ? "bg-primary/15 text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
