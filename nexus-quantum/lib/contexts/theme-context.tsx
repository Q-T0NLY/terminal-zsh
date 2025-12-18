"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { DashboardTheme } from "@/lib/types/theme"
import { ThemeApplier } from "@/lib/services/theme-applier.service"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
  dashboardTheme: DashboardTheme | null
  setDashboardTheme: (theme: DashboardTheme) => void
  applyTheme: (theme: DashboardTheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

let themeApplier: ThemeApplier | null = null
if (typeof window !== "undefined") {
  themeApplier = new ThemeApplier()
}

const defaultLightTheme: DashboardTheme = {
  id: "default-light",
  name: "Default Light",
  type: "light",
  colors: {
    primary: "#0a0a0a",
    secondary: "#f5f5f5",
    accent: "#3b82f6",
    background: "#ffffff",
    surface: "#f9fafb",
    text: "#0a0a0a",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  typography: {
    fontFamily: "var(--font-sans)",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },
}

const defaultDarkTheme: DashboardTheme = {
  id: "default-dark",
  name: "Default Dark",
  type: "dark",
  colors: {
    primary: "#ffffff",
    secondary: "#1f2937",
    accent: "#3b82f6",
    background: "#0a0a0a",
    surface: "#111827",
    text: "#ffffff",
    textSecondary: "#9ca3af",
    border: "#374151",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  typography: {
    fontFamily: "var(--font-sans)",
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.25)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
  },
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark")
  const [dashboardTheme, setDashboardThemeState] = useState<DashboardTheme | null>(null)

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("nexus-theme") as Theme | null
    if (savedTheme) {
      setThemeState(savedTheme)
    }

    const savedDashboardTheme = localStorage.getItem("dashboard-theme")
    if (savedDashboardTheme) {
      try {
        const parsed = JSON.parse(savedDashboardTheme)
        setDashboardThemeState(parsed)
        if (themeApplier) {
          themeApplier.applyTheme(parsed)
        }
      } catch (e) {
        console.error("Failed to parse saved dashboard theme", e)
      }
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement

    // Remove existing theme classes
    root.classList.remove("light", "dark")

    let effectiveTheme: "light" | "dark"

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      effectiveTheme = systemTheme
    } else {
      effectiveTheme = theme
    }

    root.classList.add(effectiveTheme)
    setResolvedTheme(effectiveTheme)

    if (!dashboardTheme && themeApplier) {
      const defaultTheme = effectiveTheme === "dark" ? defaultDarkTheme : defaultLightTheme
      setDashboardThemeState(defaultTheme)
      themeApplier.applyTheme(defaultTheme)
    }
  }, [theme, dashboardTheme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("nexus-theme", newTheme)
  }

  const setDashboardTheme = (newTheme: DashboardTheme) => {
    setDashboardThemeState(newTheme)
    localStorage.setItem("dashboard-theme", JSON.stringify(newTheme))
    if (themeApplier) {
      themeApplier.applyTheme(newTheme)
    }
  }

  const applyTheme = (newTheme: DashboardTheme) => {
    if (themeApplier) {
      themeApplier.applyTheme(newTheme)
    }
    setDashboardThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, dashboardTheme, setDashboardTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
