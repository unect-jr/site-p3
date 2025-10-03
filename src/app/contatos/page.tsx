import Image from "next/image"; 

export default function Contatos() {
  return (
    <>
      {/* BANNER */}
      <div className="w-full h-[213px] md:h-[494px] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
                              src="/quem somos alt.png"
                              alt="banner bg"
                              fill
                              className="object-cover z-[-1] max-h-[560px] md:max-h-[800px]"
                    />
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <h1 className="text-white font-nebula text-4xl md:text-7xl leading-tight text-center"> 
            Contatos
          </h1>
        </div>
      </div>

      <div className="relative flex flex-col items-center py-10 md:py-18 px-4 sm:px-6 md:px-8 lg:px-0">
        <div className="absolute inset-0 z-0 bg-[#4B795C]">
          <Image
            src="/Fundo Cor.svg"
            alt="Fundo decorativo"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 flex flex-col items-start gap-4 md:gap-5 w-full max-w-screen-xl md:w-[70%] text-white">
          <h1 className="font-poppins text-2xl md:text-4xl leading-tight">
            Estamos sempre aqui para <span className="font-bold">você</span>.
          </h1>
          <p className="text-lg md:text-2xl leading-relaxed">
            Seja para ouvir suas <span className="font-bold">necessidades</span>, responder às suas <span className="font-bold">perguntas</span> ou ajudá-lo a alcançar seus <span className="font-bold">objetivos agrícolas</span>, estamos apenas a um contato de distância.
          </p>

          <div className="relative z-10 flex flex-col items-center gap-4 md:gap-5 w-full max-w-screen-xl text-white mt-10">
            <h3 className="font-roboto text-xl md:text-2xl leading-tight ">O que os nossos clientes dizem sobre nós:</h3> 

            <div className="w-full md:w-[600px] min-h-[260px] md:h-[400px] rounded-lg bg-[#6B4000] p-5 flex flex-col justify-center gap-5 md:gap-y-12 text-center mx-auto"> 
              <p className="text-white font-poppins text-base md:text-[18px] italic font-light leading-normal">"A P3 Agro revolucionou a minha empresa com suas ferramentas de última geração!"</p>
              <p className="text-white font-poppins text-base md:text-[18px] italic font-light leading-normal">"Inovação em veículos automotores é com a P3 Agro, muito satisfeito com o serviço."</p> 
              <p className="text-white font-poppins text-base md:text-[18px] italic font-light leading-normal">"Me arrependo por não ter procurado a P3 Agro antes, equipamentos de alta qualidade!!"</p> 
            </div>

            <h2 className="font-roboto text-xl md:text-xl leading-tight text-center w-full md:max-w-3xl mx-auto mt-8">Entre em contato conosco hoje mesmo para descobrir como podemos ajudá-lo a <span className="font-bold">prosperar na agricultura.</span></h2>
          </div>

        </div>
      </div>
    </>
  );
}
