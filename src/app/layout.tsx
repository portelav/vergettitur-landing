import type { Metadata } from "next";
import { Fraunces, Piazzolla, Big_Shoulders, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import "./globals.css";

// Reservada só pro wordmark "VergettiTur" — usada como logotipo, não como
// fonte de título geral (ver globals.css: .font-editorial é a de título).
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "900"],
  style: ["normal", "italic"],
});

// Fonte dos títulos de seção. Trocada de Fraunces pra Piazzolla — Fraunces
// sozinha ficava "boutique de design/indie 2023" demais pra um guia de
// turismo regional; Piazzolla tem mais calor/tradição, menos trend.
const piazzolla = Piazzolla({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["600", "700"],
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
      className={`${fraunces.variable} ${piazzolla.variable} ${bigShoulders.variable} ${workSans.variable} ${plexMono.variable} h-full antialiased`}
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
