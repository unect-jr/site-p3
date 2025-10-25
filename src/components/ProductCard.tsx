// src/components/ProductCard.tsx
import Image from "next/image";
import type { Product } from "@/lib/mockData"; // Importando nosso contrato de dados
import { formatCurrency } from "@/lib/formatCurrency";
import WhatsAppButton from "./WhatsAppButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex flex-col items-start w-full max-w-[350px]">
      <div className="relative w-full h-48 md:h-64 rounded-md overflow-hidden">
        {/* Usamos o componente Image do Next.js para otimização automática */}
        <Image
          src={product.imagemURL}
          alt={`Imagem de ${product.nome}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="pt-2 w-full px-1">
        {/* Nome do Produto */}
        <h3 className="font-poppins font-medium text-lg text-left text-black leading-tight">
          {product.nome}
        </h3>

        {/* CTA WhatsApp */}
        <div className="pt-2">
          <WhatsAppButton
            productName={product.nome}
            // Aplicando o número fornecido: (43) 99648-1850
            phone="(43) 99648-1850"
            className="mt-2"
            message={`Olá, tenho interesse no produto "${product.nome}"`}
          />
        </div>
      </div>
    </div>
  );
}
