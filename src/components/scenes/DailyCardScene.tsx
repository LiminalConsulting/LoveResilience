import { SafeTexture } from '../TextureLoader'
import { Card3D } from './Card3D'

interface DailyCardSceneProps {
  imagePath: string
  theme: string
}

// Orb - sits behind the card, faces camera
const GoldenOrb = () => {
  return (
    <SafeTexture url="Orb.png">
      {(texture) => (
        <mesh position={[0, 0, -1]}>
          <planeGeometry args={[4, 4]} />
          <meshBasicMaterial
            map={texture}
            color="#d4af37"
            transparent
            opacity={0.85}
            depthWrite={false}
          />
        </mesh>
      )}
    </SafeTexture>
  )
}

export const DailyCardScene = ({ imagePath }: DailyCardSceneProps) => {
  return (
    <>
      {/* Daily-specific lighting */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 3, 3]} intensity={0.4} color="#d4af37" />

      <group position={[-2.5, 0, 0]}>
        <GoldenOrb />
        <Card3D
          imagePath={imagePath}
          size={[2.5, 3.8]}
          position={[0, 0, 0]}
          flipAnimation={true}
          floatAnimation={true}
          pulseAnimation={true}
        />
      </group>
    </>
  )
}
