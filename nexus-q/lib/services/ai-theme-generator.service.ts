import { generateText } from "ai"

interface ThemeGenerationOptions {
  prompt: string
  style: string
  mood: string
  colorPreference: string
  variations?: number
  responsive?: string
  accessibility?: string
}

export class AIThemeGenerator {
  async generateTheme(options: ThemeGenerationOptions): Promise<any[]> {
    const startTime = Date.now()

    try {
      const prompt = this.buildGenerationPrompt(options)

      const { text } = await generateText({
        model: "openai/gpt-4-turbo",
        prompt,
        temperature: 0.7,
        maxTokens: 4000,
      })

      const themes = JSON.parse(text)
      const validatedThemes = await this.validateAndEnhanceThemes(themes, options)

      return validatedThemes
    } catch (error) {
      console.error("[v0] Theme generation error:", error)
      throw error
    }
  }

  private buildGenerationPrompt(options: ThemeGenerationOptions): string {
    return `Generate ${options.variations || 3} complete dashboard themes based on these requirements:

DESCRIPTION: ${options.prompt}
STYLE: ${options.style}
MOOD: ${options.mood}
COLOR PREFERENCES: ${options.colorPreference}
RESPONSIVE REQUIREMENTS: ${options.responsive || "Desktop-first, mobile-optimized"}
ACCESSIBILITY: ${options.accessibility || "WCAG AA compliant"}

Return themes in this exact JSON format:
{
  "themes": [
    {
      "id": "unique-id",
      "name": "Theme Name",
      "description": "Theme description",
      "colors": {
        "primary": "#hex",
        "secondary": "#hex",
        "accent": "#hex",
        "background": "#hex",
        "surface": "#hex",
        "text": "#hex",
        "textSecondary": "#hex",
        "border": "#hex",
        "success": "#hex",
        "warning": "#hex",
        "error": "#hex"
      },
      "typography": {
        "fontFamily": "string",
        "fontSize": { "xs": "0.75rem", "sm": "0.875rem", "base": "1rem", "lg": "1.125rem", "xl": "1.25rem", "2xl": "1.5rem" },
        "fontWeight": { "normal": "400", "medium": "500", "semibold": "600", "bold": "700" }
      },
      "spacing": { "xs": "0.25rem", "sm": "0.5rem", "md": "1rem", "lg": "1.5rem", "xl": "2rem", "2xl": "3rem" },
      "borderRadius": { "sm": "0.375rem", "md": "0.5rem", "lg": "0.75rem", "xl": "1rem", "full": "9999px" },
      "shadows": { "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)", "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)", "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)" }
    }
  ]
}`
  }

  private async validateAndEnhanceThemes(themes: any, options: ThemeGenerationOptions): Promise<any[]> {
    const enhancedThemes = []

    for (const theme of themes.themes) {
      const contrastValidated = this.validateColorContrast(theme.colors)

      enhancedThemes.push({
        ...theme,
        generatedAt: new Date().toISOString(),
        generationOptions: options,
        validation: {
          contrast: contrastValidated,
          accessibility: this.calculateAccessibilityScore(theme.colors),
        },
      })
    }

    return enhancedThemes
  }

  private validateColorContrast(colors: any): any {
    const contrasts = {
      primary: this.calculateContrastRatio(colors.primary, colors.background),
      text: this.calculateContrastRatio(colors.text, colors.background),
      success: this.calculateContrastRatio(colors.success, colors.background),
    }

    return {
      valid: Object.values(contrasts).every((ratio) => ratio >= 4.5),
      ratios: contrasts,
      issues: Object.entries(contrasts)
        .filter(([_, ratio]) => (ratio as number) < 4.5)
        .map(([color]) => `${color} contrast too low`),
    }
  }

  private calculateContrastRatio(foreground: string, background: string): number {
    const lum1 = this.calculateLuminance(foreground)
    const lum2 = this.calculateLuminance(background)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    return (brightest + 0.05) / (darkest + 0.05)
  }

  private calculateLuminance(hex: string): number {
    const rgb = this.hexToRgb(hex)
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((value) => {
      value = value / 255
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  private calculateAccessibilityScore(colors: any): number {
    const contrasts = [
      this.calculateContrastRatio(colors.primary, colors.background),
      this.calculateContrastRatio(colors.text, colors.background),
      this.calculateContrastRatio(colors.success, colors.background),
    ]

    const avgContrast = contrasts.reduce((a, b) => a + b, 0) / contrasts.length
    return Math.min(100, (avgContrast / 7) * 100)
  }
}
