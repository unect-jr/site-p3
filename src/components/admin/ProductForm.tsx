"use client";

import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/mockData";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

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
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setError(null);

    if (!file) {
      setImageFile(null);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Imagem muito grande. Tamanho máximo: 4MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!initialProduct && !imageFile) {
      setError("Selecione uma imagem para o produto.");
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
      setError(err instanceof Error ? err.message : "Erro ao salvar produto");
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
          className="p-2 rounded border w-full text-gray-900"
        />
      </div>

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
          className="p-2 rounded border w-full text-gray-900"
        />
      </div>

      <div>
        <label className="block mb-1 font-poppins font-medium text-sm">Imagem</label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden border bg-gray-100 flex items-center justify-center">
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element -- preview local (blob:), next/image não aceita esse protocolo
              <img
                src={imagePreview}
                alt="Pré-visualização"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImagePlus className="text-gray-400 size-8" />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus />
              {imagePreview ? "Trocar imagem" : "Escolher imagem"}
            </Button>
            <p className="text-xs text-gray-500">
              {imageFile
                ? imageFile.name
                : initialProduct
                ? "Deixe assim para manter a imagem atual"
                : "PNG ou JPG, até 4MB"}
            </p>
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 font-poppins text-sm">
        <input
          type="checkbox"
          checked={ativo}
          onChange={(e) => setAtivo(e.target.checked)}
        />
        Produto ativo (visível no site)
      </label>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting} className="!bg-p3green !text-white">
          {submitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
