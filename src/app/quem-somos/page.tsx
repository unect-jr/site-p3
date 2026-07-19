import Image from "next/image";
import { getSiteContent } from "@/lib/siteContent";

export default async function QuemSomos() {
  const content = await getSiteContent("quemSomos");

  return (
    <>
      {/* BANNER */}
      <div className="relative w-full h-[470px] md:h-[710px]">
        <div className="flex flex-col items-start px-10 py-4 sm:py-20 md:p-30">
          <h1 className="text-white font-nebula text-4xl md:text-6xl font-bold">
            {content.bannerTitle}
          </h1>
          <h2 className="font-poppins text-white text-xl md:text-3xl my-4 md:my-10 lg:w-[50%]">
            {content.subtitle1}
          </h2>
          <h2 className="font-poppins text-white md:text-xl lg:w-[60%]">
            {content.subtitle2}
          </h2>
        </div>
        <Image
          src={content.bannerImage}
          alt="banner bg"
          fill
          className="object-cover z-[-1] max-h-[520px] md:max-h-[800px]"
        />
      </div>
      {/* BANNER CONTENT */}
    </>
  );
}
