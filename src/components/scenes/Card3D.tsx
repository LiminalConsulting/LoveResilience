import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { SafeTexture } from '../TextureLoader'
import * as THREE from 'three'

interface Card3DProps {
  imagePath: string
  size?: [number, number]
  flipAnimation?: boolean
  floatAnimation?: boolean
  pulseAnimation?: boolean
  position?: [number, number, number]
}

export const Card3D = ({
  imagePath,
  size = [2.5, 3.8],
  flipAnimation = true,
  floatAnimation = true,
  pulseAnimation = false,
  position = [0, 0, 0]
}: Card3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null)

  // Flip animation (card reveal)
  const { rotationY } = useSpring({
    from: { rotationY: flipAnimation ? Math.PI : 0 },
    to: { rotationY: 0 },
    config: { tension: 200, friction: 50 }
  })

  // Scale animation (daily card entrance)
  const { scale } = useSpring({
    from: { scale: flipAnimation ? 0 : 1 },
    to: { scale: 1 },
    config: { tension: 200, friction: 60 }
  })

  // Gentle floating/pulse animation
  useFrame((state) => {
    if (meshRef.current) {
      if (pulseAnimation) {
        // Gentle breathing pulse
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      } else if (floatAnimation) {
        // Subtle floating
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      }
    }
  })

  const CardMesh = (
    <SafeTexture url={imagePath}>
      {(texture) => {
        // Create rounded rectangle shape for card
        const shape = new THREE.Shape()
        const width = size[0]
        const height = size[1]
        const radius = 0.15 // Corner radius

        // Draw rounded rectangle
        shape.moveTo(-width/2 + radius, -height/2)
        shape.lineTo(width/2 - radius, -height/2)
        shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius)
        shape.lineTo(width/2, height/2 - radius)
        shape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2)
        shape.lineTo(-width/2 + radius, height/2)
        shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius)
        shape.lineTo(-width/2, -height/2 + radius)
        shape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2)

        return (
          <a.mesh
            ref={meshRef}
            rotation-y={rotationY}
            scale={scale}
            position={position}
          >
            <shapeGeometry args={[shape]} />
            <meshStandardMaterial
              map={texture}
              transparent
              side={THREE.DoubleSide}
            />
          </a.mesh>
        )
      }}
    </SafeTexture>
  )

  // Wrap in Float component if enabled
  if (floatAnimation) {
    return (
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        {CardMesh}
      </Float>
    )
  }

  return CardMesh
}
