"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductForm from "@/components/admin/ProductForm";
import ProductHistoryDialog from "@/components/admin/ProductHistoryDialog";
import ProductTrashDialog from "@/components/admin/ProductTrashDialog";
import { formatCurrency } from "@/lib/formatCurrency";
import type { Product } from "@/lib/mockData";

async function fetchAdminProducts(): Promise<Product[]> {
  const res = await fetch("/api/admin/products", { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao carregar produtos");
  return res.json();
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [dialogState, setDialogState] = useState<
    { mode: "create" } | { mode: "edit"; product: Product } | null
  >(null);

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchAdminProducts,
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/admin/products", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Erro ao criar produto");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDialogState(null);
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const res = await fetch(`/api/admin/products/${id}`, { method: "PATCH", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Erro ao atualizar produto");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDialogState(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Erro ao excluir produto");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  function handleDelete(product: Product) {
    if (
      !window.confirm(
        `Mover o produto "${product.nome}" para a lixeira? Você pode restaurar depois pela Lixeira.`
      )
    ) {
      return;
    }
    deleteMutation.mutate(product.id);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-poppins font-semibold">Produtos</h2>
        <div className="flex gap-2">
          <ProductTrashDialog />
          <Button className="!bg-p3green !text-white" onClick={() => setDialogState({ mode: "create" })}>
            Novo Produto
          </Button>
        </div>
      </div>

      {isLoading && <p>Carregando produtos...</p>}
      {isError && <p className="text-red-600">Erro ao carregar produtos.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products?.map((product) => (
          <Card key={product.id}>
            <CardContent className="flex flex-col gap-3">
              <div className="relative w-full h-40 rounded overflow-hidden bg-gray-100">
                <Image src={product.imagemURL} alt={product.nome} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-poppins font-medium">{product.nome}</h3>
                <p className="text-sm text-gray-600">{formatCurrency(product.preco)}</p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    product.ativo ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {product.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialogState({ mode: "edit", product })}
                >
                  Editar
                </Button>
                <ProductHistoryDialog productId={product.id} productName={product.nome} />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product)}
                  disabled={deleteMutation.isPending}
                >
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogState !== null} onOpenChange={(open) => !open && setDialogState(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogState?.mode === "edit" ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          {dialogState && (
            <ProductForm
              initialProduct={dialogState.mode === "edit" ? dialogState.product : undefined}
              submitLabel={dialogState.mode === "edit" ? "Salvar" : "Criar"}
              onCancel={() => setDialogState(null)}
              onSubmit={async (formData) => {
                if (dialogState.mode === "edit") {
                  await editMutation.mutateAsync({ id: dialogState.product.id, formData });
                } else {
                  await createMutation.mutateAsync(formData);
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
