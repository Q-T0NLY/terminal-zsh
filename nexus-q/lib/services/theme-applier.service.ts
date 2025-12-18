import type { DashboardTheme } from "@/lib/types/theme"

export class ThemeApplier {
  private cssVariables: Map<string, string> = new Map()
  private styleElement: HTMLStyleElement | null = null

  constructor() {
    if (typeof document !== "undefined") {
      this.styleElement = document.createElement("style")
      this.styleElement.id = "dashboard-theme"
      document.head.appendChild(this.styleElement)
    }
  }

  applyTheme(theme: DashboardTheme): void {
    if (!this.styleElement) return

    const css = this.generateCSS(theme)
    this.styleElement.textContent = css

    // Apply to document for global access
    this.applyCSSVariables(theme)

    // Store theme in localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("dashboard-theme", JSON.stringify(theme))
    }

    // Dispatch theme change event
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("themechange", { detail: theme }))
    }
  }

  private generateCSS(theme: DashboardTheme): string {
    const colors = theme.colors || {}
    const typography = theme.typography || { fontFamily: "sans-serif", fontSize: {}, fontWeight: {} }
    const spacing = theme.spacing || {}
    const borderRadius = theme.borderRadius || {}
    const shadows = theme.shadows || {}

    return `
:root {
  /* Colors */
  ${Object.entries(colors)
    .map(([key, value]) => `--color-${key}: ${value};`)
    .join("\n  ")}

  /* Typography */
  --font-family: ${typography.fontFamily};
  ${Object.entries(typography.fontSize || {})
    .map(([key, value]) => `--text-${key}: ${value};`)
    .join("\n  ")}
  ${Object.entries(typography.fontWeight || {})
    .map(([key, value]) => `--font-${key}: ${value};`)
    .join("\n  ")}

  /* Spacing */
  ${Object.entries(spacing)
    .map(([key, value]) => `--spacing-${key}: ${value};`)
    .join("\n  ")}

  /* Border Radius */
  ${Object.entries(borderRadius)
    .map(([key, value]) => `--radius-${key}: ${value};`)
    .join("\n  ")}

  /* Shadows */
  ${Object.entries(shadows)
    .map(([key, value]) => `--shadow-${key}: ${value};`)
    .join("\n  ")}
}

/* Component Styles */
.dashboard-button {
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--text-sm);
  font-family: var(--font-family);
  transition: all 300ms ease;
  background: var(--color-primary);
  color: var(--color-background);
}

.dashboard-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.dashboard-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  transition: all 300ms ease;
}

.dashboard-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-accent);
}

.dashboard-input {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--text-base);
  color: var(--color-text);
  transition: all 200ms ease;
}

.dashboard-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px ${this.hexToRgba(colors.accent || "#3b82f6", 0.1)};
}

/* Quantum Glow Effects */
.quantum-glow {
  position: relative;
  overflow: hidden;
}

.quantum-glow::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${this.hexToRgba(colors.accent || "#3b82f6", 0.5)}, transparent);
  animation: quantum-pulse 2s ease-in-out infinite;
}

.quantum-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, ${this.hexToRgba(colors.accent || "#3b82f6", 0.3)}, transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 300ms ease;
}

.quantum-glow:hover::after {
  opacity: 1;
}

@keyframes quantum-pulse {
  0%, 100% { opacity: 0.5; transform: translateX(-100%); }
  50% { opacity: 1; transform: translateX(100%); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-card {
    padding: var(--spacing-md);
  }
  
  .dashboard-button {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--text-xs);
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .dashboard-card {
    border-width: 2px;
  }
  
  .dashboard-button {
    border: 2px solid currentColor;
  }
}
    `
  }

  private applyCSSVariables(theme: DashboardTheme): void {
    if (typeof document === "undefined") return

    const root = document.documentElement

    // Apply colors
    if (theme.colors) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value)
      })
    }

    // Apply typography
    if (theme.typography) {
      root.style.setProperty("--font-family", theme.typography.fontFamily)
      if (theme.typography.fontSize) {
        Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
          root.style.setProperty(`--text-${key}`, value)
        })
      }
      if (theme.typography.fontWeight) {
        Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
          root.style.setProperty(`--font-${key}`, value)
        })
      }
    }

    // Apply spacing
    if (theme.spacing) {
      Object.entries(theme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value)
      })
    }

    // Apply border radius
    if (theme.borderRadius) {
      Object.entries(theme.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--radius-${key}`, value)
      })
    }

    // Apply shadows
    if (theme.shadows) {
      Object.entries(theme.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value)
      })
    }
  }

  private hexToRgba(hex: string, alpha: number): string {
    // Handle short hex codes
    if (hex.length === 4) {
      hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
    }

    const r = Number.parseInt(hex.slice(1, 3), 16)
    const g = Number.parseInt(hex.slice(3, 5), 16)
    const b = Number.parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  getCurrentTheme(): DashboardTheme | null {
    if (typeof localStorage === "undefined") return null

    const saved = localStorage.getItem("dashboard-theme")
    if (!saved) return null

    try {
      return JSON.parse(saved)
    } catch {
      return null
    }
  }

  resetToDefault(mode: "light" | "dark"): void {
    const defaultTheme: DashboardTheme = {
      id: `default-${mode}`,
      name: `Default ${mode === "light" ? "Light" : "Dark"}`,
      type: mode,
      colors:
        mode === "light"
          ? {
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
            }
          : {
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
        sm: mode === "light" ? "0 1px 2px 0 rgb(0 0 0 / 0.05)" : "0 1px 2px 0 rgb(0 0 0 / 0.25)",
        md: mode === "light" ? "0 4px 6px -1px rgb(0 0 0 / 0.1)" : "0 4px 6px -1px rgb(0 0 0 / 0.3)",
        lg: mode === "light" ? "0 10px 15px -3px rgb(0 0 0 / 0.1)" : "0 10px 15px -3px rgb(0 0 0 / 0.3)",
      },
    }

    this.applyTheme(defaultTheme)
  }
}
