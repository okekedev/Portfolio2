import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { Text, OrbitControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import CarouselTitle from './CarouselTitle' // Import the separate title component

// Simple carousel items - just titles
const CAROUSEL_ITEMS = ["Projects", "Contact", "About", "Consulting"]

// GLB Carousel with vertical text
const CarouselGLBModel = ({ activeIndex, onItemClick }) => {
  const gltf = useLoader(GLTFLoader, '/carousel.glb')
  const modelRef = useRef()
  
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={modelRef} position={[0, 0, 0]}>
      <primitive object={gltf.scene} scale={[2, 2, 2]} />
      
      {/* Vertical text on carousel panels */}
      {CAROUSEL_ITEMS.map((title, index) => {
        const angle = (index / CAROUSEL_ITEMS.length) * Math.PI * 2
        const radius = 2.5
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
        
        return (
          <Text
            key={title}
            position={[x, 0, z]}
            rotation={[0, -angle, Math.PI / 2]} // Added Z rotation for vertical text
            fontSize={0.2}
            color={activeIndex === index ? "#d4af37" : "#000000"}
            anchorX="center"
            anchorY="top"
            fontWeight="bold"
            outlineWidth={0.02}
            outlineColor="#ffffff"
            onClick={() => onItemClick(index)}
          >
            {title}
          </Text>
        )
      })}
    </group>
  )
}

// Main carousel scene with integrated 3D title
const CarouselScene = ({ activeIndex, onItemClick }) => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      
      <React.Suspense fallback={null}>
        <CarouselTitle />
        <CarouselGLBModel activeIndex={activeIndex} onItemClick={onItemClick} />
      </React.Suspense>
    </>
  )
}

// Main component
const AdvancedHomepageCarousel = ({ onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(-1)

  const handleItemClick = (index) => {
    setActiveIndex(index)
    const routes = ["projects", "contact", "about", "consulting"]
    onNavigate(routes[index])
  }

  return (
    <div className="homepage">
      {/* Single Canvas with both title and carousel */}
      <div className="carousel-container" style={{ height: '100vh' }}>
        <Canvas
          camera={{ position: [7, 1.5, 0], fov: 40 }} // Adjusted to see both title and carousel
          style={{ width: '100%', height: '100%' }}
          gl={{ alpha: true }}
        >
          <CarouselScene
            activeIndex={activeIndex}
            onItemClick={handleItemClick}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            rotateSpeed={1.5}
            target={[0, 1, 0]} // Target between title and carousel
          />
        </Canvas>
      </div>
    </div>
  )
}

export default AdvancedHomepageCarousel