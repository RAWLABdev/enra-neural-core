"use client";

import { motion } from "framer-motion";

const center = { x: 300, y: 300 };

const vectors = [
  { x: 145, y: 120 },
  { x: 230, y: 90 },
  { x: 360, y: 95 },
  { x: 470, y: 150 },
  { x: 515, y: 260 },
  { x: 500, y: 385 },
  { x: 410, y: 485 },
  { x: 285, y: 520 },
  { x: 165, y: 470 },
  { x: 95, y: 355 },
  { x: 85, y: 235 },
  { x: 190, y: 250 },
  { x: 390, y: 240 },
  { x: 245, y: 390 },
  { x: 365, y: 390 },
];

const branches = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [9, 10],
  [10, 0],
  [11, 0],
  [11, 10],
  [12, 3],
  [12, 4],
  [13, 8],
  [13, 7],
  [14, 5],
  [14, 6],
];

export default function NeuralNetwork() {
  return (
    <svg
      viewBox="0 0 600 600"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
    >
      {/* soft brain halo */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r="72"
        fill="none"
        stroke="rgba(34,211,238,0.18)"
        strokeWidth="1"
        animate={{
          r: [58, 130, 58],
          opacity: [0.25, 0.04, 0.25],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* central core */}
      <motion.circle
        cx={center.x}
        cy={center.y}
        r="8"
        fill="rgba(103,232,249,0.95)"
        animate={{
          r: [7, 12, 7],
          opacity: [0.75, 1, 0.75],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          filter: "drop-shadow(0 0 18px rgba(34,211,238,1))",
        }}
      />

      {/* radial neural vectors */}
      {vectors.map((node, index) => (
        <g key={`vector-${index}`}>
          <motion.line
            x1={center.x}
            y1={center.y}
            x2={node.x}
            y2={node.y}
            stroke="rgba(34,211,238,0.22)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1],
              opacity: [0, 0.45, 0.12],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              delay: index * 0.11,
              ease: "easeInOut",
            }}
          />

          {/* travelling impulse */}
          <motion.circle
            r="3"
            fill="rgba(165,243,252,0.95)"
            initial={{
              cx: center.x,
              cy: center.y,
              opacity: 0,
            }}
            animate={{
              cx: [center.x, node.x],
              cy: [center.y, node.y],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              delay: index * 0.11,
              ease: "easeOut",
            }}
            style={{
              filter: "drop-shadow(0 0 12px rgba(34,211,238,1))",
            }}
          />

          <motion.circle
            cx={node.x}
            cy={node.y}
            r="4"
            fill="rgba(103,232,249,0.8)"
            animate={{
              r: [3, 6, 3],
              opacity: [0.28, 0.9, 0.28],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: index * 0.13,
              ease: "easeInOut",
            }}
            style={{
              filter: "drop-shadow(0 0 10px rgba(34,211,238,0.8))",
            }}
          />
        </g>
      ))}

      {/* outer brain-like connections */}
      {branches.map(([a, b], index) => (
        <motion.line
          key={`branch-${index}`}
          x1={vectors[a].x}
          y1={vectors[a].y}
          x2={vectors[b].x}
          y2={vectors[b].y}
          stroke="rgba(34,211,238,0.14)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1],
            opacity: [0, 0.3, 0.08],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: index * 0.17,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}