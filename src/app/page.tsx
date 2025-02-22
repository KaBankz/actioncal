import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Vision } from "@/components/sections/vision";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <Features />
      <Vision />
    </main>
  );
}
