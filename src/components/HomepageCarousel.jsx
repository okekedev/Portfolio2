import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, OrbitControls, Center, Environment, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'

// Advanced carousel components
const CentralPole = ({ height = 8 }) => {
  const poleRef = useRef()
  const decorationsRef = useRef()
  
  useFrame((state) => {
    if (decorationsRef.current) {
      decorationsRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group>
      {/* Main pole */}
      <mesh ref={poleRef} position={[0, height/2, 0]}>
        <cylinderGeometry args={[0.3, 0.3, height, 16]} />
        <meshStandardMaterial 
          color="#d4af37" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#d4af37"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Decorative base */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 1, 16]} />
        <meshStandardMaterial 
          color="#d4af37" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Top crown */}
      <group position={[0, height + 0.5, 0]} ref={decorationsRef}>
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial 
            color="#d4af37" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
        
        {/* Decorative spikes */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[Math.sin(angle) * 0.5, 0.5, Math.cos(angle) * 0.5]}
            >
              <cylinderGeometry args={[0.02, 0.08, 0.6, 8]} />
              <meshStandardMaterial 
                color="#d4af37" 
                metalness={0.9} 
                roughness={0.1}
              />
            </mesh>
          )
        })}
      </group>
      
      {/* Sparkling decorative elements */}
      <group position={[0, height * 0.7, 0]}>
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const radius = 0.4
          return (
            <mesh
              key={i}
              position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial 
                color="#ffffff" 
                emissive="#ffffff"
                emissiveIntensity={0.3}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

const CarouselPlatform = ({ radius = 6, thickness = 0.3 }) => {
  return (
    <group position={[0, -2, 0]}>
      {/* Main platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, thickness, 32]} />
        <meshStandardMaterial 
          color="#3a4a4a" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#2c3e3e"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Decorative edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, thickness/2, 0]}>
        <torusGeometry args={[radius - 0.1, 0.1, 8, 32]} />
        <meshStandardMaterial 
          color="#d4af37" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Decorative rivets */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2
        const rivetRadius = radius - 0.3
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * rivetRadius, thickness/2 + 0.05, Math.cos(angle) * rivetRadius]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color="#d4af37" 
              metalness={0.8} 
              roughness={0.2}
            />
          </mesh>
        )
      })}
    </group>
  )
}

