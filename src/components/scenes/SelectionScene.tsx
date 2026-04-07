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
const FOCUS_POSITION: [number, number, number] = [0, 0, 4]

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

// Responsive focus scale — portrait mobile gets more, landscape/desktop gets less
const getFocusScale = (aspect: number) => aspect >= 1 ? 1.25 : 2.0

type SceneMode = 'spawning' | 'grid' | 'focusing' | 'shuffling'

// Slot: stable identity, mutable card data
interface Slot {
  slotIndex: number
  card: Card | null
}

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

interface SelectionSceneProps {
  active: boolean
}

export const SelectionScene = ({ active }: SelectionSceneProps) => {
  const { cardData, setSelectedCard, setFocusedCardId, focusedCardId } = useAppStore()
  const { size } = useThree()
  const aspect = size.width / size.height
  const focusScale = getFocusScale(aspect)

  // Fixed pool of COUNT slots — never remounted
  const [slots, setSlots] = useState<Slot[]>(() =>
    Array.from({ length: COUNT }, (_, i) => ({ slotIndex: i, card: null }))
  )
  const [mode, setMode] = useState<SceneMode>('spawning')
  const shuffleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pickCards = useCallback((): Card[] => {
    if (!cardData) return []
    return [...cardData.cards]
      .sort(() => Math.random() - 0.5)
      .slice(0, COUNT)
  }, [cardData])

  // Fill slots with cards — stable slot keys, just swap card data
  const fillSlots = useCallback((cards: Card[]) => {
    setSlots(Array.from({ length: COUNT }, (_, i) => ({
      slotIndex: i,
      card: cards[i] ?? null,
    })))
  }, [])

  // On first cardData load — fill slots at deck, then spread
  useEffect(() => {
    if (!cardData) return
    fillSlots(pickCards())
    setMode('spawning')
    let raf1: number, raf2: number
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setMode('grid'))
    })
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2) }
  }, [cardData])

  // "Draw another" — clear focus, return to grid
  useEffect(() => {
    if (!focusedCardId && mode === 'focusing') {
      setMode('grid')
    }
  }, [focusedCardId])

  const handleCardClick = (card: Card) => {
    if (mode !== 'grid' || !active) return
    setSelectedCard(card)
    setFocusedCardId(card.id)
    setMode('focusing')
  }

  const handleShuffle = useCallback(() => {
    if (mode !== 'grid' || !active) return
    setFocusedCardId(null)
    setSelectedCard(null)
    setMode('shuffling')

    // Wait for cards to reach deck, then swap data in place and re-spread
    shuffleTimer.current = setTimeout(() => {
      fillSlots(pickCards())       // update card data in existing slots — no remount
      setMode('spawning')
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setMode('grid'))
      })
    }, 900)
  }, [mode, active, pickCards, fillSlots, setFocusedCardId, setSelectedCard])

  useEffect(() => {
    useAppStore.setState({ triggerShuffle: handleShuffle })
  }, [handleShuffle])

  useEffect(() => () => { if (shuffleTimer.current) clearTimeout(shuffleTimer.current) }, [])

  if (!cardData) return null

  return (
    <>
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#d4af37" />
      <CameraController />

      {slots.map(({ slotIndex, card }) => {
        if (!card) return null

        const isSelected = card.id === focusedCardId
        const isFaded = !active || (mode === 'focusing' && !isSelected)

        let targetPosition: [number, number, number]
        if (mode === 'spawning' || mode === 'shuffling') {
          targetPosition = deckPosition(slotIndex)
        } else if (isSelected) {
          targetPosition = FOCUS_POSITION
        } else {
          targetPosition = gridPosition(slotIndex)
        }

        return (
          <Card3D
            key={`slot-${slotIndex}`}          // stable key — never remounts
            frontPath={card.imagePath}
            backPath={cardData.backside}
            size={[1.2, 1.8]}
            targetPosition={targetPosition}
            targetOpacity={isFaded ? 0 : 1}
            targetScale={isSelected ? focusScale : 1}
            flipped={isSelected}
            interactive={mode === 'grid' && active}
            onClick={() => handleCardClick(card)}
          />
        )
      })}
    </>
  )
}
