import { useLoader } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import * as THREE from 'three'

interface SafeTextureProps {
  url: string
  children: (texture: THREE.Texture) => React.ReactNode
  fallback?: React.ReactNode
}

const TextureComponent = ({ url, children }: { url: string; children: (texture: THREE.Texture) => React.ReactNode }) => {
  const [error, setError] = useState<Error | null>(null)

  // Use THREE.TextureLoader with error handling
  const texture = useLoader(
    THREE.TextureLoader,
    url,
    undefined,
    (err) => {
      console.error(`Failed to load texture: ${url}`, err)
      setError(err instanceof Error ? err : new Error(String(err)))
    }
  )

  if (error) {
    return (
      <mesh>
        <planeGeometry args={[1.2, 1.8]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    )
  }

  return <>{children(texture)}</>
}

export const SafeTexture = ({ url, children, fallback }: SafeTextureProps) => {
  return (
    <Suspense fallback={fallback || (
      <mesh>
        <planeGeometry args={[1.2, 1.8]} />
        <meshStandardMaterial color="#e8e4e0" />
      </mesh>
    )}>
      <TextureComponent url={url}>
        {children}
      </TextureComponent>
    </Suspense>
  )
}