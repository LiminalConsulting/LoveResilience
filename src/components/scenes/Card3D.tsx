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
  const groupRef = useRef<THREE.Group>(null)
  const [isHovered, setIsHovered] = useState(false)
  const { pointer } = useThree()
  const targetRotation = useRef({ x: 0, y: 0 })

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
      // Floating/pulse animation
      if (pulseAnimation) {
        // Gentle breathing pulse
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      } else if (floatAnimation && !interactive) {
        // Subtle floating (disabled during interactive mode to avoid conflict)
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      }
    }

    // Interactive tilt toward cursor (on group, not mesh, to avoid conflict with flip animation)
    if (groupRef.current && interactive) {
      if (isHovered) {
        const cardWorldPos = new THREE.Vector3(...position)
        const dx = pointer.x * 5 - cardWorldPos.x
        const dy = pointer.y * 3 - cardWorldPos.y

        // Very subtle tilt (max 0.15 radians = ~8.5 degrees)
        targetRotation.current.x = THREE.MathUtils.clamp(-dy * 0.08, -0.15, 0.15)
        targetRotation.current.y = THREE.MathUtils.clamp(dx * 0.08, -0.15, 0.15)
      } else {
        // Return to neutral
        targetRotation.current.x = 0
        targetRotation.current.y = 0
      }

      // Smooth interpolation
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        0.1
      )
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        0.1
      )
    }
  })

  const CardMesh = (
    <SafeTexture url={imagePath}>
      {(texture) => (
        <a.group
          ref={groupRef}
          position-x={position[0]}
          position-y={position[1]}
          position-z={interactive && hoverLift ? posZ : position[2]}
        >
          <a.mesh
            ref={meshRef}
            rotation-y={rotationY}
            scale={scale}
            onPointerEnter={() => interactive && setIsHovered(true)}
            onPointerLeave={() => interactive && setIsHovered(false)}
          >
            <RoundedBox args={[size[0], size[1], 0.001]} radius={0.08} smoothness={4}>
              <meshBasicMaterial
                map={texture}
                transparent
                side={THREE.DoubleSide}
              />
            </RoundedBox>
          </a.mesh>
        </a.group>
      )}
    </SafeTexture>
  )

  // Wrap in Float component if enabled
  if (floatAnimation && !interactive) {
    return (
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        {CardMesh}
      </Float>
    )
  }

  return CardMesh
}
