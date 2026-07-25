import Image from "next/image";
import CandidaturaForm from "@/components/CandidaturaForm";
import { getSiteContent } from "@/lib/siteContent";

export default async function TrabalheConosco() {
  const content = await getSiteContent("trabalheConosco");

  return (
    <>
      {/* BANNER */}
      <div className="w-full h-[213px] md:h-[565px] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={content.bannerImage}
            alt="banner fundo"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative z-10 flex flex-col items-start px-6 py-8 md:px-10 md:py-16 lg:p-30">
          <h1 className="text-white font-nebula text-3xl md:text-7xl leading-tight">
            {content.bannerTitle}
          </h1>
          <h2 className="text-white font-nebula text-lg md:text-4xl my-2 md:my-10 leading-tight">
            {content.bannerSubtitle}
          </h2>
        </div>
      </div>

      <div className="flex flex-col items-center py-10 md:py-18 px-4 sm:px-6 md:px-8 lg:px-0">
        <div className="flex flex-col items-start gap-4 md:gap-5 w-full max-w-screen-xl md:w-[70%]">
          <h1 className="font-nebula text-5xl md:text-7xl leading-tight">
            {content.section1Title}
          </h1>
          <p className="text-lg md:text-2xl leading-relaxed">{content.section1Paragraph1}</p>
          <p className="text-lg md:text-2xl leading-relaxed">{content.section1Paragraph2}</p>
          <p className="text-lg md:text-2xl leading-relaxed">{content.section1Paragraph3}</p>
        </div>
      </div>

      <div className="flex flex-col items-center py-10 md:pb-18 px-4 sm:px-6 md:px-8 lg:px-0">
        <div className="flex flex-col items-start gap-4 md:gap-5 w-full max-w-screen-xl md:w-[70%]">
          <h1 className="font-nebula text-5xl md:text-7xl leading-tight">
            {content.section2Title}
          </h1>
          <p className="text-lg md:text-2xl leading-relaxed">{content.section2Intro}</p>
          <div className="w-full flex flex-col md:flex-row bg-gray-300 rounded-md overflow-hidden">
            <div className="w-full md:min-w-[50%] md:w-1/2">
              <Image
                src={content.section2Image}
                alt="Imagem de equipe"
                width={600}
                height={400}
                className="object-cover w-full h-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col items-start gap-3 lg:gap-5 p-4 md:p-6 lg:p-12 w-full md:w-1/2">
              <h1 className="font-nebula text-xl lg:text-4xl leading-tight">
                {content.section2SubTitle}
              </h1>
              <p className="text-base lg:text-xl leading-relaxed">{content.section2Paragraph1}</p>
              <p className="text-base lg:text-xl leading-relaxed">{content.section2Paragraph2}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center py-10 md:pb-18 px-4 sm:px-6 md:px-8 lg:px-0">
        <div className="flex flex-col items-start gap-4 md:gap-5 w-full md:w-[70%]">
          <h1 className="font-nebula text-3xl md:text-7xl leading-tight">{content.ctaTitle}</h1>
          <CandidaturaForm />
        </div>
      </div>
    </>
  );
}
