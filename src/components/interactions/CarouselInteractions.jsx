import React, { useRef, useCallback, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function useCarouselInteractions(physics, onItemSelect) {
  const { gl, camera } = useThree()
  const interactionState = useRef({
    isDragging: false,
    isTouch: false,
    lastPosition: new THREE.Vector2(),
    velocity: new THREE.Vector2(),
    velocityHistory: [],
    lastTime: 0,
    activePointers: new Map()
  })

  // Calculate touch velocity for momentum
  const calculateVelocity = useCallback((currentPos, currentTime) => {
    const state = interactionState.current
    const deltaTime = currentTime - state.lastTime
    
    if (deltaTime > 0) {
      const deltaX = currentPos.x - state.lastPosition.x
      const velocity = deltaX / deltaTime
      
      state.velocityHistory.push({ velocity, time: currentTime })
      
      // Keep only recent history
      const cutoff = currentTime - 100
      state.velocityHistory = state.velocityHistory.filter(v => v.time > cutoff)
      
      // Calculate average velocity from recent history
      if (state.velocityHistory.length > 0) {
        const avgVelocity = state.velocityHistory.reduce((sum, v) => sum + v.velocity, 0) / state.velocityHistory.length
        state.velocity.x = avgVelocity
        physics?.addTouchVelocity(avgVelocity * 10) // Scale for carousel
      }
    }
    
    state.lastPosition.copy(currentPos)
    state.lastTime = currentTime
  }, [physics])

  // Mouse events
  const handleMouseDown = useCallback((event) => {
    const state = interactionState.current
    state.isDragging = true
    state.isTouch = false
    state.lastPosition.set(event.clientX, event.clientY)
    state.lastTime = performance.now()
    state.velocityHistory = []
    
    gl.domElement.style.cursor = 'grabbing'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [gl])

  const handleMouseMove = useCallback((event) => {
    const state = interactionState.current
    if (!state.isDragging) return
    
    const currentPos = new THREE.Vector2(event.clientX, event.clientY)
    const currentTime = performance.now()
    
    calculateVelocity(currentPos, currentTime)
    
    // Apply force to physics
    const deltaX = currentPos.x - state.lastPosition.x
    physics?.applyUserForce(deltaX * 0.01, 0.016) // Assume 60fps
  }, [physics, calculateVelocity])

  const handleMouseUp = useCallback(() => {
    const state = interactionState.current
    state.isDragging = false
    
    gl.domElement.style.cursor = 'grab'
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [gl])

  // Touch events for mobile
  const handleTouchStart = useCallback((event) => {
    event.preventDefault()
    const state = interactionState.current
    state.isTouch = true
    
    // Handle multiple touches
    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i]
      state.activePointers.set(touch.identifier, {
        x: touch.clientX,
        y: touch.clientY,
        time: performance.now()
      })
    }
    
    if (event.touches.length === 1) {
      // Single touch - rotation
      const touch = event.touches[0]
      state.isDragging = true
      state.lastPosition.set(touch.clientX, touch.clientY)
      state.lastTime = performance.now()
      state.velocityHistory = []
    }
  }, [])

  const handleTouchMove = useCallback((event) => {
    event.preventDefault()
    const state = interactionState.current
    
    if (event.touches.length === 1 && state.isDragging) {
      // Single touch rotation
      const touch = event.touches[0]
      const currentPos = new THREE.Vector2(touch.clientX, touch.clientY)
      const currentTime = performance.now()
      
      calculateVelocity(currentPos, currentTime)
      
      const deltaX = currentPos.x - state.lastPosition.x
      physics?.applyUserForce(deltaX * 0.01, 0.016)
    } else if (event.touches.length === 2) {
      // Pinch to zoom (could be used for camera distance)
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )
      
      // Store initial distance for comparison
      if (!state.initialPinchDistance) {
        state.initialPinchDistance = distance
      }
      
      const scale = distance / state.initialPinchDistance
      // Could modify camera position based on scale
    }
  }, [physics, calculateVelocity])

  const handleTouchEnd = useCallback((event) => {
    const state = interactionState.current
    
    // Remove ended touches
    const activeTouchIds = Array.from(event.touches).map(t => t.identifier)
    for (const [id] of state.activePointers) {
      if (!activeTouchIds.includes(id)) {
        state.activePointers.delete(id)
      }
    }
    
    if (event.touches.length === 0) {
      state.isDragging = false
      state.initialPinchDistance = null
    }
  }, [])

  // Wheel events for desktop
  const handleWheel = useCallback((event) => {
    event.preventDefault()
    const force = event.deltaY * 0.001
    physics?.applyUserForce(force, 0.016)
  }, [physics])

  // Set up event listeners
  useEffect(() => {
    const canvas = gl.domElement
    
    // Mouse events
    canvas.addEventListener('mousedown', handleMouseDown)
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)
    
    // Wheel events
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    
    // Set initial cursor
    canvas.style.cursor = 'grab'
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      canvas.removeEventListener('wheel', handleWheel)
      
      // Clean up active mouse listeners
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [gl, handleMouseDown, handleTouchStart, handleTouchMove, handleTouchEnd, handleWheel])

  // Raycast click detection for item selection
  const raycaster = useRef(new THREE.Raycaster())
  const mouse = useRef(new THREE.Vector2())

  const handleClick = useCallback((event, carouselItems) => {
    // Don't trigger click if we were dragging
    if (interactionState.current.velocityHistory.length > 0) return
    
    // Calculate mouse position in normalized device coordinates
    const rect = gl.domElement.getBoundingClientRect()
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    
    // Cast ray from camera through mouse position
    raycaster.current.setFromCamera(mouse.current, camera)
    
    // Check intersections with carousel items
    const intersects = raycaster.current.intersectObjects(carouselItems, true)
    
    if (intersects.length > 0) {
      // Find which carousel item was clicked
      let clickedItem = intersects[0].object
      while (clickedItem.parent && !clickedItem.userData.carouselItem) {
        clickedItem = clickedItem.parent
      }
      
      if (clickedItem.userData.carouselItem) {
        onItemSelect?.(clickedItem.userData.itemIndex)
      }
    }
  }, [gl, camera, onItemSelect])

  return {
    handleClick,
    interactionState: interactionState.current
  }
}

