// @ts-nocheck — @react-three/fiber JSX elements are not in React 19 intrinsic types
import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uTime;
  varying vec2 vUv;

  float sdfCircle(vec2 p, float r) {
    return length(p - 0.5) - r;
  }

  void main() {
    float gridSize = 48.0;
    vec2 screenUv = gl_FragCoord.xy / uResolution;
    vec2 uv = screenUv;

    vec2 gridUv = fract(uv * gridSize);
    vec2 gridId = floor(uv * gridSize);
    vec2 gridCenter = (gridId + 0.5) / gridSize;

    float dot = smoothstep(0.12, 0.0, sdfCircle(gridUv, 0.18));
    vec3 baseColor = vec3(0.247, 0.255, 0.271);
    float baseAlpha = dot * 0.38;

    float dist = distance(gridCenter, uMouse);
    float glow = smoothstep(0.22, 0.0, dist) * 0.55;
    vec3 accentColor = vec3(0.545, 0.361, 0.965);

    float breathe = sin(uTime * 0.4 + gridId.x * 0.3 + gridId.y * 0.3) * 0.02 + 1.0;
    vec3 color = mix(baseColor, accentColor, glow) * breathe;
    float alpha = baseAlpha + glow * 0.4;

    gl_FragColor = vec4(color, alpha);
  }
`;

function DotGridPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
    }),
    [size.width, size.height]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
      materialRef.current.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export const CanvasBackground = () => {
  return (
    <div className="canvas-bg-layer">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <DotGridPlane />
      </Canvas>
    </div>
  );
};
