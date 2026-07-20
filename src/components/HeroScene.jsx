import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import FoxCreature from "./FoxCreature";

export default function HeroScene() {
  return (
    <Canvas
      className="hero-canvas"
      shadows="percentage"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.3, 6], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[3, 4, 5]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, -1, -2]} intensity={0.6} color="#7c8cff" />

      <Suspense fallback={null}>
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
          <FoxCreature scale={1.15} />
        </Float>
        <ContactShadows
          position={[0, -2.05, 0]}
          opacity={0.45}
          scale={8}
          blur={2.4}
          far={3}
        />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
