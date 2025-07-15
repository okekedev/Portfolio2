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

  // Gold flakes animation
  goldFlakesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1
  },

  goldFlake: {
    position: 'absolute',
    background: '#d4af37',
    borderRadius: '50%',
    opacity: 0.4,
    animation: 'float 8s infinite ease-in-out'
  },

  // Hamburger menu styles (always visible)
  hamburgerMenuButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 20,
    background: 'rgba(44, 62, 62, 0.95)', // Increased opacity
    border: '1px solid #d4af37',
    borderRadius: '8px',
    padding: '12px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
  },

  hamburgerMenuButtonHover: {
    background: 'rgba(212, 175, 55, 0.3)', // Increased opacity
    transform: 'scale(1.05)',
    boxShadow: '0 6px 16px rgba(212, 175, 55, 0.3)'
  },

  hamburgerLine: {
    width: '20px',
    height: '2px',
    backgroundColor: '#d4af37',
    margin: '2px 0',
    transition: 'all 0.3s ease',
    borderRadius: '1px'
  },

  menuOverlay: {
    position: 'absolute',
    top: '0',
    right: '0',
    width: '100vw',
    height: '100vh',
    background: 'rgba(26, 43, 43, 0.95)',
    zIndex: 19,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    animation: 'fadeIn 0.3s ease'
  },

  menuItem: {
    padding: '20px 40px',
    margin: '10px 0',
    fontSize: '1.8rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    cursor: 'pointer',
    textAlign: 'center',
    border: '1px solid transparent',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    minWidth: '200px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
  },

  menuItemHover: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    border: '1px solid #d4af37',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
  },

  menuTitle: {
    fontSize: '2.5rem',
    color: '#d4af37',
    fontFamily: '"Great Vibes", cursive',
    marginBottom: '40px',
    textAlign: 'center',
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)'
  },

  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '2rem',
    color: '#d4af37',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(44, 62, 62, 0.8)',
    border: '1px solid #d4af37',
    transition: 'all 0.3s ease'
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

// Gold Flakes Animation Component
const GoldFlakes = () => {
  const [flakes, setFlakes] = useState([])

  useEffect(() => {
    const generateFlakes = () => {
      const newFlakes = []
      for (let i = 0; i < 40; i++) { // More flakes than contact page
        newFlakes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 5 + 1.5, // Slightly larger range
          delay: Math.random() * 8,
          duration: Math.random() * 4 + 6, // Slower floating
          direction: Math.random() > 0.5 ? 1 : -1 // Random direction
        })
      }
      setFlakes(newFlakes)
    }

    generateFlakes()
  }, [])

  return (
    <div style={styles.goldFlakesContainer}>
      {flakes.map(flake => (
        <div
          key={flake.id}
          style={{
            ...styles.goldFlake,
            left: `${flake.x}%`,
            top: `${flake.y}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`
          }}
        />
      ))}
      <style>
        {`
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) translateX(0px) rotate(0deg); 
              opacity: 0.3; 
            }
            25% { 
              transform: translateY(-25px) translateX(10px) rotate(90deg); 
              opacity: 0.6; 
            }
            50% { 
              transform: translateY(-15px) translateX(-5px) rotate(180deg); 
              opacity: 0.8; 
            }
            75% { 
              transform: translateY(-35px) translateX(15px) rotate(270deg); 
              opacity: 0.5; 
            }
          }
        `}
      </style>
    </div>
  )
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

// Menu Overlay Component
const MenuOverlay = ({ isOpen, onClose, items, onNavigate }) => {
  const [hoveredItem, setHoveredItem] = useState(null)

  if (!isOpen) return null

  const handleItemClick = (route) => {
    onNavigate(route)
    onClose()
  }

  return (
    <div style={styles.menuOverlay}>
      {/* Close button */}
      <div 
        style={styles.closeButton}
        onClick={onClose}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(212, 175, 55, 0.2)'
          e.target.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(44, 62, 62, 0.8)'
          e.target.style.transform = 'scale(1)'
        }}
      >
        ×
      </div>

      {/* Menu title */}
      <div style={styles.menuTitle}>Navigation</div>

      {/* Menu items */}
      {items.map((item, index) => (
        <div
          key={item.route}
          style={{
            ...styles.menuItem,
            ...(hoveredItem === index ? styles.menuItemHover : {})
          }}
          onClick={() => handleItemClick(item.route)}
          onMouseEnter={() => setHoveredItem(index)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {item.title}
        </div>
      ))}
    </div>
  )
}

