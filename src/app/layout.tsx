import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import Header from "./components/header";
import Footer from "./components/footer";
import QueryProvider from "./components/query-provider";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getSiteContent } from "@/lib/siteContent";
import "./globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const nebula = localFont({
  src: [
    {
      path: "../../public/fonts/Nebula-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-nebula",
});

export const metadata: Metadata = {
  title: "P3 Agro",
  description: "Site oficial P3 Agro",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerFooter = await getSiteContent("headerFooter");

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${poppins.variable} ${nebula.variable} antialiased !overflow-x-hidden`}
      >
        <QueryProvider>
          <Header logoImage={headerFooter.logoImage} />
          {children}
          <Footer
            contactEmail={headerFooter.contactEmail}
            whatsappPhoneDigits={headerFooter.whatsappPhoneDigits}
            whatsappPhoneDisplay={headerFooter.whatsappPhoneDisplay}
            instagramUrl={headerFooter.instagramUrl}
            facebookUrl={headerFooter.facebookUrl}
          />
          <FloatingWhatsApp phoneDigits={headerFooter.whatsappPhoneDigits} />
        </QueryProvider>
      </body>
    </html>
  );
}
