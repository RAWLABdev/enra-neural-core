"use client";

import { Line, OrbitControls, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function generateSpherePoints(count: number, radius: number) {
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;

    points.push(
      new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      )
    );
  }

  return points;
}

function seededNoise(seed: number) {
  const value = Math.sin(seed * 127.1) * 43758.5453123;
  return value - Math.floor(value);
}

function ElectricArc({
  points,
  index,
}: {
  points: THREE.Vector3[];
  index: number;
}) {
  const arcRef = useRef<THREE.Group>(null);
  const eventRef = useRef(0);

  const [mainArc, setMainArc] = useState<THREE.Vector3[]>([]);
  const [branches, setBranches] = useState<THREE.Vector3[][]>([]);

  useEffect(() => {
    const createBolt = () => {
      const eventSeed = index * 97 + eventRef.current * 31;

      const targetIndex = Math.min(
        points.length - 1,
        Math.floor(Math.abs(seededNoise(eventSeed)) * points.length)
      );

      const target = points[targetIndex];

      if (!target) return;

      const start = new THREE.Vector3(0, 0, 0);
      const segments = 24;

      const main = Array.from({ length: segments + 1 }, (_, i) => {
        const progress = i / segments;
        const base = start.clone().lerp(target, progress);

        if (i === 0 || i === segments) return base;

        const jitterStrength = Math.sin(progress * Math.PI) * 0.12;

        return base.add(
          new THREE.Vector3(
            seededNoise(eventSeed + i * 3) * jitterStrength -
              jitterStrength / 2,
            seededNoise(eventSeed + i * 5) * jitterStrength -
              jitterStrength / 2,
            seededNoise(eventSeed + i * 7) * jitterStrength -
              jitterStrength / 2
          )
        );
      });

      const branchCount =
        6 + Math.floor(Math.abs(seededNoise(eventSeed + 13)) * 5);

      const nextBranches = Array.from(
        { length: branchCount },
        (_, branchIndex) => {
          const anchorIndex = Math.min(3 + branchIndex * 2, main.length - 3);
          const anchor = main[anchorIndex];

          if (!anchor) return [];

          const branchLength =
            0.24 +
            Math.abs(seededNoise(eventSeed + branchIndex * 19)) * 0.42;

          const direction = new THREE.Vector3(
            seededNoise(eventSeed + branchIndex * 11) - 0.5,
            seededNoise(eventSeed + branchIndex * 17) - 0.5,
            seededNoise(eventSeed + branchIndex * 23) - 0.5
          )
            .normalize()
            .multiplyScalar(branchLength);

          const end = anchor.clone().add(direction);

          const mid = anchor
            .clone()
            .lerp(end, 0.55)
            .add(
              new THREE.Vector3(
                seededNoise(eventSeed + branchIndex * 29) * 0.08 - 0.04,
                seededNoise(eventSeed + branchIndex * 31) * 0.08 - 0.04,
                seededNoise(eventSeed + branchIndex * 37) * 0.08 - 0.04
              )
            );

          return [anchor, mid, end];
        }
      ).filter((branch) => branch.length > 0);

      setMainArc(main);
      setBranches(nextBranches);

      eventRef.current += 1;
    };

    createBolt();

    const interval = window.setInterval(() => {
      createBolt();
    }, 900 + index * 180);

    return () => {
      window.clearInterval(interval);
    };
  }, [index, points]);

  useFrame((state) => {
    if (!arcRef.current) return;

    const t = state.clock.elapsedTime + index * 0.9;

    const flash =
      Math.sin(t * (6 + index)) *
      Math.cos(t * (3.7 + index));

    arcRef.current.visible = flash > 0.92;
  });

  if (!mainArc.length) return null;

  return (
    <group ref={arcRef}>
      <Line
        points={mainArc}
        color="#e0fbff"
        transparent
        opacity={0.78}
        lineWidth={0.12}
      />

      <Line
        points={mainArc}
        color="#22d3ee"
        transparent
        opacity={0.16}
        lineWidth={0.32}
      />

      {branches.map((branch, branchIndex) => (
        <group key={branchIndex}>
          <Line
            points={branch}
            color="#e0fbff"
            transparent
            opacity={0.54}
            lineWidth={0.08}
          />

          <Line
            points={branch}
            color="#22d3ee"
            transparent
            opacity={0.12}
            lineWidth={0.22}
          />
        </group>
      ))}
    </group>
  );
}

function NeuralSystem() {
  const brainRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const coreGlowRef = useRef<THREE.Mesh>(null);

  const points = useMemo(() => generateSpherePoints(86, 3.05), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (brainRef.current) {
      brainRef.current.rotation.y = Math.sin(t * 0.18) * 0.62 + t * 0.026;
      brainRef.current.rotation.x = Math.sin(t * 0.24) * 0.28;
      brainRef.current.rotation.z = Math.cos(t * 0.16) * 0.16;
    }

    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 1.35) * 0.045);
    }

    if (coreGlowRef.current) {
      const material = coreGlowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.035 + Math.sin(t * 1.1) * 0.012;
    }
  });

  return (
    <>
      <group ref={brainRef}>
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshBasicMaterial color="#e0fbff" />
        </mesh>

        <mesh ref={coreGlowRef}>
          <sphereGeometry args={[0.56, 32, 32]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.045} />
        </mesh>

        {points.map((point, index) => {
          const intensity = 0.035 + (index % 6) * 0.005;
          const nodeOpacity = 0.42 + (index % 4) * 0.055;
          const nodeSize = 0.03 + (index % 3) * 0.005;

          return (
            <group key={index}>
              <Line
                points={[
                  [0, 0, 0],
                  [point.x, point.y, point.z],
                ]}
                color="#22d3ee"
                transparent
                opacity={intensity * 0.8}
                lineWidth={0.28}
              />

              <mesh position={[point.x, point.y, point.z]}>
                <sphereGeometry args={[nodeSize, 16, 16]} />

                <meshBasicMaterial
                  color="#a5f3fc"
                  transparent
                  opacity={nodeOpacity}
                />
              </mesh>
            </group>
          );
        })}

        {[3, 7, 11, 18, 24, 31, 37].map((index) => (
          <ElectricArc key={index} points={points} index={index} />
        ))}
      </group>

      <Sparkles
        count={72}
        scale={6.2}
        size={1.25}
        speed={0.08}
        color="#67e8f9"
        opacity={0.24}
      />
    </>
  );
}

export default function NeuralBrain3D() {
  return (
    <div className="absolute inset-0 opacity-82">
      <Canvas camera={{ position: [0, 0, 7.2] }}>
        <ambientLight intensity={0.3} />

        <pointLight position={[0, 0, 0]} intensity={4} color="#22d3ee" />

        <NeuralSystem />

        <EffectComposer>
          <Bloom
            intensity={0.95}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.86}
          />
        </EffectComposer>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}