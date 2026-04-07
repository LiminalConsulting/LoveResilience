import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// Custom orb material:
//   - tintStrength: 0 = no tint (original), 1 = full gold multiply
//   - radial edge fade: smooth transparent ring at outer ~20% of radius
const OrbShaderMaterial = shaderMaterial(
  {
    map: new THREE.Texture(),
    opacity: 1.0,
    tintStrength: 0.5,
    tintColor: new THREE.Color('#d4af37'),
    edgeFade: 0.75, // UV radius where fade begins (0–1, where 1 = corner of plane)
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
    uniform float tintStrength;
    uniform vec3 tintColor;
    uniform float edgeFade;
    varying vec2 vUv;

    void main() {
      vec4 texColor = texture2D(map, vUv);

      // Apply gold tint as a lerp between original and multiplied
      vec3 tinted = mix(texColor.rgb, texColor.rgb * tintColor, tintStrength);

      // Radial fade: distance from center (0,0) in UV space (center = 0.5,0.5)
      float dist = distance(vUv, vec2(0.5, 0.5)) * 2.0; // 0 at center, 1 at corner
      float fade = 1.0 - smoothstep(edgeFade, 1.0, dist);

      gl_FragColor = vec4(tinted, texColor.a * opacity * fade);
    }
  `
)

extend({ OrbShaderMaterial })

// Type declaration for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbShaderMaterial: any
    }
  }
}

export { OrbShaderMaterial }
