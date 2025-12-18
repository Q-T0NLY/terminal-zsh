export interface DashboardTheme {
  id: string
  name: string
  type?: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    success: string
    warning: string
    error: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      "2xl": string
    }
    fontWeight: {
      normal: string
      medium: string
      semibold: string
      bold: string
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    "2xl": string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
  }
}

export interface FigmaThemeImport {
  fileKey: string
  nodeId?: string
  accessToken?: string
}

export interface ThemeConversionInput {
  format: "css" | "tailwind" | "json" | "palette" | "auto"
  data: string
}

export interface ThemeConversionResult {
  theme: DashboardTheme
  confidence: number
  warnings?: string[]
}

export interface ThemeScalingOptions {
  preserveRatios: boolean
  generateMissingValues: boolean
  harmonizeColors: boolean
  optimizeContrast: boolean
}
