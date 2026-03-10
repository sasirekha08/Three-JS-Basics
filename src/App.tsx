import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const OrbitControls = extend(ThreeOrbitControls);

function CameraControls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<ThreeOrbitControls | null>(null);

  useFrame(() => {
    controlsRef.current?.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enablePan={false}
      minDistance={3}
      maxDistance={8}
    />
  );
}

function GroundGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    gridRef.current.material.transparent = true;
    gridRef.current.material.opacity = 0.45;
  }, []);

  return <gridHelper ref={gridRef} args={[12, 12, "#64748b", "#475569"]} />;
}

function ExcavatorArm() {
  const boomRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const bucketRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (boomRef.current) {
      boomRef.current.rotation.z = 0.35 + Math.sin(t) * 0.2;
    }

    if (armRef.current) {
      armRef.current.rotation.z = -0.45 + Math.sin(t * 1.2) * 0.15;
    }

    if (bucketRef.current) {
      bucketRef.current.rotation.z = 0.3 + Math.sin(t * 1.4) * 0.12;
    }
  });

  return (
    <group>
      {/* why when i give 0 for y axis it ges belwo grid level */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.5, 0.9]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.75, 0.9, 0.18, 32]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <group ref={boomRef} position={[0.45, 0.65, 0]}>
        <mesh position={[0.75, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.22, 0.24]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>

        <group ref={armRef} position={[1.5, 0, 0]}>
          <mesh position={[0.6, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.18, 0.2]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>

          <group ref={bucketRef} position={[1.2, 0, 0]}>
            <mesh position={[0.22, -0.08, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.4, 0.16, 0.18]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>

            <mesh
              position={[0.4, -0.18, 0]}
              rotation={[0, 0, -0.6]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.22, 0.08, 0.16]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

export default function App() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          color: "white",
          background: "rgba(15, 23, 42, 0.75)",
          padding: "12px 16px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: 700, marginTop: 4 }}>
          Excavator Arm
        </div>
      </div>

      <Canvas shadows camera={{ position: [4.5, 2.2, 4.8], fov: 42 }}>
        <color attach="background" args={["#0f172a"]} />

        <ambientLight intensity={0.7} />
        <directionalLight
          castShadow
          intensity={1.4}
          position={[5, 6, 4]}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <ExcavatorArm />
        <GroundGrid />

        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.25} />
        </mesh>

        <CameraControls />
      </Canvas>
    </div>
  );
}
