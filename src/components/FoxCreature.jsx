import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A low-poly fox-like creature built entirely from Three.js primitives.
 * The head turns and the eyes/pupils track the pointer position, with
 * separate lerp speeds on head vs pupils so the motion feels layered
 * rather than robotic (head catches up slower, eyes dart first).
 */
export default function FoxCreature({ scale = 1 }) {
  const group = useRef(null);
  const head = useRef(null);
  const leftPupil = useRef(null);
  const rightPupil = useRef(null);
  const leftEarRef = useRef(null);
  const rightEarRef = useRef(null);

  const { viewport } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef(new THREE.Vector3(0, 0, 5));

  const furColor = "#d97b3f";
  const bellyColor = "#f4e9dc";
  const darkColor = "#2a1d17";

  // Precompute a couple of idle-breathing offsets so the creature never
  // looks perfectly frozen even when the pointer is still.
  const idleSeed = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Convert normalized pointer (-1..1) into a world-space target point
    // roughly in front of the creature's face.
    const px = (state.pointer.x * viewport.width) / 2;
    const py = (state.pointer.y * viewport.height) / 2;
    target.current.set(px, py * 0.6, 4);

    if (head.current) {
      const dir = target.current.clone().sub(head.current.getWorldPosition(new THREE.Vector3()));
      const targetYaw = THREE.MathUtils.clamp(Math.atan2(dir.x, dir.z), -0.6, 0.6);
      const targetPitch = THREE.MathUtils.clamp(-Math.atan2(dir.y, dir.z), -0.35, 0.4);

      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, targetYaw, 0.06);
      head.current.rotation.x = THREE.MathUtils.lerp(
        head.current.rotation.x,
        targetPitch + Math.sin(t * 1.2 + idleSeed) * 0.01,
        0.08
      );
    }

    // Pupils dart faster than the head turns, giving a layered "alive" feel.
    const eyeX = THREE.MathUtils.clamp(state.pointer.x * 0.045, -0.045, 0.045);
    const eyeY = THREE.MathUtils.clamp(state.pointer.y * 0.03, -0.03, 0.03);
    [leftPupil, rightPupil].forEach((p) => {
      if (!p.current) return;
      p.current.position.x = THREE.MathUtils.lerp(p.current.position.x, p.current.userData.baseX + eyeX, 0.25);
      p.current.position.y = THREE.MathUtils.lerp(p.current.position.y, p.current.userData.baseY + eyeY, 0.25);
    });

    // Subtle ear twitch + body idle sway so the whole thing breathes.
    if (leftEarRef.current) leftEarRef.current.rotation.z = 0.15 + Math.sin(t * 0.8) * 0.03;
    if (rightEarRef.current) rightEarRef.current.rotation.z = -0.15 - Math.sin(t * 0.8 + 0.4) * 0.03;
    if (group.current) {
      group.current.position.y = Math.sin(t * 0.9 + idleSeed) * 0.06;
      group.current.rotation.z = Math.sin(t * 0.5) * 0.01;
    }
  });

  return (
    <group ref={group} scale={scale} dispose={null}>
      {/* Body */}
      <mesh position={[0, -1.15, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.85, 1.6, 6]} />
        <meshStandardMaterial color={furColor} roughness={0.7} flatShading />
      </mesh>

      {/* Tail */}
      <mesh position={[0, -1.6, -0.9]} rotation={[0.9, 0, 0]} castShadow>
        <coneGeometry args={[0.32, 1.3, 6]} />
        <meshStandardMaterial color={furColor} roughness={0.7} flatShading />
      </mesh>
      <mesh position={[0, -1.9, -1.55]} castShadow>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color={bellyColor} roughness={0.7} flatShading />
      </mesh>

      {/* Head group — this is what turns to look at the cursor */}
      <group ref={head} position={[0, 0.15, 0.1]}>
        {/* Skull */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.72, 10, 8]} />
          <meshStandardMaterial color={furColor} roughness={0.65} flatShading />
        </mesh>

        {/* Snout */}
        <mesh position={[0, -0.12, 0.68]} castShadow>
          <coneGeometry args={[0.34, 0.85, 8]} />
          <meshStandardMaterial color={bellyColor} roughness={0.6} flatShading />
        </mesh>
        <mesh position={[0, -0.12, 1.05]} castShadow>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color={darkColor} roughness={0.4} />
        </mesh>

        {/* Ears */}
        <mesh ref={leftEarRef} position={[-0.42, 0.62, -0.05]} rotation={[0, 0, 0.15]} castShadow>
          <coneGeometry args={[0.26, 0.62, 5]} />
          <meshStandardMaterial color={furColor} roughness={0.7} flatShading />
        </mesh>
        <mesh ref={rightEarRef} position={[0.42, 0.62, -0.05]} rotation={[0, 0, -0.15]} castShadow>
          <coneGeometry args={[0.26, 0.62, 5]} />
          <meshStandardMaterial color={furColor} roughness={0.7} flatShading />
        </mesh>

        {/* Eyes — whites */}
        <mesh position={[-0.28, 0.12, 0.6]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color="#161113" roughness={0.2} />
        </mesh>
        <mesh position={[0.28, 0.12, 0.6]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color="#161113" roughness={0.2} />
        </mesh>

        {/* Pupils / iris highlight — these get nudged each frame */}
        <mesh
          ref={leftPupil}
          position={[-0.28, 0.12, 0.71]}
          onUpdate={(self) => {
            self.userData.baseX = -0.28;
            self.userData.baseY = 0.12;
          }}
        >
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color="#f2c879" emissive="#f2c879" emissiveIntensity={0.4} />
        </mesh>
        <mesh
          ref={rightPupil}
          position={[0.28, 0.12, 0.71]}
          onUpdate={(self) => {
            self.userData.baseX = 0.28;
            self.userData.baseY = 0.12;
          }}
        >
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color="#f2c879" emissive="#f2c879" emissiveIntensity={0.4} />
        </mesh>
      </group>
    </group>
  );
}
