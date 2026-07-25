"use client";

import { useRef } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MAX_IMAGE_PICKER_SIZE = 4 * 1024 * 1024; // 4MB

interface ImagePickerFieldProps {
  label: string;
  previewUrl: string | null;
  fileName: string | null;
  helperText?: string;
  onFileSelected: (file: File | null) => void;
  onError: (message: string) => void;
}

export default function ImagePickerField({
  label,
  previewUrl,
  fileName,
  helperText,
  onFileSelected,
  onError,
}: ImagePickerFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      onFileSelected(null);
      return;
    }

    if (file.size > MAX_IMAGE_PICKER_SIZE) {
      onError("Imagem muito grande. Tamanho máximo: 4MB.");
      e.target.value = "";
      return;
    }

    onFileSelected(file);
  }

  return (
    <div>
      <label className="block mb-1 font-poppins font-medium text-sm">{label}</label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 shrink-0 rounded-md overflow-hidden border bg-gray-100 flex items-center justify-center">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- preview pode ser blob: local, next/image não aceita esse protocolo
            <img src={previewUrl} alt="Pré-visualização" className="w-full h-full object-cover" />
          ) : (
            <ImagePlus className="text-gray-400 size-8" />
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="!bg-p3green !text-white font-semibold hover:!bg-p3green-secondary transition-colors"
          >
            <ImagePlus />
            {previewUrl ? "Trocar imagem" : "Escolher imagem"}
          </Button>
          <p className="text-xs text-gray-500">
            {fileName ?? helperText ?? "PNG ou JPG, até 4MB"}
          </p>
        </div>
      </div>
    </div>
  );
}
