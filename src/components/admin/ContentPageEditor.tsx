"use client";

import { useQuery } from "@tanstack/react-query";
import SiteContentForm from "@/components/admin/SiteContentForm";
import { SITE_CONTENT_FIELDS, SITE_CONTENT_PAGE_LABELS } from "@/lib/siteContentFields";
import type { SiteContentPageKey } from "@/lib/siteContent";

interface ContentPageEditorProps {
  page: SiteContentPageKey;
}

export default function ContentPageEditor({ page }: ContentPageEditorProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-site-content", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/site-content/${page}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao carregar conteúdo");
      return res.json() as Promise<Record<string, string>>;
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-poppins font-semibold">{SITE_CONTENT_PAGE_LABELS[page]}</h2>

      {isLoading && <p>Carregando conteúdo...</p>}
      {isError && <p className="text-red-600">Erro ao carregar conteúdo.</p>}

      {data && (
        <SiteContentForm page={page} descriptors={SITE_CONTENT_FIELDS[page]} initialValues={data} />
      )}
    </div>
  );
}
