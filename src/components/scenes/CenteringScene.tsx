import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CenteringSceneProps {
  phase: 'check' | 'breathe' | 'intention' | 'ready'
  progress: number
  breathPhase: 'in' | 'out'
}

const BreathingOrb = ({
  isActive,
  breathPhase,
}: {
  isActive: boolean
  breathPhase: 'in' | 'out'
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const phaseStartTime = useRef<number | null>(null)
  const lastBreathPhase = useRef<'in' | 'out'>(breathPhase)

  useFrame(({ clock }) => {
    if (meshRef.current && materialRef.current && isActive) {
      const now = clock.getElapsedTime()

      if (breathPhase !== lastBreathPhase.current || phaseStartTime.current === null) {
        phaseStartTime.current = now
        lastBreathPhase.current = breathPhase
      }

      const phaseDuration = breathPhase === 'in' ? 4 : 7
      const elapsed = now - phaseStartTime.current
      const progress = Math.min(elapsed / phaseDuration, 1)
      const eased = Math.sin(progress * Math.PI / 2)

      const scale = breathPhase === 'in'
        ? 0.5 + (eased * 0.5)
        : 1.0 - (eased * 0.5)

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

export const CenteringScene = ({ phase, breathPhase }: CenteringSceneProps) => {
  return (
    <BreathingOrb
      isActive={phase === 'breathe'}
      breathPhase={breathPhase}
    />
  )
}
