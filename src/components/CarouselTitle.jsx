import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Center, shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// Custom shimmer shader material
const ShimmerMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color('#d4af37'),
    shimmerColor: new THREE.Color('#ffd700'),
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
    uniform float time;
    uniform vec3 color;
    uniform vec3 shimmerColor;
    varying vec2 vUv;
    
    void main() {
      // Create rolling shimmer effect
      float shimmer = sin(vUv.x * 8.0 + time * 3.0) * 0.5 + 0.5;
      shimmer *= sin(vUv.y * 2.0 + time * 1.5) * 0.5 + 0.5;
      
      // Add wave effect for more dynamic movement
      float wave = sin(vUv.x * 12.0 + time * 4.0) * 0.3 + 0.7;
      
      // Combine base color with shimmer
      vec3 finalColor = mix(color, shimmerColor, shimmer * wave * 0.8);
      
      // Add some brightness variation
      float brightness = 1.0 + shimmer * 0.3;
      finalColor *= brightness;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)

extend({ ShimmerMaterial })

const CarouselTitle = () => {
  const titleRef = useRef()
  const shimmerMaterialRef = useRef()
  
  useFrame((state) => {
    if (titleRef.current) {
      // Gentle floating animation
      titleRef.current.position.y = 3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
    
    // Update shimmer animation
    if (shimmerMaterialRef.current) {
      shimmerMaterialRef.current.time = state.clock.elapsedTime
    }
  })
  
  return (
    <group ref={titleRef} position={[0, 3, 0]}>
      {/* Main Title with shimmer effect - using default Three.js font */}
      <Center>
        <Text
          fontSize={1.2}
          color="#import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center, shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

// Custom shimmer shader material
const ShimmerMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color('#d4af37'),
    shimmerColor: new THREE.Color('#ffd700'),
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
    uniform float time;
    uniform vec3 color;
    uniform vec3 shimmerColor;
    varying vec2 vUv;
    
    void main() {
      // Create rolling shimmer effect
      float shimmer = sin(vUv.x * 8.0 + time * 3.0) * 0.5 + 0.5;
      shimmer *= sin(vUv.y * 2.0 + time * 1.5) * 0.5 + 0.5;
      
      // Add wave effect for more dynamic movement
      float wave = sin(vUv.x * 12.0 + time * 4.0) * 0.3 + 0.7;
      
      // Combine base color with shimmer
      vec3 finalColor = mix(color, shimmerColor, shimmer * wave * 0.8);
      
      // Add some brightness variation
      float brightness = 1.0 + shimmer * 0.3;
      finalColor *= brightness;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)

extend({ ShimmerMaterial })

// Custom Text component using troika-three-text
const TroikaText = ({ 
  children, 
  fontSize = 1, 
  color = '#ffffff', 
  position = [0, 0, 0], 
  fontFamily = 'Arial',
  outlineWidth = 0,
  outlineColor = '#000000',
  ...props 
}) => {
  const meshRef = useRef()
  
  useEffect(() => {
    if (meshRef.current) {
      // Import troika and configure
      import('troika-three-text').then(({ Text3D }) => {
        if (meshRef.current) {
          meshRef.current.text = children
          meshRef.current.fontSize = fontSize
          meshRef.current.color = color
          meshRef.current.fontFamily = fontFamily
          meshRef.current.textAlign = 'center'
          meshRef.current.anchorX = 'center'
          meshRef.current.anchorY = 'middle'
          
          if (outlineWidth > 0) {
            meshRef.current.outlineWidth = outlineWidth
            meshRef.current.outlineColor = outlineColor
          }
          
          // Sync and update
          meshRef.current.sync()
        }
      })
    }
  }, [children, fontSize, color, fontFamily, outlineWidth, outlineColor])
  
  return (
    <mesh ref={meshRef} position={position} {...props}>
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

const CarouselTitle = () => {
  const titleRef = useRef()
  const shimmerMaterialRef = useRef()
  
  useFrame((state) => {
    if (titleRef.current) {
      // Gentle floating animation
      titleRef.current.position.y = 3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
    
    // Update shimmer animation
    if (shimmerMaterialRef.current) {
      shimmerMaterialRef.current.time = state.clock.elapsedTime
    }
  })
  
  return (
    <group ref={titleRef} position={[0, 3, 0]}>
      {/* Main Title with shimmer effect */}
      <Center>
        <TroikaText
          fontSize={1.2}
          color="#d4af37"
          fontFamily="Great Vibes, cursive"
          position={[0, 0, 0]}
          outlineWidth={0.02}
          outlineColor="#2c3e3e"
        >
          Sundai
        </TroikaText>
      </Center>
      
      {/* Author name below title */}
      <Center position={[0, -0.8, 0]}>
        <TroikaText
          fontSize={0.3}
          color="#f5f3f0"
          fontFamily="Dancing Script, cursive"
          position={[0, 0, 0]}
          outlineWidth={0.008}
          outlineColor="#2c3e3e"
        >
          By Christian Okeke
        </TroikaText>
      </Center>
      
      {/* Decorative underline with shimmer */}
      <mesh position={[0, -0.5, 0]}>
        <planeGeometry args={[4, 0.03]} />
        <shimmerMaterial 
          ref={shimmerMaterialRef}
          color={new THREE.Color('#d4af37')}
          shimmerColor={new THREE.Color('#ffd700')}
        />
      </mesh>
      
      {/* Decorative side sparkles */}
      <group position={[-2.5, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.04]} />
          <meshStandardMaterial 
            color="#ffd700" 
            metalness={0.9}
            roughness={0.1}
            emissive="#ffd700" 
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
      
      <group position={[2.5, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.04]} />
          <meshStandardMaterial 
            color="#ffd700" 
            metalness={0.9}
            roughness={0.1}
            emissive="#ffd700" 
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
      
      {/* Additional sparkle effects */}
      <group position={[-1.8, 0.3, 0]}>
        <mesh>
          <sphereGeometry args={[0.02]} />
          <meshStandardMaterial 
            color="#ffd700" 
            metalness={1.0}
            roughness={0.0}
            emissive="#ffd700" 
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
      
      <group position={[1.8, 0.3, 0]}>
        <mesh>
          <sphereGeometry args={[0.02]} />
          <meshStandardMaterial 
            color="#ffd700" 
            metalness={1.0}
            roughness={0.0}
            emissive="#ffd700" 
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
    </group>
  )
}

export default CarouselTitle