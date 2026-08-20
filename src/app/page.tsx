import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getSiteContent } from "@/lib/siteContent";

export default async function Home() {
  const content = await getSiteContent("home");

  return (
    <>
      {/* BANNER */}
      <div className="relative w-full min-h-[470px] md:min-h-[710px]">
        <div className="flex flex-col items-start px-10 py-12 md:p-30 w-[85%] lg:w-[64%]">
          <h1 className="text-white font-nebula text-4xl md:text-7xl font-bold">
            {content.bannerTitle}
          </h1>
          <h2 className="font-poppins text-white text-xl md:text-4xl my-8 md:my-10">
            {content.bannerSubtitle}
          </h2>

          <Button
            variant={"secondary"}
            className="md:p-7 bg-p3green flex items-center gap-2 md:gap-6"
            asChild
          >
            <Link
              href={
                "https://api.whatsapp.com/send/?phone=5543996481850&text&type=phone_number&app_absent=0"
              }
              target="_blank"
            >
              <Image
                src="/whatsapp-botao-icone.png"
                alt="banner bg"
                width={30}
                height={30}
                className="object-cover max-md:w-[15px]"
              />
              <h1 className="font-poppins md:text-xl text-white">CONTATO</h1>
            </Link>
          </Button>
        </div>

        <Image
          src={content.bannerImage}
          alt="banner bg"
          fill
          className="object-cover z-[-1]"
        />
      </div>

      {/* BANNER CONTENT */}
    </>
  );
}
