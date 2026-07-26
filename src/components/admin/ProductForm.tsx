"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ImagePickerField from "@/components/admin/ImagePickerField";
import type { Product } from "@/lib/mockData";

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export default function ProductForm({
  initialProduct,
  onSubmit,
  onCancel,
  submitLabel,
}: ProductFormProps) {
  const [nome, setNome] = useState(initialProduct?.nome ?? "");
  const [preco, setPreco] = useState(initialProduct?.preco?.toString() ?? "");
  const [ativo, setAtivo] = useState(initialProduct?.ativo ?? true);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialProduct?.imagemURL ?? null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleImageSelected(file: File | null) {
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!initialProduct && !imageFile) {
      toast.error("Selecione uma imagem para o produto.");
      return;
    }

    const formData = new FormData();
    formData.set("nome", nome);
    formData.set("preco", preco);
    formData.set("ativo", String(ativo));
    if (imageFile) {
      formData.set("imagem", imageFile);
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar produto");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block mb-1 font-poppins font-medium text-sm">Nome</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="p-2 rounded border border-gray-400 w-full text-gray-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label className="block mb-1 font-poppins font-medium text-sm">
            Preço (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            className="p-2 rounded border border-gray-400 w-full text-gray-900"
          />
        </div>

        <label className="flex items-center gap-2 font-poppins text-sm pb-2.5">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
          />
          Produto ativo (visível no site)
        </label>
      </div>

      <ImagePickerField
        label="Imagem"
        previewUrl={imagePreview}
        fileName={imageFile?.name ?? null}
        helperText={initialProduct ? "Deixe assim para manter a imagem atual" : undefined}
        onFileSelected={handleImageSelected}
        onError={(message) => toast.error(message)}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
          className="!bg-gray-200 !text-gray-800 !border-gray-300 hover:!bg-gray-300"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="!bg-p3green !text-white font-semibold hover:!bg-p3green-secondary transition-colors"
        >
          {submitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
