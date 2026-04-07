import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// Custom orb material: radial edge fade only, no color tint
const OrbShaderMaterial = shaderMaterial(
  {
    map: new THREE.Texture(),
    opacity: 1.0,
    edgeFade: 0.95,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform sampler2D map;
    uniform float opacity;
    uniform float edgeFade;
    varying vec2 vUv;

    void main() {
      vec4 texColor = texture2D(map, vUv);

      // Radial fade: distance from center in UV space
      float dist = distance(vUv, vec2(0.5, 0.5)) * 2.0;
      float fade = 1.0 - smoothstep(edgeFade, 1.0, dist);

      gl_FragColor = vec4(texColor.rgb, texColor.a * opacity * fade);
    }
  `
)

extend({ OrbShaderMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbShaderMaterial: any
    }
  }
}

export { OrbShaderMaterial }
