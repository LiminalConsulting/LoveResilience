import { useRef, useEffect, ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAppStore } from '../../store/useAppStore'
import { WelcomeScene } from './WelcomeScene'
import { CenteringScene } from './CenteringScene'
import { SelectionScene } from './SelectionScene'
import { DailyCardScene } from './DailyCardScene'
import { ViewingScene } from './ViewingScene'
import * as THREE from 'three'

// Component to fade a scene by adjusting material opacity
const FadedGroup = ({ children, opacity }: { children: ReactNode; opacity: number }) => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.traverse((object) => {
        if ('material' in object) {
          const mesh = object as THREE.Mesh
          if (mesh.material) {
            const material = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            material.forEach((mat) => {
              if (mat instanceof THREE.Material) {
                mat.transparent = true
                mat.opacity = opacity
                mat.needsUpdate = true
              }
            })
          }
        }
      })
    }
  })

  return <group ref={groupRef}>{children}</group>
}

/**
 * SceneOrchestrator manages smooth transitions between app states
 *
 * Instead of instant scene switches, it:
 * - Renders both previous and current scenes during transitions
 * - Animates opacity/position/scale for smooth visual flow
 * - Drives transition progress via useFrame
 */
export const SceneOrchestrator = () => {
  const currentState = useAppStore(state => state.currentState)
  const previousState = useAppStore(state => state.previousState)
  const isTransitioning = useAppStore(state => state.isTransitioning)
  const transitionProgress = useAppStore(state => state.transitionProgress)
  const setTransitionProgress = useAppStore(state => state.setTransitionProgress)
  const completeTransition = useAppStore(state => state.completeTransition)

  const centeringPhase = useAppStore(state => state.centeringPhase)
  const centeringProgress = useAppStore(state => state.centeringProgress)
  const breathPhase = useAppStore(state => state.breathPhase)
  const selectedCard = useAppStore(state => state.selectedCard)

  const transitionStartTime = useRef<number>(0)
  const transitionDuration = 1000 // 1 second transition

  // Start transition timer when isTransitioning becomes true
  useEffect(() => {
    if (isTransitioning) {
      transitionStartTime.current = Date.now()
    }
  }, [isTransitioning])

  // Drive transition progress
  useFrame(() => {
    if (isTransitioning) {
      const elapsed = Date.now() - transitionStartTime.current
      const progress = Math.min(elapsed / transitionDuration, 1)

      setTransitionProgress(progress)

      if (progress >= 1) {
        completeTransition()
      }
    }
  })

  // Helper to get scene content
  const getSceneContent = (state: string) => {
    switch (state) {
      case 'welcome':
        return <WelcomeScene />
      case 'centering':
        return <CenteringScene
          phase={centeringPhase}
          progress={centeringProgress}
          breathPhase={breathPhase}
        />
      case 'selection':
        return <SelectionScene />
      case 'daily':
        return selectedCard ? (
          <DailyCardScene imagePath={selectedCard.imagePath} theme={selectedCard.theme} />
        ) : null
      case 'viewing':
        return selectedCard ? <ViewingScene imagePath={selectedCard.imagePath} /> : null
      default:
        return null
    }
  }

  // During transition: render both scenes with cross-fade
  if (isTransitioning && previousState) {
    return (
      <>
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />

        {/* Previous scene fading out */}
        <FadedGroup opacity={1 - transitionProgress}>
          {getSceneContent(previousState)}
        </FadedGroup>

        {/* Current scene fading in */}
        <FadedGroup opacity={transitionProgress}>
          {getSceneContent(currentState)}
        </FadedGroup>
      </>
    )
  }

  // Normal rendering: single scene at full opacity
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />

      {/* Current scene */}
      {currentState === 'welcome' && <WelcomeScene />}
      {currentState === 'centering' && (
        <CenteringScene
          phase={centeringPhase}
          progress={centeringProgress}
          breathPhase={breathPhase}
        />
      )}
      {currentState === 'selection' && <SelectionScene />}
      {currentState === 'daily' && selectedCard && (
        <DailyCardScene imagePath={selectedCard.imagePath} theme={selectedCard.theme} />
      )}
      {currentState === 'viewing' && selectedCard && (
        <ViewingScene imagePath={selectedCard.imagePath} />
      )}
    </>
  )
}
