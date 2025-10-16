"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function CandidaturaForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const submittingRef = useRef(false);

  function showMessage(msg: string, type: "success" | "error") {
    setMessage(msg);
    setMessageType(type);
    // auto-hide after 6s
    window.setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 6000);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return; // prevent duplicate submits synchronously
    submittingRef.current = true;
    setLoading(true);

    const formEl = e.currentTarget as HTMLFormElement;

    // clear previous messages
    setMessage(null);
    setMessageType(null);

    // client-side file validation
    const fileInput = formEl.querySelector(
      'input[name="cv"]'
    ) as HTMLInputElement | null;
    const file = fileInput?.files?.[0] ?? null;
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const allowedMimes = new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]);
    const allowedExt = ["pdf", "doc", "docx"];

    if (file) {
      if (file.size > MAX_SIZE) {
        showMessage("Arquivo muito grande. Tamanho máximo: 5MB.", "error");
        submittingRef.current = false;
        setLoading(false);
        return;
      }
      const mime = file.type || "";
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const isOctet = mime === "application/octet-stream";
      if (mime) {
        if (!allowedMimes.has(mime) && !(isOctet && allowedExt.includes(ext))) {
          showMessage(
            "Tipo de arquivo não permitido. Envie PDF ou DOC/DOCX.",
            "error"
          );
          submittingRef.current = false;
          setLoading(false);
          return;
        }
      } else {
        if (!allowedExt.includes(ext)) {
          showMessage(
            "Tipo de arquivo não permitido. Envie PDF ou DOC/DOCX.",
            "error"
          );
          submittingRef.current = false;
          setLoading(false);
          return;
        }
      }
    }

    const form = new FormData(formEl);
    try {
      const res = await fetch("/api/candidatura", {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.error || "Erro no envio";
        showMessage(msg, "error");
        throw new Error(msg);
      }

      const okMsg = data?.message || "Candidatura enviada com sucesso";
      showMessage(okMsg, "success");
      formEl.reset();
    } catch (err: any) {
      console.error("Envio candidatura erro:", err);
      if (!message) {
        showMessage(
          err?.message ||
            "Erro ao enviar candidatura. Tente novamente mais tarde.",
          "error"
        );
      }
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <>
      {/* inline toast */}
      {message && (
        <div
          className={`w-full md:max-w-4xl p-3 rounded mb-4 ${
            messageType === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-[#C6CACE] p-6 md:p-8 rounded-lg w-full flex flex-col gap-3 md:gap-4 items-center"
      >
        <div className="w-full md:max-w-4xl">
          <label className="block mb-1 font-poppins font-medium text-base md:text-xl leading-tight tracking-normal">
            nome completo
          </label>
          <input
            name="nome"
            type="text"
            required
            className="p-2 md:p-3 rounded bg-white w-full text-gray-900"
          />
        </div>

        <div className="w-full md:max-w-4xl">
          <label className="block mb-1 font-poppins font-medium text-base md:text-xl leading-tight tracking-normal">
            data de nascimento
          </label>
          <input
            name="nascimento"
            type="date"
            className="p-2 md:p-3 rounded bg-white text-gray-700 w-full"
          />
        </div>

        <div className="w-full md:max-w-4xl">
          <label className="block mb-1 font-poppins font-medium text-base md:text-xl leading-tight tracking-normal">
            cidade
          </label>
          <input
            name="cidade"
            type="text"
            className="p-2 md:p-3 rounded bg-white w-full text-gray-900"
          />
        </div>

        <div className="w-full md:max-w-4xl">
          <label className="block mb-1 font-poppins font-medium text-base md:text-xl leading-tight tracking-normal">
            telefone
          </label>
          <input
            name="telefone"
            type="tel"
            className="p-2 md:p-3 rounded bg-white w-full text-gray-900"
          />
        </div>

        <div className="w-full md:max-w-4xl">
          <label className="block mb-1 font-poppins font-medium text-base md:text-xl leading-tight tracking-normal">
            email
          </label>
          <input
            name="email"
            type="email"
            required
            className="p-2 md:p-3 rounded bg-white w-full text-gray-900"
          />
        </div>

        <div className="w-full md:max-w-4xl">
          <label className="block mb-1 font-poppins font-medium text-base md:text-xl leading-tight tracking-normal">
            anexar currículo (PDF ou docx)
          </label>
          <input
            name="cv"
            type="file"
            accept=".pdf,.doc,.docx"
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-white file:text-gray-700"
          />
        </div>

        <div className="w-full md:max-w-4xl flex justify-start">
          <Button
            type="submit"
            disabled={loading}
            variant="default"
            size="lg"
            className="!bg-[#195B31] !text-white hover:!bg-[#154a28] font-poppins font-semibold text-lg md:text-xl"
          >
            {loading ? "ENVIANDO..." : "ENVIAR"}
          </Button>
        </div>
      </form>
    </>
  );
}
