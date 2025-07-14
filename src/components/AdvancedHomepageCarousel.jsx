import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { Text, OrbitControls, PerformanceMonitor } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

// All styling contained within this component
const styles = {
  homepage: {
    height: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #2c3e3e 0%, #1a2b2b 100%)',
    color: '#f5f3f0',
    fontFamily: '"Dancing Script", "Great Vibes", "Pacifico", cursive, sans-serif',
    overflow: 'hidden',
    position: 'relative'
  },
  
  canvas: {
    width: '100%',
    height: '100%'
  },
  
  // Title and subtitle positioned above 3D area
  titleContainer: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
    zIndex: 10,
    pointerEvents: 'none',
    userSelect: 'none'
  },
  
  mainTitle: {
    fontSize: '4rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '400',
    letterSpacing: '0.04em',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
    margin: 0,
    marginBottom: '10px',
    opacity: 0.95
  },
  
  separator: {
    width: '150px',
    height: '1px',
    backgroundColor: '#d4af37',
    margin: '20px auto',
    opacity: 0.6,
    boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
  },
  
  authorName: {
    fontSize: '1.0rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '200',
    letterSpacing: '0.2em',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
    margin: 0,
    opacity: 0.8
  },
  
  subtitle: {
    position: 'absolute',
    bottom: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '.8rem',
    color: '#d4af37',
    opacity: 0.5,
    textAlign: 'center',
    pointerEvents: 'none',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '100',
    letterSpacing: '0.04em',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
    zIndex: 10
  },
  
  // Mobile styles
  mobile: {
    mainTitle: {
      fontSize: '2.5rem'
    },
    authorName: {
      fontSize: '1rem'
    },
    subtitle: {
      fontSize: '1.1rem',
      bottom: '40px',
      padding: '0 1rem'
    }
  }
}

// Hook for responsive styles
const useResponsiveStyles = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  
  return { isMobile }
}

// Optimized GLB Carousel Model Component
const CarouselGLBModel = ({ url = '/carousel.glb', items, activeIndex, onItemClick }) => {
  const gltf = useLoader(GLTFLoader, url)
  const modelRef = useRef()
  const { camera, gl } = useThree()
  
  // Memoize raycaster and mouse to avoid recreating
  const raycastData = useMemo(() => ({
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2()
  }), [])

  useFrame((state) => {
    if (modelRef.current) {
      // Gentle rotation
      modelRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  // Optimized click handler with proper raycasting
  const handleClick = useCallback((event) => {
    if (!modelRef.current) return
    
    const rect = gl.domElement.getBoundingClientRect()
    raycastData.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    raycastData.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    
    raycastData.raycaster.setFromCamera(raycastData.mouse, camera)
    const intersects = raycastData.raycaster.intersectObjects(modelRef.current.children, true)
    
    if (intersects.length > 0) {
      // Simple angle-based section detection
      const angle = Math.atan2(raycastData.mouse.x, raycastData.mouse.y) + Math.PI
      const normalizedAngle = angle / (Math.PI * 2)
      const clickedIndex = Math.floor(normalizedAngle * items.length) % items.length
      onItemClick(clickedIndex)
    }
  }, [camera, gl, items.length, onItemClick, raycastData])

  useEffect(() => {
    if (gltf.scene) {
      // Optimize materials and setup shadows
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          // Optimize materials for performance
          if (child.material) {
            child.material.needsUpdate = false
          }
        }
      })
    }
  }, [gltf])

  useEffect(() => {
    gl.domElement.addEventListener('click', handleClick)
    return () => gl.domElement.removeEventListener('click', handleClick)
  }, [gl, handleClick])

  return (
    <group ref={modelRef} position={[.2, -.2, 0]}>
      <primitive object={gltf.scene} scale={[2, 2, 2]} />
      
      {/* Text labels positioned closer to carousel elements with stacked characters */}
      {items.map((item, index) => {
        const angle = (index / items.length) * Math.PI * 2
        const radius = 1.7 // Moved closer to carousel
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
        
        // Make text face outward from carousel center
        const yRotation = angle
        
        // Split title into individual characters and stack them vertically
        const characters = item.title.split('')
        const totalHeight = characters.length * 0.08 // Decreased spacing between characters
        const startY = totalHeight / 4 // Center the stack
        
        return (
          <group key={item.title} position={[x, 0, z]} rotation={[0, yRotation, 0]}>
            {characters.map((char, charIndex) => (
              <Text
                key={charIndex}
                position={[0, startY - (charIndex * 0.16), 0]}
                rotation={[0, 0, 0]}
                fontSize={0.17}
                color={activeIndex === index ? "#ffd700" : "#d4af37"}
                fontFamily="serif"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.01}
                outlineColor="#2c3e3e"
                onClick={() => onItemClick(index)}
              >
                {char}
              </Text>
            ))}
          </group>
        )
      })}
    </group>
  )
}

