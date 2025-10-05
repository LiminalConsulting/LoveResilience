import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { useAppStore } from '../../store/useAppStore'
import { Card } from '../../types/Card'
import { SafeTexture } from '../TextureLoader'
import * as THREE from 'three'

interface Card3DProps {
  position: [number, number, number]
  card: Card
  backside: string
  isHovered: boolean
  onClick: () => void
  onHover: (hovered: boolean) => void
  mousePos: THREE.Vector2
}

const Card3D = ({ position, backside, isHovered, onClick, onHover, mousePos }: Card3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetRotation = useRef(new THREE.Euler(0, 0, 0))

  // Lift card up slightly when hovered (in Z direction to avoid jitter)
  const { posZ } = useSpring({
    posZ: isHovered ? 0.3 : 0,
    config: { tension: 280, friction: 40 }
  })

  useFrame(() => {
    if (meshRef.current) {
      // Calculate tilt toward cursor
      const cardWorldPos = new THREE.Vector3(...position)
      const dx = mousePos.x - cardWorldPos.x
      const dy = mousePos.y - cardWorldPos.y

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
    }
  })

  return (
    <SafeTexture url={backside}>
      {(texture) => (
        <a.mesh
          ref={meshRef}
          position-x={position[0]}
          position-y={position[1]}
          position-z={posZ}
          onClick={onClick}
          onPointerEnter={() => onHover(true)}
          onPointerLeave={() => onHover(false)}
        >
          <planeGeometry args={[1.2, 1.8]} />
          <meshStandardMaterial
            map={texture}
            transparent
            side={THREE.DoubleSide}
          />
        </a.mesh>
      )}
    </SafeTexture>
  )
}

const FloatingCards = () => {
  const { shuffledCards, cardData, setSelectedCard, startTransition } = useAppStore()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState(new THREE.Vector2(0, 0))
  const { camera, size, raycaster } = useThree()

  useFrame((state) => {
    // Convert mouse position to 3D world coordinates
    const mouse = new THREE.Vector2(
      (state.pointer.x * size.width) / size.width,
      (state.pointer.y * size.height) / size.height
    )

    raycaster.setFromCamera(mouse, camera)
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const intersectPoint = new THREE.Vector3()
    raycaster.ray.intersectPlane(planeZ, intersectPoint)

    setMousePos(new THREE.Vector2(intersectPoint.x, intersectPoint.y))
  })

  if (!cardData) return null

  const displayCards = shuffledCards.slice(0, 12)
  const cardPositions = displayCards.map((_, index) => {
    const cols = 4
    const rows = 3
    const col = index % cols
    const row = Math.floor(index / cols)

    const x = (col - (cols - 1) / 2) * 1.8
    const y = (row - (rows - 1) / 2) * -2.2
    const z = Math.random() * 0.2 - 0.1

    return [x, y, z] as [number, number, number]
  })

  const handleCardClick = (card: Card) => {
    setSelectedCard(card)
    startTransition('viewing')
  }

  return (
    <group>
      {displayCards.map((card, index) => (
        <Card3D
          key={card.id}
          position={cardPositions[index]}
          card={card}
          backside={cardData.backside}
          isHovered={hoveredCard === card.id}
          onClick={() => handleCardClick(card)}
          onHover={(hovered) => setHoveredCard(hovered ? card.id : null)}
          mousePos={mousePos}
        />
      ))}
    </group>
  )
}

const CameraController = () => {
  const { camera } = useThree()

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 0, 8), 0.02)
    camera.lookAt(0, 0, 0)
  })

  return null
}

export const SelectionScene = () => {
  return (
    <>
      {/* Selection-specific lighting */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#d4af37" />

      <CameraController />
      <FloatingCards />

      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="#5a5a5a"
        anchorX="center"
        anchorY="middle"
      >
        Trust Your Intuition
      </Text>

      <Text
        position={[0, 3.2, 0]}
        fontSize={0.25}
        color="#8a8a8a"
        anchorX="center"
        anchorY="middle"
        maxWidth={8}
        textAlign="center"
      >
        Feel into the cards and choose the one that calls to you
      </Text>
    </>
  )
}
