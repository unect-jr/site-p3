"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import SiteContentForm from "@/components/admin/SiteContentForm";
import SiteContentHistoryDialog from "@/components/admin/SiteContentHistoryDialog";
import { SITE_CONTENT_FIELDS, SITE_CONTENT_PAGE_LABELS } from "@/lib/siteContentFields";
import type { SiteContentPageKey } from "@/lib/siteContent";

interface ContentPageEditorProps {
  page: SiteContentPageKey;
}

export default function ContentPageEditor({ page }: ContentPageEditorProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-site-content", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/site-content/${page}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao carregar conteúdo");
      return res.json() as Promise<Record<string, string>>;
    },
  });

  // SiteContentForm só lê `initialValues` na montagem (estado local do form).
  // Depois de um restore, precisamos forçar a remontagem com os dados
  // atualizados — daí o `key`, incrementado só depois que o refetch resolve.
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (isError) toast.error("Erro ao carregar conteúdo.");
  }, [isError]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-poppins font-semibold">{SITE_CONTENT_PAGE_LABELS[page]}</h2>
        <SiteContentHistoryDialog
          page={page}
          onRestored={async () => {
            await refetch();
            setFormKey((k) => k + 1);
          }}
        />
      </div>

      {isLoading && <p>Carregando conteúdo...</p>}

      {data && (
        <SiteContentForm
          key={formKey}
          page={page}
          descriptors={SITE_CONTENT_FIELDS[page]}
          initialValues={data}
        />
      )}
    </div>
  );
}
