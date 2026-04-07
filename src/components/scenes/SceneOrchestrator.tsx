import { useRef, useEffect, ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAppStore } from '../../store/useAppStore'
import { WelcomeScene } from './WelcomeScene'
import { CenteringScene } from './CenteringScene'
import { SelectionScene } from './SelectionScene'
import { DailyCardScene } from './DailyCardScene'
import * as THREE from 'three'

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
  const transitionDuration = 1000

  useEffect(() => {
    if (isTransitioning) {
      transitionStartTime.current = Date.now()
    }
  }, [isTransitioning])

  useFrame(() => {
    if (isTransitioning) {
      const elapsed = Date.now() - transitionStartTime.current
      const progress = Math.min(elapsed / transitionDuration, 1)
      setTransitionProgress(progress)
      if (progress >= 1) completeTransition()
    }
  })

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
        return selectedCard
          ? <DailyCardScene imagePath={selectedCard.imagePath} theme={selectedCard.theme} />
          : null
      default:
        return null
    }
  }

  if (isTransitioning && previousState) {
    return (
      <>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <FadedGroup opacity={1 - transitionProgress}>
          {getSceneContent(previousState)}
        </FadedGroup>
        <FadedGroup opacity={transitionProgress}>
          {getSceneContent(currentState)}
        </FadedGroup>
      </>
    )
  }

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
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
    </>
  )
}
