"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { GripVertical, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DraggableWidgetProps {
  children: React.ReactNode
  id: string
  initialPosition?: { x: number; y: number }
  initialSize?: { width: number; height: number }
  onPositionChange?: (position: { x: number; y: number }) => void
  onSizeChange?: (size: { width: number; height: number }) => void
}

export function DraggableWidget({
  children,
  id,
  initialPosition = { x: 0, y: 0 },
  initialSize = { width: 400, height: 300 },
  onPositionChange,
  onSizeChange,
}: DraggableWidgetProps) {
  const [position, setPosition] = useState(initialPosition)
  const [size, setSize] = useState(initialSize)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isMaximized, setIsMaximized] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".widget-header")) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        }
        setPosition(newPosition)
        onPositionChange?.(newPosition)
      } else if (isResizing) {
        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y
        const newSize = {
          width: Math.max(200, size.width + deltaX),
          height: Math.max(150, size.height + deltaY),
        }
        setSize(newSize)
        setDragStart({ x: e.clientX, y: e.clientY })
        onSizeChange?.(newSize)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragStart, position, size, onPositionChange, onSizeChange])

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  return (
    <div
      ref={widgetRef}
      className={`absolute bg-white border border-border rounded-lg shadow-lg overflow-hidden transition-opacity ${
        isDragging ? "opacity-70 cursor-move" : ""
      } ${isMaximized ? "!fixed !inset-4 !w-auto !h-auto" : ""}`}
      style={
        isMaximized
          ? {}
          : {
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${size.width}px`,
              height: `${size.height}px`,
            }
      }
      onMouseDown={handleMouseDown}
    >
      {/* Widget Header with Drag Handle */}
      <div className="widget-header flex items-center justify-between p-3 border-b border-border bg-[#F5F7FA] cursor-move">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-[#333333]">Widget {id}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleMaximize}>
          {isMaximized ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
        </Button>
      </div>

      {/* Widget Content */}
      <div className="p-4 overflow-auto" style={{ height: "calc(100% - 49px)" }}>
        {children}
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
          style={{
            background: "linear-gradient(135deg, transparent 50%, #4B6CB7 50%)",
          }}
        />
      )}
    </div>
  )
}
