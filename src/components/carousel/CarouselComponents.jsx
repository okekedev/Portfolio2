import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Cylinder, Sphere, Torus, Box } from '@react-three/drei'
import * as THREE from 'three'
import { createShaderMaterial, brassShader, paintedWoodShader, pulsingLightShader, sparkleShader } from '../shaders/CarouselShaders'

// Central support pole with decorative elements
export function CentralPole({ height = 8 }) {
  const poleRef = useRef()
  const decorationsRef = useRef()
  
  const brassMaterial = useMemo(() => createShaderMaterial(brassShader), [])
  const sparklesMaterial = useMemo(() => createShaderMaterial(sparkleShader), [])
  
  useFrame((state) => {
    if (brassMaterial.uniforms) {
      brassMaterial.uniforms.time.value = state.clock.elapsedTime
    }
    if (sparklesMaterial.uniforms) {
      sparklesMaterial.uniforms.time.value = state.clock.elapsedTime
    }
    if (decorationsRef.current) {
      decorationsRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group>
      {/* Main pole */}
      <Cylinder ref={poleRef} args={[0.3, 0.3, height, 16]} position={[0, height/2, 0]}>
        <primitive object={brassMaterial} attach="material" />
      </Cylinder>
      
      {/* Decorative base */}
      <Cylinder args={[0.8, 0.6, 1, 16]} position={[0, 0.5, 0]}>
        <primitive object={brassMaterial} attach="material" />
      </Cylinder>
      
      {/* Top crown */}
      <group position={[0, height + 0.5, 0]} ref={decorationsRef}>
        <Sphere args={[0.4, 16, 16]}>
          <primitive object={brassMaterial} attach="material" />
        </Sphere>
        {/* Decorative spikes */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <Cylinder
              key={i}
              args={[0.02, 0.08, 0.6, 8]}
              position={[Math.sin(angle) * 0.5, 0.5, Math.cos(angle) * 0.5]}
              rotation={[0, 0, 0]}
            >
              <primitive object={brassMaterial} attach="material" />
            </Cylinder>
          )
        })}
      </group>
      
      {/* Sparkling decorative elements */}
      <group position={[0, height * 0.7, 0]}>
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const radius = 0.4
          return (
            <Sphere
              key={i}
              args={[0.05, 8, 8]}
              position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            >
              <primitive object={sparklesMaterial} attach="material" />
            </Sphere>
          )
        })}
      </group>
    </group>
  )
}

// Carousel platform with decorative edge
export function CarouselPlatform({ radius = 6, thickness = 0.3 }) {
  const platformRef = useRef()
  const edgeRef = useRef()
  
  const paintedMaterial = useMemo(() => createShaderMaterial(paintedWoodShader), [])
  const brassMaterial = useMemo(() => createShaderMaterial(brassShader), [])
  
  useFrame((state) => {
    if (paintedMaterial.uniforms) {
      paintedMaterial.uniforms.time.value = state.clock.elapsedTime
    }
    if (brassMaterial.uniforms) {
      brassMaterial.uniforms.time.value = state.clock.elapsedTime
    }
  })

  return (
    <group position={[0, -2, 0]}>
      {/* Main platform */}
      <Cylinder ref={platformRef} args={[radius, radius, thickness, 32]} rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={paintedMaterial} attach="material" />
      </Cylinder>
      
      {/* Decorative brass edge */}
      <Torus ref={edgeRef} args={[radius - 0.1, 0.1, 8, 32]} rotation={[-Math.PI / 2, 0, 0]} position={[0, thickness/2, 0]}>
        <primitive object={brassMaterial} attach="material" />
      </Torus>
      
      {/* Decorative brass rivets */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2
        const rivetRadius = radius - 0.3
        return (
          <Sphere
            key={i}
            args={[0.05, 8, 8]}
            position={[Math.sin(angle) * rivetRadius, thickness/2 + 0.05, Math.cos(angle) * rivetRadius]}
          >
            <primitive object={brassMaterial} attach="material" />
          </Sphere>
        )
      })}
    </group>
  )
}

