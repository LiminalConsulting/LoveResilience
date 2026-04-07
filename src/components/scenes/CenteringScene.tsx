import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { SafeTexture } from '../TextureLoader'
import * as THREE from 'three'
import './OrbMaterial'

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
  const materialRef = useRef<any>(null)
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
      materialRef.current.opacity = 0.5 + (scale - 0.5) * 0.8
    }
  })

  return (
    <SafeTexture url="Orb.png">
      {(texture) => (
        <mesh ref={meshRef} position={[0, 0, -2]}>
          <planeGeometry args={[3, 3]} />
          <orbShaderMaterial
            ref={materialRef}
            map={texture}
            opacity={0.5}
            tintStrength={0.5}
            transparent
            depthWrite={false}
          />
        </mesh>
      )}
    </SafeTexture>
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
