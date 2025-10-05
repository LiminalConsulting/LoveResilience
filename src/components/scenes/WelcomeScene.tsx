import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
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
      <mesh ref={meshRef} position={[0, 0, -2]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#d4af37"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </Float>
  )
}

export const WelcomeScene = () => {
  return (
    <>
      <FloatingOrb />

      <Text
        position={[0, 2, 0]}
        fontSize={0.8}
        color="#5a5a5a"
        anchorX="center"
        anchorY="middle"
        fontWeight="300"
      >
        Love Resilience
      </Text>

      <Text
        position={[0, 1, 0]}
        fontSize={0.3}
        color="#8a8a8a"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        textAlign="center"
      >
        A digital sanctuary for practical spirituality
      </Text>
    </>
  )
}