// Support arms extending from center to carousel items
export function SupportArm({ angle, radius, itemHeight = 2 }) {
  const armRef = useRef()
  const brassMaterial = useMemo(() => createShaderMaterial(brassShader), [])
  
  useFrame((state) => {
    if (brassMaterial.uniforms) {
      brassMaterial.uniforms.time.value = state.clock.elapsedTime
    }
  })

  const armPosition = [
    Math.sin(angle) * radius / 2,
    itemHeight,
    Math.cos(angle) * radius / 2
  ]

  return (
    <group>
      {/* Main support arm */}
      <Box
        ref={armRef}
        args={[radius, 0.1, 0.1]}
        position={armPosition}
        rotation={[0, -angle, 0]}
      >
        <primitive object={brassMaterial} attach="material" />
      </Box>
      
      {/* Vertical support rod */}
      <Cylinder
        args={[0.05, 0.05, itemHeight + 1, 8]}
        position={[Math.sin(angle) * radius, itemHeight / 2, Math.cos(angle) * radius]}
        rotation={[0, 0, 0]}
      >
        <primitive object={brassMaterial} attach="material" />
      </Cylinder>
    </group>
  )
}

// Carousel lighting system
export function CarouselLighting({ radius = 6, count = 8 }) {
  const lightsRef = useRef()
  const bulbMaterial = useMemo(() => createShaderMaterial(pulsingLightShader), [])
  
  useFrame((state) => {
    if (bulbMaterial.uniforms) {
      bulbMaterial.uniforms.time.value = state.clock.elapsedTime
    }
    if (lightsRef.current) {
      lightsRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={lightsRef}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2
        const lightRadius = radius + 0.5
        const position = [
          Math.sin(angle) * lightRadius,
          3,
          Math.cos(angle) * lightRadius
        ]
        
        return (
          <group key={i} position={position}>
            {/* Light bulb */}
            <Sphere args={[0.1, 8, 8]}>
              <primitive object={bulbMaterial} attach="material" />
            </Sphere>
            
            {/* Light fixture */}
            <Cylinder args={[0.15, 0.08, 0.3, 8]} position={[0, 0.2, 0]}>
              <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
            </Cylinder>
            
            {/* Point light for illumination */}
            <pointLight
              color="#d4af37"
              intensity={0.5}
              distance={8}
              decay={2}
              position={[0, 0, 0]}
            />
          </group>
        )
      })}
    </group>
  )
}

