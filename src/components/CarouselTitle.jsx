import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D, Center } from '@react-three/drei'

// 3D Site Title Component with actual 3D text depth
const CarouselTitle = () => {
  const titleRef = useRef()
  
  useFrame((state) => {
    if (titleRef.current) {
      // Gentle floating animation
      titleRef.current.position.y = 3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      // Subtle rotation that matches carousel
      titleRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    }
  })
  
  return (
    <group ref={titleRef} position={[0, 3, 0]}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json" // Default Three.js font
          size={0.8}
          height={0.2} // 3D depth/extrusion
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          Sundai
          <meshStandardMaterial 
            color="#d4af37"
            metalness={0.8}
            roughness={0.2}
            emissive="#d4af37"
            emissiveIntensity={0.1}
          />
        </Text3D>
      </Center>
      
      {/* Decorative underline */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[3, 0.02, 0.1]} />
        <meshStandardMaterial 
          color="#d4af37" 
          metalness={0.6}
          roughness={0.3}
          emissive="#d4af37" 
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Decorative side elements */}
      <mesh position={[-2.2, 0, 0]}>
        <sphereGeometry args={[0.06]} />
        <meshStandardMaterial 
          color="#d4af37" 
          metalness={0.8}
          roughness={0.1}
          emissive="#d4af37" 
          emissiveIntensity={0.4}
        />
      </mesh>
      
      <mesh position={[2.2, 0, 0]}>
        <sphereGeometry args={[0.06]} />
        <meshStandardMaterial 
          color="#d4af37" 
          metalness={0.8}
          roughness={0.1}
          emissive="#d4af37" 
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  )
}

export default CarouselTitle