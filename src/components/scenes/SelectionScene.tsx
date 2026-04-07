import { useFrame, useThree } from '@react-three/fiber'
import { useAppStore } from '../../store/useAppStore'
import { Card } from '../../types/Card'
import { Card3D } from './Card3D'
import * as THREE from 'three'

const COLS = 4
const ROWS = 3
const H_SPACING = 1.8
const V_SPACING = 2.2

const gridPosition = (index: number): [number, number, number] => {
  const col = index % COLS
  const row = Math.floor(index / COLS)
  const x = (col - (COLS - 1) / 2) * H_SPACING
  const y = (row - (ROWS - 1) / 2) * -V_SPACING
  return [x, y, 0]
}

const FloatingCards = () => {
  const { shuffledCards, cardData, setSelectedCard, setFocusedCardId, focusedCardId } = useAppStore()

  if (!cardData) return null

  const displayCards = shuffledCards.slice(0, COLS * ROWS)

  const handleCardClick = (card: Card) => {
    if (focusedCardId === card.id) return // already selected
    setSelectedCard(card)
    setFocusedCardId(card.id)
  }

  return (
    <group>
      {displayCards.map((card, index) => (
        <Card3D
          key={card.id}
          frontPath={card.imagePath}
          backPath={cardData.backside}
          size={[1.2, 1.8]}
          position={gridPosition(index)}
          interactive={!focusedCardId}
          selected={focusedCardId === card.id}
          faded={!!focusedCardId && focusedCardId !== card.id}
          focusPosition={[0, 0, 3]}
          focusScale={2.4}
          onClick={() => handleCardClick(card)}
        />
      ))}
    </group>
  )
}

const CameraController = () => {
  const { size } = useThree()
  const camera = useThree(state => state.camera)

  useFrame(() => {
    const aspect = size.width / size.height
    const targetZ = aspect >= 1 ? 8 : Math.min(8 / aspect, 16)
    camera.position.lerp(new THREE.Vector3(0, 0, targetZ), 0.02)
    camera.lookAt(0, 0, 0)
  })

  return null
}

export const SelectionScene = () => {
  return (
    <>
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#d4af37" />
      <CameraController />
      <FloatingCards />
    </>
  )
}
