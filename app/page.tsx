import EnraBrain from "@/components/brain/EnraBrain";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">
      {/* Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.08),transparent_70%)]" />

      {/* Content */}
      <div className="z-10 flex flex-col items-center gap-6">
        <h1 className="text-7xl font-bold tracking-[0.4em] text-cyan-300">
          ENRA
        </h1>

        <p className="text-cyan-100/60 uppercase tracking-[0.3em] text-sm">
          Neural Core Online
        </p>

        <EnraBrain />

        <div className="text-cyan-400/40 text-xs tracking-[0.4em]">
          Emma • Nuria • Rau
        </div>
      </div>
    </main>
  );
}