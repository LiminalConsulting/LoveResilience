import { Float } from '@react-three/drei'
import { SafeTexture } from '../TextureLoader'
import './OrbMaterial'

const FloatingOrb = () => {
  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
      <SafeTexture url="Orb.png">
        {(texture) => (
          <mesh position={[0, 0, -2]}>
            <planeGeometry args={[2.2, 2.2]} />
            <orbShaderMaterial
              map={texture}
              opacity={0.9}
              transparent
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
