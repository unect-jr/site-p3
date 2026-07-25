import { NextResponse } from "next/server";
import { getSiteContent, isSiteContentPageKey } from "@/lib/siteContent";
import { SITE_CONTENT_FIELDS } from "@/lib/siteContentFields";
import { MAX_IMAGE_UPLOAD_SIZE, uploadImage } from "@/lib/uploadImage";
import { writeSiteContentUpdate } from "@/lib/siteContentHistory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;
  if (!isSiteContentPageKey(page)) {
    return NextResponse.json({ error: "Página inválida" }, { status: 400 });
  }

  const content = await getSiteContent(page);
  return NextResponse.json(content);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page } = await params;
  if (!isSiteContentPageKey(page)) {
    return NextResponse.json({ error: "Página inválida" }, { status: 400 });
  }

  try {
    const form = await req.formData();
    const descriptors = SITE_CONTENT_FIELDS[page];

    const updates: Record<string, string> = {};

    for (const field of descriptors) {
      if (field.type === "image") {
        const file = form.get(field.key) as File | null;
        if (file && file.size > 0) {
          if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
            return NextResponse.json(
              { error: `Imagem "${field.label}" muito grande. Tamanho máximo: 4MB.` },
              { status: 400 }
            );
          }
          updates[field.key] = await uploadImage(file, "siteContent");
        }
        continue;
      }

      const value = form.get(field.key);
      if (value !== null) {
        updates[field.key] = value.toString();
      }
    }

    await writeSiteContentUpdate(page, updates);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Erro ao atualizar conteúdo do site (${page}):`, error);
    return NextResponse.json({ error: "Erro ao salvar conteúdo" }, { status: 500 });
  }
}
