import { Card3D } from './Card3D'
import { useAppStore } from '../../store/useAppStore'
import { useThree } from '@react-three/fiber'

interface DailyCardSceneProps {
  imagePath: string
  theme: string
}

// Continuous curve matching selection scene's getFocusScale, scaled up 2×
const getDailyScale = (aspect: number) => Math.max(2.5, Math.min(6.0, 2.5 / Math.min(aspect, 1.0)))

export const DailyCardScene = ({ imagePath }: DailyCardSceneProps) => {
  const cardData = useAppStore(state => state.cardData)
  const { size } = useThree()
  const scale = getDailyScale(size.width / size.height)

  if (!cardData) return null

  return (
    <>
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 3, 3]} intensity={0.4} color="#d4af37" />

      <Card3D
        frontPath={imagePath}
        backPath={cardData.backside}
        size={[1.2, 1.8]}
        targetPosition={[0, 0, 0]}
        targetScale={scale}
        flipped={true}
      />
    </>
  )
}
