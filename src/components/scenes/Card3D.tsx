import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, a } from '@react-spring/three'
import { SafeTexture } from '../TextureLoader'
import * as THREE from 'three'

interface Card3DProps {
  frontPath: string
  backPath: string
  size?: [number, number]
  position?: [number, number, number]
  // Grid behaviour
  interactive?: boolean
  // Focus behaviour
  selected?: boolean
  faded?: boolean
  focusPosition?: [number, number, number]
  focusScale?: number
  onClick?: () => void
}

const createRoundedMask = (width: number, height: number, radius: number) => {
  const canvas = document.createElement('canvas')
  const pixelWidth = 512
  const pixelHeight = Math.round(pixelWidth * (height / width))
  canvas.width = pixelWidth
  canvas.height = pixelHeight

  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, pixelWidth, pixelHeight)
  ctx.fillStyle = 'white'
  const r = radius * pixelWidth / width
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.lineTo(pixelWidth - r, 0)
  ctx.quadraticCurveTo(pixelWidth, 0, pixelWidth, r)
  ctx.lineTo(pixelWidth, pixelHeight - r)
  ctx.quadraticCurveTo(pixelWidth, pixelHeight, pixelWidth - r, pixelHeight)
  ctx.lineTo(r, pixelHeight)
  ctx.quadraticCurveTo(0, pixelHeight, 0, pixelHeight - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.needsUpdate = true
  return texture
}

export const Card3D = ({
  frontPath,
  backPath,
  size = [1.2, 1.8],
  position = [0, 0, 0],
  interactive = false,
  selected = false,
  faded = false,
  focusPosition = [0, 0, 2],
  focusScale = 2.2,
  onClick,
}: Card3DProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const frontRef = useRef<THREE.Mesh>(null)
  const backRef = useRef<THREE.Mesh>(null)
  const alphaMask = useMemo(() => createRoundedMask(size[0], size[1], 0.1), [size])

  // Flip: back (0) in grid, front (π) when selected
  const { rotationY, posX, posY, posZ, cardScale, opacity } = useSpring({
    rotationY: selected ? Math.PI : 0,
    posX: selected ? focusPosition[0] : position[0],
    posY: selected ? focusPosition[1] : position[1],
    posZ: selected ? focusPosition[2] : position[2],
    cardScale: selected ? focusScale : 1,
    opacity: faded ? 0 : 1,
    config: {
      tension: selected ? 180 : 220,
      friction: selected ? 60 : 50,
    },
  })

  // Gentle hover lift (only in grid mode)
  const [hovered, setHovered] = useState(false)
  const { hoverZ } = useSpring({
    hoverZ: interactive && !selected && hovered ? 0.3 : 0,
    config: { tension: 280, friction: 40 },
  })

  // Sync opacity to materials each frame
  useFrame(() => {
    const op = opacity.get()
    if (frontRef.current) {
      const mat = frontRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = op
    }
    if (backRef.current) {
      const mat = backRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = op
    }
  })

  return (
    <SafeTexture url={backPath}>
      {(backTexture) => (
        <SafeTexture url={frontPath}>
          {(frontTexture) => (
            <a.group
              ref={groupRef}
              position-x={posX}
              position-y={posY}
              position-z={posZ.to((z) => z + hoverZ.get())}
              scale={cardScale}
              rotation-y={rotationY}
              onClick={interactive || selected ? onClick : undefined}
              onPointerEnter={() => interactive && !selected && setHovered(true)}
              onPointerLeave={() => setHovered(false)}
            >
              {/* Back face — visible in grid (rotationY=0, back faces camera) */}
              <mesh ref={backRef}>
                <planeGeometry args={[size[0], size[1]]} />
                <meshBasicMaterial
                  map={backTexture}
                  alphaMap={alphaMask}
                  transparent
                  side={THREE.FrontSide}
                />
              </mesh>

              {/* Front face — visible when selected (rotationY=π, front faces camera) */}
              <mesh ref={frontRef} rotation-y={Math.PI}>
                <planeGeometry args={[size[0], size[1]]} />
                <meshBasicMaterial
                  map={frontTexture}
                  alphaMap={alphaMask}
                  transparent
                  side={THREE.FrontSide}
                />
              </mesh>
            </a.group>
          )}
        </SafeTexture>
      )}
    </SafeTexture>
  )
}
