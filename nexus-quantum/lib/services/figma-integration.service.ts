export class FigmaIntegration {
  private accessToken: string
  private baseURL = "https://api.figma.com/v1"

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async importThemeFromFile(fileId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/files/${fileId}`, {
        headers: { "X-Figma-Token": this.accessToken },
      })

      if (!response.ok) {
        throw new Error(`Figma API error: ${response.statusText}`)
      }

      const fileData = await response.json()

      const designTokens = this.extractDesignTokens(fileData)
      const colorStyles = this.extractColorStyles(fileData)

      const theme = this.convertToDashboardTheme(designTokens, colorStyles)

      return {
        theme,
        source: "figma",
        fileId,
        importedAt: new Date().toISOString(),
        designSystem: designTokens,
      }
    } catch (error) {
      throw new Error(`Figma import failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  private extractDesignTokens(figmaData: any): any {
    const tokens: any = {
      colors: {},
      typography: {},
      spacing: {},
    }

    if (figmaData.styles) {
      Object.values(figmaData.styles).forEach((style: any) => {
        if (style.styleType === "FILL") {
          tokens.colors[style.name] = this.parseFigmaColor(style)
        } else if (style.styleType === "TEXT") {
          tokens.typography[style.name] = this.parseFigmaTypography(style)
        }
      })
    }

    return tokens
  }

  private extractColorStyles(figmaData: any): any {
    const colors: any = {}

    const traverseNodes = (nodes: any[]) => {
      nodes.forEach((node) => {
        if (node.fills && node.fills.length > 0) {
          node.fills.forEach((fill: any) => {
            if (fill.type === "SOLID" && fill.color) {
              const colorName = this.generateColorName(node.name, fill.color)
              colors[colorName] = this.figmaColorToHex(fill.color)
            }
          })
        }
        if (node.children) {
          traverseNodes(node.children)
        }
      })
    }

    if (figmaData.document) {
      traverseNodes([figmaData.document])
    }

    return colors
  }

  private figmaColorToHex(color: { r: number; g: number; b: number; a?: number }): string {
    const toHex = (value: number) => {
      const hex = Math.round(value * 255).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }

    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
  }

  private convertToDashboardTheme(designTokens: any, colors: any): any {
    return {
      id: `figma-${Date.now()}`,
      name: "Imported Figma Theme",
      type: "figma-import",
      colors: {
        primary: colors.primary || this.findPrimaryColor(colors),
        secondary: colors.secondary || this.findSecondaryColor(colors),
        accent: colors.accent || this.findAccentColor(colors),
        background: colors.background || "#0F172A",
        surface: colors.surface || "#1E293B",
        text: colors.text || "#F8FAFC",
        textSecondary: colors.textSecondary || "#94A3B8",
        border: colors.border || "#334155",
        success: colors.success || "#10B981",
        warning: colors.warning || "#F59E0B",
        error: colors.error || "#EF4444",
      },
      typography: {
        fontFamily: "Inter, system-ui, sans-serif",
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
        sm: "0.375rem",
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
  }

  private findPrimaryColor(colors: any): string {
    const priorityColors = ["primary", "brand", "main", "accent", "blue", "purple"]
    for (const name of priorityColors) {
      if (colors[name]) return colors[name]
    }
    return Object.values(colors)[0] || "#3B82F6"
  }

  private findSecondaryColor(colors: any): string {
    const secondaryNames = ["secondary", "gray", "neutral", "surface"]
    for (const name of secondaryNames) {
      if (colors[name]) return colors[name]
    }
    return "#6B7280"
  }

  private findAccentColor(colors: any): string {
    const accentNames = ["accent", "highlight", "teal", "green", "success"]
    for (const name of accentNames) {
      if (colors[name]) return colors[name]
    }
    return "#10B981"
  }

  private parseFigmaColor(style: any): string {
    return "#000000"
  }

  private parseFigmaTypography(style: any): any {
    return {}
  }

  private generateColorName(nodeName: string, color: any): string {
    return nodeName.toLowerCase().replace(/\s+/g, "-")
  }
}
