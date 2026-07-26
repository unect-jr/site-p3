"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatCurrency";
import type { ProductContentFields } from "@/lib/productHistory";

interface ProductHistoryEntry {
  id: string;
  createdAt: string;
  changedFields: string[];
  snapshot: Partial<ProductContentFields>;
}

interface ProductHistoryDialogProps {
  productId: string;
  productName: string;
}

const FIELD_LABELS: Record<string, string> = {
  nome: "Nome",
  preco: "Preço",
  imagemURL: "Imagem",
  ativo: "Ativo",
};

function formatFieldValue(key: string, value: unknown): string {
  if (key === "preco") return formatCurrency(value as number);
  if (key === "ativo") return value ? "Sim" : "Não";
  return String(value ?? "");
}

export default function ProductHistoryDialog({ productId, productName }: ProductHistoryDialogProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-product-history", productId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/products/${productId}/history`, { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao carregar histórico");
      return res.json() as Promise<ProductHistoryEntry[]>;
    },
    enabled: open,
  });

  const restoreMutation = useMutation({
    mutationFn: async (versionId: string) => {
      const res = await fetch(
        `/api/admin/products/${productId}/history/${versionId}/restore`,
        { method: "POST" }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Erro ao restaurar versão");
      }
    },
    onSuccess: () => {
      setConfirmingId(null);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product-history", productId] });
      setOpen(false);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Erro ao restaurar versão");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          Histórico
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Histórico de &quot;{productName}&quot;</DialogTitle>
        </DialogHeader>

        {isLoading && <p className="text-sm text-gray-600">Carregando histórico...</p>}
        {isError && <p className="text-sm text-red-600">Erro ao carregar histórico.</p>}
        {data && data.length === 0 && (
          <p className="text-sm text-gray-600">Nenhuma alteração anterior registrada ainda.</p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex flex-col gap-3">
          {data?.map((entry) => (
            <div key={entry.id} className="border rounded-lg p-3 flex flex-col gap-2">
              <p className="text-sm font-medium">
                {new Date(entry.createdAt).toLocaleString("pt-BR")}
              </p>

              <p className="text-xs text-gray-600">
                Alterado nesta edição:{" "}
                {entry.changedFields.map((key) => FIELD_LABELS[key] ?? key).join(", ")}
              </p>

              <div className="flex flex-wrap gap-3">
                {entry.changedFields.includes("imagemURL") && entry.snapshot.imagemURL && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={entry.snapshot.imagemURL}
                    alt="Imagem anterior"
                    className="h-16 w-16 object-cover rounded border"
                  />
                )}
                {entry.changedFields
                  .filter((key) => key !== "imagemURL")
                  .map((key) => (
                    <span key={key} className="text-xs text-gray-700">
                      {FIELD_LABELS[key] ?? key}: {formatFieldValue(key, entry.snapshot[key as keyof ProductContentFields])}
                    </span>
                  ))}
              </div>

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
                    onClick={() => {
                      setError(null);
                      setConfirmingId(entry.id);
                    }}
                  >
                    Restaurar
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
