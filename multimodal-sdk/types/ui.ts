import type React from "react"
// UI state types
export interface NavigationItem {
  id: string
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
  children?: NavigationItem[]
}

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
}

export interface ModalState {
  isOpen: boolean
  title?: string
  content?: React.ReactNode
  onClose?: () => void
  size?: "sm" | "md" | "lg" | "xl"
}

export interface ToastNotification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration?: number
}

// Form types
export interface FormField {
  name: string
  label: string
  type: "text" | "email" | "password" | "textarea" | "select" | "checkbox" | "radio" | "file"
  placeholder?: string
  required?: boolean
  validation?: {
    pattern?: RegExp
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    custom?: (value: any) => boolean | string
  }
  options?: { label: string; value: string | number }[]
}

export interface FormState<T = Record<string, any>> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
}

// Theme types
export interface ThemeConfig {
  mode: "light" | "dark" | "system"
  primaryColor?: string
  radius?: "none" | "sm" | "md" | "lg" | "xl"
  scaling?: "90%" | "95%" | "100%" | "105%" | "110%"
}
