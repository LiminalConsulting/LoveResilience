import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Card3D } from './Card3D'
import * as THREE from 'three'

interface DailyCardSceneProps {
  imagePath: string
  theme: string
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
      <Card3D
        imagePath={imagePath}
        size={[2.5, 3.8]}
        flipAnimation={true}
        floatAnimation={true}
        pulseAnimation={true}
      />

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
