import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { SafeTexture } from '../TextureLoader'
import { Card3D } from './Card3D'
import * as THREE from 'three'

interface DailyCardSceneProps {
  imagePath: string
  theme: string
}

// Golden mandala orb - rotates behind the card
const GoldenOrb = () => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <SafeTexture url="Backside.jpg">
      {(texture) => (
        <mesh ref={meshRef} position={[0, 0, -1]}>
          <planeGeometry args={[4, 4]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </SafeTexture>
  )
}

export const DailyCardScene = ({ imagePath, theme }: DailyCardSceneProps) => {
  return (
    <>
      {/* Daily-specific lighting */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 3, 3]} intensity={0.4} color="#d4af37" />

      <group position={[-2.5, 0, 0]}>
        <GoldenOrb />
        <Card3D
          imagePath={imagePath}
          size={[2.5, 3.8]}
          position={[0, 0, 0]}
          flipAnimation={true}
          floatAnimation={true}
          pulseAnimation={true}
        />
      </group>
    </>
  )
}
