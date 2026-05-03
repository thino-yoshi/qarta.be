"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";

function PhoneScreen({ src }: { src: string }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      src,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        if (matRef.current) {
          matRef.current.map = t;
          matRef.current.color.set("#ffffff");
          matRef.current.needsUpdate = true;
        }
      },
      undefined,
      () => {} // image manquante → garde le fond sombre
    );
  }, [src]);

  return (
    <mesh position={[0, 0, 0.046]}>
      <planeGeometry args={[0.94, 2.08]} />
      <meshBasicMaterial ref={matRef} color="#080814" toneMapped={false} />
    </mesh>
  );
}

function PhoneModel({
  mouse,
  screenSrc,
}: {
  mouse: React.MutableRefObject<[number, number]>;
  screenSrc: string;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const [mx, my] = mouse.current;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mx * 0.5, 0.06);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -my * 0.25, 0.06);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.04} floatIntensity={0.5}>
      <group ref={group}>

        {/* Corps */}
        <RoundedBox args={[1.1, 2.3, 0.09]} radius={0.11} smoothness={6} castShadow>
          <meshStandardMaterial color="#1a1a40" metalness={0.5} roughness={0.3} />
        </RoundedBox>

        {/* Tranche latérale */}
        <RoundedBox args={[1.14, 2.34, 0.085]} radius={0.11} smoothness={6}>
          <meshStandardMaterial color="#2a2a55" metalness={0.6} roughness={0.15} />
        </RoundedBox>

        {/* Écran – screenshot ou fond sombre si manquant */}
        <PhoneScreen src={screenSrc} />

        {/* Notch */}
        <mesh position={[0, 0.96, 0.047]}>
          <capsuleGeometry args={[0.035, 0.1, 4, 8]} />
          <meshBasicMaterial color="#0d0d20" />
        </mesh>

        {/* Bouton home */}
        <mesh position={[0, -1.1, 0.047]}>
          <circleGeometry args={[0.055, 24]} />
          <meshBasicMaterial color="rgba(255,255,255,0.18)" />
        </mesh>

      </group>
    </Float>
  );
}

export default function Phone3D({ screenSrc }: { screenSrc: string }) {
  const mouse = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      ];
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 3.6], fov: 40 }}
      style={{ width: "280px", height: "500px", background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} castShadow />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color="#818cf8" />
      <pointLight position={[3, 4, 1]} intensity={0.6} color="#c4b5fd" />
      <PhoneModel mouse={mouse} screenSrc={screenSrc} />
    </Canvas>
  );
}
