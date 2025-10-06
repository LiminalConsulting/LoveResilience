import { useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useAppStore } from '../../store/useAppStore'
import { Card } from '../../types/Card'
import { Card3D } from './Card3D'
import * as THREE from 'three'

const FloatingCards = () => {
  const { shuffledCards, cardData, setSelectedCard, startTransition } = useAppStore()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

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
        <group
          key={card.id}
          onClick={() => handleCardClick(card)}
          onPointerEnter={() => setHoveredCard(card.id)}
          onPointerLeave={() => setHoveredCard(null)}
        >
          <Card3D
            imagePath={cardData.backside}
            size={[1.2, 1.8]}
            position={cardPositions[index]}
            flipAnimation={false}
            floatAnimation={false}
            interactive={true}
            hoverLift={true}
          />
        </group>
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
        position={[0, 4.2, 0]}
        fontSize={0.5}
        color="#5a5a5a"
        anchorX="center"
        anchorY="middle"
      >
        Trust Your Intuition
      </Text>

      <Text
        position={[0, 3.6, 0]}
        fontSize={0.3}
        color="#7a7a7a"
        anchorX="center"
        anchorY="middle"
      >
        Take a deep breath
      </Text>

      <Text
        position={[0, 3.1, 0]}
        fontSize={0.3}
        color="#7a7a7a"
        anchorX="center"
        anchorY="middle"
      >
        In and out
      </Text>

      <Text
        position={[0, 2.4, 0]}
        fontSize={0.32}
        color="#6a6a6a"
        anchorX="center"
        anchorY="middle"
        maxWidth={8}
        textAlign="center"
        fontStyle="italic"
      >
        Feel into the cards and choose the one that calls to you
      </Text>
    </>
  )
}
