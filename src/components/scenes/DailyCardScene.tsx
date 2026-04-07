import { Card3D } from './Card3D'
import { OrbMesh } from './OrbMesh'
import { useAppStore } from '../../store/useAppStore'

interface DailyCardSceneProps {
  imagePath: string
  theme: string
}

export const DailyCardScene = ({ imagePath }: DailyCardSceneProps) => {
  const cardData = useAppStore(state => state.cardData)
  if (!cardData) return null

  return (
    <>
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 3, 3]} intensity={0.4} color="#d4af37" />

      <group position={[-2.5, 0, 0]}>
        <OrbMesh size={4} opacity={0.85} z={-1} />
        <Card3D
          frontPath={imagePath}
          backPath={cardData.backside}
          size={[2.5, 3.8]}
          position={[0, 0, 0]}
          selected={true}
        />
      </group>
    </>
  )
}
