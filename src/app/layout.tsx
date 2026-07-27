import type { Metadata } from "next";
import { Fraunces, Big_Shoulders, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "900"],
  style: ["normal", "italic"],
});

const bigShoulders = Big_Shoulders({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const workSans = Work_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Vergetti Turismo — Passeios em Alagoas",
  description:
    "Adriano Vergetti leva você às praias, piscinas naturais e rios mais bonitos de Alagoas. Fale no WhatsApp e monte seu roteiro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${bigShoulders.variable} ${workSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Aplica o tema salvo ANTES do primeiro paint — evita flash de
            tema errado. Claro é o padrão (não lê prefers-color-scheme). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('vergettitur-theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
