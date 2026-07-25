import { notFound } from "next/navigation";
import { isSiteContentPageKey } from "@/lib/siteContent";
import ContentPageEditor from "@/components/admin/ContentPageEditor";

export default async function AdminConteudoPagePage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;

  if (!isSiteContentPageKey(page)) {
    notFound();
  }

  return <ContentPageEditor page={page} />;
}
