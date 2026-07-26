"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SITE_CONTENT_FIELDS } from "@/lib/siteContentFields";
import type { SiteContentPageKey } from "@/lib/siteContent";

interface SiteContentHistoryEntry {
  id: string;
  createdAt: string;
  changedFields: string[];
  snapshot: Record<string, string>;
}

interface SiteContentHistoryDialogProps {
  page: SiteContentPageKey;
  onRestored?: () => void | Promise<void>;
}

export default function SiteContentHistoryDialog({ page, onRestored }: SiteContentHistoryDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const descriptors = SITE_CONTENT_FIELDS[page];
  const fieldLabels = Object.fromEntries(descriptors.map((field) => [field.key, field.label]));
  const imageKeys = new Set(descriptors.filter((f) => f.type === "image").map((f) => f.key));

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-site-content-history", page],
    queryFn: async () => {
      const res = await fetch(`/api/admin/site-content/${page}/history`, { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao carregar histórico");
      return res.json() as Promise<SiteContentHistoryEntry[]>;
    },
    enabled: open,
  });

  useEffect(() => {
    if (isError) toast.error("Erro ao carregar histórico.");
  }, [isError]);

  const restoreMutation = useMutation({
    mutationFn: async (versionId: string) => {
      const res = await fetch(`/api/admin/site-content/${page}/history/${versionId}/restore`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Erro ao restaurar versão");
      }
    },
    onSuccess: async () => {
      setConfirmingId(null);
      await onRestored?.();
      queryClient.invalidateQueries({ queryKey: ["admin-site-content-history", page] });
      setOpen(false);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Erro ao restaurar versão");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Histórico de alterações</DialogTitle>
        </DialogHeader>

        {isLoading && <p className="text-sm text-gray-600">Carregando histórico...</p>}
        {data && data.length === 0 && (
          <p className="text-sm text-gray-600">Nenhuma alteração anterior registrada ainda.</p>
        )}

        <div className="flex flex-col gap-3">
          {data?.map((entry) => {
            const imageChanges = entry.changedFields.filter((key) => imageKeys.has(key));
            const textChanges = entry.changedFields.filter((key) => !imageKeys.has(key));

            return (
              <div key={entry.id} className="border rounded-lg p-3 flex flex-col gap-2">
                <p className="text-sm font-medium">
                  {new Date(entry.createdAt).toLocaleString("pt-BR")}
                </p>

                <p className="text-xs text-gray-600">
                  Alterado nesta edição:{" "}
                  {entry.changedFields.map((key) => fieldLabels[key] ?? key).join(", ")}
                </p>

                {imageChanges.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {imageChanges.map((key) => (
                      <img
                        key={key}
                        src={entry.snapshot[key]}
                        alt={fieldLabels[key] ?? key}
                        className="h-16 w-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}

                {textChanges.length === 0 && imageChanges.length === 0 && (
                  <p className="text-xs text-gray-500">Sem campos alterados registrados.</p>
                )}

                {confirmingId === entry.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-700">Restaurar esta versão?</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      disabled={restoreMutation.isPending}
                      onClick={() => restoreMutation.mutate(entry.id)}
                    >
                      {restoreMutation.isPending ? "Restaurando..." : "Confirmar"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={restoreMutation.isPending}
                      onClick={() => setConfirmingId(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmingId(entry.id)}
                    >
                      Restaurar
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
