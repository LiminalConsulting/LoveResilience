import { Card3D } from './Card3D'

interface ViewingSceneProps {
  imagePath: string
}

export const ViewingScene = ({ imagePath }: ViewingSceneProps) => {
  return (
    <>
      {/* Viewing-specific lighting */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 3, 3]} intensity={0.4} color="#d4af37" />

      <Card3D
        imagePath={imagePath}
        size={[3, 4.5]}
        flipAnimation={true}
        floatAnimation={true}
      />
    </>
  )
}
