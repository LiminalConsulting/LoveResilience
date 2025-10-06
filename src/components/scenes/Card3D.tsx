import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
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
  interactive?: boolean
  hoverLift?: boolean
}

export const Card3D = ({
  imagePath,
  size = [2.5, 3.8],
  flipAnimation = true,
  floatAnimation = true,
  pulseAnimation = false,
  position = [0, 0, 0],
  interactive = false,
  hoverLift = false
}: Card3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)
  const { pointer } = useThree()
  const targetRotation = useRef(new THREE.Euler(0, 0, 0))

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

  // Hover lift animation
  const { posZ } = useSpring({
    posZ: interactive && hoverLift && isHovered ? 0.3 : 0,
    config: { tension: 280, friction: 40 }
  })

  // Gentle floating/pulse animation + interactive tilt
  useFrame((state) => {
    if (meshRef.current) {
      // Interactive tilt toward cursor
      if (interactive && isHovered) {
        const cardWorldPos = new THREE.Vector3(...position)
        const dx = pointer.x * 5 - cardWorldPos.x
        const dy = pointer.y * 3 - cardWorldPos.y

        // Very subtle tilt (max 0.1 radians = ~5.7 degrees)
        const tiltX = THREE.MathUtils.clamp(-dy * 0.05, -0.1, 0.1)
        const tiltY = THREE.MathUtils.clamp(dx * 0.05, -0.1, 0.1)

        targetRotation.current.set(tiltX, tiltY, 0)

        // Smooth interpolation
        meshRef.current.rotation.x = THREE.MathUtils.lerp(
          meshRef.current.rotation.x,
          targetRotation.current.x,
          0.1
        )
        meshRef.current.rotation.y = THREE.MathUtils.lerp(
          meshRef.current.rotation.y,
          targetRotation.current.y,
          0.1
        )
      } else {
        // Return to neutral rotation
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1)
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1)
      }

      // Floating/pulse animation
      if (pulseAnimation) {
        // Gentle breathing pulse
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      } else if (floatAnimation && !interactive) {
        // Subtle floating (disabled during interactive mode to avoid conflict)
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      }
    }
  })

  const CardMesh = (
    <SafeTexture url={imagePath}>
      {(texture) => (
        <a.mesh
          ref={meshRef}
          rotation-y={rotationY}
          scale={scale}
          position-x={position[0]}
          position-y={position[1]}
          position-z={interactive && hoverLift ? posZ : position[2]}
          onPointerEnter={() => interactive && setIsHovered(true)}
          onPointerLeave={() => interactive && setIsHovered(false)}
        >
          <RoundedBox args={[size[0], size[1], 0.01]} radius={0.1} smoothness={4}>
            <meshStandardMaterial
              map={texture}
              transparent
              side={THREE.DoubleSide}
            />
          </RoundedBox>
        </a.mesh>
      )}
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
