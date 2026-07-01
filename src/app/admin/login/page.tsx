import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { isAdmin } from "@/lib/admin";
import AdminLoginForm from "@/components/AdminLoginForm";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="card w-full max-w-sm">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="text-primary size-6" />
          <h1 className="text-xl font-bold">Espace administrateur</h1>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
