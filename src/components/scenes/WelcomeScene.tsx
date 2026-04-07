import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbMesh } from './OrbMesh'

const FloatingOrb = () => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    // Slow, overlapping sine waves on each axis — feels organic, not mechanical
    groupRef.current.position.x = Math.sin(t * 0.31) * 0.12 + Math.sin(t * 0.17) * 0.06
    groupRef.current.position.y = Math.sin(t * 0.23) * 0.10 + Math.sin(t * 0.41) * 0.05
    groupRef.current.position.z = Math.sin(t * 0.19) * 0.18 + Math.sin(t * 0.29) * 0.08
  })

  return (
    <group ref={groupRef}>
      <OrbMesh size={4.4} opacity={0.9} z={0} />
    </group>
  )
}

export const WelcomeScene = () => {
  return <FloatingOrb />
}
