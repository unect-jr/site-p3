import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_CONTENT_PAGE_KEYS } from "@/lib/siteContent";
import { SITE_CONTENT_PAGE_LABELS } from "@/lib/siteContentFields";

export default function AdminConteudoIndexPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-poppins font-semibold">Conteúdo do Site</h2>
      <p className="text-gray-600 -mt-2">
        Edite os textos, títulos e imagens de cada página do site.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {SITE_CONTENT_PAGE_KEYS.map((page) => (
          <Link key={page} href={`/admin/conteudo/${page}`}>
            <Card className="hover:border-p3green transition-colors cursor-pointer">
              <CardContent>
                <h3 className="font-poppins font-medium">{SITE_CONTENT_PAGE_LABELS[page]}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
