'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Premium radial gradient blobs (Novabase-inspired fluid shapes)
    interface Blob {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      baseRadius: number
      pulse: number
      pulseSpeed: number
      color: string
      opacity: number
    }

    const blobs: Blob[] = []
    const blobCount = 5

    const getBlobColors = () => {
      const isDark = document.documentElement.classList.contains('dark')
      return isDark
        ? [
            { color: 'rgba(6, 182, 212, 0.15)', radius: 200 }, // Cyan-blue
            { color: 'rgba(59, 130, 246, 0.12)', radius: 180 }, // Medium blue
            { color: 'rgba(37, 99, 235, 0.1)', radius: 220 }, // Deep blue
            { color: 'rgba(22, 163, 74, 0.08)', radius: 160 }, // Green accent
            { color: 'rgba(14, 165, 233, 0.09)', radius: 190 }, // Sky blue
          ]
        : [
            { color: 'rgba(6, 182, 212, 0.08)', radius: 200 },
            { color: 'rgba(59, 130, 246, 0.06)', radius: 180 },
            { color: 'rgba(37, 99, 235, 0.05)', radius: 220 },
            { color: 'rgba(22, 163, 74, 0.04)', radius: 160 },
            { color: 'rgba(14, 165, 233, 0.05)', radius: 190 },
          ]
    }

    const colors = getBlobColors()
    for (let i = 0; i < blobCount; i++) {
      const colorData = colors[i % colors.length]
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: colorData.radius,
        baseRadius: colorData.radius,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.005,
        color: colorData.color,
        opacity: 1
      })
    }

    // Elegant floating particles
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      baseSize: number
      life: number
      maxLife: number
      color: string
    }

    const particles: Particle[] = []
    const particleCount = 40

    const getParticleColor = () => {
      const isDark = document.documentElement.classList.contains('dark')
      return isDark ? 'rgba(59, 130, 246, 0.6)' : 'rgba(37, 99, 235, 0.4)'
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 2 + Math.random() * 3,
        baseSize: 2 + Math.random() * 3,
        life: Math.random(),
        maxLife: 1,
        color: getParticleColor()
      })
    }

    // Light rays/beams for premium effect
    interface LightRay {
      x: number
      y: number
      angle: number
      length: number
      width: number
      opacity: number
      speed: number
    }

    const lightRays: LightRay[] = []
    const rayCount = 3

    for (let i = 0; i < rayCount; i++) {
      lightRays.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        angle: Math.random() * Math.PI * 2,
        length: 300 + Math.random() * 200,
        width: 2 + Math.random() * 2,
        opacity: 0,
        speed: 0.002 + Math.random() * 0.002
      })
    }

    // Subtle mesh gradient overlay
    const drawMeshGradient = () => {
      const isDark = document.documentElement.classList.contains('dark')
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.3, 0,
        canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.8
      )
      gradient1.addColorStop(0, isDark ? 'rgba(6, 182, 212, 0.04)' : 'rgba(6, 182, 212, 0.02)')
      gradient1.addColorStop(1, 'transparent')
      
      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.7, 0,
        canvas.width * 0.8, canvas.height * 0.7, canvas.width * 0.8
      )
      gradient2.addColorStop(0, isDark ? 'rgba(37, 99, 235, 0.04)' : 'rgba(37, 99, 235, 0.02)')
      gradient2.addColorStop(1, 'transparent')
      
      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Subtle grid pattern
    const drawGrid = () => {
      const isDark = document.documentElement.classList.contains('dark')
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.01)'
      ctx.lineWidth = 0.5

      const gridSize = 100
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    let animationFrame: number

    const animate = () => {
      const isDark = document.documentElement.classList.contains('dark')
      
      // Clear with subtle fade for trails
      ctx.fillStyle = isDark ? 'rgba(10, 10, 10, 0.03)' : 'rgba(250, 250, 250, 0.03)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw mesh gradient
      drawMeshGradient()

      // Draw grid
      drawGrid()

      // Update and draw blobs (fluid, organic shapes)
      blobs.forEach((blob) => {
        blob.x += blob.vx
        blob.y += blob.vy
        blob.pulse += blob.pulseSpeed

        // Smooth boundary bounce
        if (blob.x < blob.radius || blob.x > canvas.width - blob.radius) blob.vx *= -1
        if (blob.y < blob.radius || blob.y > canvas.height - blob.radius) blob.vy *= -1

        // Keep within bounds
        blob.x = Math.max(blob.radius, Math.min(canvas.width - blob.radius, blob.x))
        blob.y = Math.max(blob.radius, Math.min(canvas.height - blob.radius, blob.y))

        // Pulsing radius
        const pulseRadius = blob.baseRadius + Math.sin(blob.pulse) * (blob.baseRadius * 0.1)

        // Create radial gradient for blob
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, pulseRadius
        )
        
        // Extract color from rgba string and adjust opacity
        const colorMatch = blob.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
        if (colorMatch) {
          const r = parseInt(colorMatch[1])
          const g = parseInt(colorMatch[2])
          const b = parseInt(colorMatch[3])
          const baseOpacity = parseFloat(colorMatch[4])
          
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${baseOpacity * 1.5})`)
          gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${baseOpacity})`)
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(blob.x, blob.y, pulseRadius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw light rays
      lightRays.forEach((ray) => {
        ray.opacity += ray.speed
        if (ray.opacity > 0.3) {
          ray.opacity = 0
          ray.x = Math.random() * canvas.width
          ray.y = Math.random() * canvas.height
          ray.angle = Math.random() * Math.PI * 2
        }

        const endX = ray.x + Math.cos(ray.angle) * ray.length
        const endY = ray.y + Math.sin(ray.angle) * ray.length

        const gradient = ctx.createLinearGradient(ray.x, ray.y, endX, endY)
        gradient.addColorStop(0, `rgba(59, 130, 246, ${ray.opacity})`)
        gradient.addColorStop(0.5, `rgba(37, 99, 235, ${ray.opacity * 0.5})`)
        gradient.addColorStop(1, 'transparent')

        ctx.strokeStyle = gradient
        ctx.lineWidth = ray.width
        ctx.beginPath()
        ctx.moveTo(ray.x, ray.y)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      })

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life += 0.005

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Fade in/out based on life
        const lifeFactor = Math.sin(particle.life * Math.PI)
        const size = particle.baseSize * (0.5 + lifeFactor * 0.5)

        ctx.fillStyle = particle.color.replace('0.6', String(lifeFactor * 0.6)).replace('0.4', String(lifeFactor * 0.4))
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
        ctx.fill()

        // Reset life when it reaches max
        if (particle.life >= particle.maxLife) {
          particle.life = 0
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
        }
      })

      // Draw connections between nearby particles (subtle network effect)
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.1 * Math.min(p1.life, p2.life) * 2
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = isDark ? `rgba(59, 130, 246, ${opacity})` : `rgba(37, 99, 235, ${opacity * 0.5})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-0 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300"
    />
  )
}
