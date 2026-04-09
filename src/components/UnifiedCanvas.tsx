import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { SceneOrchestrator } from './scenes/SceneOrchestrator'

export const UnifiedCanvas = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100dvh',
      background: 'linear-gradient(135deg, #f5f3f0 0%, #e8e4e0 100%)'
    }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ position: 'absolute', top: 0, left: 0 }}
        gl={{
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <Suspense fallback={null}>
          <SceneOrchestrator />
        </Suspense>
      </Canvas>
    </div>
  )
}
