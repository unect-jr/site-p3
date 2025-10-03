import Link from "next/link";
import Image from "next/image";

const Footer = () => (
  <div className="flex flex-col items-start p-10 md:px-18 bg-[#D7DDD9]">
    <h1 className="text-2xl md:text-4xl font-nebula font-semibold">
      ENTRE EM CONTATO
    </h1>
    <div className="w-full flex flex-col md:flex-row justify-between items-center">
      <div className="max-md:w-[100%] flex flex-col items-start gap-4 py-8 md:p-8">
        <div className="flex items-center gap-2">
          <Image
            src="/email-icon.svg"
            alt="banner bg"
            width={30}
            height={30}
            className="object-cover max-md:w-[22px]"
          />
          <h1 className="text-sm md:text-lg">
            agriculturadeprecisao@p3agro.com.br
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/whatsapp-icon.svg"
            alt="banner bg"
            width={30}
            height={30}
            className="object-cover max-md:w-[22px]"
          />
          <Link
            href={
              "https://api.whatsapp.com/send/?phone=5543996481850&text&type=phone_number&app_absent=0"
            }
            target="_blank"
          >
            <h1 className="text-sm md:text-lg">
              (43) 99648-1850 / (43) 99150-1850
            </h1>
          </Link>
        </div>
      </div>
      <div className="flex flex-row md:flex-col gap-3 max-md:gap-18 max-md:pt-4">
        <Link
          href={"https://www.instagram.com/p3agro/"}
          target="_blank"
          className="flex items-center gap-3"
        >
          <Image
            src="/instagram-icon.svg"
            alt="banner bg"
            width={50}
            height={50}
            className="object-cover max-md:w-[55px]"
          />
          <h1 className="max-md:hidden">Instagram</h1>
        </Link>
        <Link
          href={"https://www.facebook.com/profile.php?id=100076567544982"}
          target="_blank"
          className="flex items-center gap-3"
        >
          <Image
            src="/facebook-icon.svg"
            alt="banner bg"
            width={50}
            height={50}
            className="object-cover max-md:w-[55px]"
          />
          <h1 className="max-md:hidden">Facebook</h1>
        </Link>
      </div>
    </div>
  </div>
);

export default Footer;
