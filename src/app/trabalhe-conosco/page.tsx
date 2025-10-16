import Image from "next/image";
import CandidaturaForm from "@/components/CandidaturaForm";

export default function TrabalheConosco() {
  return (
    <>
      {/* BANNER */}
      <div className="w-full h-[213px] md:h-[565px] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/image 19.png"
            alt="banner fundo"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-10 flex flex-col items-start px-6 py-8 md:px-10 md:py-16 lg:p-30">
          <h1 className="text-white font-nebula text-3xl md:text-7xl leading-tight">
            Trabalhe conosco
          </h1>
          <h2 className="text-white font-nebula text-lg md:text-4xl my-2 md:my-10 leading-tight">
            Vem construir o novo na p3 agro!
          </h2>
        </div>
      </div>

      <div className="flex flex-col items-center py-10 md:py-18 px-4 sm:px-6 md:px-8 lg:px-0">
        <div className="flex flex-col items-start gap-4 md:gap-5 w-full max-w-screen-xl md:w-[70%]">
          <h1 className="font-nebula text-5xl md:text-7xl leading-tight">
            a p3 agro
          </h1>
          <p className="text-lg md:text-2xl leading-relaxed">
            Na P3Agro, enxergamos um futuro agrícola impulsionado pela inovação
            e sustentabilidade. Buscamos ser líderes na transformação da
            agricultura de precisão, proporcionando soluções tecnológicas
            avançadas que redefinem os padrões de eficiência e sustentabilidade.
          </p>
          <p className="text-lg md:text-2xl leading-relaxed">
            <span className="font-bold">Nossa</span> missão vai além de
            simplesmente fornecer ferramentas e conhecimentos aos agricultores.
            Comprometemo-nos a capacitar os agricultores para alimentar o mundo
            de maneira sustentável, utilizando tecnologias avançadas.
          </p>
          <p className="text-lg md:text-2xl leading-relaxed">
            Acreditamos que a aplicação correta da tecnologia pode não apenas
            revolucionar a agricultura, mas também contribuir para a construção
            de um futuro mais verde e equilibrado.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center py-10 md:pb-18 px-4 sm:px-6 md:px-8 lg:px-0">
        <div className="flex flex-col items-start gap-4 md:gap-5 w-full max-w-screen-xl md:w-[70%]">
          <h1 className="font-nebula text-5xl md:text-7xl leading-tight">
            Porque escolher a p3 agro?
          </h1>
          <p className="text-lg md:text-2xl leading-relaxed">
            Neste ambiente, você enfrentará diversos desafios em um cenário de
            aprendizado, colaboração, respeito e diversidade.
          </p>
          <div className="w-full flex flex-col md:flex-row bg-gray-300 rounded-md overflow-hidden">
            <div className="w-full md:min-w-[50%] md:w-1/2">
              <Image
                src="/escolherP3.png"
                alt="Imagem de equipe"
                width={600}
                height={400}
                className="object-cover w-full h-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col items-start gap-3 lg:gap-5 p-4 md:p-6 lg:p-12 w-full md:w-1/2">
              <h1 className="font-nebula text-xl lg:text-4xl leading-tight">
                nosso objetivo e o jeito de ser
              </h1>
              <p className="text-base lg:text-xl leading-relaxed">
                Atuar na P3 Agro é sobre capacitar os agricultores para
                alimentar o mundo de uma maneira que seja sustentável para o
                nosso planeta.
              </p>
              <p className="text-base lg:text-xl leading-relaxed">
                Acreditamos que a tecnologia certa pode transformar a
                agricultura e nos ajudar a construir um futuro mais verde. Com o
                objetivo de alcançar isso, incentivamos a aprendizagem e o
                autodesenvolvimento de nossos colaboradores, capacitando-os a
                serem protagonistas de suas trajetórias profissionais.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center py-10 md:pb-18 px-4 sm:px-6 md:px-8 lg:px-0">
        <div className="flex flex-col items-start gap-4 md:gap-5 w-full md:w-[70%]">
          <h1 className="font-nebula text-3xl md:text-7xl leading-tight">
            Candidate-se:
          </h1>
          <CandidaturaForm />
        </div>
      </div>
    </>
  );
}
