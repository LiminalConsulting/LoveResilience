import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useAppStore } from '../store/useAppStore'
import { WelcomeScene } from './scenes/WelcomeScene'

// Temporary scene router - will be replaced with SceneOrchestrator
const SceneRouter = () => {
  const currentState = useAppStore(state => state.currentState)

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />

      {/* State-specific scenes */}
      {currentState === 'welcome' && <WelcomeScene />}

      {/* Placeholder for other states */}
      {currentState !== 'welcome' && (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#d4af37" />
        </mesh>
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
