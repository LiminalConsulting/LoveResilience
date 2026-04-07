import { useEffect, useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useAppStore } from '../../store/useAppStore'
import { Card } from '../../types/Card'
import { Card3D } from './Card3D'
import * as THREE from 'three'

const COLS = 4
const ROWS = 3
const COUNT = COLS * ROWS
const H_SPACING = 1.8
const V_SPACING = 2.2

// Positions
const gridPosition = (index: number): [number, number, number] => {
  const col = index % COLS
  const row = Math.floor(index / COLS)
  return [
    (col - (COLS - 1) / 2) * H_SPACING,
    (row - (ROWS - 1) / 2) * -V_SPACING,
    0,
  ]
}

const deckPosition = (index: number): [number, number, number] => [
  0, 0, index * 0.015,
]

const FOCUS_POSITION: [number, number, number] = [0, 0, 4]
const FOCUS_SCALE = 2.5

type SceneMode = 'spawning' | 'grid' | 'focusing' | 'shuffling'

const CameraController = () => {
  const { size, camera } = useThree()
  useFrame(() => {
    const aspect = size.width / size.height
    const targetZ = aspect >= 1 ? 8 : Math.min(8 / aspect, 16)
    camera.position.lerp(new THREE.Vector3(0, 0, targetZ), 0.02)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export const SelectionScene = () => {
  const { cardData, setSelectedCard, setFocusedCardId, focusedCardId } = useAppStore()

  // Pick 12 random cards from the full deck
  const pickCards = useCallback(() => {
    if (!cardData) return []
    const shuffled = [...cardData.cards].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, COUNT)
  }, [cardData])

  const [activeCards, setActiveCards] = useState<Card[]>([])
  const [mode, setMode] = useState<SceneMode>('spawning')
  const shuffleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Initial load — pick cards and spawn
  useEffect(() => {
    if (!cardData) return
    setActiveCards(pickCards())
    setMode('spawning')
    const t = setTimeout(() => setMode('grid'), 50) // one frame delay so deck positions render first
    return () => clearTimeout(t)
  }, [cardData])

  // When focusedCardId changes externally (e.g. cleared by "draw another")
  useEffect(() => {
    if (!focusedCardId && mode === 'focusing') {
      setMode('grid')
    }
  }, [focusedCardId])

  const handleCardClick = (card: Card) => {
    if (mode !== 'grid') return
    setSelectedCard(card)
    setFocusedCardId(card.id)
    setMode('focusing')
  }

  // Called from overlay via store action — exposed via shuffle trigger
  const handleShuffle = useCallback(() => {
    if (mode !== 'grid') return
    setMode('shuffling')
    // After cards reach deck (~700ms), swap and re-spawn
    shuffleTimer.current = setTimeout(() => {
      setFocusedCardId(null)
      setSelectedCard(null)
      setActiveCards(pickCards())
      setMode('spawning')
      setTimeout(() => setMode('grid'), 50)
    }, 700)
  }, [mode, pickCards, setFocusedCardId, setSelectedCard])

  // Expose shuffle handler to store so overlay can call it
  useEffect(() => {
    useAppStore.setState({ triggerShuffle: handleShuffle })
  }, [handleShuffle])

  // Cleanup timer on unmount
  useEffect(() => () => { if (shuffleTimer.current) clearTimeout(shuffleTimer.current) }, [])

  if (!cardData || activeCards.length === 0) return null

  return (
    <>
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#d4af37" />
      <CameraController />

      {activeCards.map((card, index) => {
        const isSelected = card.id === focusedCardId
        const isFaded = mode === 'focusing' && !isSelected

        let targetPosition: [number, number, number]
        if (mode === 'spawning' || mode === 'shuffling') {
          targetPosition = deckPosition(index)
        } else if (isSelected) {
          targetPosition = FOCUS_POSITION
        } else {
          targetPosition = gridPosition(index)
        }

        return (
          <Card3D
            key={card.id}
            frontPath={card.imagePath}
            backPath={cardData.backside}
            size={[1.2, 1.8]}
            targetPosition={targetPosition}
            targetOpacity={isFaded ? 0 : 1}
            targetScale={isSelected ? FOCUS_SCALE : 1}
            flipped={isSelected}
            interactive={mode === 'grid'}
            onClick={() => handleCardClick(card)}
          />
        )
      })}
    </>
  )
}
