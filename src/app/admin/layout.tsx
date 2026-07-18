"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="flex items-center justify-between px-6 py-4 bg-p3green text-white">
        <h1 className="font-nebula text-xl">P3 Agro — Painel Admin</h1>
        <Button variant="outline" className="!bg-white !text-p3green" onClick={handleLogout}>
          Sair
        </Button>
      </div>
      <div className="p-6 max-w-5xl mx-auto">{children}</div>
    </div>
  );
}
