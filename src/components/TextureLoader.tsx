import { useLoader } from '@react-three/fiber'
import { Suspense, useState, useEffect } from 'react'
import * as THREE from 'three'

interface SafeTextureProps {
  url: string
  children: (texture: THREE.Texture) => React.ReactNode
  fallback?: React.ReactNode
}

// Custom texture loader that configures textures properly
class ConfiguredTextureLoader extends THREE.TextureLoader {
  load(
    url: string,
    onLoad?: (texture: THREE.Texture) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void
  ): THREE.Texture {
    const texture = super.load(
      url,
      (loadedTexture) => {
        // Configure IMMEDIATELY on load, before any rendering
        loadedTexture.minFilter = THREE.LinearFilter
        loadedTexture.magFilter = THREE.LinearFilter
        loadedTexture.generateMipmaps = false
        loadedTexture.needsUpdate = true

        if (onLoad) onLoad(loadedTexture)
      },
      onProgress,
      onError
    )

    // Also configure the initial texture object
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false

    return texture
  }
}

const TextureComponent = ({ url, children }: { url: string; children: (texture: THREE.Texture) => React.ReactNode }) => {
  const [error, setError] = useState<Error | null>(null)

  // Use our custom loader that configures textures properly
  const texture = useLoader(
    ConfiguredTextureLoader,
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