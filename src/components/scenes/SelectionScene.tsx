import { useFrame, useThree } from '@react-three/fiber'
import { useAppStore } from '../../store/useAppStore'
import { Card } from '../../types/Card'
import { Card3D } from './Card3D'
import * as THREE from 'three'

const FloatingCards = () => {
  const { shuffledCards, cardData, setSelectedCard, startTransition } = useAppStore()

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
  const { camera, size } = useThree()

  useFrame(() => {
    const aspect = size.width / size.height
    // On portrait/narrow screens, pull back so all 4 columns stay visible
    // Base distance of 8 is tuned for ~16:9; scale inversely with aspect ratio
    const targetZ = aspect >= 1 ? 8 : Math.min(8 / aspect, 16)
    camera.position.lerp(new THREE.Vector3(0, 0, targetZ), 0.02)
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
    </>
  )
}
