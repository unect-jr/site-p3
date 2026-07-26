"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ImagePickerField from "@/components/admin/ImagePickerField";
import type { SiteContentFieldDescriptor } from "@/lib/siteContentFields";
import type { SiteContentPageKey } from "@/lib/siteContent";

interface SiteContentFormProps {
  page: SiteContentPageKey;
  descriptors: SiteContentFieldDescriptor[];
  initialValues: Record<string, string>;
}

export default function SiteContentForm({
  page,
  descriptors,
  initialValues,
}: SiteContentFormProps) {
  const queryClient = useQueryClient();

  const [textValues, setTextValues] = useState<Record<string, string>>(() => {
    const values: Record<string, string> = {};
    for (const field of descriptors) {
      if (field.type !== "image") {
        values[field.key] = initialValues[field.key] ?? "";
      }
    }
    return values;
  });

  const [imageFiles, setImageFiles] = useState<Record<string, File | null>>({});
  const [imagePreviews, setImagePreviews] = useState<Record<string, string | null>>(() => {
    const values: Record<string, string | null> = {};
    for (const field of descriptors) {
      if (field.type === "image") {
        values[field.key] = initialValues[field.key] ?? null;
      }
    }
    return values;
  });

  const [success, setSuccess] = useState(false);

  const groups = useMemo(() => {
    const ordered: { group: string; fields: SiteContentFieldDescriptor[] }[] = [];
    for (const field of descriptors) {
      const groupName = field.group ?? "";
      const existing = ordered.find((g) => g.group === groupName);
      if (existing) {
        existing.fields.push(field);
      } else {
        ordered.push({ group: groupName, fields: [field] });
      }
    }
    return ordered;
  }, [descriptors]);

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      for (const [key, value] of Object.entries(textValues)) {
        formData.set(key, value);
      }
      for (const [key, file] of Object.entries(imageFiles)) {
        if (file) formData.set(key, file);
      }

      const res = await fetch(`/api/admin/site-content/${page}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Erro ao salvar conteúdo");
      }
    },
    onSuccess: () => {
      setSuccess(true);
      setImageFiles({});
      queryClient.invalidateQueries({ queryKey: ["admin-site-content", page] });
      window.setTimeout(() => setSuccess(false), 4000);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar conteúdo");
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {groups.map(({ group, fields }) => (
        <div key={group} className="flex flex-col gap-4 border rounded-lg p-4 bg-white">
          {group && <h3 className="font-poppins font-semibold text-base">{group}</h3>}

          {fields.map((field) => {
            if (field.type === "image") {
              return (
                <ImagePickerField
                  key={field.key}
                  label={field.label}
                  previewUrl={imagePreviews[field.key] ?? null}
                  fileName={imageFiles[field.key]?.name ?? null}
                  helperText="Deixe assim para manter a imagem atual"
                  onFileSelected={(file) => {
                    setImageFiles((prev) => ({ ...prev, [field.key]: file }));
                    if (file) {
                      setImagePreviews((prev) => ({
                        ...prev,
                        [field.key]: URL.createObjectURL(file),
                      }));
                    }
                  }}
                  onError={(message) => toast.error(message)}
                />
              );
            }

            return (
              <div key={field.key}>
                <label className="block mb-1 font-poppins font-medium text-sm">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={textValues[field.key] ?? ""}
                    onChange={(e) =>
                      setTextValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    rows={4}
                    className="p-2 rounded border border-gray-400 w-full text-gray-900"
                  />
                ) : (
                  <input
                    value={textValues[field.key] ?? ""}
                    onChange={(e) =>
                      setTextValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className="p-2 rounded border border-gray-400 w-full text-gray-900"
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}

      {success && <p className="text-green-700 text-sm">Conteúdo salvo com sucesso.</p>}

      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending} className="!bg-p3green !text-white">
          {mutation.isPending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
