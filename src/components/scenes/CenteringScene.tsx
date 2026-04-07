import { OrbMesh } from './OrbMesh'

interface CenteringSceneProps {
  phase: 'check' | 'breathe' | 'intention' | 'ready'
  progress: number
  breathPhase: 'in' | 'out'
}

export const CenteringScene = ({ phase, breathPhase }: CenteringSceneProps) => {
  return (
    <OrbMesh
      size={3}
      opacity={0.9}
      z={-2}
      breathPhase={breathPhase}
      breathActive={phase === 'breathe'}
    />
  )
}
