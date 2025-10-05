import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface CenteringSceneProps {
  phase: 'check' | 'breathe' | 'intention' | 'ready'
  progress: number
}

const BreathingOrb = ({ isActive }: { isActive: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    if (meshRef.current && materialRef.current && isActive) {
      const breathCycle = Math.sin(state.clock.elapsedTime * 0.3) * 0.5 + 0.5
      const scale = 0.5 + breathCycle * 0.3

      meshRef.current.scale.setScalar(scale)
      materialRef.current.opacity = 0.3 + breathCycle * 0.4
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#d4af37"
        transparent
        opacity={0.3}
        roughness={0.1}
        metalness={0.5}
      />
    </mesh>
  )
}

const CenteringText = ({ phase }: { phase: string }) => {
  const texts = {
    check: "How are you feeling right now?",
    breathe: "Follow the gentle rhythm with your breath",
    intention: "Set your intention for this moment",
    ready: "You are centered and ready"
  }

  return (
    <Text
      position={[0, -1.5, 0]}
      fontSize={0.4}
      color="#5a5a5a"
      anchorX="center"
      anchorY="middle"
      maxWidth={8}
      textAlign="center"
    >
      {texts[phase as keyof typeof texts]}
    </Text>
  )
}

export const CenteringScene = ({ phase, progress }: CenteringSceneProps) => {
  return (
    <>
      <BreathingOrb isActive={phase === 'breathe'} />
      <CenteringText phase={phase} />
    </>
  )
}
