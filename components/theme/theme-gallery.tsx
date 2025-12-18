"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Award, Palette, Zap, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { DashboardTheme } from "@/lib/types/theme"

const AWARD_WINNING_THEMES: Record<string, DashboardTheme> = {
  "quantum-nebula": {
    id: "quantum-nebula",
    name: "Quantum Nebula",
    type: "futuristic",
    author: "Design Studio",
    awards: ["Awwwards", "CSS Design Awards"],
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      accent: "#f59e0b",
      background: "#0f172a",
      surface: "#1e293b",
      text: "#f1f5f9",
      textSecondary: "#94a3b8",
      border: "#334155",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      fontSize: { base: 16, scale: 1.2 },
    },
    spacing: { base: 8, scale: 1.5 },
    borderRadius: { base: 8, scale: 1.5 },
    animations: { enabled: true, duration: 300 },
  },
  "cyber-punk": {
    id: "cyber-punk",
    name: "Cyber Punk 2077",
    type: "futuristic",
    author: "Neon Labs",
    colors: {
      primary: "#00ff87",
      secondary: "#60efff",
      accent: "#ff0080",
      background: "#0a0a0a",
      surface: "#1a1a1a",
      text: "#00ff87",
      textSecondary: "#60efff",
      border: "#00ff87",
      success: "#00ff87",
      warning: "#ffff00",
      error: "#ff0080",
    },
    typography: {
      fontFamily: "Orbitron, sans-serif",
      fontSize: { base: 16, scale: 1.2 },
    },
    spacing: { base: 8, scale: 1.5 },
    borderRadius: { base: 4, scale: 1 },
    animations: { enabled: true, duration: 200 },
  },
}

interface ThemeGalleryProps {
  currentTheme?: DashboardTheme
  onThemeSelect: (theme: DashboardTheme) => void
  onClose: () => void
}

export function ThemeGallery({ currentTheme, onThemeSelect, onClose }: ThemeGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Themes", icon: Palette },
    { id: "futuristic", name: "Futuristic", icon: Zap },
    { id: "modern", name: "Modern", icon: Award },
  ]

  const themes = Object.values(AWARD_WINNING_THEMES)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-6xl max-h-[90vh] overflow-auto bg-background rounded-lg shadow-xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-background border-b">
          <h2 className="text-2xl font-bold">🎨 Theme Gallery</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 p-6 border-b">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
            >
              <category.icon className="h-4 w-4 mr-2" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {themes
            .filter((theme) => activeCategory === "all" || theme.type === activeCategory)
            .map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isActive={currentTheme?.id === theme.id}
                onSelect={() => onThemeSelect(theme)}
              />
            ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

interface ThemeCardProps {
  theme: DashboardTheme
  isActive: boolean
  onSelect: () => void
}

function ThemeCard({ theme, isActive, onSelect }: ThemeCardProps) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card className={`cursor-pointer overflow-hidden ${isActive ? "ring-2 ring-primary" : ""}`} onClick={onSelect}>
        <div
          className="h-32 p-4"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
          }}
        >
          <div className="flex gap-2">
            <div className="w-16 h-16 rounded bg-white/20 backdrop-blur" />
            <div className="flex-1 space-y-2">
              <div className="h-3 rounded bg-white/20 backdrop-blur" />
              <div className="h-3 rounded bg-white/20 backdrop-blur w-2/3" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="font-semibold">{theme.name}</div>
          <div className="text-sm text-muted-foreground">by {theme.author}</div>

          {theme.awards && (
            <div className="flex flex-wrap gap-1 mt-2">
              {theme.awards.map((award) => (
                <span key={award} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-primary/10 rounded">
                  <Award className="h-3 w-3" />
                  {award}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
