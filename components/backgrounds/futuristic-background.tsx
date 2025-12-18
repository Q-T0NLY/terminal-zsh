"use client"

import { useEffect, useRef } from "react"

interface FuturisticBackgroundProps {
  variant?: "grid" | "particles" | "waves" | "neural"
  intensity?: "low" | "medium" | "high"
  color?: string
}

export function FuturisticBackground({
  variant = "grid",
  intensity = "medium",
  color = "#667eea",
}: FuturisticBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let animationFrameId: number

    if (variant === "grid") {
      const drawGrid = (time: number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const gridSize = intensity === "low" ? 80 : intensity === "medium" ? 60 : 40
        const lineWidth = intensity === "low" ? 0.5 : intensity === "medium" ? 1 : 1.5

        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth

        // Vertical lines
        for (let x = 0; x < canvas.width; x += gridSize) {
          const offset = Math.sin(time * 0.001 + x * 0.01) * 10
          ctx.globalAlpha = 0.1 + Math.sin(time * 0.001 + x * 0.01) * 0.05
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x + offset, canvas.height)
          ctx.stroke()
        }

        // Horizontal lines
        for (let y = 0; y < canvas.height; y += gridSize) {
          const offset = Math.cos(time * 0.001 + y * 0.01) * 10
          ctx.globalAlpha = 0.1 + Math.cos(time * 0.001 + y * 0.01) * 0.05
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y + offset)
          ctx.stroke()
        }

        animationFrameId = requestAnimationFrame(drawGrid)
      }

      animationFrameId = requestAnimationFrame(drawGrid)
    } else if (variant === "particles") {
      const particleCount = intensity === "low" ? 50 : intensity === "medium" ? 100 : 150

      const particles: Array<{
        x: number
        y: number
        vx: number
        vy: number
        size: number
      }> = []

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
        })
      }

      const drawParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particles.forEach((particle, i) => {
          particle.x += particle.vx
          particle.y += particle.vy

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

          ctx.fillStyle = color
          ctx.globalAlpha = 0.6
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()

          // Draw connections
          particles.slice(i + 1).forEach((otherParticle) => {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 150) {
              ctx.strokeStyle = color
              ctx.globalAlpha = (1 - distance / 150) * 0.3
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.stroke()
            }
          })
        })

        animationFrameId = requestAnimationFrame(drawParticles)
      }

      animationFrameId = requestAnimationFrame(drawParticles)
    } else if (variant === "waves") {
      const drawWaves = (time: number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const waveCount = intensity === "low" ? 3 : intensity === "medium" ? 5 : 7

        for (let i = 0; i < waveCount; i++) {
          ctx.strokeStyle = color
          ctx.globalAlpha = 0.1 - i * 0.01
          ctx.lineWidth = 2
          ctx.beginPath()

          for (let x = 0; x < canvas.width; x += 5) {
            const y =
              canvas.height / 2 +
              Math.sin(x * 0.01 + time * 0.001 + i * 0.5) * 50 +
              Math.cos(x * 0.005 + time * 0.0005 + i) * 30
            if (x === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }

          ctx.stroke()
        }

        animationFrameId = requestAnimationFrame(drawWaves)
      }

      animationFrameId = requestAnimationFrame(drawWaves)
    } else if (variant === "neural") {
      const nodeCount = intensity === "low" ? 30 : intensity === "medium" ? 50 : 80

      const nodes: Array<{
        x: number
        y: number
        vx: number
        vy: number
      }> = []

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        })
      }

      const drawNeural = (time: number) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        nodes.forEach((node, i) => {
          node.x += node.vx
          node.y += node.vy

          if (node.x < 0 || node.x > canvas.width) node.vx *= -1
          if (node.y < 0 || node.y > canvas.height) node.vy *= -1

          // Draw node
          ctx.fillStyle = color
          ctx.globalAlpha = 0.8
          ctx.beginPath()
          ctx.arc(node.x, node.y, 3, 0, Math.PI * 2)
          ctx.fill()

          // Draw connections with pulse effect
          nodes.slice(i + 1).forEach((otherNode, j) => {
            const dx = node.x - otherNode.x
            const dy = node.y - otherNode.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 200) {
              const pulse = Math.sin(time * 0.002 + i * 0.1 + j * 0.1) * 0.5 + 0.5
              ctx.strokeStyle = color
              ctx.globalAlpha = (1 - distance / 200) * 0.4 * pulse
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(otherNode.x, otherNode.y)
              ctx.stroke()
            }
          })
        })

        animationFrameId = requestAnimationFrame(drawNeural)
      }

      animationFrameId = requestAnimationFrame(drawNeural)
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [variant, intensity, color])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.4 }} />
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/95 to-background/90 pointer-events-none z-0" />
    </>
  )
}
