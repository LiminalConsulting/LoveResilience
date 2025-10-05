import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useAppStore } from '../store/useAppStore'
import { WelcomeScene } from './scenes/WelcomeScene'
import { CenteringScene } from './scenes/CenteringScene'
import { SelectionScene } from './scenes/SelectionScene'
import { DailyCardScene } from './scenes/DailyCardScene'
import { ViewingScene } from './scenes/ViewingScene'

// Temporary scene router - will be replaced with SceneOrchestrator
const SceneRouter = () => {
  const currentState = useAppStore(state => state.currentState)
  const centeringPhase = useAppStore(state => state.centeringPhase)
  const centeringProgress = useAppStore(state => state.centeringProgress)
  const selectedCard = useAppStore(state => state.selectedCard)

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />

      {/* State-specific scenes */}
      {currentState === 'welcome' && <WelcomeScene />}
      {currentState === 'centering' && (
        <CenteringScene phase={centeringPhase} progress={centeringProgress} />
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

export const UnifiedCanvas = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #f5f3f0 0%, #e8e4e0 100%)'
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Suspense fallback={null}>
          <SceneRouter />
        </Suspense>
      </Canvas>
    </div>
  )
}
