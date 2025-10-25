import React from "react";
import Image from "next/image";

interface WhatsAppButtonProps {
  productName?: string;
  phone?: string; // número no formato local ou internacional
  label?: string;
  className?: string;
  message?: string;
}

export default function WhatsAppButton({
  productName = "",
  phone = "",
  label = "CONTATO-NOS",
  className = "",
  message,
}: WhatsAppButtonProps) {
  // Remove tudo que não for dígito
  let phoneNumber = phone.replace(/\D/g, "");

  // Se o número for um local brasileiro (10 ou 11 dígitos), assume DDI +55
  if (phoneNumber && (phoneNumber.length === 10 || phoneNumber.length === 11)) {
    phoneNumber = `55${phoneNumber}`;
  }

  const defaultMessage = `Olá, tenho interesse no produto: ${productName}`;
  const text = encodeURIComponent(message ?? defaultMessage);

  const href = phoneNumber
    ? `https://wa.me/${phoneNumber}?text=${text}`
    : `https://web.whatsapp.com/send?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex w-full items-center justify-center px-4 py-2 bg-p3green rounded-md gap-2 md:p-3 md:gap-4 hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500/30 transition duration-150 ease-in-out ${className}`}
    >
      <Image
        src="/whatsapp-botao-icone.png"
        alt="banner bg"
        width={30}
        height={30}
        className="object-cover max-md:w-[15px]"
      />
      <h1 className="font-poppins md:text-xl text-[12px] text-white">
        {label}
      </h1>
    </a>
  );
}
