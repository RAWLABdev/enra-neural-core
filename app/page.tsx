import EnraBrain from "@/components/brain/EnraBrain";
import NeuralBackground from "@/components/enra/NeuralBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center">
      <NeuralBackground />

      <section className="relative z-10 flex flex-col items-center gap-6">
        <p className="text-xs tracking-[0.5em] text-cyan-300/60 uppercase">
          Neural Core Online
        </p>

        <h1 className="text-6xl md:text-8xl font-bold tracking-[0.35em] text-cyan-200 drop-shadow-[0_0_24px_rgba(34,211,238,0.65)]">
          ENRA
        </h1>

        <EnraBrain />

        <p className="text-xs tracking-[0.45em] text-cyan-300/40 uppercase">
          Emma • Nuria • Rau
        </p>
      </section>
    </main>
  );
}