// Hamburger Menu Button Component (always visible)
const HamburgerMenuButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      style={{
        ...styles.hamburgerMenuButton,
        ...(isHovered ? styles.hamburgerMenuButtonHover : {})
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div style={styles.hamburgerLine}></div>
      <div style={styles.hamburgerLine}></div>
      <div style={styles.hamburgerLine}></div>
    </div>
  )
}

// Invisible clickable box component
const ClickableBox = ({ position, size, onItemClick, index, activeIndex }) => {
  const meshRef = useRef()
  
  // Create invisible material that doesn't interfere with rendering
  const invisibleMaterial = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({ 
      transparent: true, 
      opacity: 0,
      visible: true,
      // Ensure it doesn't write to depth buffer to avoid z-fighting
      depthWrite: false,
      // Render after other objects
      renderOrder: 1000
    })
    return material
  }, [])

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onItemClick(index)
      }}
      onPointerOver={(e) => {
        document.body.style.cursor = 'pointer'
        e.stopPropagation()
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = 'auto'
        e.stopPropagation()
      }}
      // Ensure the mesh is behind the text
      renderOrder={-1}
    >
      <boxGeometry args={size} />
      <primitive object={invisibleMaterial} />
    </mesh>
  )
}

// Optimized GLB Carousel Model Component
const CarouselGLBModel = ({ url = '/carousel.glb', items, activeIndex, onItemClick }) => {
  const gltf = useLoader(GLTFLoader, url)
  const modelRef = useRef()

  useFrame((state) => {
    if (modelRef.current) {
      // Gentle rotation
      modelRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

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

  return (
    <group ref={modelRef} position={[.2, -.2, 0]}>
      {/* The carousel model - no click handlers here */}
      <primitive object={gltf.scene} scale={[2, 2, 2]} />
      
      {/* Text labels with invisible clickable boxes */}
      {items.map((item, index) => {
        const angle = (index / items.length) * Math.PI * 2
        const radius = 1.6 // Same radius as before
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
        
        // Make text face outward from carousel center
        const yRotation = angle
        
        // Split title into individual characters and stack them vertically
        const characters = item.title.split('')
        const totalHeight = characters.length * 0.16 // Character spacing
        const startY = totalHeight / 4 // Center the stack
        
        // Calculate box size based on text dimensions
        const boxWidth = 0.4  // Increased width of clickable area
        const boxHeight = totalHeight + 0.6  // Height including more padding
        const boxDepth = 0.1  // Slightly deeper clickable area
        
        return (
          <group key={item.title} position={[x, 0, z]} rotation={[0, yRotation, 0]}>
            {/* Text characters - render these first */}
            {characters.map((char, charIndex) => (
              <Text
                key={charIndex}
                position={[0, startY - (charIndex * 0.16), 0.1]} // Moved text slightly forward
                rotation={[0, 0, 0]}
                fontSize={0.17}
                color={activeIndex === index ? "#ffd700" : "#d4af37"}
                fontFamily="serif"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.008}
                outlineColor="#2c3e3e"
                // Ensure text renders on top
                renderOrder={100}
              >
                {char}
              </Text>
            ))}
            
            {/* Invisible clickable box positioned behind the text */}
            <ClickableBox
              position={[0, startY - (totalHeight / 2), 0]} // Positioned at text center
              size={[boxWidth, boxHeight, boxDepth]}
              onItemClick={onItemClick}
              index={index}
              activeIndex={activeIndex}
            />
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
  const [menuOpen, setMenuOpen] = useState(false)
  
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

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
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
      {/* Gold Flakes Background Animation */}
      <GoldFlakes />

      {/* Always Visible Hamburger Menu Button */}
      <HamburgerMenuButton onClick={toggleMenu} />

      {/* Menu Overlay */}
      <MenuOverlay
        isOpen={menuOpen}
        onClose={closeMenu}
        items={carouselItems}
        onNavigate={onNavigate}
      />

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
        Click sections to navigate
      </div>
    </div>
  )
}

export default AdvancedHomepageCarousel