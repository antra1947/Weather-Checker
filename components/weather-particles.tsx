"use client"

import { useEffect, useRef } from "react"

type Particle = {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color?: string
  rotation?: number
  rotationSpeed?: number
}

type WeatherParticlesProps = {
  type: "clear" | "clouds" | "rain" | "snow" | "mist" | "thunderstorm" | "default"
}

export default function WeatherParticles({ type }: WeatherParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const lastLightningRef = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.offsetWidth
    const height = container.offsetHeight
    const ctx = setupCanvas(container, width, height)
    if (!ctx) return

    // Clear existing particles
    particlesRef.current = []

    // Create particles based on weather type
    createParticles(type, width, height)

    // Start animation
    let lastTime = 0
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime
      lastTime = timestamp

      ctx.clearRect(0, 0, width, height)
      updateParticles(ctx, width, height, type, deltaTime)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
      const canvas = container.querySelector("canvas")
      if (canvas) container.removeChild(canvas)
    }
  }, [type])

  const setupCanvas = (container: HTMLDivElement, width: number, height: number) => {
    // Remove any existing canvas
    const existingCanvas = container.querySelector("canvas")
    if (existingCanvas) container.removeChild(existingCanvas)

    // Create new canvas
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    canvas.style.position = "absolute"
    canvas.style.top = "0"
    canvas.style.left = "0"
    canvas.style.pointerEvents = "none"
    container.appendChild(canvas)

    return canvas.getContext("2d")
  }

  const createParticles = (type: string, width: number, height: number) => {
    let count = 0

    switch (type) {
      case "rain":
        count = 150
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.5,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 10 + 10,
            opacity: Math.random() * 0.4 + 0.1,
            color: `rgba(174, 194, 224, ${Math.random() * 0.4 + 0.1})`,
          })
        }
        break
      case "snow":
        count = 100
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 4 + 1,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1 + 0.5,
            opacity: Math.random() * 0.7 + 0.3,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() * 0.02 - 0.01) * (Math.random() > 0.5 ? 1 : -1),
          })
        }
        break
      case "clouds":
        count = 20
        for (let i = 0; i < count; i++) {
          const size = Math.random() * 60 + 30
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height * 0.6,
            size: size,
            speedX: Math.random() * 0.5 + 0.1,
            speedY: Math.random() * 0.1 - 0.05,
            opacity: Math.random() * 0.3 + 0.1,
          })
        }
        break
      case "mist":
        count = 25
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 80 + 40,
            speedX: Math.random() * 0.3 - 0.15,
            speedY: Math.random() * 0.1 - 0.05,
            opacity: Math.random() * 0.15 + 0.05,
          })
        }
        break
      case "thunderstorm":
        // Rain particles
        count = 150
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.5,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 10 + 10,
            opacity: Math.random() * 0.4 + 0.1,
            color: `rgba(174, 194, 224, ${Math.random() * 0.4 + 0.1})`,
          })
        }

        // Cloud particles
        for (let i = 0; i < 10; i++) {
          const size = Math.random() * 80 + 40
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height * 0.4,
            size: size,
            speedX: Math.random() * 0.7 + 0.3,
            speedY: 0,
            opacity: Math.random() * 0.4 + 0.2,
          })
        }
        break
      case "clear":
        // Sun rays
        count = 12
        const centerX = width / 2
        const centerY = height / 4
        const rayLength = Math.min(width, height) * 0.4

        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2
          particlesRef.current.push({
            x: centerX,
            y: centerY,
            size: rayLength,
            speedX: 0,
            speedY: 0,
            opacity: 0.1,
            rotation: angle,
            rotationSpeed: 0.0001,
          })
        }

        // Sparkles
        for (let i = 0; i < 30; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height * 0.7,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 0.2 - 0.1,
            speedY: Math.random() * 0.1 - 0.05,
            opacity: Math.random() * 0.7 + 0.3,
            color: `rgba(255, 255, 200, ${Math.random() * 0.5 + 0.2})`,
          })
        }
        break
      default:
        count = 40
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3 + 1,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.3 + 0.1,
            color: `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`,
          })
        }
    }
  }

  const updateParticles = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    type: string,
    deltaTime: number,
  ) => {
    // Special effects for certain weather types
    if (type === "thunderstorm") {
      // Lightning effect
      const now = Date.now()
      if (now - lastLightningRef.current > 5000 && Math.random() < 0.01) {
        lastLightningRef.current = now
        const gradient = ctx.createRadialGradient(width / 2, height / 3, 0, width / 2, height / 3, width / 1.5)
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
        gradient.addColorStop(0.1, "rgba(200, 220, 255, 0.6)")
        gradient.addColorStop(0.2, "rgba(150, 180, 255, 0.4)")
        gradient.addColorStop(1, "rgba(100, 150, 255, 0)")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      }
    }

    if (type === "clear") {
      // Sun glow effect
      const centerX = width / 2
      const centerY = height / 4
      const radius = Math.min(width, height) * 0.1

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2)
      gradient.addColorStop(0, "rgba(255, 220, 100, 0.6)")
      gradient.addColorStop(0.5, "rgba(255, 200, 70, 0.2)")
      gradient.addColorStop(1, "rgba(255, 180, 50, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw sun
      ctx.fillStyle = "rgba(255, 220, 100, 0.8)"
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    particlesRef.current.forEach((particle, index) => {
      // Update position
      particle.x += particle.speedX * (deltaTime / 16)
      particle.y += particle.speedY * (deltaTime / 16)

      // Update rotation if applicable
      if (particle.rotation !== undefined && particle.rotationSpeed !== undefined) {
        particle.rotation += particle.rotationSpeed * (deltaTime / 16)
      }

      // Reset position if out of bounds
      if (particle.y > height) {
        if (type === "rain" || type === "snow" || type === "thunderstorm") {
          particle.y = -10
          particle.x = Math.random() * width
        } else {
          particle.y = 0
        }
      }
      if (particle.y < 0) {
        if (type === "clouds" || type === "mist") {
          particle.y = height
        } else {
          particle.y = height
        }
      }
      if (particle.x > width) {
        if (type === "clouds" || type === "mist") {
          particle.x = -particle.size
        } else {
          particle.x = 0
        }
      }
      if (particle.x < 0) {
        if (type === "clouds" || type === "mist") {
          particle.x = width + particle.size
        } else {
          particle.x = width
        }
      }

      // Draw particle
      ctx.beginPath()
      ctx.globalAlpha = particle.opacity

      if (type === "rain" || type === "thunderstorm") {
        ctx.strokeStyle = particle.color || "rgba(174, 194, 224, 0.8)"
        ctx.lineWidth = particle.size / 2
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(particle.x + particle.speedX * 0.5, particle.y - particle.speedY * 0.1)
        ctx.stroke()
      } else if (type === "snow") {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.save()
        ctx.translate(particle.x, particle.y)
        if (particle.rotation !== undefined) {
          ctx.rotate(particle.rotation)
        }

        // Draw snowflake
        for (let i = 0; i < 6; i++) {
          ctx.rotate(Math.PI / 3)
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(0, particle.size)
          ctx.stroke()

          // Add some details to larger snowflakes
          if (particle.size > 3) {
            ctx.beginPath()
            ctx.moveTo(0, particle.size * 0.3)
            ctx.lineTo(particle.size * 0.3, particle.size * 0.5)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(0, particle.size * 0.3)
            ctx.lineTo(-particle.size * 0.3, particle.size * 0.5)
            ctx.stroke()
          }
        }

        ctx.restore()
      } else if (type === "clouds" || type === "mist") {
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity * 1.5})`)
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${particle.opacity})`)
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)
        ctx.fillStyle = gradient
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      } else if (type === "clear" && particle.rotation !== undefined) {
        // Draw sun rays
        ctx.strokeStyle = "rgba(255, 220, 100, 0.2)"
        ctx.lineWidth = 2
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate(particle.rotation)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, particle.size)
        ctx.stroke()
        ctx.restore()
      } else {
        ctx.fillStyle = particle.color || "rgba(255, 255, 255, 0.5)"
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
    })
  }

  return <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0" />
}

