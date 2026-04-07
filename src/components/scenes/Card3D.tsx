import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, a } from '@react-spring/three'
import { SafeTexture } from '../TextureLoader'
import * as THREE from 'three'

interface Card3DProps {
  frontPath: string
  backPath: string
  size?: [number, number]
  targetPosition: [number, number, number]
  targetOpacity?: number
  targetScale?: number
  flipped?: boolean       // true = front faces camera
  interactive?: boolean
  onClick?: () => void
}

const createRoundedMask = (width: number, height: number, radius: number) => {
  const canvas = document.createElement('canvas')
  const pw = 512
  const ph = Math.round(pw * (height / width))
  canvas.width = pw
  canvas.height = ph
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, pw, ph)
  ctx.fillStyle = 'white'
  const r = radius * pw / width
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.lineTo(pw - r, 0)
  ctx.quadraticCurveTo(pw, 0, pw, r)
  ctx.lineTo(pw, ph - r)
  ctx.quadraticCurveTo(pw, ph, pw - r, ph)
  ctx.lineTo(r, ph)
  ctx.quadraticCurveTo(0, ph, 0, ph - r)
  ctx.lineTo(0, r)
  ctx.quadraticCurveTo(0, 0, r, 0)
  ctx.closePath()
  ctx.fill()
  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.generateMipmaps = false
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  return tex
}

export const Card3D = ({
  frontPath,
  backPath,
  size = [1.2, 1.8],
  targetPosition,
  targetOpacity = 1,
  targetScale = 1,
  flipped = false,
  interactive = false,
  onClick,
}: Card3DProps) => {
  const frontRef = useRef<THREE.Mesh>(null)
  const backRef = useRef<THREE.Mesh>(null)
  const alphaMask = useMemo(() => createRoundedMask(size[0], size[1], 0.1), [size])

  const [hovered, setHovered] = useState(false)
  const hoverLift = interactive && hovered ? 0.35 : 0

  // Single spring drives everything — position, scale, flip, opacity, hover
  const spring = useSpring({
    x: targetPosition[0],
    y: targetPosition[1],
    z: targetPosition[2] + hoverLift,
    scale: targetScale,
    rotationY: flipped ? Math.PI : 0,
    opacity: targetOpacity,
    config: { tension: 180, friction: 55 },
  })

  // Drive material opacity from spring each frame (can't bind opacity directly on mesh)
  useFrame(() => {
    const op = spring.opacity.get()
    if (frontRef.current) (frontRef.current.material as THREE.MeshBasicMaterial).opacity = op
    if (backRef.current) (backRef.current.material as THREE.MeshBasicMaterial).opacity = op
  })

  return (
    <SafeTexture url={backPath}>
      {(backTexture) => (
        <SafeTexture url={frontPath}>
          {(frontTexture) => (
            <a.group
              position-x={spring.x}
              position-y={spring.y}
              position-z={spring.z}
              scale={spring.scale}
              rotation-y={spring.rotationY}
              onClick={interactive || flipped ? onClick : undefined}
              onPointerEnter={() => { if (interactive) setHovered(true) }}
              onPointerLeave={() => setHovered(false)}
            >
              {/* Back face — faces camera when rotationY=0 */}
              <mesh ref={backRef}>
                <planeGeometry args={[size[0], size[1]]} />
                <meshBasicMaterial
                  map={backTexture}
                  alphaMap={alphaMask}
                  transparent
                  side={THREE.FrontSide}
                />
              </mesh>

              {/* Front face — faces camera when rotationY=π */}
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
