"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, Lightformer, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import * as THREE from "three";

const INTRO_KEY = "uchit-web-intro-seen";
const HINGE = new THREE.Vector3(0, -1.83, 0.42);
const SCREEN_CENTER = new THREE.Vector3(0, -2.05, 2.42);
useGLTF.preload("/models/laptop.glb");

type IntroModel = { body: THREE.Group; lid: THREE.Group; screenAnchor: THREE.Group };

function Laptop({ phase, onPreviewLoad, onZoomComplete }: { phase: number; onPreviewLoad: () => void; onZoomComplete: () => void }) {
  const { scene } = useGLTF("/models/laptop.glb");
  const hinge = useRef<THREE.Group>(null);
  const zoomStarted = useRef<number | null>(null);
  const zoomDone = useRef(false);
  const cameraReady = useRef(false);
  const model = useMemo<IntroModel>(() => {
    const body = scene.clone(true);
    const movingNames = new Set(["lid", "bezel", "display"]);
    const moving: THREE.Object3D[] = [];
    body.traverse((obj) => {
      if (movingNames.has(obj.name)) moving.push(obj);
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) {
          material.color.set("#ffffff");
          material.metalness = 0.72;
          material.roughness = 0.3;
        }
      });
    });

    const lid = new THREE.Group();
    lid.name = "LidPivot";
    lid.position.copy(HINGE);
    body.add(lid);
    moving.forEach((part) => {
      part.parent?.remove(part);
      part.position.sub(HINGE);
      lid.add(part);
    });
    const screenAnchor = new THREE.Group();
    screenAnchor.name = "ScreenAnchor";
    screenAnchor.position.copy(SCREEN_CENTER).sub(HINGE);
    lid.add(screenAnchor);
    return { body, lid, screenAnchor };
  }, [scene]);

  useEffect(() => {
    hinge.current = model.lid;
    // The GLB hinge is along the back edge; -90° folds the lid over the keyboard.
    hinge.current.rotation.x = THREE.MathUtils.degToRad(-90);
  }, [model]);

  useFrame((state, delta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const initialTarget = new THREE.Vector3(0, 1.8, 0);
    const aspect = state.size.width / Math.max(state.size.height, 1);
    const halfVerticalFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const halfHorizontalFov = Math.atan(Math.tan(halfVerticalFov) * aspect);
    const frameDistance = Math.max(
      (6.8 * 0.78) / (2 * Math.tan(halfHorizontalFov)),
      (4.42 * 0.78) / (2 * Math.tan(halfVerticalFov)),
    ) * 1.12;
    const initialPosition = initialTarget.clone().add(new THREE.Vector3(0.58, 0.32, 0.70).normalize().multiplyScalar(frameDistance));

    if (!cameraReady.current) {
      camera.position.copy(initialPosition.clone().multiplyScalar(1.035));
      camera.lookAt(initialTarget);
      cameraReady.current = true;
    }

    if (phase >= 4) {
      if (zoomStarted.current === null) zoomStarted.current = state.clock.elapsedTime;
      model.screenAnchor.updateWorldMatrix(true, false);
      const target = model.screenAnchor.getWorldPosition(new THREE.Vector3());
      const rotation = model.screenAnchor.getWorldQuaternion(new THREE.Quaternion());
      const normal = new THREE.Vector3(0, 1, 0).applyQuaternion(rotation).normalize();
      const fov = THREE.MathUtils.degToRad(camera.fov);
      const screenHeight = 3.3 * 0.78;
      const halfHorizontalFov = Math.atan(Math.tan(fov / 2) * aspect);
      const screenWidth = 6.1 * 0.78;
      const distance = Math.max(
        screenHeight / (2 * Math.tan(fov / 2)),
        screenWidth / (2 * Math.tan(halfHorizontalFov)),
      ) * 1.02;
      const destination = target.clone().addScaledVector(normal, distance);
      const progress = THREE.MathUtils.clamp((state.clock.elapsedTime - zoomStarted.current) / 1.7, 0, 1);
      const eased = progress * progress * (3 - 2 * progress);
      camera.position.lerpVectors(initialPosition, destination, eased);
      camera.lookAt(initialTarget.clone().lerp(target, eased));
      if (progress >= 1 && !zoomDone.current) {
        zoomDone.current = true;
        onZoomComplete();
      }
    } else {
      zoomStarted.current = null;
      camera.position.lerp(initialPosition, 1 - Math.exp(-delta * 2.1));
      camera.lookAt(initialTarget);
    }

    if (hinge.current) {
      // -90° closed over the keyboard → +15° (105° open), pivoting at the back edge.
      const target = phase >= 1 ? THREE.MathUtils.degToRad(15) : THREE.MathUtils.degToRad(-90);
      hinge.current.rotation.x = THREE.MathUtils.damp(hinge.current.rotation.x, target, 1.8, delta);
    }
  });

  return (
    <group rotation={[0, Math.PI, 0]}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.78}>
        <primitive object={model.body}>
          <primitive object={model.lid}>
            <primitive object={model.screenAnchor}>
              <Html position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} transform distanceFactor={1.92}>
                <div className={`intro-screen ${phase >= 2 ? "intro-screen-on" : ""}`}>
                  {phase < 2 ? null : phase < 3 ? (
                    <div className="intro-screen-brand"><Image src="/logo.svg" alt="UCHIT-WEB" width={180} height={180} unoptimized /></div>
                  ) : (
                    <iframe title="UCHIT-WEB homepage preview" src="/?screen=1" onLoad={onPreviewLoad} tabIndex={-1} />
                  )}
                </div>
              </Html>
            </primitive>
          </primitive>
        </primitive>
      </group>
    </group>
  );
}

