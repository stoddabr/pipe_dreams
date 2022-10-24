import { PlaneProps, usePlane } from "@react-three/cannon";
import { MeshPhongMaterialProps } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type OurPlaneProps = Pick<MeshPhongMaterialProps, "color"> &
  Pick<PlaneProps, "position" | "rotation">;

export default function Plane({ color, ...props }: OurPlaneProps) {
  const [ref] = usePlane(() => ({ ...props }), useRef<THREE.Mesh>(null));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshPhongMaterial color={color} />
    </mesh>
  );
}
