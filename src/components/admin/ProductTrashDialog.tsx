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
import { formatCurrency } from "@/lib/formatCurrency";
import type { AdminProduct } from "@/lib/getProdutos";

async function fetchDeletedProducts(): Promise<AdminProduct[]> {
  const res = await fetch("/api/admin/products?trash=1", { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar lixeira");
  return res.json();
}

export default function ProductTrashDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmingPurgeId, setConfirmingPurgeId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-products-trash"],
    queryFn: fetchDeletedProducts,
    enabled: open,
  });

  useEffect(() => {
    if (isError) toast.error("Erro ao carregar lixeira.");
  }, [isError]);

  function invalidateAll() {
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["admin-products-trash"] });
  }

  const undeleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products/${id}/undelete`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Erro ao restaurar produto");
      }
    },
    onSuccess: () => {
      invalidateAll();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Erro ao restaurar produto");
    },
  });

  const purgeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products/${id}/purge`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Erro ao excluir produto permanentemente");
      }
    },
    onSuccess: () => {
      setConfirmingPurgeId(null);
      invalidateAll();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir produto permanentemente");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Lixeira
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Lixeira de produtos</DialogTitle>
        </DialogHeader>

        {isLoading && <p className="text-sm text-gray-600">Carregando lixeira...</p>}
        {data && data.length === 0 && (
          <p className="text-sm text-gray-600">Nenhum produto na lixeira.</p>
        )}

        <div className="flex flex-col gap-3">
          {data?.map((product) => (
            <div key={product.id} className="border rounded-lg p-3 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imagemURL}
                alt={product.nome}
                className="h-14 w-14 object-cover rounded border shrink-0"
              />
              <div className="flex-1">
                <p className="font-medium text-sm">{product.nome}</p>
                <p className="text-xs text-gray-600">{formatCurrency(product.preco)}</p>
                {product.deletedAt && (
                  <p className="text-xs text-gray-500">
                    Excluído em {new Date(product.deletedAt).toLocaleString("pt-BR")}
                  </p>
                )}
              </div>

              {confirmingPurgeId === product.id ? (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-700">Excluir para sempre?</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      disabled={purgeMutation.isPending}
                      onClick={() => purgeMutation.mutate(product.id)}
                    >
                      {purgeMutation.isPending ? "Excluindo..." : "Confirmar"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={purgeMutation.isPending}
                      onClick={() => setConfirmingPurgeId(null)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={undeleteMutation.isPending}
                    onClick={() => undeleteMutation.mutate(product.id)}
                  >
                    Restaurar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => setConfirmingPurgeId(product.id)}
                  >
                    Excluir permanentemente
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
