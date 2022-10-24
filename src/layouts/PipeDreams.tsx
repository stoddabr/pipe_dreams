import type { PlaneProps, Triplet } from "@react-three/cannon";
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";
import type { MeshPhongMaterialProps } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import { forwardRef, useMemo, useRef } from "react";
import type { InstancedMesh, Mesh } from "three";
import { Color } from "three";
import CameraController from "../components/CameraControls";
import { mergeRefs } from "../utils/mergeRefs";

type OurPlaneProps = Pick<MeshPhongMaterialProps, "color"> &
  Pick<PlaneProps, "position" | "rotation">;

function Plane({ color, ...props }: OurPlaneProps) {
  const [ref] = usePlane(() => ({ ...props }), useRef<Mesh>(null));
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry args={[1000, 1000]} />
      <meshPhongMaterial color={color} />
    </mesh>
  );
}

const Cube = forwardRef((props, refFwd) => {
  const [ref, api] = useBox<THREE.Mesh>(() => ({
    mass: 1,
    position: [0, 20, 0],
  }));

  function onClick() {
    const dx = Math.random() * 4 - 2;
    api.applyImpulse([dx, 20, dx], [0, 0, 0]);
  }

  return (
    <mesh ref={mergeRefs(refFwd, ref)} onClick={() => onClick()}>
      <boxGeometry />
      <meshPhongMaterial color={"lightblue"} />
    </mesh>
  );
});

function InstancedSpheres({ number = 100 }) {
  const [ref] = useSphere(
    (index) => ({
      args: [1],
      mass: 1,
      position: [Math.random() - 0.5, Math.random() - 0.5, index * 2],
    }),
    useRef<InstancedMesh>(null)
  );
  const colors = useMemo(() => {
    const array = new Float32Array(number * 3);
    const color = new Color();
    for (let i = 0; i < number; i++)
      color
        .set(
          `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
            Math.random() * 255
          )},${Math.floor(Math.random() * 255)})`
        )
        .convertSRGBToLinear()
        .toArray(array, i * 3);
    return array;
  }, [number]);

  return (
    <instancedMesh
      ref={ref}
      castShadow
      receiveShadow
      args={[undefined, undefined, number]}
    >
      <sphereBufferGeometry args={[1, 16, 16]}>
        <instancedBufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </sphereBufferGeometry>
      <meshPhongMaterial vertexColors />
    </instancedMesh>
  );
}

export default () => (
  <Canvas shadows gl={{ alpha: false }} camera={{ position: [0, -12, 16] }}>
    <hemisphereLight intensity={0.35} />
    <spotLight
      position={[30, 0, 30]}
      angle={0.3}
      penumbra={1}
      intensity={2}
      castShadow
      shadow-mapSize-width={256}
      shadow-mapSize-height={256}
    />
    <pointLight position={[-30, 0, -30]} intensity={0.5} />
    <Physics gravity={[0, -1, 0]}>
      <Plane color={"yellow"} position={[0, 0, 0]} rotation={[0, 0, 0]} />
      <Plane
        color={"orange"}
        position={[-6, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Plane
        color={"blue"}
        position={[6, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <Plane
        color={"purple"}
        position={[0, 6, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <Plane
        color={"lightblue"}
        position={[0, -6, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Cube />
    </Physics>
    <OrbitControls />
  </Canvas>
);