const SupportArm = ({ angle, radius, itemHeight = 2 }) => {
  const armLength = radius * 0.8 // Make arms shorter
  const armPosition = [0, itemHeight - 0.5, 0] // Center the arm

  return (
    <group rotation={[0, angle, 0]}>
      {/* Main support arm - horizontal */}
      <mesh position={[armLength / 2, itemHeight - 0.5, 0]}>
        <boxGeometry args={[armLength, 0.08, 0.08]} />
        <meshStandardMaterial 
          color="#6a7a7a" 
          metalness={0.7} 
          roughness={0.3}
        />
      </mesh>
      
      {/* Vertical support rod */}
      <mesh position={[radius, (itemHeight - 0.5) / 2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, itemHeight - 0.5, 8]} />
        <meshStandardMaterial 
          color="#6a7a7a" 
          metalness={0.7} 
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

const CarouselLighting = ({ radius = 6, count = 8 }) => {
  const lightsRef = useRef()
  
  useFrame((state) => {
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
            <mesh>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial 
                color="#d4af37"
                emissive="#d4af37"
                emissiveIntensity={0.5}
              />
            </mesh>
            
            {/* Light fixture */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.15, 0.08, 0.3, 8]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
            </mesh>
            
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

// Advanced carousel items
const AdvancedCarouselItem = ({ type, position, isActive, children }) => {
  const itemRef = useRef()
  const decorationRef = useRef()
  
  useFrame((state, delta) => {
    if (itemRef.current) {
      // Gentle bobbing motion (smaller amplitude)
      const bobbing = Math.sin(state.clock.elapsedTime * 1.5) * 0.05
      itemRef.current.position.y = position[1] + bobbing
      
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
      const targetScale = isActive ? 1.2 : 1
      const currentScale = itemRef.current.scale.x
      const newScale = currentScale + (targetScale - currentScale) * delta * 5
      itemRef.current.scale.setScalar(newScale)
    }
    
    if (decorationRef.current) {
      decorationRef.current.rotation.y += delta * 2
    }
  })

  const renderItemGeometry = () => {
    const baseColor = type === 'projects' ? "#4a90e2" : 
                     type === 'contact' ? "#50c878" : 
                     "#e74c3c"
    
    switch (type) {
      case 'projects':
        return (
          <group>
            {/* Main octahedral shape */}
            <mesh>
              <octahedronGeometry args={[1, 2]} />
              <meshStandardMaterial 
                color={isActive ? "#d4af37" : baseColor}
                emissive={isActive ? "#d4af37" : baseColor}
                emissiveIntensity={isActive ? 0.3 : 0.1}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Floating detail elements */}
            <mesh position={[1.5, 0.5, 0]}>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial 
                color="#d4af37"
                emissive="#d4af37"
                emissiveIntensity={0.3}
              />
            </mesh>
            <mesh position={[-1.2, -0.8, 0.5]}>
              <sphereGeometry args={[0.15]} />
              <meshStandardMaterial 
                color="#d4af37"
                emissive="#d4af37"
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        )
      
      case 'contact':
        return (
          <group>
            {/* Main torus */}
            <mesh>
              <torusGeometry args={[1, 0.3, 8, 16]} />
              <meshStandardMaterial 
                color={isActive ? "#d4af37" : baseColor}
                emissive={isActive ? "#d4af37" : baseColor}
                emissiveIntensity={isActive ? 0.3 : 0.1}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Inner communication sphere */}
            <mesh>
              <sphereGeometry args={[0.4]} />
              <meshPhysicalMaterial
                color="#f5f3f0"
                metalness={0.1}
                roughness={0.1}
                transmission={0.9}
                thickness={0.5}
              />
            </mesh>
          </group>
        )
      
      case 'consulting':
        return (
          <group>
            {/* Base platform */}
            <mesh>
              <boxGeometry args={[1.5, 0.3, 1.5]} />
              <meshStandardMaterial 
                color={isActive ? "#d4af37" : baseColor}
                emissive={isActive ? "#d4af37" : baseColor}
                emissiveIntensity={isActive ? 0.3 : 0.1}
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            {/* Rotating top element */}
            <group ref={decorationRef} position={[0, 0.8, 0]}>
              <mesh>
                <cylinderGeometry args={[0.8, 0.8, 0.2, 8]} />
                <meshPhysicalMaterial
                  color="#f5f3f0"
                  metalness={0.8}
                  roughness={0.2}
                  clearcoat={1.0}
                />
              </mesh>
            </group>
          </group>
        )
      
      default:
        return (
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#666" />
          </mesh>
        )
    }
  }

  return (
    <group ref={itemRef} position={position}>
      {renderItemGeometry()}
      {children}
    </group>
  )
}

const CarouselLabel = ({ text, position, isActive }) => {
  const labelRef = useRef()
  
  useFrame((state, delta) => {
    if (labelRef.current) {
      // Gentle floating animation
      labelRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05
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
    </Text>
  )
}

// Performance monitoring component
const PerformanceOptimizer = ({ onPerformanceChange }) => {
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, 2))
  
  return (
    <PerformanceMonitor
      onIncline={() => {
        setDpr(Math.min(window.devicePixelRatio, 2))
        onPerformanceChange?.({ quality: 'high', dpr })
      }}
      onDecline={() => {
        setDpr(Math.min(window.devicePixelRatio * 0.8, 1.5))
        onPerformanceChange?.({ quality: 'low', dpr })
      }}
    />
  )
}

// Main carousel scene
const AdvancedCarouselScene = ({ items, activeIndex, onItemClick, targetVelocity }) => {
  const carouselRef = useRef()
  const itemRefs = useRef([])
  const { camera, gl } = useThree()
  
  // Physics state inside the Canvas
  const physicsRef = useRef({
    rotation: 0,
    angularVelocity: 0.3,
    targetVelocity: 0.3,
    isUserInteracting: false
  })
  
  const radius = 4
  const itemHeight = 1
  
  useFrame((state, delta) => {
    // Update physics
    const physics = physicsRef.current
    physics.targetVelocity = targetVelocity
    
    if (!physics.isUserInteracting) {
      const diff = physics.targetVelocity - physics.angularVelocity
      physics.angularVelocity += diff * delta * 2
    }
    physics.rotation += physics.angularVelocity * delta
    
    // Apply rotation to carousel
    if (carouselRef.current) {
      carouselRef.current.rotation.y = physics.rotation
    }
  })
  
  // Handle click events
  useEffect(() => {
    const handleCanvasClick = (event) => {
      // Simple click detection
      const rect = gl.domElement.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      // Calculate which item was clicked based on angle
      const mouse = new THREE.Vector2(x, y)
      const angle = Math.atan2(mouse.x, mouse.y) + Math.PI
      const carouselRotation = physicsRef.current.rotation
      const adjustedAngle = (angle - carouselRotation) % (Math.PI * 2)
      const normalizedAngle = adjustedAngle < 0 ? adjustedAngle + Math.PI * 2 : adjustedAngle
      const clickedIndex = Math.round((normalizedAngle / (Math.PI * 2)) * items.length) % items.length
      
      if (mouse.length() < 1.5) { // Click within carousel area
        onItemClick(clickedIndex)
      }
    }
    
    gl.domElement.addEventListener('click', handleCanvasClick)
    return () => gl.domElement.removeEventListener('click', handleCanvasClick)
  }, [gl, items.length, onItemClick])

  return (
    <>
      {/* Environment and lighting */}
      <Environment preset="warehouse" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#d4af37" />
      <fog attach="fog" args={['#1a2b2b', 15, 40]} />
      
      {/* Main carousel structure */}
      <group ref={carouselRef}>
        {/* Central support pole */}
        <CentralPole height={6} />
        
        {/* Carousel platform */}
        <CarouselPlatform radius={radius + 1} thickness={0.3} />
        
        {/* Support arms */}
        {items.map((_, index) => {
          const angle = (index / items.length) * Math.PI * 2
          return (
            <SupportArm
              key={`arm-${index}`}
              angle={angle}
              radius={radius}
              itemHeight={itemHeight}
            />
          )
        })}
        
        {/* Carousel lighting system */}
        <CarouselLighting radius={radius} count={6} />
        
        {/* Carousel items */}
        {items.map((item, index) => {
          const angle = (index / items.length) * Math.PI * 2
          const x = Math.sin(angle) * radius
          const z = Math.cos(angle) * radius
          const position = [x, itemHeight, z]
          
          return (
            <group key={item.type} position={position}>
              <AdvancedCarouselItem
                ref={el => itemRefs.current[index] = el}
                type={item.type}
                position={[0, 0, 0]} // Position relative to the group
                isActive={activeIndex === index}
              />
              
              <CarouselLabel
                text={item.title}
                position={[0, -1.8, 0]} // Position relative to the group
                isActive={activeIndex === index}
              />
            </group>
          )
        })}
      </group>
    </>
  )
}

// 3D Title component
const Advanced3DTitle = () => {
  const titleRef = useRef()
  
  useFrame((state) => {
    if (titleRef.current) {
      // Subtle floating animation
      titleRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      
      // Gentle rotation
      titleRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    }
  })
  
  return (
    <group ref={titleRef}>
      <Center>
        <Text
          fontSize={1.2}
          color="#d4af37"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          outlineWidth={0.05}
          outlineColor="#2c3e3e"
        >
          sundai
        </Text>
      </Center>
    </group>
  )
}

// Main component
const AdvancedHomepageCarousel = ({ onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [showInfo, setShowInfo] = useState(false)
  const [performanceSettings, setPerformanceSettings] = useState({ quality: 'high', dpr: 2 })
  const [targetVelocity, setTargetVelocity] = useState(0.3)

  const carouselItems = [
    {
      title: "Projects",
      type: "projects",
      description: "Explore my portfolio of innovative solutions including AI-powered platforms, mobile applications, and enterprise integrations.",
      route: "projects"
    },
    {
      title: "Contact",
      type: "contact", 
      description: "Get in touch to discuss your next project, collaboration opportunities, or technical consultations.",
      route: "contact"
    },
    {
      title: "Consulting",
      type: "consulting",
      description: "Strategic technology consulting for digital transformation, AI implementation, and system optimization.",
      route: "consulting"
    }
  ]

  const handleItemClick = (index) => {
    setActiveIndex(index)
    setShowInfo(true)
    
    // Slow down carousel when item selected
    setTargetVelocity(0.1)
  }

  const handleEnter = () => {
    if (activeIndex >= 0) {
      const route = carouselItems[activeIndex].route
      onNavigate(route)
    }
  }

  const handleClose = () => {
    setActiveIndex(-1)
    setShowInfo(false)
    
    // Resume normal carousel speed
    setTargetVelocity(0.3)
  }

  // Auto-resume after 8 seconds
  useEffect(() => {
    if (showInfo) {
      const timer = setTimeout(() => {
        handleClose()
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [showInfo])

  return (
    <div className="homepage">
      {/* 3D Title */}
      <div className="title-3d">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={performanceSettings.dpr}
        >
          <PerformanceOptimizer onPerformanceChange={setPerformanceSettings} />
          <Advanced3DTitle />
        </Canvas>
      </div>
      
      {/* Main Carousel */}
      <div className="carousel-container">
        <Canvas 
          camera={{ position: [0, 4, 12], fov: 50 }}
          shadows
          dpr={performanceSettings.dpr}
          gl={{ 
            antialias: performanceSettings.quality === 'high',
            alpha: false,
            powerPreference: 'high-performance'
          }}
        >
          <PerformanceOptimizer onPerformanceChange={setPerformanceSettings} />
          <AdvancedCarouselScene
            items={carouselItems}
            activeIndex={activeIndex}
            onItemClick={handleItemClick}
            targetVelocity={targetVelocity}
          />
          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            maxDistance={20}
            minDistance={8}
            zoomSpeed={0.5}
            rotateSpeed={0.3}
          />
        </Canvas>
        
        {!showInfo && (
          <div className="subtitle">
            Drag to spin • Click to explore
          </div>
        )}
      </div>

      {/* Info Panel */}
      {showInfo && activeIndex >= 0 && (
        <div className="info-panel show">
          <h3>{carouselItems[activeIndex].title}</h3>
          <p>{carouselItems[activeIndex].description}</p>
          <div className="panel-buttons">
            <button className="enter-btn" onClick={handleEnter}>
              Enter
            </button>
            <button className="close-btn" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedHomepageCarousel