"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface AnimatedAgentPreviewProps {
  efficiency: number
  agentType: string
  isActive: boolean
}

const AnimatedAgentPreview: React.FC<AnimatedAgentPreviewProps> = ({ efficiency, agentType, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const centerX = width / 2
    const centerY = height / 2

    const nodes: Array<{
      angle: number
      radius: number
      size: number
      speed: number
      color: string
      activityPhase: number
    }> = []

    const colors = agentType === "Base" ? ["#3B82F6", "#60A5FA"] : ["#10B981", "#34D399"]

    for (let i = 0; i < 25; i++) {
      nodes.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 50 + 20,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.02 + 0.005,
        color: colors[Math.floor(Math.random() * colors.length)],
        activityPhase: Math.random() * Math.PI * 2,
      })
    }

    let rotation = 0
    let animationId: number

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, width, height)

      if (isActive) {
        rotation += 0.01
      }

      const activityMultiplier = isActive ? efficiency / 100 : 0.3

      nodes.forEach((node) => {
        const x = centerX + Math.cos(node.angle + rotation) * node.radius
        const y = centerY + Math.sin(node.angle + rotation) * node.radius

        const activity = Math.sin(Date.now() * 0.005 + node.activityPhase) * activityMultiplier
        const pulse = 1 + 0.5 * activity

        ctx.beginPath()
        ctx.arc(x, y, node.size * pulse, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.shadowBlur = isActive ? 10 * pulse : 5
        ctx.shadowColor = node.color
        ctx.fill()

        if (isActive) {
          node.radius += (Math.random() - 0.5) * 0.5
        }
      })

      if (isActive) {
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const nodeA = nodes[i]
            const nodeB = nodes[j]

            const ax = centerX + Math.cos(nodeA.angle + rotation) * nodeA.radius
            const ay = centerY + Math.sin(nodeA.angle + rotation) * nodeA.radius
            const bx = centerX + Math.cos(nodeB.angle + rotation) * nodeB.radius
            const by = centerY + Math.sin(nodeB.angle + rotation) * nodeB.radius

            const dx = ax - bx
            const dy = ay - by
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < 60) {
              const glow = ((Math.sin(Date.now() * 0.01 + nodeA.activityPhase) + 1) / 2) * activityMultiplier
              ctx.beginPath()
              ctx.moveTo(ax, ay)
              ctx.lineTo(bx, by)
              ctx.strokeStyle = `rgba(255,255,255,${glow})`
              ctx.lineWidth = 0.8
              ctx.stroke()
            }
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [efficiency, agentType, isActive])

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-xl transition-all"
      style={{
        height: "180px",
        background: isActive ? "rgba(30,33,48,0.8)" : "rgba(30,33,48,0.4)",
        border: isActive ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255, 255, 255, 0.1)",
      }}
    />
  )
}

export default AnimatedAgentPreview
