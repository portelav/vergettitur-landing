import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarqueeBand } from "@/components/MarqueeBand";
import { Hero } from "@/components/sections/hero";
import { Sobre } from "@/components/sections/sobre";
import { Mapa } from "@/components/sections/mapa";
import { Contato } from "@/components/sections/contato";
import { SectionDivider } from "@/components/motion/section-divider";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />

        <MarqueeBand />

        <Sobre />

        <SectionDivider label="Roteiros" numerator={["01", "02"]} />

        <Mapa />

        <SectionDivider label="Contato" numerator={["02", "03"]} />

        <Contato />
      </main>
      <Footer />
    </>
  );
}
