import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

export class CarouselPhysicsEngine {
  constructor(options = {}) {
    this.mass = options.mass || 1000
    this.radius = options.radius || 5
    this.momentOfInertia = 0.5 * this.mass * this.radius * this.radius
    this.angularVelocity = options.initialVelocity || 0.2
    this.angularAcceleration = 0
    this.rotation = 0
    this.dragCoefficient = options.dragCoefficient || 0.015
    this.friction = options.friction || 0.995
    this.userInputTorque = 0
    this.maxVelocity = options.maxVelocity || 3
    this.minVelocity = options.minVelocity || 0.05
    
    // Spring physics for natural deceleration
    this.springConstant = options.springConstant || 0.1
    this.dampingRatio = options.dampingRatio || 0.8
    
    // Touch interaction
    this.touchVelocityHistory = []
    this.touchHistoryLength = 5
    this.isUserInteracting = false
    this.lastTouchTime = 0
    
    // Auto-rotation when idle
    this.targetVelocity = options.initialVelocity || 0.2
    this.autoRotateForce = options.autoRotateForce || 0.05
  }

  applyUserForce(force, deltaTime) {
    this.userInputTorque = force * this.radius
    this.isUserInteracting = true
    this.lastTouchTime = performance.now()
  }

  addTouchVelocity(velocity) {
    this.touchVelocityHistory.push({
      velocity,
      time: performance.now()
    })
    
    if (this.touchVelocityHistory.length > this.touchHistoryLength) {
      this.touchVelocityHistory.shift()
    }
  }

  getTouchVelocity() {
    if (this.touchVelocityHistory.length < 2) return 0
    
    const recent = this.touchVelocityHistory.slice(-3)
    const avgVelocity = recent.reduce((sum, item) => sum + item.velocity, 0) / recent.length
    return avgVelocity
  }

  update(deltaTime) {
    const currentTime = performance.now()
    
    // Check if user stopped interacting
    if (currentTime - this.lastTouchTime > 100) {
      this.isUserInteracting = false
    }

    // Calculate drag torque (quadratic drag at higher speeds)
    const speed = Math.abs(this.angularVelocity)
    const dragTorque = -this.dragCoefficient * this.angularVelocity * speed

    // Auto-rotation force when not interacting
    let autoTorque = 0
    if (!this.isUserInteracting) {
      const velocityDiff = this.targetVelocity - this.angularVelocity
      autoTorque = velocityDiff * this.autoRotateForce
    }

    // Apply all torques
    const totalTorque = this.userInputTorque + dragTorque + autoTorque
    this.angularAcceleration = totalTorque / this.momentOfInertia

    // Update velocity with acceleration
    this.angularVelocity += this.angularAcceleration * deltaTime
    
    // Apply friction
    this.angularVelocity *= this.friction

    // Clamp velocity
    this.angularVelocity = Math.max(
      -this.maxVelocity, 
      Math.min(this.maxVelocity, this.angularVelocity)
    )

    // Ensure minimum rotation
    if (!this.isUserInteracting && Math.abs(this.angularVelocity) < this.minVelocity) {
      this.angularVelocity = this.angularVelocity >= 0 ? this.minVelocity : -this.minVelocity
    }

    // Update rotation
    this.rotation += this.angularVelocity * deltaTime

    // Reset user input
    this.userInputTorque = 0
  }

  getRotation() {
    return this.rotation
  }

  getAngularVelocity() {
    return this.angularVelocity
  }

  setTargetVelocity(velocity) {
    this.targetVelocity = velocity
  }
}

export function useCarouselPhysics(options = {}) {
  const physicsRef = useRef(null)
  
  useEffect(() => {
    physicsRef.current = new CarouselPhysicsEngine(options)
  }, [])

  useFrame((state, delta) => {
    if (physicsRef.current) {
      physicsRef.current.update(delta)
    }
  })

  return physicsRef.current
}