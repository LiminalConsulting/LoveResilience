import { Card3D } from './Card3D'
import { OrbMesh } from './OrbMesh'

interface DailyCardSceneProps {
  imagePath: string
  theme: string
}

export const DailyCardScene = ({ imagePath }: DailyCardSceneProps) => {
  return (
    <>
      {/* Daily-specific lighting */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 3, 3]} intensity={0.4} color="#d4af37" />

      <group position={[-2.5, 0, 0]}>
        <OrbMesh size={4} opacity={0.85} z={-1} />
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
