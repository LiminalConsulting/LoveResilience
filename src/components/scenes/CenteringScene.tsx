import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface CenteringSceneProps {
  phase: 'check' | 'breathe' | 'intention' | 'ready'
  progress: number
  breathPhase: 'in' | 'out'
  breathCountdown: number
}

const BreathingOrb = ({
  isActive,
  breathPhase,
  breathCountdown
}: {
  isActive: boolean
  breathPhase: 'in' | 'out'
  breathCountdown: number
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame(() => {
    if (meshRef.current && materialRef.current && isActive) {
      const phaseDuration = breathPhase === 'in' ? 4 : 7
      const elapsed = phaseDuration - breathCountdown
      const progress = Math.min(Math.max(elapsed / phaseDuration, 0), 1)

      // Smooth easing with sine wave (half period)
      const eased = Math.sin(progress * Math.PI / 2)

      let scale: number
      if (breathPhase === 'in') {
        // Expand: 0.5 -> 1.0
        scale = 0.5 + (eased * 0.5)
      } else {
        // Contract: 1.0 -> 0.5
        scale = 1.0 - (eased * 0.5)
      }

      meshRef.current.scale.setScalar(scale)
      materialRef.current.opacity = 0.3 + (scale - 0.5) * 0.4
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
      position={[0, -1.2, 0]}
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

export const CenteringScene = ({ phase, breathPhase, breathCountdown }: CenteringSceneProps) => {
  return (
    <>
      <BreathingOrb
        isActive={phase === 'breathe'}
        breathPhase={breathPhase}
        breathCountdown={breathCountdown}
      />
      <CenteringText phase={phase} />
    </>
  )
}