// Component to handle click interactions
export function CarouselClickHandler({ onItemSelect, carouselItems, children }) {
  const { handleClick } = useCarouselInteractions(null, onItemSelect)
  const { gl } = useThree()
  
  useEffect(() => {
    const handleClickEvent = (event) => {
      handleClick(event, carouselItems)
    }
    
    gl.domElement.addEventListener('click', handleClickEvent)
    
    return () => {
      gl.domElement.removeEventListener('click', handleClickEvent)
    }
  }, [gl, handleClick, carouselItems])
  
  return <>{children}</>
}

// Hook for advanced gesture recognition
export function useGestureRecognition() {
  const gestureState = useRef({
    startTime: 0,
    startPosition: new THREE.Vector2(),
    currentPosition: new THREE.Vector2(),
    gestureType: null
  })
  
  const recognizeGesture = useCallback((startPos, endPos, duration) => {
    const distance = startPos.distanceTo(endPos)
    const deltaX = endPos.x - startPos.x
    const deltaY = endPos.y - startPos.y
    
    // Swipe detection
    if (distance > 50 && duration < 500) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > 0 ? 'swipe-right' : 'swipe-left'
      } else {
        return deltaY > 0 ? 'swipe-down' : 'swipe-up'
      }
    }
    
    // Tap detection
    if (distance < 10 && duration < 200) {
      return 'tap'
    }
    
    // Long press detection
    if (distance < 20 && duration > 800) {
      return 'long-press'
    }
    
    return null
  }, [])
  
  return { recognizeGesture, gestureState: gestureState.current }
}