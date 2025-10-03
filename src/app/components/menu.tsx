import Image from "next/image";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

import { useState } from "react";
import { useEffect } from "react";

const Menu = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden z-10" asChild>
        <Button variant="ghost" size="icon" style={{ cursor: "pointer" }}>
          <Image
            src="/icone-menu.svg"
            alt="Ícone de menu"
            width={50}
            height={50}
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gray-100">
        <SheetHeader>
          <SheetTitle className="text-3xl">Menu</SheetTitle>
        </SheetHeader>
        <div className="p-4 flex flex-col gap-4">
          <div className="p-5 bg-p3green rounded-lg">
            <Link
              className="text-white text-xl font-semibold"
              href={`/quem-somos`}
            >
              Quem somos
            </Link>
          </div>
          <div className="p-5 bg-p3green rounded-lg">
            <Link
              className="text-white text-xl font-semibold"
              href={`/servicos`}
            >
              Serviços & Produtos
            </Link>
          </div>
          <div className="p-5 bg-p3green rounded-lg">
            <Link
              className="text-white text-xl font-semibold"
              href={`/previsao`}
            >
              Previsão
            </Link>
          </div>
          <div className="p-5 bg-p3green rounded-lg">
            <Link
              className="text-white text-xl font-semibold"
              href={`/trabalhe-conosco`}
            >
              Trabalhe Conosco
            </Link>
          </div>
          <div className="p-5 bg-p3green rounded-lg">
            <Link
              className="text-white text-xl font-semibold"
              href={`/contatos`}
            >
              Contatos
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Menu;
