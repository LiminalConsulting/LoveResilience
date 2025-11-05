import { useLoader } from '@react-three/fiber'
import { Suspense, useState, useEffect } from 'react'
import * as THREE from 'three'

interface SafeTextureProps {
  url: string
  children: (texture: THREE.Texture) => React.ReactNode
  fallback?: React.ReactNode
}

// Custom texture loader that waits for image to be fully ready (Safari fix)
class ConfiguredTextureLoader extends THREE.TextureLoader {
  load(
    url: string,
    onLoad?: (texture: THREE.Texture) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (event: ErrorEvent) => void
  ): THREE.Texture {
    console.log('[TextureLoader] Starting load:', url)
    const texture = new THREE.Texture()

    // Configure texture BEFORE loading image (Safari requires this)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.colorSpace = THREE.SRGBColorSpace

    console.log('[TextureLoader] Texture configured:', {
      url,
      minFilter: 'LinearFilter',
      magFilter: 'LinearFilter',
      generateMipmaps: false
    })

    const loader = new THREE.ImageLoader(this.manager)
    loader.setCrossOrigin(this.crossOrigin)
    loader.setPath(this.path)

    loader.load(
      url,
      (image) => {
        console.log('[TextureLoader] Image loaded successfully:', {
          url,
          width: image.width,
          height: image.height,
          complete: (image as HTMLImageElement).complete
        })

        // Image is fully loaded - assign immediately
        texture.image = image
        texture.needsUpdate = true

        console.log('[TextureLoader] Texture ready for rendering:', url)
        if (onLoad) onLoad(texture)
      },
      onProgress,
      (error) => {
        console.error('[TextureLoader] Failed to load:', url, error)
        if (onError) onError(error as ErrorEvent)
      }
    )

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