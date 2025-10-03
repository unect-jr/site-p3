import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function QuemSomos() {
  return (
    <>
      {/* BANNER */}
      <div className="relative w-full h-[470px] md:h-[710px]">
        <div className="flex flex-col items-start px-10 py-4 sm:py-20 md:p-30">
          <h1 className="text-white font-nebula text-4xl md:text-6xl font-bold">
            QUEM SOMOS
          </h1>
          <h2 className="font-poppins text-white text-xl md:text-3xl my-4 md:my-10 lg:w-[50%]">
            Bem-vindo à P3Agro: A P3Agro é uma empresa inovadora em agricultura
            de precisão, fundada em 2020.
          </h2>
          <h2 className="font-poppins text-white md:text-xl lg:w-[60%]">
            Nossa missão é mais do que apenas fornecer ferramentas e
            conhecimentos aos agricultores. É sobre capacitar os agricultores
            para alimentar o mundo de uma maneira que seja sustentável para o
            nosso planeta. Acreditamos que a tecnologia certa pode transformar a
            agricultura e nos ajudar a construir um futuro mais verde.
          </h2>
        </div>
        <Image
                  src="/Home_background.png"
                  alt="banner bg"
                  fill
                  className="object-cover z-[-1] max-h-[520px] md:max-h-[800px]"
                />
      </div>
      {/* BANNER CONTENT */}
    </>
  );
}
