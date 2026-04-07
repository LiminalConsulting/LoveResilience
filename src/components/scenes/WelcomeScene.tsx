import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { SafeTexture } from '../TextureLoader'
import * as THREE from 'three'

const FloatingOrb = () => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <SafeTexture url="Orb.png">
        {(texture) => (
          <mesh ref={meshRef} position={[0, 0, -2]}>
            <planeGeometry args={[2.2, 2.2]} />
            <meshBasicMaterial
              map={texture}
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}
      </SafeTexture>
    </Float>
  )
}

export const WelcomeScene = () => {
  return (
    <>
      <FloatingOrb />
    </>
  )
}