// Advanced carousel item with multiple geometries and animations
export function AdvancedCarouselItem({ type, position, isActive, children }) {
  const itemRef = useRef()
  const decorationRef = useRef()
  
  const paintedMaterial = useMemo(() => createShaderMaterial(paintedWoodShader, {
    paintColor: { value: type === 'projects' ? new THREE.Color(0x4a90e2) : 
                         type === 'contact' ? new THREE.Color(0x50c878) : 
                         new THREE.Color(0xe74c3c) }
  }), [type])
  
  const sparklesMaterial = useMemo(() => createShaderMaterial(sparkleShader), [])
  
  useFrame((state, delta) => {
    if (itemRef.current) {
      // Gentle bobbing motion
      itemRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.1
      
      // Individual item rotation
      if (type === 'projects') {
        itemRef.current.rotation.y += delta * 0.3
        itemRef.current.rotation.x += delta * 0.1
      } else if (type === 'contact') {
        itemRef.current.rotation.z += delta * 0.4
      } else {
        itemRef.current.rotation.y += delta * 0.2
      }
      
      // Scale animation when active
      const targetScale = isActive ? 1.3 : 1
      itemRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5)
    }
    
    if (decorationRef.current) {
      decorationRef.current.rotation.y += delta * 2
    }
    
    if (paintedMaterial.uniforms) {
      paintedMaterial.uniforms.time.value = state.clock.elapsedTime
    }
    if (sparklesMaterial.uniforms) {
      sparklesMaterial.uniforms.time.value = state.clock.elapsedTime
    }
  })

  const renderItemGeometry = () => {
    switch (type) {
      case 'projects':
        return (
          <group>
            {/* Main octahedral shape */}
            <mesh>
              <octahedronGeometry args={[1, 2]} />
              <primitive object={paintedMaterial} attach="material" />
            </mesh>
            {/* Floating detail elements */}
            <Box args={[0.2, 0.2, 0.2]} position={[1.5, 0.5, 0]}>
              <primitive object={sparklesMaterial} attach="material" />
            </Box>
            <Sphere args={[0.15]} position={[-1.2, -0.8, 0.5]}>
              <primitive object={sparklesMaterial} attach="material" />
            </Sphere>
            <Cylinder args={[0.1, 0.1, 0.4]} position={[0.8, -1.2, -0.8]} rotation={[Math.PI/4, 0, Math.PI/3]}>
              <primitive object={sparklesMaterial} attach="material" />
            </Cylinder>
          </group>
        )
      
      case 'contact':
        return (
          <group>
            {/* Main torus */}
            <Torus args={[1, 0.3, 8, 16]}>
              <primitive object={paintedMaterial} attach="material" />
            </Torus>
            {/* Inner communication sphere */}
            <Sphere args={[0.4]}>
              <meshPhysicalMaterial
                color="#f5f3f0"
                metalness={0.1}
                roughness={0.1}
                transmission={0.9}
                thickness={0.5}
              />
            </Sphere>
            {/* Signal waves */}
            {Array.from({ length: 3 }, (_, i) => (
              <Torus
                key={i}
                args={[0.8 + i * 0.3, 0.02, 4, 16]}
                position={[0, 0, 0]}
              >
                <meshBasicMaterial
                  color="#50c878"
                  transparent
                  opacity={0.3 - i * 0.1}
                />
              </Torus>
            ))}
          </group>
        )
      
      case 'consulting':
        return (
          <group>
            {/* Base platform */}
            <Box args={[1.5, 0.3, 1.5]}>
              <primitive object={paintedMaterial} attach="material" />
            </Box>
            {/* Rotating top element */}
            <group ref={decorationRef} position={[0, 0.8, 0]}>
              <Cylinder args={[0.8, 0.8, 0.2, 8]}>
                <meshPhysicalMaterial
                  color="#f5f3f0"
                  metalness={0.8}
                  roughness={0.2}
                  clearcoat={1.0}
                />
              </Cylinder>
              {/* Gear teeth */}
              {Array.from({ length: 8 }, (_, i) => {
                const angle = (i / 8) * Math.PI * 2
                return (
                  <Box
                    key={i}
                    args={[0.1, 0.3, 0.1]}
                    position={[Math.sin(angle) * 0.9, 0, Math.cos(angle) * 0.9]}
                    rotation={[0, angle, 0]}
                  >
                    <meshStandardMaterial color="#666" metalness={0.9} roughness={0.1} />
                  </Box>
                )
              })}
            </group>
            {/* Data stream effects */}
            {Array.from({ length: 5 }, (_, i) => (
              <Sphere
                key={i}
                args={[0.05]}
                position={[
                  (Math.random() - 0.5) * 2,
                  Math.random() * 1.5,
                  (Math.random() - 0.5) * 2
                ]}
              >
                <primitive object={sparklesMaterial} attach="material" />
              </Sphere>
            ))}
          </group>
        )
      
      default:
        return <Box args={[1, 1, 1]}><meshStandardMaterial color="#666" /></Box>
    }
  }

  return (
    <group ref={itemRef} position={position}>
      {renderItemGeometry()}
      {children}
    </group>
  )
}

// Text labels with 3D depth and glow effects
export function CarouselLabel({ text, position, isActive }) {
  const labelRef = useRef()
  
  useFrame((state, delta) => {
    if (labelRef.current) {
      // Gentle floating animation
      labelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05
      
      // Glow effect when active
      const material = labelRef.current.material
      if (material) {
        const targetIntensity = isActive ? 0.3 : 0.1
        material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, targetIntensity, delta * 5)
      }
    }
  })

  return (
    <Text
      ref={labelRef}
      position={position}
      fontSize={0.4}
      color="#f5f3f0"
      anchorX="center"
      anchorY="middle"
      fontWeight="bold"
      outlineWidth={0.03}
      outlineColor="#2c3e3e"
    >
      {text}
      <meshStandardMaterial
        emissive="#d4af37"
        emissiveIntensity={isActive ? 0.3 : 0.1}
      />
    </Text>
  )
}