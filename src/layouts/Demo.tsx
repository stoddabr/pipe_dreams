import * as THREE from "three";
import { createRoot } from "react-dom/client";
import React, { useRef, useState } from "react";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";

function Box(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // useFrame((state, delta) => (mesh.current.rotation.x += 0.01));
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

let lastTime = new Date();

function MovingLight() {
  const light = useRef<THREE.PointLight>(null!);
  useFrame((state, delta) => {
    const currTime = new Date();
    if (currTime.getTime() - lastTime.getTime() > 3000) {
      // every 1s
      lastTime = new Date();
      light.current.position.x = Math.random() * 20 - 10;
      light.current.position.y = Math.random() * 20 - 10;
      light.current.position.z = Math.random() * 20 - 10;
    }
  });
  return <pointLight position={[10, 10, 10]} ref={light} />;
}

export default function BoxScene() {
  return (
    <Canvas>
      <ambientLight intensity={0.2} />
      <MovingLight />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
}
