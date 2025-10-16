import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const nome = form.get("nome")?.toString() ?? "";
    const nascimento = form.get("nascimento")?.toString() ?? "";
    // format nascimento from YYYY-MM-DD to DD/MM/YYYY if possible
    function formatDateDMY(iso?: string) {
      if (!iso) return "";
      const parts = iso.split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return iso;
    }
    const nascimentoFormatado = formatDateDMY(nascimento);
    const cidade = form.get("cidade")?.toString() ?? "";
    const telefone = form.get("telefone")?.toString() ?? "";
    const email = form.get("email")?.toString() ?? "";
    const file = form.get("cv") as File | null;

    if (!nome || !email) {
      return NextResponse.json(
        { error: "Nome e email são obrigatórios" },
        { status: 400 }
      );
    }

    // Validate file size and MIME/extension
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    const allowedMimes = new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]);

    if (file) {
      // size check
      if (typeof file.size === "number" && file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: "Arquivo muito grande. Tamanho máximo: 5MB." },
          { status: 400 }
        );
      }

      const mime = file.type || "";
      const name = file.name || "";
      const ext = name.split(".").pop()?.toLowerCase() ?? "";
      const allowedExt = ["pdf", "doc", "docx"];

      // If mime is provided, require it to be in allowed list OR be octet with allowed extension
      if (mime) {
        const isOctet = mime === "application/octet-stream";
        if (!allowedMimes.has(mime) && !(isOctet && allowedExt.includes(ext))) {
          return NextResponse.json(
            { error: "Tipo de arquivo não permitido. Envie PDF ou DOC/DOCX." },
            { status: 400 }
          );
        }
      } else {
        // Fallback to extension check when mime is empty
        if (!allowedExt.includes(ext)) {
          return NextResponse.json(
            { error: "Tipo de arquivo não permitido. Envie PDF ou DOC/DOCX." },
            { status: 400 }
          );
        }
      }
    }

    // create transporter with env vars (adjusted for providers like Hostinger)
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465, // true for 465, false for 587 (STARTTLS)
      requireTLS: port === 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      pool: false,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
    } as any);

    const attachments = file
      ? [
          {
            filename: file.name,
            content: Buffer.from(await file.arrayBuffer()),
          },
        ]
      : [];

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.TO_EMAIL,
      subject: `Candidatura P3Agro - ${nome}`,
      text: `Novo candidato:\n\nNome: ${nome}\nNascimento: ${nascimentoFormatado}\nCidade: ${cidade}\nTelefone: ${telefone}\nEmail: ${email}`,
      attachments,
    } as any;

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      ok: true,
      message: "Candidatura recebida com sucesso.",
    });
  } catch (err) {
    console.error("Erro candidatura:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
