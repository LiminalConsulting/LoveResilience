import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { SafeTexture } from '../TextureLoader'
import * as THREE from 'three'

// Generates a radial alpha mask: opaque center fading to transparent at the edge.
// fadeStart: fraction of radius where fade begins (0.95 = fade starts at 95% out)
function makeRadialAlphaMask(size = 256, fadeStart = 0.95): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const center = size / 2
  const gradient = ctx.createRadialGradient(center, center, center * fadeStart, center, center, center)
  gradient.addColorStop(0, 'white')
  gradient.addColorStop(1, 'transparent')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

interface OrbMeshProps {
  /** Size of the plane in world units */
  size?: number
  /** Base opacity when fully visible */
  opacity?: number
  /** Z position */
  z?: number
  /** If true, wraps in Float for gentle idle animation */
  float?: boolean
  /** If provided, animates scale/opacity with breathing rhythm */
  breathPhase?: 'in' | 'out'
  /** Set false to pause breathing animation */
  breathActive?: boolean
}

const OrbInner = ({ size = 2.5, opacity = 0.9, z = -2, breathPhase, breathActive }: OrbMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const phaseStartTime = useRef<number | null>(null)
  const lastPhase = useRef(breathPhase)

  const alphaMap = useMemo(() => makeRadialAlphaMask(256, 0.95), [])

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return
    if (!breathActive || breathPhase === undefined) return

    const now = clock.getElapsedTime()
    if (breathPhase !== lastPhase.current || phaseStartTime.current === null) {
      phaseStartTime.current = now
      lastPhase.current = breathPhase
    }

    const phaseDuration = breathPhase === 'in' ? 4 : 7
    const elapsed = now - phaseStartTime.current
    const progress = Math.min(elapsed / phaseDuration, 1)
    const eased = Math.sin(progress * Math.PI / 2)

    const scale = breathPhase === 'in'
      ? 0.5 + eased * 0.5
      : 1.0 - eased * 0.5

    meshRef.current.scale.setScalar(scale)
    materialRef.current.opacity = (0.5 + (scale - 0.5) * 0.8) * opacity
  })

  return (
    <SafeTexture url="Orb.png">
      {(texture) => (
        <mesh ref={meshRef} position={[0, 0, z]}>
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial
            ref={materialRef}
            map={texture}
            alphaMap={alphaMap}
            transparent
            opacity={opacity}
            depthWrite={false}
          />
        </mesh>
      )}
    </SafeTexture>
  )
}

export const OrbMesh = (props: OrbMeshProps) => {
  if (props.float) {
    return (
      <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
        <OrbInner {...props} />
      </Float>
    )
  }
  return <OrbInner {...props} />
}
