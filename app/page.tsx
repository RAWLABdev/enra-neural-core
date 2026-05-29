import EnraCoreBubble from "@/components/enra/EnraCoreBubble";
import NeuralBackground from "@/components/enra/NeuralBackground";

export default function Home() {
  return (
    <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black text-white">
      <NeuralBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.32)_75%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-soft-light">
        <div className="h-full w-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
      <EnraCoreBubble />
    </main>
  );
}