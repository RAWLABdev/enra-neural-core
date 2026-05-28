"use client";

import { motion } from "framer-motion";

const nodes = [
  { id: 1, x: 50, y: 80 },
  { id: 2, x: 150, y: 40 },
  { id: 3, x: 250, y: 90 },
  { id: 4, x: 120, y: 180 },
  { id: 5, x: 220, y: 200 },
  { id: 6, x: 320, y: 140 },
];

const connections = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [4, 5],
  [2, 5],
  [1, 4],
];

export default function EnraBrain() {
  return (
    <div className="relative flex items-center justify-center">
      <svg
        width="400"
        height="300"
        viewBox="0 0 400 300"
        className="overflow-visible"
      >
        {/* Connections */}
        {connections.map(([a, b], index) => (
          <motion.line
            key={index}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="rgba(0,255,255,0.35)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r="8"
            fill="#00ffff"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: node.id * 0.2,
            }}
            style={{
              filter: "drop-shadow(0 0 12px #00ffff)",
            }}
          />
        ))}
      </svg>
    </div>
  );
}