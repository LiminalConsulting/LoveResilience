import { Float } from '@react-three/drei'
import { SafeTexture } from '../TextureLoader'

const FloatingOrb = () => {
  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
      <SafeTexture url="Orb.png">
        {(texture) => (
          <mesh position={[0, 0, -2]}>
            <planeGeometry args={[2.2, 2.2]} />
            <meshBasicMaterial
              map={texture}
              transparent
              opacity={0.9}
              depthWrite={false}
            />
          </mesh>
        )}
      </SafeTexture>
    </Float>
  )
}

export const WelcomeScene = () => {
  return (
    <>
      <FloatingOrb />
    </>
  )
}