// Main 3D Scene with just the carousel (no 3D title)
const MainScene = ({ items, activeIndex, onItemClick }) => {
  return (
    <>
      {/* Optimized lighting setup */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.0} 
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.6} color="#d4af37" />
      
      <React.Suspense fallback={null}>
        {/* Only the carousel model - title is now HTML */}
        <CarouselGLBModel 
          items={items}
          activeIndex={activeIndex}
          onItemClick={onItemClick}
        />
      </React.Suspense>
    </>
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

// Main component
const AdvancedHomepageCarousel = ({ onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [performanceSettings, setPerformanceSettings] = useState({ 
    quality: 'high', 
    dpr: Math.min(window.devicePixelRatio, 2) 
  })
  
  const { isMobile } = useResponsiveStyles()

  // Memoize carousel items to prevent unnecessary re-renders
  const carouselItems = useMemo(() => [
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
      title: "About",
      type: "about",
      description: "Learn about my background, experience, and passion for creating technology solutions that make a difference.",
      route: "about"
    },
    {
      title: "Consult",
      type: "consulting",
      description: "Strategic technology consulting for digital transformation, AI implementation, and system optimization.",
      route: "consulting"
    }
  ], [])

  const handleItemClick = useCallback((index) => {
    setActiveIndex(index)
    const route = carouselItems[index].route
    onNavigate(route)
  }, [carouselItems, onNavigate])

  const handlePerformanceChange = useCallback((settings) => {
    setPerformanceSettings(settings)
  }, [])

  // Memoize camera settings - positioned to see the carousel
  const cameraSettings = useMemo(() => ({
    position: [6, -.5, 0],
    fov: isMobile ? 80 : 50
  }), [isMobile])

  // Get responsive styles
  const titleStyles = {
    ...styles.mainTitle,
    ...(isMobile ? styles.mobile.mainTitle : {})
  }
  
  const authorStyles = {
    ...styles.authorName,
    ...(isMobile ? styles.mobile.authorName : {})
  }
  
  const subtitleStyle = {
    ...styles.subtitle,
    ...(isMobile ? styles.mobile.subtitle : {})
  }

  return (
    <div style={styles.homepage}>
      {/* HTML Title and Author positioned above 3D area */}
      <div style={styles.titleContainer}>
        <h1 style={titleStyles}>
          Sundai
        </h1>
        <div style={styles.separator}></div>
        <p style={authorStyles}>
          By Christian Okeke
        </p>
      </div>
      
      {/* 3D Canvas with just the carousel */}
      <Canvas 
        camera={cameraSettings}
        shadows={performanceSettings.quality === 'high'}
        dpr={performanceSettings.dpr}
        style={styles.canvas}
        gl={{ 
          antialias: performanceSettings.quality === 'high',
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
      >
        <PerformanceOptimizer onPerformanceChange={handlePerformanceChange} />
        <MainScene
          items={carouselItems}
          activeIndex={activeIndex}
          onItemClick={handleItemClick}
        />
        <OrbitControls 
          enablePan={false} 
          enableZoom={false}
          enableRotate={true}
          autoRotate={false}
          maxPolarAngle={Math.PI * 0.8}
          minPolarAngle={Math.PI * 0.2}
          maxDistance={15}
          minDistance={5}
          zoomSpeed={0.5}
          rotateSpeed={0.5}
          dampingFactor={0.05}
          enableDamping={true}
          target={[0, 0, 0]}
        />
      </Canvas>
      
      {/* Instruction text at bottom */}
      <div style={subtitleStyle}>
        Drag to explore • Click sections to navigate
      </div>
    </div>
  )
}

export default AdvancedHomepageCarousel