function Scene({ phase, onPreviewLoad, onZoomComplete }: { phase: number; onPreviewLoad: () => void; onZoomComplete: () => void }) {
  return (
    <>
      <ambientLight intensity={0.48} />
      <spotLight position={[4, 7, 4]} intensity={72} angle={0.42} penumbra={0.76} color="#fff1df" castShadow />
      <spotLight position={[-4, 3, -2]} intensity={34} angle={0.55} penumbra={0.85} color="#aeb4d0" />
      <pointLight position={[0, 2.4, 4]} intensity={8} color="#D8125B" />
      <Laptop phase={phase} onPreviewLoad={onPreviewLoad} onZoomComplete={onZoomComplete} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#111116" roughness={0.86} metalness={0.06} />
      </mesh>
      <Environment resolution={128} background={false}>
        <Lightformer form="rect" intensity={2.2} color="#fff0dc" position={[-4, 5, 4]} scale={[7, 5, 1]} />
        <Lightformer form="rect" intensity={1.7} color="#c3c8df" position={[4, 3, -3]} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={0.35} color="#D8125B" position={[0, 2, 5]} scale={[2.5, 4, 1]} />
      </Environment>
    </>
  );
}

export default function IntroExperience() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const previewStarted = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("screen") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let seen = false;
    const replay = params.has("intro");
    try {
      seen = sessionStorage.getItem(INTRO_KEY) === "1";
      if (!seen || replay) sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // Keep the cinematic intro available when browser storage is disabled.
    }
    if (!seen || replay) {
      const frame = window.requestAnimationFrame(() => setActive(true));
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const timers = [
      window.setTimeout(() => setPhase(1), 1000),
      window.setTimeout(() => setPhase(2), 2850),
      window.setTimeout(() => setPhase(3), 3650),
      window.setTimeout(() => setPhase(4), 8200),
      window.setTimeout(() => setPhase(5), 11200),
    ];
    return () => {
      timers.forEach(window.clearTimeout);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalRootOverflow;
    };
  }, [active]);

  useEffect(() => {
    if (!active || phase < 3 || !previewLoaded) return;
    const timer = window.setTimeout(() => setPhase(4), 700);
    return () => window.clearTimeout(timer);
  }, [active, phase, previewLoaded]);

  useEffect(() => {
    if (phase !== 5) return;
    const timer = window.setTimeout(() => setActive(false), 620);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (!active) return null;
  const skip = () => setPhase(5);

  return (
    <motion.div className="cinematic-intro" initial={{ opacity: 1 }} animate={{ opacity: phase === 5 ? 0 : 1 }} transition={{ duration: 0.62, ease: "easeInOut" }}>
      <div className="intro-grain" aria-hidden="true" />
      <Canvas camera={{ position: [7.2, 5.1, 9.1], fov: 38 }} dpr={[1, 1.2]} shadows gl={{ alpha: true, antialias: true }}>
        <Suspense fallback={null}><Scene phase={phase} onPreviewLoad={() => {
          if (!previewStarted.current) {
            previewStarted.current = true;
            setPreviewLoaded(true);
          }
        }} onZoomComplete={() => setPhase(5)} /></Suspense>
      </Canvas>
      <div className="intro-caption" style={{ opacity: phase >= 4 ? 0 : 1, transition: "opacity .5s ease" }}>
        <span>INDEPENDENT DIGITAL STUDIO</span>
        <strong>Ideas, made <em>real.</em></strong>
        <i>DESIGN · DEVELOPMENT · MOTION</i>
      </div>
      <button className="intro-skip" onClick={skip}>SKIP INTRO <span>↗</span></button>
    </motion.div>
  );
}
