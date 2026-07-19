import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";

interface HeaderProps {
  logoImage: string;
}

const Header = ({ logoImage }: HeaderProps) => {
  return (
    <div className="py-4 px-10 flex items-center justify-between bg-gray-200 text-p3green">
      <Image
        src="/header-bg.png"
        alt="header bg"
        className="object-cover absolute right-0 max-md:hidden"
        width={340}
        height={300}
      />
      <Image
        src="/header-responsive.svg"
        alt="header bg"
        className="object-cover absolute right-0 md:hidden"
        width={180}
        height={300}
      />
      <Link href={`/`} className="z-10">
        <Image src={logoImage} alt="P3 Agro logo" width={55} height={55} />
      </Link>
      <Menu></Menu>
      <ul className="header-text-color space-x-12 hidden md:flex font-poppins final z-10">
        <li className="menu-item">
          <Link href={`/quem-somos`}>Quem somos</Link>
        </li>
        <li className="menu-item">
          <Link href={`/servicos`}>Serviços & Produtos</Link>
        </li>
        <li className="menu-item">
          <Link href={`/previsao`}>Previsão</Link>
        </li>
        <li className="menu-item">
          <Link href={`/trabalhe-conosco`}>Trabalhe Conosco</Link>
        </li>
        <li className="menu-item">
          <Link href={`/contatos`}>Contatos</Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
