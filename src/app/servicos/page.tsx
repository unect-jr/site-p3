"use client";
import ProductCard from "@/components/ProductCard";
//import { MOCK_PRODUCTS } from "@/lib/mockData";
import type { Product } from "@/lib/mockData";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

const servicos = [
  {
    titulo: "MONITORES",
    texto:
      "Dispositivo que monitora em tempo real todas as atividades. Na agricultura, também são chamados de GPS, são verdadeiros amigos do produtor quando se trata de produção no campo, principalmente se você quer começar a implementar a agricultura de precisão na sua propriedade.",
    desktopImg: "/monitor.png",
    mobileImg: "/monitor_carousel.png",
  },
  {
    titulo: "ANTENAS GPS",
    texto: "São dispositivos que recebem sinais dos satélites GPS.",
    desktopImg: "/antena.png",
    mobileImg: "/antena_carousel.png",
  },
  {
    titulo: "PILOTO AUTOMATICO",
    texto:
      "O piloto automático na agricultura de precisão permite a automação de veículos agrícolas, melhorando a precisão nas operações de plantio, colheita e pulverização.",
    desktopImg: "/piloto_automatico.png",
    mobileImg: "/piloto_carousel.png",
  },
];

const equipamentos = [
  {
    img: "/tablet.png",
    texto: "Desligamento linha à linha para todas plantadeiras sistema Isobus",
  },
  {
    img: "/repotenciamento.png",
    texto: "Repotenciamento de motores, especialista na linha agrícola.",
  },
  {
    img: "/plantio.png",
    texto: "Projeto de linhas de plantio para sistema linha a linha",
  },
];

export default function Servicos() {
  const isMobile = useIsMobile();

  //const products = MOCK_PRODUCTS.filter((product) => product.ativo);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      {/* BANNER */}
      <div className="w-full relative min-h-[300px] md:min-h-[415px]">
        <div className="flex flex-col items-center justify-center p-12 md:p-24 relative z-10">
          <h1 className="text-white font-nebula text-3xl md:text-6xl">
            Serviços & Produtos
          </h1>
          <h2 className="text-white text-xl md:text-3xl my-2 md:my-5">
            Uma gama diversificada de produtos e serviços de qualidade.
          </h2>
        </div>
        <Image
                            src="/quem somos alt.png"
                            alt="banner bg"
                            fill
                            className="object-cover z-[-1] max-h-[560px] md:max-h-[800px]"
                  />
      </div>

      {/* SEPARADOR */}
      <div className="w-full relative">
        <div className="flex flex-col items-center py-4 md:py-8 relative z-10">
          <h1 className="text-black font-nebula text-3xl md:text-6xl">
            Serviços
          </h1>
        </div>
        <Image
          src="/Fundo cor.svg"
          alt="fundo separador"
          fill
          className="object-cover md:max-h-[415px] z-[-1]"
        />
      </div>

      {/* SERVIÇOS GRID/CARROSSEL */}
      <div className="w-full">
        <div className="hidden md:grid grid-cols-3">
          {servicos.map((item, index) => (
            <div
              key={index}
              className="relative text-white p-18 flex flex-col items-center min-h-[400px]"
            >
              <Image
                src={item.desktopImg}
                alt={item.titulo}
                fill
                className="object-cover z-[-1]"
              />
              <h2 className="font-poppins font-bold text-[36px] leading-[1] tracking-[0.01em] text-center mb-12">
                {item.titulo}
              </h2>
              <p className="font-poppins font-medium text-[16px] leading-[1.5] tracking-[0.1em] text-center">
                {item.texto}
              </p>
            </div>
          ))}
        </div>

        <div className="md:hidden relative">
          <Carousel className="w-full mx-auto" showIndicators={true}>
            <CarouselContent>
              {servicos.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="relative text-white p-10 flex flex-col items-center min-h-[450px]">
                    <Image
                      src={isMobile ? item.mobileImg : item.desktopImg}
                      alt={item.titulo}
                      fill
                      className="object-cover z-[-1]"
                    />
                    <h2 className="font-poppins font-bold text-[36px] leading-[1] tracking-[0.01em] text-center mb-12">
                      {item.titulo}
                    </h2>
                    <p className="font-poppins font-medium text-[14px] leading-[1.5] tracking-[0.1em] text-center">
                      {item.texto}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      {/* EQUIPAMENTOS E INOVAÇÕES - GRID NO DESKTOP / CARROSSEL NO MOBILE */}
      <div className="w-full relative py-12 bg-[#FAFAFA]">
        <div className="flex flex-col items-start justify-center px-4 max-w-7xl mx-auto">
          <h1 className="text-black font-nebula text-2xl md:text-5xl mb-2">
            Equipamentos e inovações
          </h1>
          <h2 className="text-black text-xl md:text-2xl mb-8">
            Com alta tecnologia, oferecemos o melhor do AGRO para você!
          </h2>

          {/* DESKTOP GRID */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {equipamentos.map((item, index) => (
              <div
                key={index}
                className="rounded-lg shadow-md text-center bg-white overflow-hidden h-full flex flex-col justify-between p-1 transition-transform duration-300 transform hover:scale-105"
              >
                <Image
                  src={item.img}
                  alt={item.texto}
                  width={400}
                  height={300}
                  className="object-cover w-full h-64"
                />
                <p className="mt-2 text-sm font-semibold">{item.texto}</p>
              </div>
            ))}
          </div>

          {/* MOBILE CAROUSEL */}
          <div className="md:hidden w-full">
            <Carousel className="w-full mx-auto mt-4 showIndicators">
              <CarouselContent>
                {equipamentos.map((item, index) => (
                  <CarouselItem key={index} className="basis-[90%]">
                    <div className="rounded-lg shadow-md text-center bg-white overflow-hidden h-full flex flex-col justify-between p-1 mx-2 transition-transform duration-300 transform hover:scale-105">
                      <Image
                        src={item.img}
                        alt={item.texto}
                        width={400}
                        height={300}
                        className="object-cover w-full h-50"
                      />
                      <p className="mt-2 text-sm font-semibold px-2">
                        {item.texto}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="!left-[-5px] text-black" />
              <CarouselNext className="!right-[-5px] text-black" />
            </Carousel>
          </div>
        </div>
      </div>

      {/* SEÇÃO: CONFIRA NOSSOS PRODUTOS (Layout Ajustado) */}
      <div className="bg-[#EAEAEA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-nebula text-4xl md:text-5xl text-black">
              CONFIRA NOSSOS PRODUTOS
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mt-2">
              Descubra o novo padrão de qualidade.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4 place-items-center">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
