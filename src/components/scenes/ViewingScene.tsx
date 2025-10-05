import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { SafeTexture } from '../TextureLoader'
import * as THREE from 'three'

interface ViewingSceneProps {
  imagePath: string
}

const Card3DDisplay = ({ imagePath }: { imagePath: string }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  const { rotationY } = useSpring({
    from: { rotationY: Math.PI },
    to: { rotationY: 0 },
    config: { tension: 200, friction: 50 }
  })

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <SafeTexture url={imagePath}>
      {(texture) => (
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
          <a.mesh ref={meshRef} rotation-y={rotationY}>
            <planeGeometry args={[3, 4.5]} />
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

export const ViewingScene = ({ imagePath }: ViewingSceneProps) => {
  return (
    <>
      {/* Viewing-specific lighting */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 3, 3]} intensity={0.4} color="#d4af37" />

      <Card3DDisplay imagePath={imagePath} />
    </>
  )
}
