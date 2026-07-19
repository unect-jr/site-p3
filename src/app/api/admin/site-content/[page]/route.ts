import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getFirestoreAdmin } from "@/lib/firebase-admin";
import { getSiteContent, isSiteContentPageKey, type SiteContentPageKey } from "@/lib/siteContent";
import { SITE_CONTENT_FIELDS } from "@/lib/siteContentFields";
import { MAX_IMAGE_UPLOAD_SIZE, deleteImageBestEffort, uploadImage } from "@/lib/uploadImage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function revalidatePublicPaths(page: SiteContentPageKey) {
  switch (page) {
    case "home":
      revalidatePath("/");
      break;
    case "quemSomos":
      revalidatePath("/quem-somos");
      break;
    case "servicos":
      revalidatePath("/servicos");
      revalidatePath("/api/site-content/servicos");
      break;
    case "contatos":
      revalidatePath("/contatos");
      break;
    case "trabalheConosco":
      revalidatePath("/trabalhe-conosco");
      break;
    case "headerFooter":
      revalidatePath("/", "layout");
      break;
  }
}

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
    const docRef = getFirestoreAdmin().collection("siteContent").doc(page);
    const existing = await docRef.get();
    const existingData = existing.data() ?? {};

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
          await deleteImageBestEffort(existingData[field.key]);
        }
        continue;
      }

      const value = form.get(field.key);
      if (value !== null) {
        updates[field.key] = value.toString();
      }
    }

    await docRef.set(updates, { merge: true });

    revalidatePublicPaths(page);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`Erro ao atualizar conteúdo do site (${page}):`, error);
    return NextResponse.json({ error: "Erro ao salvar conteúdo" }, { status: 500 });
  }
}
