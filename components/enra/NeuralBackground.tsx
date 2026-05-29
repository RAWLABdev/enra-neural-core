"use client";

import { motion } from "framer-motion";

const particles = [
  { id: 1, left: "12%", top: "20%", duration: 9, delay: 0.2 },
  { id: 2, left: "82%", top: "18%", duration: 11, delay: 1.1 },
  { id: 3, left: "18%", top: "78%", duration: 10, delay: 0.6 },
  { id: 4, left: "76%", top: "72%", duration: 12, delay: 1.7 },
  { id: 5, left: "50%", top: "10%", duration: 13, delay: 0.4 },
  { id: 6, left: "92%", top: "45%", duration: 9, delay: 1.4 },
  { id: 7, left: "8%", top: "48%", duration: 11, delay: 0.9 },
  { id: 8, left: "58%", top: "88%", duration: 12, delay: 2.1 },
];

export default function NeuralBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.12),transparent_42%,rgba(0,0,0,0.96)_82%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.018)_1px,transparent_1px)] bg-[size:96px_96px] opacity-25" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.28)_62%,rgba(0,0,0,0.9)_100%)]" />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute h-1 w-1 rounded-full bg-cyan-300/60"
          style={{
            left: particle.left,
            top: particle.top,
            boxShadow: "0 0 18px rgba(103,232,249,0.8)",
          }}
          animate={{
            opacity: [0.15, 0.75, 0.15],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cyan-950/10 to-transparent" />
    </div>
  );
}