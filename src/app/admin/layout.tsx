"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { href: "/admin", label: "Produtos" },
  { href: "/admin/conteudo", label: "Conteúdo do Site" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="flex items-center justify-between px-6 py-4 bg-p3green text-white">
        <h1 className="font-nebula text-xl">P3 Agro — Painel Admin</h1>
        <Button
          variant="outline"
          className="!bg-black !text-white !border-black hover:!bg-white hover:!text-black transition-colors duration-500 ease-in-out"
          onClick={handleLogout}
        >
          Sair
        </Button>
      </div>

      <div className="flex items-center gap-3 px-6 py-3 bg-white border-b font-poppins">
        {SECTIONS.map((section) => {
          const isActive =
            section.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(section.href);

          return (
            <Link
              key={section.href}
              href={section.href}
              className={cn(
                "px-4 py-2 rounded-md font-medium transition-colors",
                isActive
                  ? "bg-p3green text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {section.label}
            </Link>
          );
        })}
      </div>

      <div className="p-6 max-w-5xl mx-auto">{children}</div>
    </div>
  );
}
