"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 32 }, (_, index) => ({
  id: index,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  duration: 4 + Math.random() * 8,
  delay: Math.random() * 5,
}));

export default function NeuralBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.035)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.14),transparent_65%)]" />

      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan-400/10 to-transparent" />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute h-1 w-1 rounded-full bg-cyan-300"
          style={{
            left: particle.left,
            top: particle.top,
            boxShadow: "0 0 14px #22d3ee",
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.15, 1, 0.15],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className="absolute left-0 top-0 h-px w-full bg-cyan-300/40"
        animate={{ y: ["0vh", "100vh"] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          boxShadow: "0 0 24px #22d3ee",
        }}
      />
    </div>
  );
}