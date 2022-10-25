import type { PlaneProps, Triplet } from "@react-three/cannon";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";
import type { MeshPhongMaterialProps } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import { forwardRef, useMemo, useRef, useState } from "react";
import { InstancedMesh, Mesh, Vector3 } from "three";
import * as THREE from "three";
import CameraController from "../components/CameraControls";
import { mergeRefs } from "../utils/mergeRefs";
import * as React from "react";

type OurPlaneProps = Pick<MeshPhongMaterialProps, "color"> &
  Pick<PlaneProps, "position" | "rotation">;

function Plane({ color, ...props }: OurPlaneProps) {
  const [ref] = usePlane(() => ({ ...props }), useRef<Mesh>(null));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshPhongMaterial side={THREE.DoubleSide} color={color} />
    </mesh>
  );
}

const cv = new Vector3(); // character velocity
const speed = 10; // character speed multiplier

const Character = () => {
  const [ref, api] = useSphere(
    () => ({
      mass: 1,
      args: [1],
      position: [0, 0, -10],
      type: "Kinematic",
      collisionFilterGroup: 42,
    }),
    useRef<Mesh>(null)
  );

  const [isMovingX, setIsMovingX] = useState(0);
  const [isMovingY, setIsMovingY] = useState(0);

  useFrame((state, delta) => {
    api.velocity.copy(cv);
    api.velocity.set(cv.x + isMovingX * speed, cv.y + isMovingY * speed, 0);
  });

  function onKeyDown(e: KeyboardEvent) {
    console.log("ondown", e.key);
    if (e.key === "ArrowLeft") setIsMovingX(-1);
    if (e.key === "ArrowRight") setIsMovingX(1);
    if (e.key === "ArrowUp") setIsMovingY(1);
    if (e.key === "ArrowDown") setIsMovingY(-1);
  }

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === "ArrowLeft") setIsMovingX(0);
    if (e.key === "ArrowRight") setIsMovingX(0);
    if (e.key === "ArrowUp") setIsMovingY(0);
    if (e.key === "ArrowDown") setIsMovingY(0);
  }

  React.useEffect(() => {
    console.log("setting listeners...");
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame(() => {});

  return (
    <mesh ref={ref}>
      <sphereGeometry />
      <meshPhongMaterial color={"green"} />
    </mesh>
  );
};

const Cube = forwardRef((props, refFwd) => {
  const [ref, api] = useBox<THREE.Mesh>(() => ({
    mass: 50,
    onCollide: (e) => {
      console.log({ e });
      if (e.collisionFilters.bodyFilterGroup == 42) applyImpulse();
    },
    position: [0, 0, 0],
  }));

  function applyImpulse() {
    const dx = Math.random() - 0.5;
    api.applyImpulse([dx, dx, 1], [0, 0, 0]);
  }

  return (
    <mesh
      ref={mergeRefs(refFwd, ref)}
      onClick={() => applyImpulse()}
      castShadow
    >
      <boxGeometry />
      <meshPhongMaterial color={"purple"} />
    </mesh>
  );
});

export default () => (
  <Canvas
    shadows
    gl={{ alpha: false }}
    camera={{ position: [5, 5, 0], rotation: [0, 0, 0] }}
  >
    <OrbitControls />
    <pointLight position={[0, 0, 10]} intensity={1} />
    <pointLight position={[2, 0, 10]} intensity={1} />

    <Physics gravity={[0, 0, -10]}>
      <Plane color={"white"} position={[0, 0, -10]} rotation={[0, 0, 0]} />
      <Cube />
      <Character />
    </Physics>
  </Canvas>
);
