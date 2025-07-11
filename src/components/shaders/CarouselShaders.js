import * as THREE from 'three'

// Pulsing light shader for carousel decorations
export const pulsingLightShader = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color(0xd4af37) },
    intensity: { value: 1.0 },
    pulseSpeed: { value: 2.0 },
    pulseAmplitude: { value: 0.5 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    uniform float intensity;
    uniform float pulseSpeed;
    uniform float pulseAmplitude;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      float pulse = sin(time * pulseSpeed) * pulseAmplitude + (1.0 - pulseAmplitude);
      vec3 emissive = color * intensity * pulse;
      
      // Add rim lighting effect
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = 1.0 - max(0.0, dot(viewDirection, vNormal));
      fresnel = pow(fresnel, 2.0);
      
      vec3 finalColor = emissive + (color * fresnel * 0.3);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
}

// Metallic brass shader with patina effects
export const brassShader = {
  uniforms: {
    time: { value: 0 },
    baseColor: { value: new THREE.Color(0xb8860b) },
    patinaMask: { value: null },
    roughness: { value: 0.2 },
    metalness: { value: 0.9 },
    envMap: { value: null },
    envMapIntensity: { value: 1.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 baseColor;
    uniform float roughness;
    uniform float metalness;
    uniform samplerCube envMap;
    uniform float envMapIntensity;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    
    // Simple noise function for patina
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      
      // Patina effect based on height and noise
      float patina = smoothstep(0.3, 1.0, vPosition.y + noise(vUv * 10.0) * 0.2);
      vec3 patinaColor = mix(baseColor, vec3(0.2, 0.4, 0.3), patina * 0.6);
      
      // Simple reflection
      vec3 reflectDir = reflect(-viewDir, normal);
      vec3 envColor = textureCube(envMap, reflectDir).rgb;
      
      // Fresnel for metallic reflection
      float fresnel = pow(1.0 - max(0.0, dot(viewDir, normal)), 2.0);
      
      vec3 finalColor = mix(patinaColor, envColor * envMapIntensity, fresnel * metalness);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
}

// Painted wood shader with wear effects
export const paintedWoodShader = {
  uniforms: {
    time: { value: 0 },
    baseWoodColor: { value: new THREE.Color(0x8b4513) },
    paintColor: { value: new THREE.Color(0xff6b6b) },
    wearAmount: { value: 0.3 },
    woodGrainScale: { value: 10.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 baseWoodColor;
    uniform vec3 paintColor;
    uniform float wearAmount;
    uniform float woodGrainScale;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    // Wood grain noise
    float woodGrain(vec2 p) {
      float grain = sin(p.x * woodGrainScale) * 0.1;
      grain += sin(p.x * woodGrainScale * 2.0) * 0.05;
      return grain;
    }
    
    // Wear pattern
    float wearPattern(vec2 p) {
      float wear = smoothstep(0.4, 0.6, 
        sin(p.x * 3.0 + sin(p.y * 2.0)) * 0.5 + 0.5);
      return wear;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Wood grain
      float grain = woodGrain(uv);
      vec3 woodColor = baseWoodColor + vec3(grain);
      
      // Paint wear
      float wear = wearPattern(uv) * wearAmount;
      wear += (1.0 - smoothstep(0.0, 1.0, vPosition.y)) * 0.3; // More wear at bottom
      
      vec3 finalColor = mix(paintColor, woodColor, wear);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
}

// Sparkle/rhinestone shader
export const sparkleShader = {
  uniforms: {
    time: { value: 0 },
    sparkleColor: { value: new THREE.Color(0xffffff) },
    sparkleIntensity: { value: 2.0 },
    sparkleScale: { value: 50.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 sparkleColor;
    uniform float sparkleIntensity;
    uniform float sparkleScale;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    // Voronoi-based sparkle pattern
    vec2 voronoiRandom(vec2 p) {
      return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
    }
    
    float voronoi(vec2 p) {
      vec2 g = floor(p);
      vec2 f = fract(p);
      
      float minDist = 1.0;
      for(int i = -1; i <= 1; i++) {
        for(int j = -1; j <= 1; j++) {
          vec2 neighbor = vec2(float(i), float(j));
          vec2 point = voronoiRandom(g + neighbor);
          point = 0.5 + 0.5 * sin(time + 6.2831 * point);
          vec2 diff = neighbor + point - f;
          float dist = length(diff);
          minDist = min(minDist, dist);
        }
      }
      return minDist;
    }
    
    void main() {
      vec2 uv = vUv * sparkleScale;
      float sparkle = voronoi(uv);
      sparkle = step(0.1, sparkle);
      sparkle = 1.0 - sparkle;
      
      // Add time-based twinkle
      float twinkle = sin(time * 3.0 + dot(vUv, vec2(12.9898, 78.233))) * 0.5 + 0.5;
      sparkle *= twinkle;
      
      vec3 finalColor = sparkleColor * sparkle * sparkleIntensity;
      
      gl_FragColor = vec4(finalColor, sparkle);
    }
  `
}

// Create material from shader
export function createShaderMaterial(shader, additionalUniforms = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      ...shader.uniforms,
      ...additionalUniforms
    },
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    transparent: true
  })
}