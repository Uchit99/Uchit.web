"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

function UArtifact() {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshPhysicalMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const [clickTurn, setClickTurn] = useState(0);
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1.16, 1.2);
    shape.lineTo(-1.16, -0.18);
    shape.bezierCurveTo(-1.16, -0.95, -0.68, -1.32, 0, -1.32);
    shape.bezierCurveTo(0.68, -1.32, 1.16, -0.95, 1.16, -0.18);
    shape.lineTo(1.16, 1.2);
    shape.lineTo(0.62, 1.2);
    shape.lineTo(0.62, -0.16);
    shape.bezierCurveTo(0.62, -0.58, 0.4, -0.78, 0, -0.78);
    shape.bezierCurveTo(-0.4, -0.78, -0.62, -0.58, -0.62, -0.16);
    shape.lineTo(-0.62, 1.2);
    shape.closePath();
    const result = new THREE.ExtrudeGeometry(shape, {
      depth: 0.44,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.065,
      bevelThickness: 0.07,
      curveSegments: 18,
    });
    result.center();
    result.computeVertexNormals();
    return result;
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const targetX = reducedMotion ? 0 : state.pointer.y * 0.16;
    const targetY = (reducedMotion ? 0 : state.pointer.x * 0.28) + clickTurn * (Math.PI / 5);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY + (reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.32) * 0.06), 3, delta);
    group.current.position.y = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.55) * 0.045;
    if (material.current) {
      material.current.emissiveIntensity = THREE.MathUtils.damp(material.current.emissiveIntensity, hovered ? 0.42 : 0.12, 5, delta);
    }
  });

  return (
    <group
      ref={group}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClickTurn((turn) => turn + 1)}
    >
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          ref={material}
          color="#343640"
          metalness={0.72}
          roughness={0.24}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          emissive="#D8125B"
          emissiveIntensity={0.12}
        />
      </mesh>
      <mesh position={[0.92, 0.08, 0.28]} scale={[0.035, 0.92, 0.045]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#D8125B" emissive="#D8125B" emissiveIntensity={0.5} metalness={0.6} roughness={0.25} />
      </mesh>
    </group>
  );
}

export function HeroArtifact() {
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  return (
    <div className="hero-artifact" role="img" aria-label="Interactive sculptural U mark">
      <Canvas frameloop={reducedMotion ? "demand" : "always"} dpr={[1, 1.5]} camera={{ position: [0, 0, 5.2], fov: 36 }} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 4, 5]} intensity={2.3} castShadow />
        <pointLight position={[-3, 0, 2]} intensity={8} color="#D8125B" distance={8} />
        <UArtifact />
        <ContactShadows position={[0, -1.75, -0.6]} opacity={0.36} scale={4.8} blur={2.8} far={4} />
      </Canvas>
      <span className="hero-artifact-index" aria-hidden="true">OBJECT / 001</span>
    </div>
  );
}
