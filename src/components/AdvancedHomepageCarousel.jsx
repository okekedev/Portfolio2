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
    maxHeight: '100vh',
    maxWidth: '100vw',
    background: 'linear-gradient(135deg, #2c3e3e 0%, #1a2b2b 100%)',
    color: '#f5f3f0',
    fontFamily: '"Dancing Script", "Great Vibes", "Pacifico", cursive, sans-serif',
    overflow: 'hidden',
    overflowX: 'hidden',
    overflowY: 'hidden',
    position: 'relative',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
  },
  
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block'
  },

  // Gold flakes animation
  goldFlakesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1,
    overflow: 'hidden'
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
    background: 'rgba(44, 62, 62, 0.95)',
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
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    boxSizing: 'border-box'
  },

  hamburgerMenuButtonHover: {
    background: 'rgba(212, 175, 55, 0.3)',
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
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(26, 43, 43, 0.95)',
    zIndex: 19,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    animation: 'fadeIn 0.3s ease',
    overflow: 'hidden',
    boxSizing: 'border-box'
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
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
    boxSizing: 'border-box'
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
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
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
    userSelect: 'none',
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box'
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
    bottom: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '0.8rem',
    color: '#d4af37',
    opacity: 0.5,
    textAlign: 'center',
    pointerEvents: 'none',
    fontFamily: '"Great Vibes", cursive',
    fontWeight: '100',
    letterSpacing: '0.04em',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
    zIndex: 10,
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box'
  },
  
  // Mobile styles
  mobile: {
    titleContainer: {
      top: '8%',
      padding: '0 20px'
    },
    mainTitle: {
      fontSize: '2.5rem'
    },
    authorName: {
      fontSize: '1rem'
    },
    subtitle: {
      fontSize: '0.9rem',
      bottom: '60px',
      padding: '0 1rem'
    },
    menuItem: {
      padding: '15px 30px',
      fontSize: '1.5rem',
      minWidth: '160px'
    },
    menuTitle: {
      fontSize: '2rem'
    }
  }
}

