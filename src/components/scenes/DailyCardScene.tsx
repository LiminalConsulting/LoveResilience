import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { SafeTexture } from '../TextureLoader'
import * as THREE from 'three'

interface DailyCardSceneProps {
  imagePath: string
  theme: string
}

const DailyCard3D = ({ imagePath }: { imagePath: string }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  const { scale, rotationY } = useSpring({
    from: { scale: 0, rotationY: Math.PI },
    to: { scale: 1, rotationY: 0 },
    config: { tension: 200, friction: 60 }
  })

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <SafeTexture url={imagePath}>
      {(texture) => (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
          <a.mesh ref={meshRef} scale={scale} rotation-y={rotationY}>
            <planeGeometry args={[2.5, 3.8]} />
            <meshStandardMaterial
              map={texture}
              transparent
              side={THREE.DoubleSide}
            />
          </a.mesh>
        </Float>
      )}
    </SafeTexture>
  )
}

const SunRays = () => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 12) * Math.PI * 2) * 4,
            Math.sin((i / 12) * Math.PI * 2) * 4,
            0
          ]}
          rotation={[0, 0, (i / 12) * Math.PI * 2]}
        >
          <planeGeometry args={[0.1, 2]} />
          <meshBasicMaterial
            color="#d4af37"
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

export const DailyCardScene = ({ imagePath, theme }: DailyCardSceneProps) => {
  return (
    <>
      {/* Daily-specific lighting */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 3, 3]} intensity={0.4} color="#d4af37" />

      <SunRays />
      <DailyCard3D imagePath={imagePath} />

      <Text
        position={[0, -3, 0]}
        fontSize={0.8}
        color="#5a5a5a"
        anchorX="center"
        anchorY="middle"
        fontWeight="300"
      >
        {theme}
      </Text>
    </>
  )
}
