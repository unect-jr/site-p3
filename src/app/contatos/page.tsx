import Image from "next/image";
import { getSiteContent } from "@/lib/siteContent";

export default async function Contatos() {
  const content = await getSiteContent("contatos");

  return (
    <>
      {/* BANNER */}
      <div className="w-full h-[213px] md:h-[494px] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={content.bannerImage}
            alt="banner bg"
            fill
            className="object-cover z-[-1] max-h-[520px] md:max-h-[800px]"
          />
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <h1 className="text-white font-nebula text-4xl md:text-7xl leading-tight text-center">
            {content.bannerTitle}
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
            {content.introTitle}
          </h1>
          <p className="text-lg md:text-2xl leading-relaxed">{content.introParagraph}</p>

          <div className="relative z-10 flex flex-col items-center gap-4 md:gap-5 w-full max-w-screen-xl text-white mt-10">
            <h3 className="font-roboto text-xl md:text-2xl leading-tight ">
              {content.testimonialsHeading}
            </h3>

            <div className="w-full md:w-[600px] min-h-[260px] md:h-[400px] rounded-lg bg-[#6B4000] p-5 flex flex-col justify-center gap-5 md:gap-y-12 text-center mx-auto">
              <p className="text-white font-poppins text-base md:text-[18px] italic font-light leading-normal">
                &quot;{content.testimonial1}&quot;
              </p>
              <p className="text-white font-poppins text-base md:text-[18px] italic font-light leading-normal">
                &quot;{content.testimonial2}&quot;
              </p>
              <p className="text-white font-poppins text-base md:text-[18px] italic font-light leading-normal">
                &quot;{content.testimonial3}&quot;
              </p>
            </div>

            <h2 className="font-roboto text-xl md:text-xl leading-tight text-center w-full md:max-w-3xl mx-auto mt-8">
              {content.closingText}
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