// Gold Flakes Animation Component
const GoldFlakes = () => {
  const [flakes, setFlakes] = useState([])

  useEffect(() => {
    const generateFlakes = () => {
      const newFlakes = []
      for (let i = 0; i < 40; i++) {
        newFlakes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 5 + 1.5,
          delay: Math.random() * 8,
          duration: Math.random() * 4 + 6,
          direction: Math.random() > 0.5 ? 1 : -1
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
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100vh;
            width: 100vw;
            max-height: 100vh;
            max-width: 100vw;
          }
          
          #root {
            margin: 0;
            padding: 0;
            overflow: hidden;
            height: 100vh;
            width: 100vw;
          }
          
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
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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
  const { isMobile } = useResponsiveStyles()

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
      <div style={{
        ...styles.menuTitle,
        ...(isMobile ? styles.mobile.menuTitle : {})
      }}>
        Navigation
      </div>

      {/* Menu items */}
      {items.map((item, index) => (
        <div
          key={item.route}
          style={{
            ...styles.menuItem,
            ...(isMobile ? styles.mobile.menuItem : {}),
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
const ClickableBox = ({ position, size, onItemClick, onItemHover, index, activeIndex, hoveredIndex }) => {
  const meshRef = useRef()
  
  // Create invisible material that doesn't interfere with rendering
  const invisibleMaterial = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({ 
      transparent: true, 
      opacity: 0,
      visible: true,
      depthWrite: false
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
        if (onItemHover) onItemHover(index, true)
        e.stopPropagation()
      }}
      onPointerOut={(e) => {
        document.body.style.cursor = 'auto'
        if (onItemHover) onItemHover(index, false)
        e.stopPropagation()
      }}
    >
      <boxGeometry args={size} />
      <primitive object={invisibleMaterial} />
    </mesh>
  )
}

// Enhanced Carousel Model with Smooth Animation Controls
const CarouselGLBModel = ({ url = '/carousel.glb', items, activeIndex, hoveredIndex, onItemClick, onItemHover }) => {
  const gltf = useLoader(GLTFLoader, url)
  const modelRef = useRef()
  
  // Enhanced rotation control states
  const rotationSpeed = useRef(0)         // Current rotation speed
  const targetSpeed = useRef(0)           // Target rotation speed
  const isInitializing = useRef(true)     // Flag for initial sequence
  const initialStartTime = useRef(0)      // Start time for timing calculations
  
  // Animation phases
  const PHASES = {
    FAST_SPIN: 'fast_spin',      // Initial fast spinning (3 full rotations)
    SLOW_DOWN: 'slow_down',      // Dramatic slowdown
    NORMAL: 'normal'             // Normal hover-responsive operation
  }
  
  const [currentPhase, setCurrentPhase] = useState(PHASES.FAST_SPIN)

  useFrame((state, delta) => {
    if (!modelRef.current) return
    
    const elapsedTime = state.clock.elapsedTime
    
    // Initialize start time on first frame
    if (initialStartTime.current === 0) {
      initialStartTime.current = elapsedTime
    }
    
    const timeSinceStart = elapsedTime - initialStartTime.current
    
    // Phase management and speed calculation
    if (currentPhase === PHASES.FAST_SPIN) {
      // Fast initial spin - 3 full rotations in 2.5 seconds
      const fastSpinDuration = .5
      const rotationsPerSecond = 3 / fastSpinDuration // 3 rotations in 2.5 seconds
      targetSpeed.current = rotationsPerSecond * Math.PI * 2 // Convert to radians per second
      
      if (timeSinceStart >= fastSpinDuration) {
        setCurrentPhase(PHASES.SLOW_DOWN)
      }
    } 
    else if (currentPhase === PHASES.SLOW_DOWN) {
      // Dramatic slowdown over 1.5 seconds with smooth easing
      const slowDownStart = 1
      const slowDownDuration = 1.5
      const slowDownElapsed = timeSinceStart - slowDownStart
      
      if (slowDownElapsed >= slowDownDuration) {
        setCurrentPhase(PHASES.NORMAL)
        targetSpeed.current = 0.3 // Normal speed
      } else {
        // Smooth cubic ease-out from fast to normal speed
        const progress = slowDownElapsed / slowDownDuration
        const easedProgress = 1 - Math.pow(1 - progress, 3)
        const fastSpeed = 3 / 2.5 * Math.PI * 2
        const normalSpeed = 0.3
        targetSpeed.current = fastSpeed - (fastSpeed - normalSpeed) * easedProgress
      }
    } 
    else { // NORMAL phase
      // Normal operation - responsive to hover
      if (hoveredIndex !== undefined && hoveredIndex !== -1) {
        targetSpeed.current = 0 // Stop on hover
      } else {
        targetSpeed.current = 0.3 // Normal rotation speed
      }
    }
    
    // Smooth interpolation to target speed
    const lerpFactor = currentPhase === PHASES.NORMAL ? 0.05 : 0.02 // Slower lerp during initial sequence
    rotationSpeed.current += (targetSpeed.current - rotationSpeed.current) * lerpFactor
    
    // Apply rotation
    modelRef.current.rotation.y += rotationSpeed.current * delta
  })

  useEffect(() => {
    if (gltf?.scene) {
      // Optimize materials and setup shadows
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          if (child.material) {
            child.material.needsUpdate = false
          }
        }
      })
    }
  }, [gltf])

  // Reset animation when component mounts
  useEffect(() => {
    setCurrentPhase(PHASES.FAST_SPIN)
    rotationSpeed.current = 0
    targetSpeed.current = 0
    initialStartTime.current = 0
    isInitializing.current = true
  }, [])

  if (!gltf?.scene) {
    return null
  }

  return (
    <group ref={modelRef} position={[0, -.2, 0]}>
      {/* The carousel model */}
      <primitive object={gltf.scene} scale={[2, 2, 2]} />
      
      {/* Text labels with enhanced hover effects */}
      {items.map((item, index) => {
        const angle = (index / items.length) * Math.PI * 2
        const radius = 1.6
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
        const yRotation = angle
        
        const characters = item.title.split('')
        const totalHeight = characters.length * 0.16
        const startY = totalHeight / 4
        
        const boxWidth = 0.4
        const boxHeight = totalHeight + 0.6
        const boxDepth = 0.1
        
        const isHovered = hoveredIndex === index
        
        return (
          <group key={item.title} position={[x, 0, z]} rotation={[0, yRotation, 0]}>
            {/* Enhanced glow effect when hovered */}
            {isHovered && (
              <>
                {/* Outer glow */}
                <mesh position={[0, startY - (totalHeight / 2), -0.01]}>
                  <boxGeometry args={[boxWidth * 1.4, boxHeight * 1.2, 0.01]} />
                  <meshBasicMaterial 
                    color="#d4af37" 
                    transparent 
                    opacity={0.1}
                    blending={THREE.AdditiveBlending}
                  />
                </mesh>
                {/* Inner glow */}
                <mesh position={[0, startY - (totalHeight / 2), 0]}>
                  <boxGeometry args={[boxWidth * 1.1, boxHeight * 1.05, 0.02]} />
                  <meshBasicMaterial 
                    color="#f4d03f" 
                    transparent 
                    opacity={0.2}
                    blending={THREE.AdditiveBlending}
                  />
                </mesh>
              </>
            )}
            
            {/* Text characters with smooth hover transitions */}
            {characters.map((char, charIndex) => (
              <Text
                key={charIndex}
                position={[0, startY - (charIndex * 0.16), 0.1]}
                rotation={[0, 0, 0]}
                fontSize={isHovered ? 0.19 : 0.17} // Slightly larger when hovered
                color={isHovered ? "#f4d03f" : "#d4af37"}
                fontFamily="serif"
                anchorX="center"
                anchorY="middle"
                outlineWidth={isHovered ? 0.012 : 0.008}
                outlineColor="#2c3e3e"
                renderOrder={100}
              >
                {char}
              </Text>
            ))}
            
            {/* Clickable area */}
            <ClickableBox
              position={[0, startY - (totalHeight / 2), 0]}
              size={[boxWidth, boxHeight, boxDepth]}
              onItemClick={onItemClick}
              onItemHover={onItemHover}
              index={index}
              activeIndex={activeIndex}
              hoveredIndex={hoveredIndex}
            />
          </group>
        )
      })}
    </group>
  )
}

// Main 3D Scene
const MainScene = ({ items, activeIndex, hoveredIndex, onItemClick, onItemHover }) => {
  return (
    <>
      {/* Enhanced lighting for better visual effects */}
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
      {/* Additional rim lighting for hover effects */}
      <pointLight position={[10, 5, 10]} intensity={0.3} color="#daa520" />
      
      <React.Suspense fallback={null}>
        <CarouselGLBModel 
          items={items}
          activeIndex={activeIndex}
          hoveredIndex={hoveredIndex}
          onItemClick={onItemClick}
          onItemHover={onItemHover}
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
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [performanceSettings, setPerformanceSettings] = useState({ 
    quality: 'high', 
    dpr: Math.min(window.devicePixelRatio, 2) 
  })
  const [menuOpen, setMenuOpen] = useState(false)
  
  const { isMobile } = useResponsiveStyles()

  // Memoize carousel items
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

  const handleItemHover = useCallback((index, isHovering) => {
    setHoveredIndex(isHovering ? index : -1)
  }, [])

  const handlePerformanceChange = useCallback((settings) => {
    setPerformanceSettings(settings)
  }, [])

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
  }, [])

  // Camera settings
  const cameraSettings = useMemo(() => ({
    position: [6, -.5, 0],
    fov: isMobile ? 80 : 50
  }), [isMobile])

  // Responsive styles
  const titleContainerStyles = {
    ...styles.titleContainer,
    ...(isMobile ? styles.mobile.titleContainer : {})
  }
  
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

      {/* Hamburger Menu */}
      <HamburgerMenuButton onClick={toggleMenu} />

      {/* Menu Overlay */}
      <MenuOverlay
        isOpen={menuOpen}
        onClose={closeMenu}
        items={carouselItems}
        onNavigate={onNavigate}
      />

      {/* Title Section */}
      <div style={titleContainerStyles}>
        <h1 style={titleStyles}>Sundai</h1>
        <div style={styles.separator}></div>
        <p style={authorStyles}>By Christian Okeke</p>
      </div>
      
      {/* 3D Canvas */}
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
          hoveredIndex={hoveredIndex}
          onItemClick={handleItemClick}
          onItemHover={handleItemHover}
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
      
      {/* Instructions */}
      <div style={subtitleStyle}>
        Hover to pause • Click sections to navigate
      </div>
    </div>
  )
}

export default AdvancedHomepageCarousel