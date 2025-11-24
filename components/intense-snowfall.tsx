"use client"

import { useEffect, useRef } from "react"

interface Snowflake {
  x: number
  y: number
  radius: number
  speed: number
  drift: number
  opacity: number
  rotation: number
  rotationSpeed: number
}

export default function IntenseSnowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.parentElement?.getBoundingClientRect()
    if (rect) {
      canvas.width = rect.width
      canvas.height = rect.height
    }

    // Create more intense snowflakes
    const snowflakes: Snowflake[] = []
    const snowflakeCount = 150

    for (let i = 0; i < snowflakeCount; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 1,
        drift: Math.random() * 1.5 - 0.75,
        opacity: Math.random() * 0.6 + 0.4,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1,
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      snowflakes.forEach((flake) => {
        ctx.save()
        ctx.translate(flake.x, flake.y)
        ctx.rotate((flake.rotation * Math.PI) / 180)

        // Draw snowflake with sparkle
        ctx.beginPath()
        ctx.arc(0, 0, flake.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        ctx.fill()

        // Add glow
        ctx.beginPath()
        ctx.arc(0, 0, flake.radius * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity * 0.3})`
        ctx.fill()

        ctx.restore()

        // Update position
        flake.y += flake.speed
        flake.x += flake.drift
        flake.rotation += flake.rotationSpeed

        // Reset if snowflake goes off screen
        if (flake.y > canvas.height) {
          flake.y = -10
          flake.x = Math.random() * canvas.width
        }
        if (flake.x > canvas.width) {
          flake.x = 0
        } else if (flake.x < 0) {
          flake.x = canvas.width
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-5" style={{ opacity: 0.8 }} />
}
